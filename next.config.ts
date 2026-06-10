import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mantenha qualquer outra configuração que já exista aqui
  serverActions: {
    allowedOrigins: [
      "cmpzz-server.tail3be0dc.ts.net:3000", // O seu endereço seguro do Tailscale
      "localhost:3000",
      // Se você acessar pelo IP da rede local (ex: "192.168.1.50:3000"), adicione-o aqui também!
    ],
  },
};

export default nextConfig;