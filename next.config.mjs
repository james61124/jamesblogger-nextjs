/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-503a3f28f35c423785d131f4a589a3f0.r2.dev",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
