import type { NextConfig } from "next";

// Read the custom origin from the .env file (if it exists)
const customOrigins = process.env.ALLOWED_ORIGIN ? [process.env.ALLOWED_ORIGIN] : [];

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        ...customOrigins, // This safely injects your Tailscale URL!
      ],
    },
  },
};

export default nextConfig;
