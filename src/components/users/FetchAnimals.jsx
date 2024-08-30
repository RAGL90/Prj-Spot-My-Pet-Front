import { BASE_URL } from "@/core/config/configDev";
import React, { useEffect, useState } from "react";
import AnimalPhotoSlider from "../AnimalPhotoSlider";

export default function FetchAnimals() {
  const [userAnimals, setUserAnimals] = useState([]);

  useEffect(() => {
    async function initTokenFetchAnimal() {
      //1º Revisamos si es un navegador para poder acceder al localStorage y obtener el token
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
          // 3º Creamos nuestro array con los animales localizados
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
                <div className="my-2">
                  <strong>Nombre:</strong> {userAnimal.name}
                </div>
                <div className="my-2">
                  <strong>Especie:</strong> {userAnimal.specie}
                </div>
                <div className="my-2">
                  <strong>Especie:</strong> {userAnimal.breed}
                </div>
                <div className="my-2 mb-2">
                  <strong>Rasgos físicos:</strong> {userAnimal.physicFeatures}
                </div>
              </div>
              <div className="w-full">
                <button className="mt-auto w-1/3 justify-center bg-blue-dark rounded-full text-white p-2 shadow hover:bg-pink-dark">
                  Modificar animal
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No se encontraron animales.</p>
        )}
      </div>
    </div>
  );
}
