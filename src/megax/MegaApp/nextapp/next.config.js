/** @type {import('next').NextConfig} */
const rewrites = () => {
  return [
    {
      source: "/api/:path*",
      destination: "http://localhost:5291/api/:path*",
    },
  ];
};

const nextConfig = {
  rewrites,
}

module.exports = nextConfig
