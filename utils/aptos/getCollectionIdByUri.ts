import { request, gql } from 'graphql-request';

const APTOS_GRAPHQL_ENDPOINT = 'https://testnet.aptoslabs.com/v1/graphql';

interface NftCollection {
  collection_id: string;
  distinct_tokens: number;
  last_transaction_version: number;
  owner_address: string;
  current_collection: {
    collection_id: string;
    collection_name: string;
    creator_address: string;
    current_supply: number;
    description: string;
    last_transaction_timestamp: string;
    last_transaction_version: number;
    max_supply: number;
    mutable_description: string | null;
    mutable_uri: string | null;
    table_handle_v1: string | null;
    token_standard: string;
    total_minted_v2: number;
    uri: string;
    __typename: string;
  };
  __typename: string;
}

interface GetAccountNftCollectionsResponse {
  current_collection_ownership_v2_view: NftCollection[];
}

const GET_ACCOUNT_NFT_COLLECTIONS = gql`
  query GetAccountNftCollections($address: String) {
    current_collection_ownership_v2_view(
      where: { owner_address: { _eq: $address } }
      limit: 1000000
      offset: 0
      order_by: [{ last_transaction_version: desc }, { collection_id: asc }]
    ) {
      collection_id
      distinct_tokens
      last_transaction_version
      owner_address
      current_collection {
        collection_id
        collection_name
        creator_address
        current_supply
        description
        last_transaction_timestamp
        last_transaction_version
        max_supply
        mutable_description
        mutable_uri
        table_handle_v1
        token_standard
        total_minted_v2
        uri
        __typename
      }
      __typename
    }
  }
`;

/**
 * This utility function retrieves the collection ID based on the unique URI.
 * @param userAddress - The address of the user
 * @param uniqueCid - The unique URI string (CID) to search for
 * @returns {Promise<string>} - Returns the collection ID if found, or 'No Collection Found'
 */
export async function getCollectionIdByUri(
  userAddress: string,
  uniqueCid: string
): Promise<string> {
  try {
    const response = await request<GetAccountNftCollectionsResponse>(
      APTOS_GRAPHQL_ENDPOINT,
      GET_ACCOUNT_NFT_COLLECTIONS,
      {
        address: userAddress,
      }
    );

    const collections = response.current_collection_ownership_v2_view;

    // console.log(collections);

    const collection = collections.find((collection: NftCollection) => {
      return collection.current_collection.uri === uniqueCid;
    });

    return collection ? collection.collection_id : 'No Collection Found';
  } catch (error) {
    console.error('Error fetching NFT collections:', error);
    return 'No Collection Found';
  }
}
