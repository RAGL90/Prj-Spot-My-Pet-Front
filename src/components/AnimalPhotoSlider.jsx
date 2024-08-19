import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/core/config/configDev";
import Image from "next/image";

function AnimalCard({ animal, nonResponsive }) {
  //1. La BBDD tiene rutas de foto?
  const [imageIndex, setImageIndex] = useState(0);
  const [previousButton, setPreviousButton] = useState(false);
  const [nextButton, setNextButton] = useState(true);

  let imageUrl =
    animal.photo.length > 0
      ? `${BASE_URL}${animal._id}/${animal.photo[imageIndex]}`
      : //Si no tiene foto usaremos:
        "/imageComponents/ImageNotFound.svg";

  const imageAlt =
    animal.photo.length > 0
      ? `${animal.name} - Imagen ${imageIndex}`
      : "Imagen no encontrada";

  const handleNext = () => {
    if (imageIndex < animal.photo.length - 1) {
      setImageIndex(imageIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1);
    }
  };

  useEffect(() => {
    setNextButton(imageIndex < animal.photo.length - 1);
    setPreviousButton(imageIndex > 0);
  }, [imageIndex, animal.photo]);

  return (
    <div className="w-full flex flex-col items-center justify-center h-auto max-h-[400px]">
      <div>
        <div className="flex justify-center items-center w-full h-full">
          <Image
            src={imageUrl}
            width={330}
            height={320}
            layout="intrinsic"
            alt={imageAlt}
            className="rounded-lg shadow-xl "
          />
        </div>
        <div className="flex items-center justify-between text-center text-xl">
          {imageIndex > 0 && nonResponsive && (
            <button onClick={handlePrevious} disabled={!previousButton}>
              ⏪
            </button>
          )}
          {imageIndex < animal.photo.length - 1 && nonResponsive && (
            <button onClick={handleNext} disabled={!nextButton}>
              ⏩
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnimalCard;
