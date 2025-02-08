import { PropsWithChildren } from 'react';
import {
  AptosWalletAdapterProvider,
  Network,
} from '@aptos-labs/wallet-adapter-react';
import { toast } from 'react-toastify';

import { NETWORK } from '@/constants';

const network: Network = NETWORK as Network;

export function WalletProvider({ children }: PropsWithChildren) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{ network }}
      onError={(error) => {
        toast.error(error || 'Unknown wallet error', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
