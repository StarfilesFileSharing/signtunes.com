/** @type {import('next').NextConfig} */

const nextConfig = {
  swcMinify: true,
  images: {
    domains: ["sts.st"],
    remotePatterns: [{ protocol: "https", hostname: "**.sts.st" }],
  },
};

module.exports = nextConfig;