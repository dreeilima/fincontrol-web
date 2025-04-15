const { withContentlayer } = require("next-contentlayer2");

import("./env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/site.webmanifest",
        headers: [
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type",
          },
        ],
      },
    ];
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
    // Adicionar opção para melhorar compatibilidade com Prisma
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      return config;
    }

    // Evitar que o Prisma seja incluído no bundle do cliente
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
      fs: false,
      net: false,
      tls: false,
      dns: false,
      tty: false,
      os: false,
      path: false,
    };

    return config;
  },
};

module.exports = withContentlayer(nextConfig);
