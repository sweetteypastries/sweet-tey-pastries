import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "silver-chainsaw-4q4rrgjjpx4h5j9q-3000.app.github.dev",
      ],
    },
  },
};

export default nextConfig;