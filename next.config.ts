import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
  turbopack: {
    resolveAlias: {
      'pino-pretty': 'pino-pretty',
    },
  },
};

export default nextConfig;
