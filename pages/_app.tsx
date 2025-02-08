import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { WalletProvider } from '@/helpers/WalletProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ImageProvider } from '@/context/ImageContext';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <ImageProvider>
          <Component {...pageProps} />
        </ImageProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}
