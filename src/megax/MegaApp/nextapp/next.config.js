/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";
const backendUrl = process.env.BACKEND_URL;

const nextConfig = {};

if (isProd) {
  nextConfig.output = "export";
} else {
  nextConfig.rewrites = async () => [
    {
      source: "/api/auth/:path*", // keep the auth path
      destination: "/api/auth/:path*",
    },
    {
      source: "/api/:path*",
      destination: backendUrl + "/api/:path*",
    },
  ];
}

module.exports = nextConfig;
