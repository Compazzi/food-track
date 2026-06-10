import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mantenha qualquer outra configuração que já exista aqui
  experimental: {
    serverActions: {
      allowedOrigins: [
        "cmpzz-server.tail3be0dc.ts.net:3000", // O seu endereço seguro do Tailscale
        "localhost:3000",
      ],
    },
  },
};

export default nextConfig;