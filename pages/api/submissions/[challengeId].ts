import { NextApiRequest, NextApiResponse } from 'next';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CHALLENGES_MODULE_ADDRESS;

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { challengeId } = req.query;

  if (!challengeId || Array.isArray(challengeId)) {
    return res.status(400).json({ message: 'Invalid challenge ID' });
  }

  try {
    const [submissionEvents, voteEvents] = await Promise.all([
      aptos.getModuleEventsByEventType({
        eventType: `${CONTRACT_ADDRESS}::challenge_contract::SubmissionAddedEvent`,
      }),
      aptos.getModuleEventsByEventType({
        eventType: `${CONTRACT_ADDRESS}::challenge_contract::VoteCastEvent`,
      }),
    ]);

    const challengeSubmissions = submissionEvents.filter(
      (event) => event.data.challenge_id === challengeId
    );

    const formattedSubmissions = challengeSubmissions.map((submission) => {
      const voteCount = voteEvents.filter(
        (vote) =>
          vote.data.challenge_id === challengeId &&
          vote.data.submission_id === submission.data.submission_id
      ).length;

      // Use transaction_version as a proxy for timestamp
      const timestamp = new Date(
        parseInt(submission.transaction_version) * 1000
      ).toLocaleString();

      return {
        submission_id: submission.data.submission_id,
        creator: submission.data.creator,
        ipfs_uri: submission.data.ipfs_uri,
        vote_count: voteCount,
        timestamp: timestamp,
      };
    });

    res.status(200).json(formattedSubmissions);
  } catch (error) {
    console.error('Error fetching challenge submissions:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
