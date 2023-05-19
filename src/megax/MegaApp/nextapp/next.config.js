/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";
const backendUrl = process.env.BACKEND_URL;

const nextConfig = {
  swcMinify: true,
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/dashboard",
  //       permanent: true,
  //     },
  //   ];
  // },
};

if (isProd) {
  nextConfig.output = "export";
} else {
  nextConfig.rewrites = async () => [
    // {
    //   source: "/api/auth/:path*", // use as below
    //   destination: "/api/auth/:path*",
    // },
    {
      source: "/api/:path((?!auth).*)", // skip auth path for authentication
      destination: backendUrl + "/api/:path*",
    },
  ];
}

module.exports = nextConfig;
