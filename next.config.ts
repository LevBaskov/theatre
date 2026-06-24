import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Для Prisma: исключаем из bundling
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};

export default nextConfig;