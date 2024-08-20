import React from "react";
import AnimalPhotoSlider from "./AnimalPhotoSlider";
import { useSelector } from "react-redux";
import UserLogin from "@/auth/UserLogin";

export default function AnimalDetails({ selectedAnimal, nonResponsive }) {
  const isLoggedIn = useSelector((state) => state.login.userLog);

  return (
    <div>
      <div className="text-pink-dark mb-2">
        <h1 className="text-center text-xl">{selectedAnimal?.name}</h1>
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
          <span> 8 años</span>
        </div>
      </div>
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
      <div className="w-full flex justify-center text-blue-dark text-center mt-2">
        {isLoggedIn ? (
          <div>
            <button>Solicitar adopción</button>
          </div>
        ) : (
          <div>
            <a
              href="/UsersPages/UserRegister"
              className="text-blue-dark text-sm text-l"
            >
              Regístrate
            </a>
            <span> o </span>
            <span> inicia sesión para adoptar</span>
          </div>
        )}
      </div>
    </div>
  );
}
