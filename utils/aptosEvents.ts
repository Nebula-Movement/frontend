export interface AptosEvent {
  version: string;
  guid: {
    creation_number: string;
    account_address: string;
  };
  sequence_number: string;
  type: string;
  data: any;
}

export interface AptosEvent {
  version: string;
  guid: {
    creation_number: string;
    account_address: string;
  };
  sequence_number: string;
  type: string;
  data: any;
}

export interface FetchAptosEventsOptions {
  apiEndpoint?: string;
  accountAddress: string;
  moduleAddress: string;
  moduleName: string;
  eventName: string;
  limit?: number;
}

export async function fetchAptosEvents(
  options: FetchAptosEventsOptions
): Promise<AptosEvent[]> {
  const {
    apiEndpoint = 'https://fullnode.testnet.aptoslabs.com/v1',
    accountAddress,
    moduleAddress,
    moduleName,
    eventName,
    limit = 25,
  } = options;

  const txnUrl = `${apiEndpoint}/accounts/${accountAddress}/transactions?limit=${limit}`;
  const txnResponse = await fetch(txnUrl);
  if (!txnResponse.ok) {
    throw new Error(`Error fetching transactions: ${await txnResponse.text()}`);
  }

  const transactions = await txnResponse.json();

  const events: AptosEvent[] = [];
  const eventType = `${moduleAddress}::${moduleName}::${eventName}`;

  for (const txn of transactions) {
    if (txn.events) {
      for (const event of txn.events) {
        if (event.type === eventType) {
          events.push({
            version: txn.version,
            guid: {
              creation_number: event.guid.creation_number,
              account_address: event.guid.account_address,
            },
            sequence_number: event.sequence_number,
            type: event.type,
            data: event.data,
          });
        }
      }
    }
  }

  return events;
}
