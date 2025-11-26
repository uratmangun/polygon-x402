import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygon, polygonAmoy } from 'wagmi/chains';
import { http } from 'viem';

// Custom RPC URLs from environment variables with fallbacks
const polygonRpc = process.env.NEXT_PUBLIC_POLYGON_RPC || 'https://polygon-rpc.com';
const polygonAmoyRpc = process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC || 'https://rpc-amoy.polygon.technology';

export const config = getDefaultConfig({
  appName: 'x402 Marketplace',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [polygon, polygonAmoy],
  transports: {
    [polygon.id]: http(polygonRpc),
    [polygonAmoy.id]: http(polygonAmoyRpc),
  },
  ssr: true,
});
