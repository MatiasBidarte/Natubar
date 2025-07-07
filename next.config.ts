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
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        pathname: "/id/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
