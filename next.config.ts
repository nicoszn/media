import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  async rewrites() {
    return [
      {
        source: '/api/video/info',
        destination: 'https://web-production-a9b29.up.railway.app/info',
      },
    ];
  },
  turbopack: {},
};

export default nextConfig;
