/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";
const apiUrl = process.env.BACKEND_URL;

const nextConfig = {
  swcMinify: true,
  async redirects() {
    return [
      // {
      //   source: "/admin/users/:id",
      //   destination: "/admin/users/:id/info",
      //   permanent: true,
      // },
    ];
  },
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
      // source: "/api/:path((?!auth/).*)", // skip auth path for authentication
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
