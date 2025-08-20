/** @type {import('next').NextConfig} */
const buildTime = new Date().toISOString();

const nextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_TIMESTAMP: buildTime,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.microlink.io",
      },
    ],
  },
};

export default nextConfig;
