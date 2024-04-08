/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // NEXT_PUBLIC_API_URL:"https://group-11.cyclic.app",
    NEXT_PUBLIC_API_URL: "http://localhost:8080",
    APP_ID: "3c4c2acf",
    APP_KEY: "0d155571d9ecdeb8c6295a839f9bb6a7",
  },
};

export default nextConfig;
