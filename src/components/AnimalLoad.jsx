import React, { useEffect, useState } from "react";

import { BASE_URL } from "@/core/config/configDev";
import AnimalPhotoSlider from "@/components/AnimalPhotoSlider";
import ModalScreen from "./ModalScreen";
import AnimalDetails from "./AnimalDetails";

async function fetchAnimals() {
  const res = await fetch(BASE_URL);
  const animalData = await res.json();
  return animalData.data; // Asegura que esto retorna los datos directamente
}

function AnimalLoad() {
  const [animals, setAnimals] = useState(null); // Usamos null inicialmente para indicar que no hay datos cargados
  const [nonResponsive, setNonResponsive] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(null);

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

  const handleOpenModal = (animal) => {
    setNonResponsive(true);
    setSelectedAnimal(animal);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setNonResponsive(false);
    setIsModalOpen(false);
  };

  if (animals === null) {
    return <div className="text-blue-dark">Cargando animales...</div>; // Muestra esto mientras los datos están cargando
  }

  return (
    <div className="flex flex-row flex-1 flex-wrap justify-center items-start gap-3">
      {animals.map((animal) => (
        <div
          className="bg-blue-dark shadow-xl rounded-xl w-11/12 m-1 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5"
          key={animal._id}
        >
          <div className="w-full flex items-center justify-between relative">
            <div className="w-full text-center text-2xl text-white-light px-4">
              <p>{animal.name}</p>
            </div>
            <div className="w-auto justify-end text-2xl rounded-full bg-blue-medium text-center flex px-1">
              <p className="shadow-xl">
                {animal.gender === "macho" ? "♂️" : "♀️"}
              </p>
            </div>
          </div>
          <AnimalPhotoSlider animal={animal} nonResponsive={nonResponsive} />
          <div className="w-full border-0 flex justify-center items-center mt-2">
            <button
              className="rounded-full bg-pink-dark shadow-xl text-white-light p-2 mb-2 font-italic transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-blue-medium duration-300"
              onClick={() => handleOpenModal(animal)}
            >
              ¡Cónoceme!
            </button>
          </div>
        </div>
      ))}
      <ModalScreen isOpen={isModalOpen} onClose={handleCloseModal}>
        <AnimalDetails
          selectedAnimal={selectedAnimal}
          nonResponsive={nonResponsive}
        />
      </ModalScreen>
    </div>
  );
}

export default AnimalLoad;
