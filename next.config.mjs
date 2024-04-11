/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'localhost',
      'chat-app-sooty-theta.vercel.app',
    ],
  },
};

export default nextConfig;
