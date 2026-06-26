/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/mohikov',
  assetPrefix: '/mohikov',
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: '/mohikov',
  },
};

module.exports = nextConfig;
