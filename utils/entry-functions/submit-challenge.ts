import { InputTransactionData } from '@aptos-labs/wallet-adapter-react';
import { TxnBuilderTypes } from 'aptos';

export type SubmitChallengeArguments = {
  challengeId: number;
  ipfsUri: string;
};

// Sponsored version
export const submitChallengeSponsored = (args: SubmitChallengeArguments) => {
  const { challengeId, ipfsUri } = args;

  return {
    type: 'entry_function_payload',
    function: `${process.env.NEXT_PUBLIC_CHALLENGES_MODULE_ADDRESS}::challenge_contract::submit`,
    type_arguments: [],
    arguments: [challengeId, ipfsUri],
  };
};

// Normal version
export const submitChallenge = (
  args: SubmitChallengeArguments
): InputTransactionData => {
  const { challengeId, ipfsUri } = args;

  return {
    data: {
      function: `${process.env.NEXT_PUBLIC_CHALLENGES_MODULE_ADDRESS}::challenge_contract::submit`,
      typeArguments: [],
      functionArguments: [challengeId, ipfsUri],
    },
  };
};
