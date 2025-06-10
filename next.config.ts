import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.delishop.com.uy",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },

};

export default nextConfig;
