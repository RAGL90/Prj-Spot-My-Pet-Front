import React, { useEffect, useState } from "react";
import AnimalPhotoSlider from "./AnimalPhotoSlider";
import { useSelector } from "react-redux";
import { BASE_URL } from "@/core/config/configDev";

export default function AnimalDetails({ selectedAnimal, nonResponsive }) {
  const isLoggedIn = useSelector((state) => state.login.userLog);
  const [age, setAge] = useState({ diffYear: 0, diffMonth: 0 });

  useEffect(() => {
    const birthdate = new Date(selectedAnimal.birthDate);
    console.log(birthdate);

    const now = new Date();

    let diffYear = now.getUTCFullYear() - birthdate.getUTCFullYear();
    let diffMonth = now.getUTCMonth() - birthdate.getUTCMonth();
    let diffDays = now.getUTCDate() - birthdate.getUTCDate();

    if (diffDays < 0) {
      diffMonth -= 1;
    }

    if (diffMonth < 0) {
      diffYear -= 1;
      diffMonth += 12;
    }
    console.log("Años: " + diffYear + " y " + diffMonth);

    setAge({ diffYear, diffMonth });
    console.log(age);
  }, [selectedAnimal]);

  const handleRequest = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log(token);
    console.log(selectedAnimal._id);

    async function fetchRequest() {
      try {
        const response = await fetch(
          `${BASE_URL}user/request/${selectedAnimal._id}`,
          {
            method: "POST",
            headers: {
              "auth-token": token,
              Accept: "*/*",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            `Error en el procesado de solicitud de animal Status:${response.status} 
            Mensaje: ${data.message}`
          );
        }

        console.log("Hecho todo perfecto: ", data);
      } catch (error) {
        console.log("Error " + error.message + " : " + error.error);
      }
    }
    fetchRequest();
  };

  return (
    <div>
      <div className="w-full text-center text-2xl bg-blue-dark text-white py-1 my-1">
        <h1>{selectedAnimal?.name}</h1>
      </div>
      <div className="text-pink-dark mb-2">
        <AnimalPhotoSlider
          animal={selectedAnimal}
          nonResponsive={nonResponsive}
        />
      </div>
      <hr />
      {
        //Si se trata de una protectora activamos el nombre y un enlace a su ficha para ver otros animales de la misma protectora.
        selectedAnimal.owner.ownerType === "shelter" ? (
          <div className="w-full flex text-pink-dark text-l my-2 text-center justify-center">
            <span className="font-bold pr-1">Propietario actual: </span>
            <span>{selectedAnimal?.owner.ownerName}</span>
          </div>
        ) : (
          <></>
        )
      }
      <div className="w-full flex text-pink-dark text-l my-2 text-center">
        <div className="w-2/4">
          <span className="font-bold">Raza: </span>
          <span>{selectedAnimal?.breed}</span>
        </div>
        <div className="w-2/4">
          <span className="font-bold">Edad: </span>
          {age.diffYear > 0 ? (
            <span>
              {age.diffYear} años y {age.diffMonth} meses
            </span>
          ) : age.diffMonth > 1 ? (
            <span>{age.diffMonth} meses</span>
          ) : (
            <span>{age.diffMonth} mes</span>
          )}
        </div>
      </div>
      <div>
        <div className="w-full flex text-pink-dark text-l my-2 text-center">
          <div className="w-2/4">
            <span className="font-bold">Tipo de Pelo: </span>
            <span> {selectedAnimal?.hairType}</span>
          </div>
          <div className="w-2/4">
            <span className="font-bold">Género: </span>
            <span> {selectedAnimal?.gender} </span>
          </div>
        </div>
        <div className="w-full flex text-pink-dark text-l my-2 justify-center">
          <div className="text-center w-full">
            <span className="font-bold">Rasgos: </span>
            <span className="w-full"> {selectedAnimal?.physicFeatures} </span>
          </div>
        </div>
        <div className="w-full flex text-pink-dark text-l my-2 justify-center">
          <div className="text-center w-full">
            <span className="font-bold">Color: </span>
            <span className="w-full"> {selectedAnimal?.mainColor} </span>
          </div>
        </div>
        <hr />
        <div className="w-full flex text-pink-dark text-l my-2 text-center">
          <div className="w-full text-center">
            <p className="font-bold">Descripción </p>
            <p> {selectedAnimal?.description} </p>
          </div>
        </div>
        <hr className="text-blue-dark" />
        <div className="w-full flex justify-center text-blue-dark text-center mt-2 mb-2">
          {isLoggedIn ? (
            <div className="bg-blue-dark text-white shadow-xl text-xl rounded-full px-3 py-1 mt-2 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-pink-darkduration-300 ">
              <button onClick={handleRequest}>Solicitar adopción</button>
            </div>
          ) : (
            <div>
              <a
                href="/UsersPages/UserRegister"
                className="text-blue-dark underline"
              >
                Regístrate
              </a>
              <span> o </span>
              <span> inicia sesión para adoptar</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
