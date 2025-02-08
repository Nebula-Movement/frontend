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

  try {
    const challengeEvents = await aptos.getModuleEventsByEventType({
      eventType: `${CONTRACT_ADDRESS}::challenge_contract::ChallengeCreatedEvent`,
    });

    const challenges = challengeEvents.map((event) => ({
      challenge_id: event.data.challenge_id,
      creator: event.data.creator,
      prize: event.data.prize,
      start_time: event.data.start_time,
      duration: event.data.duration,
      ipfs_uri: event.data.ipfs_uri,
    }));

    res.status(200).json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
