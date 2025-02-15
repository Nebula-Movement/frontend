import { InputTransactionData } from '@aptos-labs/wallet-adapter-react';
import { dateToSeconds } from '../aptos/helpers';

export type CreatePromptCollectionArguments = {
  description: string;
  name: string;
  uri: string;
  maxSupply: number;
  publicMintLimitPerAddr: number;
  publicMintFeePerPrompt: number;
};

export const createPromptCollection = (
  args: CreatePromptCollectionArguments
): InputTransactionData => {
  const {
    description,
    name,
    uri,
    maxSupply,
    publicMintLimitPerAddr,
    publicMintFeePerPrompt,
  } = args;

  return {
    data: {
      function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS}::prompt_marketplace::create_collection`,
      typeArguments: [],
      functionArguments: [
        name,
        description,
        uri,
        maxSupply,
        Math.floor(publicMintFeePerPrompt * 100000000),
        publicMintLimitPerAddr,
      ],
    },
  };
};
