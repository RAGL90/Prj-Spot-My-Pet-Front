import React, { useEffect, useState } from "react";

import { BASE_URL } from "@/core/config/configDev";
import AnimalCard from "@/components/AnimalPhotoSlider";
import ModalScreen from "./ModalScreen";

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
          className="bg-blue-dark rounded-xl w-full m-1 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5"
          key={animal._id}
        >
          <div className="w-full flex items-center justify-between relative">
            <div className="w-full text-center text-2xl text-white-light px-4">
              <p>{animal.name}</p>
            </div>
            <div className="w-auto justify-end text-2xl pr-2">
              <p>{animal.gender === "macho" ? " ♂️" : " ♀️"}</p>
            </div>
          </div>
          <AnimalCard animal={animal} nonResponsive={nonResponsive} />
          <div className="w-full border-0 flex justify-center items-center my-1">
            <button
              className="rounded-full bg-pink-dark shadow text-white-light p-2 mb-2"
              onClick={() => handleOpenModal(animal)}
            >
              ¡Cónoceme!
            </button>
          </div>
        </div>
      ))}
      <ModalScreen isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="text-pink-dark">
          <h1 className="text-center text-xl">{selectedAnimal?.name}</h1>
          <AnimalCard animal={selectedAnimal} nonResponsive={nonResponsive} />
        </div>
        <hr />
        <div className="w-full flex text-pink-dark text-l my-2 text-center">
          <div className="w-2/4">
            <span className="font-bold">Raza: </span>
            <span>{selectedAnimal?.breed}</span>
          </div>
          <div className="w-2/4">
            <span className="font-bold">Edad: </span>
            <span> 8 años</span>
          </div>
        </div>
        <div className="w-full flex text-pink-dark text-l my-2 text-center">
          <div className="w-2/4">
            <span className="font-bold">Tipo de Pelo: </span>
            <span> {selectedAnimal?.hairType}</span>
          </div>
          <div className="w-2/4">
            <span className="font-bold">Color principal: </span>
            <span> {selectedAnimal?.mainColor} </span>
          </div>
        </div>
        <div className="w-full flex text-pink-dark text-l my-2 justify-center">
          <div className="text-center w-full">
            <span className="font-bold">Rasgos: </span>
            <span className="w-full"> {selectedAnimal?.physicFeatures} </span>
          </div>
        </div>
        <hr />
        <div className="w-full flex text-pink-dark text-l my-2 text-center">
          <div className="w-full text-center">
            <p className="font-bold">Descripción </p>
            <p> {selectedAnimal?.description} </p>
          </div>
          <hr />
        </div>
      </ModalScreen>
    </div>
  );
}

export default AnimalLoad;
