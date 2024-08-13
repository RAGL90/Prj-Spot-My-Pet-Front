import React, { useEffect, useState } from "react";

import { BASE_URL } from "@/core/config/configDev";
import AnimalCard from "@/components/AnimalPhotoSlider";

async function fetchAnimals() {
  const res = await fetch(BASE_URL);
  const animalData = await res.json();
  return animalData.data; // Asegura que esto retorna los datos directamente
}

function AnimalLoad() {
  const [animals, setAnimals] = useState(null); // Usamos null inicialmente para indicar que no hay datos cargados

  //Introducimos los animales en el state
  useEffect(() => {
    async function loadAnimals() {
      try {
        const fetchedAnimals = await fetchAnimals();
        setAnimals(fetchedAnimals);
      } catch (error) {
        console.error("Failed to fetch animals:", error);
        setAnimals([]); // Si hay error, se crea un array vacío
      }
    }

    loadAnimals();
  }, []); // Solo en la carga

  if (animals === null) {
    return <div className="text-blue-dark">Cargando animales...</div>; // Muestra esto mientras los datos están cargando
  }

  return (
    <div className="flex flex-row flex-1 flex-wrap justify-center items-start gap-3">
      {animals.map((animal) => (
        <div
          className="bg-blue-dark rounded-md w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5"
          key={animal._id}
        >
          <p className="text-2xl text-white-light text-center p-1">
            {animal.name}
          </p>

          <p className="text-xl text-white-light text-center">
            {animal.gender}
          </p>
          <AnimalCard animal={animal} />
        </div>
      ))}
    </div>
  );
}

export default AnimalLoad;
