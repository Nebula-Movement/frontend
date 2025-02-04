/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'gateway.pinata.cloud',
      'ipfs.io',
      'anotherdomain.com',
      'api.dicebear.com',
    ],
  },
};

export default nextConfig;
