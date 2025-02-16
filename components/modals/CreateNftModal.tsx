/* eslint-disable @next/next/no-html-link-for-pages */
// @ts-nocheck
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import DestinationChain from '../ai-params/DestinationChain';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SwitchButton from '../Switch';
import base64ToBlob from '@/utils/base64toBlob';
import { useImages } from '@/context/ImageContext';
import { encryptPrompt } from '@/utils/encryptPrompt';
import generateKey from '@/utils/generateKey';
import axios from 'axios';
import { createPromptCollection } from '@/utils/entry-functions/create_collection';
import { createPromptCollectionSponsored } from '@/utils/entry-functions/create_collection_sponsored';
import { aptosClient } from '@/utils/aptos/aptosClient';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { AptosClient, TxnBuilderTypes, BCS, HexString, Provider } from 'aptos';
import { ClipLoader } from 'react-spinners';

const CreateNftModal = ({ openModal, handleOnClose, image }) => {
  const { signAndSubmitTransaction, account, network, wallet } = useWallet();
  console.log(network);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const isPetraConnected = wallet?.name === 'Petra' && window.petra;

  const { prompts } = useImages();
  const address = account?.address || '';
  const [promptNftName, setPromptNftName] = useState('');
  const [promptNftDescription, setPromptNftDescription] = useState('');
  const [attr, setAttr] = useState([
    { trait_type: 'model', value: 'Stable Diffusion XL' },
    { trait_type: 'creator', value: '' },
    { trait_type: 'chain', value: '' },
    { trait_type: 'prompts', value: '' },
    { trait_type: 'type', value: '' },
  ]);
  const [maxSupply, setMaxSupply] = useState(3000);
  const [publicMintFeePerNFT, setPublicMintFeePerNFT] = useState(1);
  const [txHash, setTxHash] = useState('');
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
  const [completedMint, setCompletedMint] = useState(false);
  const [loading, setLoading] = useState(false);

  const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;
  const pinataEndpoint = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  const handleModalClose = () => {
    handleOnClose();
    setCompletedMint(false);
  };

  // const createPromptNFTSponsored = async (e) => {
  //   e.preventDefault();

  //   if (!account || !window.petra || account.address === null) {
  //     toast.error('Please connect your Petra wallet first');
  //     return;
  //   }

  //   let base64String = image;
  //   let imageType = 'image/jpeg';
  //   let blob = base64ToBlob(base64String, imageType);

  //   let promptValue;
  //   if (isSwitchEnabled) {
  //     const promptKey = generateKey(promptNftName);
  //     promptValue = encryptPrompt(prompts, promptKey);
  //   } else {
  //     promptValue = prompts;
  //   }

  //   let updatedAttr = [...attr];
  //   updatedAttr[3].value = promptValue;
  //   updatedAttr[2].value = 'Aptos';
  //   updatedAttr[1].value = address;
  //   updatedAttr[4].value = isSwitchEnabled ? 'premium' : 'public';

  //   setAttr(updatedAttr);

  //   try {
  //     setLoading(true);

  //     const formData = new FormData();
  //     formData.append('file', blob);

  //     const imagePinataResponse = await axios.post(pinataEndpoint, formData, {
  //       headers: {
  //         'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
  //         pinata_api_key: pinataApiKey,
  //         pinata_secret_api_key: pinataSecretApiKey,
  //       },
  //     });

  //     if (!imagePinataResponse.data.IpfsHash) {
  //       throw new Error('Failed to upload image to Pinata');
  //     }

  //     const imageUrl = `https://gateway.pinata.cloud/ipfs/${imagePinataResponse.data.IpfsHash}`;

  //     const metadata = {
  //       name: promptNftName,
  //       description: promptNftDescription,
  //       image: imageUrl,
  //       attributes: updatedAttr,
  //     };

  //     const jsonBlob = new Blob([JSON.stringify(metadata)], {
  //       type: 'application/json',
  //     });
  //     formData.set('file', jsonBlob);
  //     const metadataPinataResponse = await axios.post(
  //       pinataEndpoint,
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
  //           pinata_api_key: pinataApiKey,
  //           pinata_secret_api_key: pinataSecretApiKey,
  //         },
  //       }
  //     );

  //     if (!metadataPinataResponse.data.IpfsHash) {
  //       throw new Error('Failed to upload metadata to Pinata');
  //     }

  //     const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataPinataResponse.data.IpfsHash}`;

  //     const currentTime = new Date();

  //     const payload = createPromptCollectionSponsored({
  //       description: promptNftDescription,
  //       name: promptNftName,
  //       uri: metadataUrl,
  //       maxSupply: maxSupply,
  //       publicMintLimitPerAddr: 1,
  //       publicMintFeePerPrompt: publicMintFeePerNFT,
  //     });

  //     const provider = new Provider(network.name);
  //     const feePayerTransaction = await provider.generateFeePayerTransaction(
  //       account.address,
  //       payload,
  //       process.env.NEXT_PUBLIC_FEE_PAYER_ADDRESS!
  //     );

  //     const petra = window.petra;
  //     const publicKey = HexString.ensure(account.publicKey);
  //     const signedTransaction = await petra.signMultiAgentTransaction(
  //       feePayerTransaction
  //     );

  //     const senderAuth = new TxnBuilderTypes.AccountAuthenticatorEd25519(
  //       new TxnBuilderTypes.Ed25519PublicKey(publicKey.toUint8Array()),
  //       new TxnBuilderTypes.Ed25519Signature(signedTransaction)
  //     );

  //     const serializer = new BCS.Serializer();
  //     feePayerTransaction.serialize(serializer);
  //     senderAuth.serialize(serializer);
  //     const serializedBytes = serializer.getBytes();
  //     const hexData = HexString.fromUint8Array(serializedBytes).toString();

  //     const response = await axios.post('/api/sponsor-transaction', {
  //       serializedData: hexData,
  //       network: network.name,
  //     });

  //     if (response.data.hash) {
  //       setTxHash(response.data.hash);
  //       // toast.update(mintNotification, {
  //       //   render: 'Creation Completed Successfully',
  //       //   type: 'success',
  //       //   isLoading: false,
  //       //   autoClose: 7000,
  //       // });
  //       setCompletedMint(true);
  //     } else {
  //       throw new Error('Failed to submit sponsored transaction');
  //     }
  //     // const committedTransactionResponse =
  //     //   await aptosClient().waitForTransaction({
  //     //     transactionHash: response.hash,
  //     //   });

  //     // console.log('committedTransaction', committedTransactionResponse);

  //     if (response.data.hash) {
  //       if (isSwitchEnabled) {
  //         await axios.post(
  //           'https://deep-zitella-Nebula-846660d9.koyeb.app/marketplace/add-premium-prompts/',
  //           {
  //             ipfs_image_url: imageUrl,
  //             account_address: address,
  //             prompt: promptValue,
  //             post_name: promptNftName,
  //             cid: metadataUrl,
  //             prompt_tag: '3D Art',
  //             collection_name: promptNftName,
  //             max_supply: maxSupply,
  //             prompt_nft_price: publicMintFeePerNFT,
  //             ai_model: 'stable-diffusion',
  //             chain: 'Movement Porto',
  //           }
  //         );
  //       } else {
  //         await axios.post(
  //           `https://deep-zitella-Nebula-846660d9.koyeb.app/prompts/add-public-prompts/`,
  //           {
  //             ipfs_image_url: imageUrl,
  //             prompt: promptValue,
  //             account_address: address,
  //             post_name: promptNftName,
  //             public: true,
  //             prompt_tag: '3D Art',
  //             ai_model: 'stable-diffusion',
  //             chain: 'Movement Porto',
  //           }
  //         );
  //       }
  //     }

  //     setPromptNftName('');
  //     setPromptNftDescription('');
  //     setMaxSupply(1);
  //     setPublicMintFeePerNFT(0.1);
  //     setCompletedMint(true);
  //     setTxHash(response.hash);
  //   } catch (error) {
  //     console.error('Error in the overall NFT creation process:', error);
  //     toast.error(`Error: ${error.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const createPromptNFT = async (e) => {
    e.preventDefault();

    if (!account || !account.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    console.log('Wallet object:', wallet);
    console.log('Account object:', account);
    console.log('signAndSubmitTransaction:', signAndSubmitTransaction);

    let base64String = image;
    let imageType = 'image/jpeg';
    let blob = base64ToBlob(base64String, imageType);

    let promptValue;
    if (isSwitchEnabled) {
      const promptKey = generateKey(promptNftName);
      promptValue = encryptPrompt(prompts, promptKey);
    } else {
      promptValue = prompts;
    }

    let updatedAttr = [...attr];
    updatedAttr[3].value = promptValue;
    updatedAttr[2].value = 'Aptos';
    updatedAttr[1].value = account.address;
    updatedAttr[4].value = isSwitchEnabled ? 'premium' : 'public';

    setAttr(updatedAttr);

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', blob);

      const imagePinataResponse = await axios.post(pinataEndpoint, formData, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      });

      if (!imagePinataResponse.data.IpfsHash) {
        throw new Error('Failed to upload image to Pinata');
      }

      const imageUrl = `https://gateway.pinata.cloud/ipfs/${imagePinataResponse.data.IpfsHash}`;

      const metadata = {
        name: promptNftName,
        description: promptNftDescription,
        image: imageUrl,
        attributes: updatedAttr,
      };

      const jsonBlob = new Blob([JSON.stringify(metadata)], {
        type: 'application/json',
      });
      formData.set('file', jsonBlob);
      const metadataPinataResponse = await axios.post(
        pinataEndpoint,
        formData,
        {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        }
      );

      if (!metadataPinataResponse.data.IpfsHash) {
        throw new Error('Failed to upload metadata to Pinata');
      }

      const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataPinataResponse.data.IpfsHash}`;

      const currentTime = new Date();

      const payload = createPromptCollection({
        description: promptNftDescription,
        name: promptNftName,
        uri: metadataUrl,
        maxSupply: maxSupply,
        publicMintLimitPerAddr: 1,
        publicMintFeePerPrompt: publicMintFeePerNFT,
      });

      let response;

      try {
        response = await signAndSubmitTransaction(payload);
      } catch (signError) {
        console.error('Error during transaction signing:', signError);
        throw new Error(`Transaction signing failed: ${signError.message}`);
      }

      console.log('Transaction response:', response);

      if (response.hash) {
        setTxHash(response.hash);
        setCompletedMint(true);

        await axios.post(`${baseUrl}/marketplace/add-premium-prompts/`, {
          ipfs_image_url: imageUrl,
          account_address: account.address,
          prompt: promptValue,
          post_name: promptNftName,
          cid: metadataUrl,
          prompt_tag: '3D Art',
          collection_name: promptNftName,
          max_supply: maxSupply,
          prompt_nft_price: publicMintFeePerNFT,
          ai_model: 'stable-diffusion',
          chain: 'ethereum',
        });

        setPromptNftName('');
        setPromptNftDescription('');
        setMaxSupply(1);
        setPublicMintFeePerNFT(0.1);
        setCompletedMint(true);
        setTxHash(response.hash);
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error in the overall NFT creation process:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createPromptWithoutNFT = async (e) => {
    e.preventDefault();

    if (!account || !account.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    let base64String = image;
    let imageType = 'image/jpeg';
    let blob = base64ToBlob(base64String, imageType);

    let promptValue;
    if (isSwitchEnabled) {
      const promptKey = generateKey(promptNftName);
      promptValue = encryptPrompt(prompts, promptKey);
    } else {
      promptValue = prompts;
    }

    try {
      setLoading(true);

      // Upload image to IPFS
      const formData = new FormData();
      formData.append('file', blob);

      const imagePinataResponse = await axios.post(pinataEndpoint, formData, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      });

      if (!imagePinataResponse.data.IpfsHash) {
        throw new Error('Failed to upload image to Pinata');
      }

      const imageUrl = `https://gateway.pinata.cloud/ipfs/${imagePinataResponse.data.IpfsHash}`;

      // Make API request to add prompt to marketplace

      await axios.post(`${baseUrl}/prompts/add-public-prompts/`, {
        ipfs_image_url: imageUrl,
        prompt: promptValue,
        account_address: account.address,
        post_name: promptNftName,
        public: true,
        prompt_tag: '3D Art',
        ai_model: 'stable-diffusion',
        chain: 'Aptos',
      });

      // Reset form and show success
      setPromptNftName('');
      setPromptNftDescription('');
      setMaxSupply(1);
      setPublicMintFeePerNFT(0.1);
      toast.success('Successfully created prompt!');
      handleOnClose();
    } catch (error) {
      console.error('Error in the prompt creation process:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  console.log('isSwitchEnabled', isSwitchEnabled);

  const appropriateCreateFunction = isSwitchEnabled
    ? createPromptNFT
    : createPromptWithoutNFT;

  useEffect(() => {
    if (!isSwitchEnabled) {
      setMaxSupply(1);
      setPublicMintFeePerNFT(0);
    }
  }, [isSwitchEnabled]);

  return (
    <>
      <Transition appear show={openModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 font-serif"
          onClose={handleOnClose}
        >
          <Transition.Child
            as={'div'}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur"
              aria-hidden="true"
            />

            <div className="flex min-h-full  items-center justify-center p-2 text-center pt-5">
              <Transition.Child
                as={'div'}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {!completedMint && (
                  <Dialog.Panel className="w-[100%]  transform overflow-hidden rounded-lg bg-black/80 border border-gray-800  text-left align-middle shadow-xl transition-all">
                    <div className="relative h-[100px] w-full">
                      <img
                        src="/abstract.jpg"
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-0 left-0 h-full w-full bg-black opacity-70"></div>
                      <p className="absolute top-[36px] left-[290px] right-8 transform  text-white text-2xl font-bold">
                        Configure{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 ">
                          Prompt Details
                        </span>
                      </p>
                    </div>

                    <div className=" flex w-full text-center justify-center">
                      <div className="w-[100%] mt-3 mb-4 pl-4">
                        <img
                          src={image}
                          alt=""
                          className="rounded-xl w-[530px] h-[550px]  object-cover"
                        />
                      </div>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <div className="text-white w-[100%]">
                        <form className="ml-[40px] w-[400px] mt-6">
                          <div className="relative z-0 w-full mb-6 group">
                            <input
                              name="floating"
                              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                              placeholder=" "
                              required
                              onChange={(e) => setPromptNftName(e.target.value)}
                            />
                            <label
                              for="floating"
                              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Prompt NFT Name
                            </label>
                          </div>

                          <div className="relative z-0 w-full mb-6 group">
                            <textarea
                              name="text"
                              id="floating_text"
                              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
                              placeholder=" "
                              required
                              onChange={(e) =>
                                setPromptNftDescription(e.target.value)
                              }
                            />
                            <label
                              for="floating_repeat"
                              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Prompt NFT Description (Optional)
                            </label>
                          </div>

                          <div className="flex items-center justify-center z-0 w-full gap-4 mb-6 group">
                            <span
                              htmlFor="floating_repeat"
                              className="text-gray-400 text-[15px]"
                            >
                              Premium Prompt
                            </span>
                            <SwitchButton
                              enabled={isSwitchEnabled}
                              setEnabled={setIsSwitchEnabled}
                            />
                          </div>

                          <div class="text-gray-400 flex justify-center">
                            &nbsp;&nbsp;
                            <DestinationChain />
                          </div>

                          {isSwitchEnabled && (
                            <div class="text-gray-400 flex flex-col items-center mt-6">
                              <label for="quantity" class="block mb-1">
                                Maximum Supply:
                              </label>

                              <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                min="1"
                                max="50000"
                                className="px-4 w-[60%] bg-transparent py-2 border border-gray-500 rounded-md focus:outline-none focus:ring focus:border-purple-600"
                                value={maxSupply}
                                onChange={(e) =>
                                  setMaxSupply(Number(e.target.value))
                                }
                              />
                            </div>
                          )}

                          {isSwitchEnabled && (
                            <div className="text-gray-400 mt-6 flex flex-col items-center">
                              <label htmlFor="quantity" className="block mb-1">
                                NFT Price:
                              </label>
                              <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                min="1"
                                step="1"
                                className="px-6 bg-transparent py-2 border border-gray-500 rounded-md focus:outline-none focus:ring focus:border-purple-500"
                                value={publicMintFeePerNFT}
                                onChange={(e) =>
                                  setPublicMintFeePerNFT(Number(e.target.value))
                                }
                              />
                            </div>
                          )}

                          <button
                            type="submit"
                            onClick={appropriateCreateFunction}
                            className="text-white  bg-gradient-to-r from-purple-700 via-purple-500 to-pink-500 mt-3 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300  rounded-lg text-sm font-bold w-[140px] h-[40px]  px-8 py-2 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                          >
                            {loading ? (
                              <ClipLoader color="#fff" size={22} />
                            ) : (
                              ' Create'
                            )}
                          </button>
                        </form>
                      </div>
                      &nbsp;&nbsp;
                    </div>
                  </Dialog.Panel>
                )}

                {completedMint && (
                  <Dialog.Panel className="w-full  transform overflow-hidden rounded-lg bg-black/80 border border-gray-800  text-left align-middle shadow-xl transition-all px-32 py-32">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium text-center leading-6 text-gray-300"
                    >
                      Prompt Creation Successful!!
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You can now proceed to verify your Prompt Transaction on
                        the Explorer.
                        <br /> <br />
                      </p>
                    </div>

                    <div className="mt-4 text-center">
                      <button
                        type="button"
                        className="text-white border-purple-300 border focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-xl text-sm px-4 py-2 hover:opacity-70"
                        //   onClick={closeModal}
                      >
                        <a target="_blank" href={'' + txHash}>
                          Confirm on Movement
                        </a>
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <Link href="/home">
                        <button
                          type="button"
                          className="text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-xl text-sm px-4 py-2 hover:opacity-70"
                          //   onClick={closeModal}
                        >
                          View in profile
                        </button>
                      </Link>
                      &nbsp;&nbsp;
                    </div>
                  </Dialog.Panel>
                )}
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <ToastContainer />
    </>
  );
};

export default CreateNftModal;
