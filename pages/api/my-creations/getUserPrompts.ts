import { NextApiRequest, NextApiResponse } from 'next';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import axios from 'axios';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MODULE_ADDRESS;

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

interface Metadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

interface FormattedCollection {
  collection_obj: string;
  collection_owner_obj: string;
  creator_addr: string;
  description: string;
  max_supply: string;
  name: string;
  pre_mint_amount: string | null;
  public_mint_end_time: string | null;
  public_mint_fee_per_nft: string;
  public_mint_limit_per_addr: string;
  public_mint_start_time: string;
  royalty_percentage: string | null;
  uri: string;
  metadata: Metadata | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ message: 'Invalid address parameter' });
  }

  try {
    const events = await aptos.getModuleEventsByEventType({
      eventType: `${CONTRACT_ADDRESS}::prompt_marketplace::CreatePromptCollectionEvent`,
    });

    const matchingCollections: FormattedCollection[] = [];

    for (const event of events) {
      if (event.data.creator_addr === address) {
        const formattedCollection: FormattedCollection = {
          collection_obj: event.data.collection_obj.inner,
          collection_owner_obj: event.data.collection_owner_obj.inner,
          creator_addr: event.data.creator_addr,
          description: event.data.description,
          max_supply: event.data.max_supply,
          name: event.data.name,
          pre_mint_amount: event.data.pre_mint_amount.vec[0] || null,
          public_mint_end_time: event.data.public_mint_end_time.vec[0] || null,
          public_mint_fee_per_nft: event.data.public_mint_fee_per_nft,
          public_mint_limit_per_addr: event.data.public_mint_limit_per_addr,
          public_mint_start_time: event.data.public_mint_start_time,
          royalty_percentage: event.data.royalty_percentage.vec[0] || null,
          uri: event.data.uri,
          metadata: null,
        };

        try {
          const metadataResponse = await axios.get<Metadata>(event.data.uri);
          formattedCollection.metadata = metadataResponse.data;
        } catch (error) {
          console.error('Error fetching metadata:', error);
        }

        matchingCollections.push(formattedCollection);
      }
    }

    res.status(200).json(matchingCollections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
