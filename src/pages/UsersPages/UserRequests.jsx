import { BASE_URL } from "@/core/config/configDev";
import React, { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import { useSelector } from "react-redux";

export default function UserRequests() {
  const [requests, setRequests] = useState([]);
  const [token, setToken] = useState(null);
  const isLoggedIn = useSelector((state) => state.login.userLog); // Verificamos si el usuario está logueado

  useEffect(() => {
    async function initializeToken() {
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
      }
    }
    initializeToken();
  }, []);

  useEffect(() => {
    console.log("Is logged In?", isLoggedIn);
    console.log("Token Number", token);

    if (isLoggedIn && token) {
      loadUserRequests();
    }
  }, [isLoggedIn, token]);

  async function loadUserRequests() {
    try {
      const fetchedRequests = await fetchRequests();
      setRequests(fetchedRequests);
    } catch (error) {
      console.error(
        "Fallo durante la carga de solicitudes de adopción del usuario:",
        error
      );
      setRequests([]); // Si hay error, se crea un array vacío
    }
  }

  async function fetchRequests() {
    const res = await fetch(`${BASE_URL}user/request`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "auth-token": token,
      },
    });
    if (!res.ok) {
      throw new Error(
        `Error durante la carga de solicitudes: ${res.status} ${res.statusText}`
      );
    }
    const requestData = await res.json();
    console.log(requestData);

    return Array.isArray(requestData.data)
      ? requestData.data.filter((item) => item !== null)
      : [];
  }

  function ReqStatus(requestStatus) {
    switch (requestStatus) {
      case "accepted":
        return "✅ Aceptada";
      case "refused":
        return "❌ Rechazada";
      default:
        return "❓ Pendiente";
    }
  }

  function AnimalType(requestAnimalType, requestAnimalBreed) {
    switch (requestAnimalType) {
      case "Perros":
        return "🐶 Perro";
      case "Gatos":
        return "🐱 Gato";
      case "Roedores":
        return "🐰🐹 Roedor";
      case "Aves":
        return "🦜 Ave";
      default:
        return `🐾 ${requestAnimalBreed}`;
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="flex flex-col justify-start min-h-screen py-6">
        <div className="w-full h-2 bg-pink-dark shadow"></div>
        <div className="w-full flex flex-col gap-2 justify-center align-center">
          <h2 className="text-center text-blue-dark text-2xl mt-1">
            Estado de las solicitudes
          </h2>
          <hr className="border-blue-dark border-1 border-rounded" />
          {isLoggedIn ? (
            requests.map((request) => (
              <div
                className="flex justify-center align-center m-1"
                key={request._id}
              >
                <div className="w-full bg-pink-dark flex flex-row rounded-full shadow-xl p-2 text-white text-sm items-center md:mx-20 md:text-lg">
                  <div className="w-1/6 p-1">
                    <span className="font-bold">Nombre: </span>
                    <span>{request.reqAnimalName}</span>
                  </div>
                  <div className="w-1/6 ml-1 p-1">
                    <span className="font-bold">Tipo: </span>
                    <span>
                      {AnimalType(
                        request.reqAnimalSpecie,
                        request.reqAnimalBreed
                      )}
                    </span>
                  </div>
                  <div className="w-1/6 ml-1 p-1">
                    <span className="font-bold">Raza: </span>
                    <span>{request.reqAnimalBreed}</span>
                  </div>
                  <div className="w-1/6 ml-1 p-1">
                    <span className="font-bold">Cedente: </span>
                    <span>{request.transferName}</span>
                  </div>
                  <div className="w-2/6 flex justify-end ml-3 text-center h-full">
                    <div className="bg-blue-dark px-2 rounded-full content-center">
                      <span className="font-bold">Estado de solicitud: </span>
                      <span>{ReqStatus(request.status)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>
              <p className="text-3xl text-red text-center underline">
                Inicie sesion para mostrar resultados de este panel
              </p>
            </div>
          )}
        </div>
        <hr className="mt-5 border-blue-light border border-double" />
        <div className="flex flex-col mt-5">
          <div className="w-5/6 flex justify-center w-full">
            <p className="p-2 bg-blue-lightest text-blue-dark rounded-full text-center mx-1 shadow-xl">
              Si tienes alguna duda con el estado de tu solicitud, te
              recomendamos contactar con el cedente o actual propietario del
              animal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
