import React from "react";
import { BASE_URL } from "@/core/config/configDev";
import Image from "next/image";

function AnimalCard({ animal }) {
  //1. La BBDD indica foto?
  const imageUrl =
    animal.photo.length > 0
      ? `${BASE_URL}${animal._id}/${animal.photo[0]}`
      : //Si no tiene foto usaremos:
        "/NotFound.svg";

  const imageAlt =
    animal.photo.length > 0
      ? `${animal.name} - Imagen 1`
      : "Imagen no encontrada";

  return (
    <div className="w-full">
      <div className="relative pt-[75%] overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt}
          layout="fill"
          className="absolute top-0 left-0 w-full h-full object-contain"
        />
      </div>
    </div>
  );
}

export default AnimalCard;
