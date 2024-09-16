module.exports = {
  apps: [
    {
      name: "SpotMyPet-Frontend",
      script: "npm",
      args: "start",
      cwd: "/var/www/Prj-Spot-My-Pet-Front",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
        PORT: 3001, // Configuramos el puerto 3001
        // Otras variables de entorno si las tienes
      },
    },
  ],
};
