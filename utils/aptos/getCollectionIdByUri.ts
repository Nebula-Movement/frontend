import { AptosClient } from 'aptos';

const NODE_URL =
  process.env.NEXT_PUBLIC_APTOS_NODE_URL ||
  'https://aptos.testnet.porto.movementlabs.xyz/v1';
const MODULE_ADDRESS = process.env.NEXT_PUBLIC_MODULE_ADDRESS;

// if (!MODULE_ADDRESS) {
//   console.warn(
//     'NEXT_PUBLIC_PROMPT_MARKETPLACE_MODULE_ADDRESS is not set in environment variables'
//   );
// }

/**
 * This utility function retrieves the collection ID based on the unique URI.
 * @param userAddress - The address of the user (not used in new implementation but kept for backwards compatibility)
 * @param uniqueCid - The unique URI string (CID) to search for
 * @returns {Promise<string>} - Returns the collection ID if found, or 'No Collection Found'
 */
export async function getCollectionIdByUri(
  userAddress: string,
  uniqueCid: string
): Promise<string> {
  // if (!MODULE_ADDRESS) {
  //   console.error('Module address is not configured');
  //   return 'No Collection Found';
  // }

  try {
    const client = new AptosClient(NODE_URL);

    const payload = {
      function: `${MODULE_ADDRESS}::prompt_marketplace::get_collections_with_details`,
      type_arguments: [],
      arguments: [],
    };

    const response = await client.view(payload);

    const collectionIds = response[0] as unknown as string[];
    const uris = response[1] as unknown as string[];

    const collections = collectionIds.map((id: string, index: number) => ({
      id: id,
      uri: uris[index],
    }));

    const collection = collections.find((col) => col.uri === uniqueCid);
    return collection ? collection.id : 'No Collection Found';
  } catch (error) {
    console.error('Error fetching collections:', error);
    return 'No Collection Found';
  }
}
