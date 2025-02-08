// import type { NextApiRequest, NextApiResponse } from 'next';
// import axios from 'axios';

// interface PromptRequestBody {
//   isSwitchEnabled: boolean;
//   imageUrl: string;
//   promptValue: string;
//   promptNftName: string;
//   address: string;
//   maxSupply: number;
//   publicMintFeePerNFT: number;
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === 'POST') {
//     const {
//       isSwitchEnabled,
//       imageUrl,
//       promptValue,
//       promptNftName,
//       address,
//       maxSupply,
//       publicMintFeePerNFT,
//     }: PromptRequestBody = req.body;

//     try {
//       if (isSwitchEnabled) {
//         await axios.post(
//           'https://deep-zitella-artemys-846660d9.koyeb.app/marketplace/add-premium-prompts/',
//           {
//             ipfs_image_url: imageUrl,
//             prompt: promptValue,
//             post_name: promptNftName,
//             account_address: address,
//             collection_name: promptNftName,
//             max_supply: maxSupply,
//             prompt_tag: '3D Art',
//             prompt_nft_price: publicMintFeePerNFT,
//           }
//         );
//       } else {
//         await axios.post(
//           'https://deep-zitella-artemys-846660d9.koyeb.app/prompts/add-public-prompts/',
//           {
//             ipfs_image_url: imageUrl,
//             prompt: promptValue,
//             account_address: address,
//             post_name: promptNftName,
//             public: true,
//             prompt_tag: '3D Art',
//           }
//         );
//       }

//       res.status(200).json({ message: 'Prompt added successfully' });
//     } catch (error: any) {
//       if (axios.isAxiosError(error)) {
//         console.error('Error status:', error.response?.status);
//         console.error('Error data:', error.response?.data); // Log the actual response data
//         res.status(500).json({ error: error.response?.data || error.message });
//       } else {
//         console.error('Unexpected error:', error);
//         res.status(500).json({ error: error.message });
//       }
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// }
