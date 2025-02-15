import { InputTransactionData } from '@aptos-labs/wallet-adapter-react';

export type MintPromptArguments = {
  collectionId: string;
};

export const mintPrompt = (args: MintPromptArguments): InputTransactionData => {
  const { collectionId } = args;
  return {
    data: {
      function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS}::prompt_marketplace::mint_prompt`,
      typeArguments: [],
      functionArguments: [collectionId],
    },
  };
};
