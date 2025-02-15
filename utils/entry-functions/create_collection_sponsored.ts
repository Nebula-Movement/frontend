import { TxnBuilderTypes } from 'aptos';
import { dateToSeconds } from '../aptos/helpers';

export type CreatePromptCollectionArguments = {
  description: string;
  name: string;
  uri: string;
  maxSupply: number;
  publicMintLimitPerAddr: number;
  publicMintFeePerPrompt: number;
};

export const createPromptCollectionSponsored = (
  args: CreatePromptCollectionArguments
) => {
  const {
    description,
    name,
    uri,
    maxSupply,
    publicMintLimitPerAddr,
    publicMintFeePerPrompt,
  } = args;

  return {
    type: 'entry_function_payload',
    function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS}::prompt_marketplace::create_collection`,
    type_arguments: [],
    arguments: [
      name,
      description,
      uri,
      maxSupply,
      Math.floor(publicMintFeePerPrompt * 100000000),
      publicMintLimitPerAddr,
    ],
  };
};
