import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/core/config/configDev";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";

function AnimalPhotoSlider({
  animal,
  nonResponsive,
  allowSetMainImage,
  onSetMainImage,
}) {
  //1. La BBDD tiene rutas de foto?
  const [imageIndex, setImageIndex] = useState(0);
  const [previousButton, setPreviousButton] = useState(false);
  const [nextButton, setNextButton] = useState(true);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [photoChanged, setPhotoChanged] = useState(false);

  //No es const, dado que vamos a ir modificando esta variable imageUrl con las diferentes fotos
  let imageUrl =
    animal.photo.length > 0
      ? `${BASE_URL}${animal._id}/${animal.photo[imageIndex]}`
      : //Si no tiene foto usaremos:
        "/imageComponents/ImageNotFound.svg";

  //Proporcionamos un Alt automatizado, indicando el nombre del animal
  const imageAlt =
    animal.photo.length > 0
      ? `${animal.name} - Imagen ${imageIndex}`
      : "Imagen no encontrada";

  //En caso de heredar un allowSetMainImage del Modulo de Modify, se activa el botón de hacer imagen principal:
  const handleSetMainImage = (index) => {
    onSetMainImage(index); // Actualizamos el array del padre Modify para ejercer los cambios
    setPrimaryImageIndex(index); // Reflejamos cambios en la nueva imagen principal de la mascota
    setPhotoChanged(true);
  };

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
        <div
          className="w-11/12 flex justify-center overflow-hidden"
          {...handlers}
        >
          <Image
            src={imageUrl}
            width={500}
            height={120}
            layout="intrinsic"
            alt={imageAlt}
            className={`rounded-lg shadow-xl border-2 ${
              imageIndex === primaryImageIndex
                ? "border-blue-light"
                : "border-pink-light"
            }`}
            priority={true}
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-center text-3xl">
        {/*
         Si llega al "0" del array se desactiva el botón
         */}
        {imageIndex > 0 && nonResponsive && (
          <button
            onClick={handlePrevious}
            disabled={!previousButton}
            type="button"
          >
            ⏪
          </button>
        )}
        {/*
         Si llega al máximo del array se bloquea el botón.
         */}
        {imageIndex < animal.photo.length - 1 && nonResponsive && (
          <button type="button" onClick={handleNext} disabled={!nextButton}>
            ⏩
          </button>
        )}
      </div>
      {allowSetMainImage && (
        <button
          type="button"
          className={`mt-2 px-2 text-white rounded-full ${
            imageIndex === primaryImageIndex ? "bg-green-500" : "bg-blue-dark"
          }`}
          onClick={() => handleSetMainImage(imageIndex)}
        >
          {imageIndex === primaryImageIndex
            ? "Imagen Principal"
            : `Hacer Imagen Principal`}
        </button>
      )}
      {photoChanged && (
        <p className="mb-2 text-black italic">(Recuerda aceptar los cambios)</p>
      )}
    </div>
  );
}

export default AnimalPhotoSlider;
