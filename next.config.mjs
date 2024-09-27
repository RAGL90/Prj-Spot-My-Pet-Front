/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [16, 32, 48, 64, 96],
    // domains: ["spotmypet.es", "www.spotmypet.es"],
    path: "/public/animals/",
    loader: "default",
    remotePatterns: [
      {
        // protocol: "http", //Aqui en local
        protocol: "https",
        // hostname: "192.168.2.2", //Dónde "localhost" irá la IP  o dominio real
        hostname: "localhost",
        // hostname: "spotmypet.es",
      },
    ],
  },
};

export default nextConfig;
