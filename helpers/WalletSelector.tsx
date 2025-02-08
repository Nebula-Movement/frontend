import React, { useCallback, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  useWallet,
  AnyAptosWallet,
  WalletName,
  isAptosConnectWallet,
  truncateAddress,
  groupAndSortWallets,
  isInstallRequired,
} from '@aptos-labs/wallet-adapter-react';
import { toast } from 'react-toastify';
import { ChevronDown, Copy, LogOut, User } from 'lucide-react';
import GradientBorderButton from '@/components/button/GradientBorderButton';

const APTOS_CONNECT_ACCOUNT_URL = 'https://aptosconnect.com/account';

export function WalletSelector() {
  const { account, connected, disconnect, wallet } = useWallet();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (connected && account) {
      setIsConnecting(false);
      setIsDialogOpen(false);
    //   toast.success('Wallet connected successfully');
    } else if (connected && !account) {
      setIsConnecting(true);
    } else {
      setIsConnecting(false);
    }
  }, [connected, account]);

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  const copyAddress = useCallback(async () => {
    if (!account?.address) return;
    try {
      await navigator.clipboard.writeText(account.address);
      toast.success('Copied wallet address to clipboard.');
    } catch {
      toast.error('Failed to copy wallet address.');
    }
  }, [account?.address]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect:', error);
      toast.error('Failed to disconnect wallet');
    }
  }, [disconnect]);

  return (
    <>
      <div>
        {connected && account ? (
          <GradientBorderButton
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            // className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {account.ansName || truncateAddress(account.address) || 'Unknown'}
          </GradientBorderButton>
        ) : (
          <button
            onClick={() => setIsDialogOpen(true)}
            className="px-4 py-2 border-[1px] border-purple-400 text-gray-200 rounded-md text-sm mr-4"
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
      {isDropdownOpen && (
        <Portal>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setIsDropdownOpen(false)}
          >
            <div
              className="absolute right-[180px] top-[16px] w-48 bg-white rounded-md shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={copyAddress}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Copy className="inline-block h-4 w-4 mr-2" /> Copy address
              </button>
              {wallet && isAptosConnectWallet(wallet) && (
                <a
                  href={APTOS_CONNECT_ACCOUNT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="inline-block h-4 w-4 mr-2" /> Account
                </a>
              )}
              <button
                onClick={handleDisconnect}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="inline-block h-4 w-4 mr-2" /> Disconnect
              </button>
            </div>
          </div>
        </Portal>
      )}
      {isDialogOpen && (
        <Portal>
          <ConnectWalletDialog close={closeDialog} />
        </Portal>
      )}
    </>
  );
}

function Portal({ children }) {
  const [container] = useState(() => document.createElement('div'));

  useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  return ReactDOM.createPortal(children, container);
}

interface ConnectWalletDialogProps {
  close: () => void;
}

function ConnectWalletDialog({ close }: ConnectWalletDialogProps) {
  const { wallets = [], connect } = useWallet();
  const [showMore, setShowMore] = useState(false);

  const { aptosConnectWallets, availableWallets, installableWallets } =
    groupAndSortWallets(wallets);

  const hasAptosConnectWallets = !!aptosConnectWallets.length;

  const handleConnect = async (wallet: AnyAptosWallet) => {
    try {
      await connect(wallet.name as WalletName);
      close();
    } catch (error) {
      console.error('Failed to connect:', error);
      toast.error(`Failed to connect to ${wallet.name}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-screen overflow-auto">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">Connect a Wallet</h2>
        </div>
        <div className="space-y-4">
          {hasAptosConnectWallets && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Aptos Connect Wallets</h3>
              {aptosConnectWallets.map((wallet) => (
                <AptosConnectWalletRow
                  key={wallet.name}
                  wallet={wallet}
                  onConnect={() => handleConnect(wallet)}
                />
              ))}
            </div>
          )}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Available Wallets</h3>
            {availableWallets.map((wallet) => (
              <WalletRow
                key={wallet.name}
                wallet={wallet}
                onConnect={() => handleConnect(wallet)}
              />
            ))}
          </div>
          {!!installableWallets.length && (
            <div className="space-y-2">
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-blue-500 flex items-center"
              >
                More wallets{' '}
                <ChevronDown
                  className={`ml-1 transform ${showMore ? 'rotate-180' : ''}`}
                />
              </button>
              {showMore &&
                installableWallets.map((wallet) => (
                  <WalletRow
                    key={wallet.name}
                    wallet={wallet}
                    onConnect={() => handleConnect(wallet)}
                  />
                ))}
            </div>
          )}
        </div>
        <button
          onClick={close}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

interface WalletRowProps {
  wallet: AnyAptosWallet;
  onConnect: () => void;
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <div className="flex items-center justify-between p-2 border rounded-md">
      <div className="flex items-center space-x-2">
        <img
          src={wallet.icon}
          alt={`${wallet.name} icon`}
          className="h-6 w-6"
        />
        <span>{wallet.name}</span>
      </div>
      {isInstallRequired(wallet) ? (
        <a
          href={wallet.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-1 bg-gray-200 text-sm rounded"
        >
          Install
        </a>
      ) : (
        <button
          onClick={onConnect}
          className="px-2 py-1 bg-blue-500 text-black text-sm rounded"
        >
          Connect
        </button>
      )}
    </div>
  );
}

function AptosConnectWalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <button
      onClick={onConnect}
      className="flex items-center justify-center space-x-2 w-full p-2 border rounded-md hover:bg-gray-100"
    >
      <img src={wallet.icon} alt={`${wallet.name} icon`} className="h-5 w-5" />
      <span>{wallet.name}</span>
    </button>
  );
}

export default WalletSelector;
