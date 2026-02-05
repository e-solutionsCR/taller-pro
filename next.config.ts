import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    // @ts-ignore
    allowedDevOrigins: ['217.216.89.248:3000', 'localhost:3000', '217.216.89.248']
  }
};

export default nextConfig;
