import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: false,
  },
  images: {
    remotePatterns: [
      // Remote image patterns removed
    ],
  },
};

export default nextConfig;
