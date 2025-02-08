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

export async function checkUserNftAccess(
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

    console.log("response", response);
    

    const collections = response.current_collection_ownership_v2_view;

    console.log(collections);
    

    const hasAccess = collections.some((collection: NftCollection) => {
      return collection.current_collection.uri === uniqueCid;
    });

    return hasAccess ? 'Has Access' : 'No Access';
  } catch (error) {
    console.error('Error fetching NFT collections:', error);
    return 'No Access';
  }
}
