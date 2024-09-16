/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        // protocol: "http", //Aqui en local
        protocol: "https",
        // hostname: "192.168.2.2", //Dónde "localhost" irá la IP  o dominio real
        // hostname: "localhost",
        hostname: "spotmypet.es",
      },
    ],
  },
};

export default nextConfig;
