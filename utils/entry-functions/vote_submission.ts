import { InputTransactionData } from '@aptos-labs/wallet-adapter-react';
import { TxnBuilderTypes } from 'aptos';

export type VoteSubmissionArguments = {
  challengeId: number;
  submissionId: number;
};

export const voteSubmissionSponsored = (args: VoteSubmissionArguments) => {
  const { challengeId, submissionId } = args;

  return {
    type: 'entry_function_payload',
    function: `${process.env.NEXT_PUBLIC_CHALLENGES_MODULE_ADDRESS}::challenge_contract::vote`,
    type_arguments: [],
    arguments: [challengeId, submissionId],
  };
};

export const voteSubmission = (
  args: VoteSubmissionArguments
): InputTransactionData => {
  const { challengeId, submissionId } = args;

  return {
    data: {
      function: `${process.env.NEXT_PUBLIC_CHALLENGES_MODULE_ADDRESS}::challenge_contract::vote`,
      typeArguments: [],
      functionArguments: [challengeId, submissionId],
    },
  };
};
