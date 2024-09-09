import React, { useEffect, useState } from "react";

import { BASE_URL } from "@/core/config/configDev";
import AnimalPhotoSlider from "@/components/AnimalPhotoSlider";
import ModalScreen from "./ModalScreen";
import AnimalDetails from "./AnimalDetails";
import PhotoView from "@/components/PhotoView";

function AnimalLoad({ filters }) {
  const [animals, setAnimals] = useState(null); // Usamos null inicialmente para indicar que no hay datos cargados
  const [nonResponsive, setNonResponsive] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(null);

  //Manejo de páginas de resultados
  const [page, setPage] = useState(1); // 1 es la página actual (o mínima)
  const [totalPages, setTotalPages] = useState(1); // (1 también lo es para Totalpages, a menos que el fetch diga lo contrario)

  //Introducimos los animales en el state
  useEffect(() => {
    async function loadAnimals() {
      try {
        //Declaramos data (que serán animales) y pages (que nos lo indicará el back en respuesta)
        const { data, pages } = await fetchAnimals(filters, page);
        setAnimals(data); //Seteamos data para ver los resultados
        setTotalPages(pages); //Seteamos TotalPages para saber cuantas páginas de resultados podemos ver.
      } catch (error) {
        console.error("Failed to fetch animals:", error);
        setAnimals([]);
      }
    }

    loadAnimals();
  }, [filters, page]); // Ejecutar cuando cambien los filtros o la página

  async function fetchAnimals(filters, page) {
    //1º Añadimos a los filtros de busqueda y finalmente el page (convertidos con la clase URLSearchParams)
    const query = new URLSearchParams({ ...filters, page }).toString();
    //2º Introducimos ya la query construida en la url
    const url = `${BASE_URL}?${query}`; //Recuerda! que nuestro BASE_URL ya incorpora una "/"

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Error al obtener los datos de animales");
      }
      const animalData = await res.json();
      return animalData;
    } catch (error) {
      console.error("Error en fetchAnimals:", error);
      return { data: [], pages: 1 };
    }
  }

  const handleOpenModal = (animal) => {
    setNonResponsive(true);
    setSelectedAnimal(animal);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setNonResponsive(false);
    setIsModalOpen(false);
  };

  // Botones de paginación de resultados
  const handleNextPage = () => {
    //Se ejecutará sólo si page es menor que el total de páginas
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    //No podemos estar en la página 0, el mínimo es 1
    if (page > 1) {
      setPage(page - 1);
    }
  };

  if (animals === null) {
    return <div className="text-blue-dark">Cargando animales...</div>; // Muestra esto mientras los datos están cargando
  }

  return (
    <div>
      <div className="bg-pink-light flex flex-row flex-1 flex-wrap justify-center items-start gap-3 py-5">
        {animals.map((animal) => (
          <div
            className="bg-blue-dark shadow-xl rounded-xl w-11/12 m-1 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5"
            key={animal._id}
          >
            <div className="w-full flex items-center justify-between relative">
              <div className="w-full text-center text-2xl text-white-light px-4 mb-2">
                <p>{animal.name}</p>
              </div>
              <div className="w-auto justify-end text-2xl rounded-full bg-blue-medium text-center flex px-1">
                <p className="shadow-xl">
                  {animal.gender === "macho" ? "♂️" : "♀️"}
                </p>
              </div>
            </div>
            {/* <AnimalPhotoSlider animal={animal} nonResponsive={nonResponsive} /> */}
            <PhotoView animal={animal} />
            <div className="w-full text-center text-base text-white-light px-4">
              <p>{animal.breed}</p>
            </div>
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
        <div className="w-full mt-6 flex justify-center gap-4">
          {totalPages > 1 && (
            <>
              <button
                className={`px-4 py-2 bg-blue-medium text-white rounded ${
                  page === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-dark"
                }`}
                onClick={handlePreviousPage}
                disabled={page === 1}
              >
                Página Anterior
              </button>

              <button
                className={`px-4 py-2 bg-blue-medium text-white rounded ${
                  page === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-dark"
                }`}
                onClick={handleNextPage}
                disabled={page === totalPages}
              >
                Siguiente página
              </button>
            </>
          )}
        </div>
        <ModalScreen isOpen={isModalOpen} onClose={handleCloseModal}>
          <AnimalDetails
            selectedAnimal={selectedAnimal}
            nonResponsive={nonResponsive}
          />
        </ModalScreen>
      </div>
    </div>
  );
}

export default AnimalLoad;
