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
    const [challengeEvents, submissionEvents, finalizedEvents] =
      await Promise.all([
        aptos.getModuleEventsByEventType({
          eventType: `${CONTRACT_ADDRESS}::challenge_contract::ChallengeCreatedEvent`,
        }),
        aptos.getModuleEventsByEventType({
          eventType: `${CONTRACT_ADDRESS}::challenge_contract::SubmissionAddedEvent`,
        }),
        aptos.getModuleEventsByEventType({
          eventType: `${CONTRACT_ADDRESS}::challenge_contract::ChallengeFinalizedEvent`,
        }),
      ]);

    const currentTime = Math.floor(Date.now() / 1000);

    const finalizedChallenges = challengeEvents.filter((event) => {
      const { start_time, duration } = event.data;
      const endTime = parseInt(start_time) + parseInt(duration);
      return currentTime >= endTime;
    });

    const formattedEvents = finalizedChallenges.map((event) => {
      const submissionCount = submissionEvents.filter(
        (subEvent) => subEvent.data.challenge_id === event.data.challenge_id
      ).length;

      const finalizedEvent = finalizedEvents.find(
        (finEvent) => finEvent.data.challenge_id === event.data.challenge_id
      );

      let winner = null;
      if (
        finalizedEvent &&
        finalizedEvent.data.winner.vec &&
        finalizedEvent.data.winner.vec.length > 0
      ) {
        winner = finalizedEvent.data.winner.vec[0];
      }

      return {
        challenge_id: event.data.challenge_id,
        creator: event.data.creator,
        prize: event.data.prize,
        start_time: new Date(
          parseInt(event.data.start_time) * 1000
        ).toLocaleString(),
        end_time: new Date(
          (parseInt(event.data.start_time) + parseInt(event.data.duration)) *
            1000
        ).toLocaleString(),
        ipfs_uri: event.data.ipfs_uri,
        numberOfSubmissions: submissionCount,
        winner: winner,
      };
    });

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error fetching finalized challenges:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
