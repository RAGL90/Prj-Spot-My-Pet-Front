import { BASE_URL } from "@/core/config/configDev";
import React, { useEffect, useRef, useState } from "react";
import AnimalPhotoSlider from "../AnimalPhotoSlider";
import EditAnimalFormShelterEd from "../animals/EditAnimalFormShelterEd";
import UploadPhoto from "../animals/UploadPhoto";
import DeleteAnimal from "../animals/DeleteAnimal";

export default function FetchAnimals() {
  const [shelterAnimals, setShelterAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [modifyAnimal, setModifyAnimal] = useState(false);
  const [uplPhoto, setUplPhoto] = useState(false);
  const [deleteAnimal, setDeleteAnimal] = useState(false);

  const formRef = useRef(null);
  const photoRef = useRef(null);
  const deleteFormRef = useRef(null);

  //Preparamos handler para ser llamado desde el componente hijo "EditAnimalForm"
  const handleCloseEditForm = () => {
    setModifyAnimal(false); // Esto esconde el formulario
    setSelectedAnimal(null); // Opcional, limpia el animal seleccionado si es necesario
  };

  useEffect(() => {
    if (selectedAnimal) {
      setUplPhoto(false); // Desactiva uplPhoto cuando un animal es seleccionado, o configúralo como true si es necesario
    }
  }, [selectedAnimal]);

  //Este useEffect es para dispositivos pequeños dónde les ayudará a situar la vista en el formulario
  useEffect(() => {
    if (modifyAnimal && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [modifyAnimal]);

  useEffect(() => {
    if (deleteAnimal && deleteFormRef.current) {
      deleteFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [deleteAnimal]);

  useEffect(() => {
    if (photoRef && photoRef.current) {
      photoRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [uplPhoto]);

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
    setSelectedAnimal(shelterAnimals); // Configurar el animal seleccionado para todas las acciones

    switch (actionType) {
      case "modify":
        setModifyAnimal(true);
        setUplPhoto(false);
        setDeleteAnimal(false);
        break;
      case "upload":
        setModifyAnimal(false);
        setUplPhoto(true);
        setDeleteAnimal(false);
        break;
      case "delete":
        setModifyAnimal(false);
        setUplPhoto(false);
        setDeleteAnimal(true);
        break;
      default:
        console.log("Sin accion especificada");
    }
  };

  return (
    <div className="border-2 m-2 p-5 rounded-xl">
      <p className="text-pink-dark text-2xl mb-2">Tus animales subidos: </p>
      <div className="w-full flex flex-wrap justify-around text-center text-base">
        {shelterAnimals.length > 0 ? (
          shelterAnimals.map((shelterAnimal) => (
            <div
              className="w-full md:w-1/4 flex flex-col justify-between bg-pink-lightest border border-blue-dark rounded m-1 p-2"
              key={shelterAnimal._id}
            >
              <div>
                <div className="bg-pink-dark text-white p-1 text-lg">
                  {shelterAnimal.status === "available"
                    ? "Sin adoptar aún"
                    : "Adoptado"}
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
                  className="mt-auto w-1/3 justify-center bg-blue-dark rounded-full text-white p-2 shadow hover:bg-pink-dark"
                  onClick={() => handleButtonClick(shelterAnimal, "modify")}
                >
                  Modificar animal
                </button>
                <div className="flex flex-col content-center w-full justify-center my-2">
                  <div>
                    <button
                      type="button"
                      className="mt-auto w-1/3 justify-center bg-blue-dark rounded-full text-white p-2 shadow hover:bg-pink-dark"
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
                      className="mt-auto w-1/3 justify-center bg-red-dark rounded-full text-white p-2 shadow hover:bg-pink-dark"
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
      <div>
        {modifyAnimal ? (
          <div ref={formRef}>
            <EditAnimalFormShelterEd
              animal={selectedAnimal}
              onClose={handleCloseEditForm}
            />
          </div>
        ) : null}
      </div>
      <div className="flex justify-center">
        <div className="w-3/6" ref={photoRef}>
          {uplPhoto && <UploadPhoto animalId={selectedAnimal._id} />}
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-3/6" ref={deleteFormRef}>
          {deleteAnimal && <DeleteAnimal animal={selectedAnimal} />}
        </div>
      </div>
    </div>
  );
}
