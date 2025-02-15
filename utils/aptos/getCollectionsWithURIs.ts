import { AptosClient, Types } from 'aptos';

// Get the module address from environment variable
const MODULE_ADDRESS = process.env.NEXT_PUBLIC_MODULE_ADDRESS;

if (!MODULE_ADDRESS) {
  console.warn('NEXT_PUBLIC_MODULE_ADDRESS not set in environment variables');
}

interface Collection {
  id: string;
  uri: string;
}

/**
 * Fetches all collections with their URIs from the Move contract
 * @param client AptosClient instance
 * @returns Promise<Collection[]> Array of collections with their IDs and URIs
 */
export async function getCollectionsWithURIs(
  client: AptosClient
): Promise<Collection[]> {
  try {
    const payload: Types.ViewRequest = {
      function: `${MODULE_ADDRESS}::prompt_marketplace::get_collections_with_details`,
      type_arguments: [],
      arguments: [],
    };

    const response = await client.view(payload);
    const collectionIds = response[0] as unknown as string[];
    const uris = response[1] as unknown as string[];

    return collectionIds.map((id: string, index: number) => ({
      id: id,
      uri: uris[index],
    }));
  } catch (error) {
    console.error('Error fetching collections with URIs:', error);
    throw error;
  }
}

/**
 * Find a collection ID by its URI
 * @param client AptosClient instance
 * @param targetUri The URI to search for
 * @returns Promise<string | null> The collection ID if found, null otherwise
 */
export async function findCollectionIdByUri(
  client: AptosClient,
  targetUri: string
): Promise<string | null> {
  try {
    const collections = await getCollectionsWithURIs(client);
    const collection = collections.find((col) => col.uri === targetUri);
    return collection ? collection.id : null;
  } catch (error) {
    console.error('Error finding collection by URI:', error);
    throw error;
  }
}
