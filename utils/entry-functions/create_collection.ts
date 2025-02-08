import { InputTransactionData } from '@aptos-labs/wallet-adapter-react';
import { dateToSeconds } from '../aptos/helpers';

export type CreatePromptCollectionArguments = {
  description: string;
  name: string;
  uri: string;
  maxSupply: number;
  preMintAmount: number;
  publicMintStartDate: Date;
  publicMintEndDate?: Date | null;
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
    preMintAmount,
    publicMintStartDate,
    publicMintEndDate,
    publicMintLimitPerAddr,
    publicMintFeePerPrompt,
  } = args;

  return {
    data: {
      function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS}::prompt_marketplace::create_prompt_collection`,
      typeArguments: [],
      functionArguments: [
        description,
        name,
        uri,
        maxSupply,
        preMintAmount,
        publicMintStartDate
          ? dateToSeconds(publicMintStartDate)
          : dateToSeconds(new Date()),
        publicMintEndDate ? dateToSeconds(publicMintEndDate) : null,
        publicMintLimitPerAddr,
        Math.floor(publicMintFeePerPrompt * 100000000),
      ],
    },
  };
};
