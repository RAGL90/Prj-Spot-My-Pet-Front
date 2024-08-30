/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        // hostname: "192.168.2.2", //Dónde "localhost" irá la IP  o dominio real
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
