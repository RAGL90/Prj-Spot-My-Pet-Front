import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/core/config/configDev";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";

function AnimalPhotoSlider({ animal, nonResponsive }) {
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

  //Handler de gestos para el móvil => Biblioteca react-swipeable
  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrevious(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

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
    <div className="w-full flex flex-col items-center justify-center">
      <div className="flex justify-center items-center my-2">
        <div className="w-11/12 flex justify-center items-center" {...handlers}>
          <Image
            src={imageUrl}
            width={500}
            height={1000}
            layout="intrinsic"
            alt={imageAlt}
            className="rounded-lg shadow-xl"
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-center text-3xl">
        {/*
         Si llega al "0" del array se desactiva el botón
         */}
        {imageIndex > 0 && nonResponsive && (
          <button onClick={handlePrevious} disabled={!previousButton}>
            ⏪
          </button>
        )}
        {/*
         Si llega al máximo del array se bloquea el botón.
         */}
        {imageIndex < animal.photo.length - 1 && nonResponsive && (
          <button onClick={handleNext} disabled={!nextButton}>
            ⏩
          </button>
        )}
      </div>
    </div>
  );
}

export default AnimalPhotoSlider;
