// pages/api/admin/batch-finalize-challenges.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { AptosClient, AptosAccount, HexString, Types } from 'aptos';
import Cors from 'cors';
import axios from 'axios';

const cors = Cors({
  methods: ['POST', 'HEAD'],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const nodeUrl = process.env.NEXT_PUBLIC_APTOS_NODE_URL;
const privateKey = process.env.FEE_PAYER_PRIVATE_KEY;
const moduleAddress = process.env.NEXT_PUBLIC_CHALLENGES_MODULE_ADDRESS;
const API_KEY = process.env.FINALIZE_API_KEY;
const baseUrl = 'http://localhost:3000';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const client = new AptosClient(nodeUrl);
  const account = new AptosAccount(HexString.ensure(privateKey).toUint8Array());

  try {
    console.log('Checking admin status...');
    const adminPayload = {
      function: `${moduleAddress}::challenge_contract::get_admin`,
      type_arguments: [],
      arguments: [],
    };
    const adminResponse = await client.view(adminPayload);
    console.log('Admin response:', adminResponse);

    if (adminResponse[0] !== account.address().hex()) {
      return res
        .status(403)
        .json({ message: 'Your account is not set as the admin.' });
    }

    console.log('Fetching all challenges...');
    const allChallengesResponse = await axios.get(
      `${baseUrl}/api/challenges/get-all-challenges`
    );
    const allChallenges = allChallengesResponse.data;

    console.log('Filtering completed challenges...');
    const completedChallenges = filterCompletedChallenges(allChallenges);
    console.log('Completed challenges:', completedChallenges);

    console.log('Fetching finalized challenges...');
    const finalizedChallenges = await getFinalizedChallenges(client);
    console.log('Finalized challenges:', finalizedChallenges);

    const challengesToFinalize = completedChallenges.filter(
      (challenge) =>
        !finalizedChallenges.includes(Number(challenge.challenge_id))
    );
    console.log('Challenges to finalize:', challengesToFinalize);

    if (challengesToFinalize.length === 0) {
      return res.status(200).json({ message: 'No new challenges to finalize' });
    }

    const maxBatchSize = Math.min(8, challengesToFinalize.length);

    console.log('Preparing batch finalize payload...');
    const batchFinalizePayload = {
      function: `${moduleAddress}::challenge_contract::batch_finalize_challenges`,
      type_arguments: [],
      arguments: [maxBatchSize.toString()],
    };
    console.log('Batch finalize payload:', batchFinalizePayload);

    console.log('Generating transaction...');
    const txnRequest = await client.generateTransaction(
      account.address(),
      batchFinalizePayload
    );
    console.log('Signing transaction...');
    const signedTxn = await client.signTransaction(account, txnRequest);
    console.log('Submitting transaction...');
    const txnResult = await client.submitTransaction(signedTxn);
    console.log('Waiting for transaction to be processed...');
    await client.waitForTransaction(txnResult.hash);

    console.log('Transaction processed successfully');
    res.status(200).json({
      message: `Batch finalization completed for ${maxBatchSize} challenges`,
      transactionHash: txnResult.hash,
    });
  } catch (error) {
    console.error('Error in process:', error);
    if (error.message && error.message.includes('E_NOT_ADMIN')) {
      res
        .status(403)
        .json({ message: 'Your account is not authorized as the admin.' });
    } else {
      res.status(500).json({
        message: 'An error occurred during batch finalization',
        error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      });
    }
  }
}

function filterCompletedChallenges(challenges) {
  const currentTime = Math.floor(Date.now() / 1000);
  return challenges.filter((challenge) => {
    const endTime =
      parseInt(challenge.start_time) + parseInt(challenge.duration);
    return currentTime >= endTime;
  });
}

async function getFinalizedChallenges(client: AptosClient): Promise<number[]> {
  const payload = {
    function: `${moduleAddress}::challenge_contract::get_finalized_challenges`,
    type_arguments: [],
    arguments: [],
  };
  const response = await client.view(payload);

  if (Array.isArray(response[0])) {
    return response[0].map((value: any) => Number(value));
  } else {
    console.error('Unexpected response format from get_finalized_challenges');
    return [];
  }
}
