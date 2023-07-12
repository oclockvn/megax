/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";
const apiUrl = process.env.BACKEND_URL;

const nextConfig = {
  swcMinify: true,
};

if (isProd) {
  nextConfig.output = "export";
} else {
  nextConfig.rewrites = async () => [
    {
      source: "/api/:path*", // skip auth path for authentication
      has: [
        {
          type: "header",
          key: "x-rewrite-me",
        },
      ],
      destination: apiUrl + "/api/:path*",
    },
  ];
}

module.exports = nextConfig;
