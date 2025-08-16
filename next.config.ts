import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:"media.istockphoto.com"
        //hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
