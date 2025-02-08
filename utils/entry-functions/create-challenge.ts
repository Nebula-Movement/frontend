import { InputTransactionData } from '@aptos-labs/wallet-adapter-react';
import { TxnBuilderTypes } from 'aptos';
import { dateToSeconds } from '../aptos/helpers';

export type CreateChallengeArguments = {
  prize: number;
  startDate: Date;
  duration: number;
  ipfsUri: string;
};

export const createChallengeSponsored = (args: CreateChallengeArguments) => {
  const { prize, startDate, duration, ipfsUri } = args;

  return {
    type: 'entry_function_payload',
    function: `${process.env.NEXT_PUBLIC_CHALLENGES_MODULE_ADDRESS}::challenge_contract::create_challenge`,
    type_arguments: [],
    arguments: [
      Math.floor(prize * 100000000),
      dateToSeconds(startDate),
      duration,
      ipfsUri,
    ],
  };
};

export const createChallenge = (
  args: CreateChallengeArguments
): InputTransactionData => {
  const { prize, startDate, duration, ipfsUri } = args;

  return {
    data: {
      function: `${process.env.NEXT_PUBLIC_CHALLENGES_MODULE_ADDRESS}::challenge_contract::create_challenge`,
      typeArguments: [],
      functionArguments: [
        Math.floor(prize * 100000000),
        dateToSeconds(startDate),
        duration,
        ipfsUri,
      ],
    },
  };
};
