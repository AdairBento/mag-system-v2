/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mag-system/core'],
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
};

module.exports = nextConfig;
