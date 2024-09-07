import { BASE_URL } from "@/core/config/configDev";
import React, { useEffect, useRef, useState } from "react";
import AnimalPhotoSlider from "../AnimalPhotoSlider";
import EditAnimalFormShelterEd from "../animals/EditAnimalFormShelterEd";
import UploadPhoto from "../animals/UploadPhoto";
import ShelterDeleteAnimal from "@/components/animals/ShelterDeleteAnimal";
import ModalScreen from "../ModalScreen";
import ShelterCreateAnimals from "./ShelterCreateAnimals";

export default function FetchAnimals() {
  const [shelterAnimals, setShelterAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [modifyAnimal, setModifyAnimal] = useState(false);
  const [uplPhoto, setUplPhoto] = useState(false);
  const [deleteAnimal, setDeleteAnimal] = useState(false);
  const [createAnimal, setCreateAnimal] = useState(false);

  //              ********** Declaraciones y funciones para ventana Modal ***********
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    console.log("Invocación al cierre de modal");
    setIsModalOpen(false);
    setModifyAnimal(false); // Esto esconde el formulario
    setSelectedAnimal(null); // Opcional, limpia el animal seleccionado si es necesario
  };
  //                **********                  Fin declaraciones ventana Modal         **********

  //Preparamos handler para ser llamado desde el componente hijo "EditAnimalForm"
  const handleCloseEditForm = () => {
    setModifyAnimal(false); // Esto esconde el formulario
    setSelectedAnimal(null); // Opcional, limpia el animal seleccionado si es necesario
  };

  useEffect(() => {
    async function initTokenFetchAnimal() {
      //1º Buscamos en el localStorage para obtener el token
      const storedToken = localStorage.getItem("token");

      //2º Si lo hay lo lanzamos al fetch
      if (storedToken) {
        try {
          const response = await fetch(`${BASE_URL}shelter/animal`, {
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
          console.log(response);

          setShelterAnimals(animalsData.data);
        } catch (error) {
          console.log("Error durante la carga de animales", error);
          setShelterAnimals([]);
        }
      }
    }
    initTokenFetchAnimal();
  }, []);

  const handleButtonClick = (shelterAnimals, actionType) => {
    // Configurar el animal seleccionado para transmitirlo a su correspondiente acción
    setSelectedAnimal(shelterAnimals);
    // Abre el modal en cualquier acción
    handleOpenModal();

    switch (actionType) {
      case "modify":
        setModifyAnimal(true);
        setUplPhoto(false);
        setDeleteAnimal(false);
        setCreateAnimal(false);
        break;
      case "upload":
        setModifyAnimal(false);
        setUplPhoto(true);
        setDeleteAnimal(false);
        setCreateAnimal(false);
        break;
      case "delete":
        setModifyAnimal(false);
        setUplPhoto(false);
        setDeleteAnimal(true);
        setCreateAnimal(false);
        break;
      case "create":
        setModifyAnimal(false);
        setUplPhoto(false);
        setDeleteAnimal(false);
        setCreateAnimal(true);
        break;
      default:
        console.log("Sin accion especificada");
        handleCloseModal(); // Cierra el modal si no hay acción
    }
  };

  return (
    <div className="border-2 m-2 p-5 rounded-xl">
      <div className="flex justify-center">
        <div className="w-full md:w-2/6 text-xl mb-5">
          <button
            className="bg-blue-dark text-white p-5 rounded-full hover:bg-blue-lightest hover:text-blue-dark"
            onClick={() => handleButtonClick("", "create")}
          >
            🐾 Registrar nueva mascota 🐾
          </button>
        </div>
      </div>
      <p className="bg-pink-dark py-2 text-white text-2xl mb-2 rounded-xl shadow">
        Vuestros animales:
      </p>
      <div className="w-full flex flex-wrap justify-around text-center text-base">
        {shelterAnimals.length > 0 ? (
          shelterAnimals.map((shelterAnimal) => (
            <div
              className="w-full md:w-1/4 flex flex-col justify-between bg-pink-lightest border border-blue-dark rounded m-1 p-2 my-5"
              key={shelterAnimal._id}
            >
              <div>
                <div className="bg-pink-dark text-white p-1 text-lg">
                  {shelterAnimal.status === "available" ? (
                    <p>Sin adoptar aún</p>
                  ) : (
                    <p className="bg-greenL text-white font-bold animate-bounce animate-pulse">
                      Adoptado 😻
                    </p>
                  )}
                </div>
                <div>
                  <AnimalPhotoSlider animal={shelterAnimal} />
                </div>
                <div className="w-full flex flex-col justify-center">
                  <div className="my-2">
                    <strong>Nombre:</strong> {shelterAnimal.name}
                  </div>
                  <div className="my-2">
                    <strong>Especie:</strong> {shelterAnimal.specie}
                  </div>
                  <div className="my-2">
                    <strong>Raza:</strong> {shelterAnimal.breed}
                  </div>
                  <div className="my-2 mb-2">
                    <strong>Rasgos físicos:</strong>{" "}
                    {shelterAnimal.physicFeatures}
                  </div>
                </div>
              </div>
              <div className="w-full">
                <button
                  type="button"
                  className="w-4/5 justify-center bg-blue-dark rounded-full text-white p-2 shadow hover:bg-pink-dark"
                  onClick={() => handleButtonClick(shelterAnimal, "modify")}
                >
                  Ver o Modificar animal
                </button>
                <div className="flex flex-col content-center w-full justify-center my-2">
                  <div>
                    <button
                      type="button"
                      className="w-4/5 justify-center bg-blue-dark rounded-full text-white p-2 shadow hover:bg-pink-dark"
                      onClick={() => handleButtonClick(shelterAnimal, "upload")}
                    >
                      📷 Añadir fotos
                    </button>
                  </div>
                </div>
                <div className="flex flex-col content-center w-full justify-center my-2">
                  <div>
                    <button
                      type="button"
                      className="w-4/5 justify-center bg-red-dark rounded-full text-white p-2 shadow hover:bg-pink-dark"
                      onClick={() => handleButtonClick(shelterAnimal, "delete")}
                    >
                      ❌ Borrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No se encontraron animales.</p>
        )}
      </div>
      <ModalScreen isOpen={isModalOpen} onClose={handleCloseModal}>
        {modifyAnimal && selectedAnimal && (
          <EditAnimalFormShelterEd
            animal={selectedAnimal}
            onClose={handleCloseModal}
          />
        )}
        {uplPhoto && selectedAnimal && (
          <>
            {console.log(
              `Renderizando componente UploadPhoto y el animal recibido es ${selectedAnimal._id}`
            )}
            <UploadPhoto
              animalId={selectedAnimal._id}
              onClose={handleCloseModal}
            />
          </>
        )}
        {deleteAnimal && selectedAnimal && (
          <ShelterDeleteAnimal
            animal={selectedAnimal}
            onClose={handleCloseModal}
          />
        )}
        {createAnimal && <ShelterCreateAnimals onClose={handleCloseModal} />}
      </ModalScreen>
    </div>
  );
}
