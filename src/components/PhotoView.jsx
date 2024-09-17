import React, { useEffect, useState } from "react";
import { BASE_URL, IMAGE_BASE_URL } from "@/core/config/configDev";
import Image from "next/image";

function PhotoView({ animal }) {
  //Aquí es const, no se va a modificar la ruta
  const imageUrl =
    animal.photo.length > 0
      ? `${IMAGE_BASE_URL}${animal._id}/${animal.photo[0]}`
      : // ? `${BASE_URL}${animal._id}/${animal.photo[0]}` (ASI EN EL LOCAL)
        //Si no tiene foto usaremos:
        "/imageComponents/ImageNotFound.jpg";

  //Proporcionamos un Alt automatizado, indicando el nombre del animal
  const imageAlt =
    animal.photo.length > 0
      ? `${animal.name} - Imagen principal`
      : "Imagen no encontrada";

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="relative w-11/12 h-[300px] max-h-[500px] max-w-full">
        <Image
          src={imageUrl}
          layout="fill" // Llenará el contenedor asignado
          objectFit="cover" // Cubrirá el espacio manteniendo la proporción
          alt={imageAlt}
          className="rounded-lg shadow-xl"
          priority={true}
        />
      </div>
    </div>
  );
}

export default PhotoView;
