import { BASE_URL } from "@/core/config/configDev";
import React, { useEffect, useRef, useState } from "react";
import AnimalPhotoSlider from "../AnimalPhotoSlider";
import EditAnimalForm from "../animals/EditAnimalForm";

export default function FetchAnimals() {
  const [userAnimals, setUserAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [modifyAnimal, setModifyAnimal] = useState(false);
  const formRef = useRef(null);

  //Preparamos handler para ser llamado desde el componente hijo "EditAnimalForm"
  const handleCloseEditForm = () => {
    setModifyAnimal(false); // Esto esconde el formulario
    setSelectedAnimal(null); // Opcional, limpia el animal seleccionado si es necesario
  };

  //Este useEffect es para dispositivos pequeños dónde les ayudará a situar la vista en el formulario
  useEffect(() => {
    if (modifyAnimal && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [modifyAnimal]);

  useEffect(() => {
    async function initTokenFetchAnimal() {
      //1º Buscamos en el localStorage para obtener el token
      const storedToken = localStorage.getItem("token");

      //2º Si lo hay lo lanzamos al fetch
      if (storedToken) {
        try {
          const response = await fetch(`${BASE_URL}user/animal`, {
            method: "GET",
            headers: {
              Accept: "*/*",
              "auth-token": storedToken,
            },
          });
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          // 3º Creamos array con los animales del usuario
          const animalsData = await response.json();
          setUserAnimals(animalsData.data);
        } catch (error) {
          console.log("Error durante la carga de animales", error);
          setUserAnimals([]);
        }
      }
    }
    initTokenFetchAnimal();
  }, []);

  return (
    <div className="border-2 m-2 p-5 rounded-xl">
      <p className="text-pink-dark text-2xl mb-2">Tus animales subidos: </p>
      <div className="w-full flex flex-wrap justify-around text-center">
        {userAnimals.length > 0 ? (
          userAnimals.map((userAnimal) => (
            <div
              className="w-full md:w-1/4 flex flex-col justify-between bg-pink-lightest border border-blue-dark rounded m-1 p-2"
              key={userAnimal._id}
            >
              <div>
                <div className="bg-pink-dark text-white p-1">
                  {userAnimal.status === "available"
                    ? "Sin adoptar aún"
                    : "Adoptado"}
                </div>
                <div>
                  <AnimalPhotoSlider animal={userAnimal} />
                </div>
                <div className="w-full flex flex-col justify-center">
                  <div className="my-2">
                    <strong>Nombre:</strong> {userAnimal.name}
                  </div>
                  <div className="my-2">
                    <strong>Especie:</strong> {userAnimal.specie}
                  </div>
                  <div className="my-2">
                    <strong>Raza:</strong> {userAnimal.breed}
                  </div>
                  <div className="my-2 mb-2">
                    <strong>Rasgos físicos:</strong> {userAnimal.physicFeatures}
                  </div>
                </div>
              </div>
              <div className="w-full">
                <button
                  type="button"
                  className="mt-auto w-1/3 justify-center bg-blue-dark rounded-full text-white p-2 shadow hover:bg-pink-dark"
                  onClick={() => {
                    setSelectedAnimal(userAnimal);
                    setModifyAnimal(true);
                  }}
                >
                  Modificar animal
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No se encontraron animales.</p>
        )}
      </div>
      <div>
        {modifyAnimal ? (
          <div ref={formRef}>
            <EditAnimalForm
              animal={selectedAnimal}
              onClose={handleCloseEditForm}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
