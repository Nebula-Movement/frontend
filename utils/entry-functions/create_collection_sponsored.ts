import { TxnBuilderTypes } from 'aptos';
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

export const createPromptCollectionSponsored = (
  args: CreatePromptCollectionArguments
) => {
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
    type: 'entry_function_payload',
    function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS}::prompt_marketplace::create_prompt_collection`,
    type_arguments: [],
    arguments: [
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
  };
};
