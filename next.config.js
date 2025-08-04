/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  transpilePackages: ["lightningcss", "@tailwindcss/oxide"],
  experimental: {
    optimizeCss: false,
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@tailwindcss/oxide': false,
        'lightningcss': false,
      },
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
        module: false,
        path: false,
      },
    };
    return config;
  },
};

module.exports = nextConfig;
