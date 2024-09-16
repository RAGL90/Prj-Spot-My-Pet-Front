module.exports = {
  apps: [
    {
      name: "SpotMyPet-Frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/var/www/Prj-Spot-My-Pet-Front",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        NEXT_PUBLIC_IMAGE_PROTOCOL: "https",
        NEXT_PUBLIC_IMAGE_HOSTNAME: "spotmypet.es",
        // Otras variables de entorno
      },
    },
  ],
};
