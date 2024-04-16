/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: "https://group-11-server.cyclic.app",
    APP_ID: "3c4c2acf",
    APP_KEY: "0d155571d9ecdeb8c6295a839f9bb6a7",
  },
  images: {
    domains: ['edamam-product-images.s3.amazonaws.com'],
  }
};

export default nextConfig;
