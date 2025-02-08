import { NETWORK } from '@/constants';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

console.log('NETWORK:', NETWORK);

const network: Network = NETWORK as Network;

function isValidNetwork(network: string): network is Network {
  return ['mainnet', 'testnet', 'devnet', 'local'].includes(network);
}

if (!isValidNetwork(network)) {
  throw new Error(
    `Invalid network: ${network}. Must be 'mainnet', 'testnet', 'devnet', or 'local'.`
  );
}

const aptos = new Aptos(new AptosConfig({ network }));

// Reuse same Aptos instance to utilize cookie based sticky routing
export function aptosClient() {
  return aptos;
}
