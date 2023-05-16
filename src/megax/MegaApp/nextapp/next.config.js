/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {};

if (isProd) {
  nextConfig.output = "export";
} else {
  nextConfig.rewrites = async () => [
    {
      source: "/api/:path*",
      destination: "http://localhost:5291/api/:path*",
    },
  ];
}

module.exports = nextConfig;
