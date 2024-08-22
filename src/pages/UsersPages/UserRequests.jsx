import { BASE_URL } from "@/core/config/configDev";
import React, { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import AnimalPhotoSlider from "@/components/AnimalPhotoSlider";

export default function UserRequests() {
  const [requests, setRequests] = useState([]);
  const [token, setToken] = useState(null);

  //useState para el cargador de fotos:
  const [nonResponsive, setNonResponsive] = useState(false);

  //Hacemos una carga para inicializar el token:
  useEffect(() => {
    async function initializeToken() {
      //Revisamos si es un navegador antes de hacer lectura del localStorage, para evitar entrar a "algo" no definido y traiga error.
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        setToken(token);
      }
      if (token) {
        await loadUserRequests();
      }
    }
    initializeToken();
  }, []);

  async function loadUserRequests() {
    try {
      const fetchedRequests = await fetchRequests();
      setRequests(fetchedRequests);
    } catch (error) {
      console.error(
        "Fallo durante la carga de solicitudes de adopcion del usuario:",
        error
      );
      setRequests([]); // Si hay error, se crea un array vacío
    }
  }

  //En el useEffect llama a esta función, que hace un fetch enviando el token al backend, recibe unos datos que guardamos en el useState
  async function fetchRequests() {
    const res = await fetch(`${BASE_URL}user/request`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "auth-token": token,
      },
    });
    if (!res.ok) {
      throw new Error(`Error durante la carga de solicitudes: ${res.status}
            ${res.error.message}`);
    }

    const requestData = await res.json();
    const validData = Array.isArray(requestData.data)
      ? requestData.data.filter((item) => item !== null)
      : [];
    //Forzamos y revisamos la creación de un array incluso si no se reciben datos
    return validData;
  }

  function ReqStatus(requestStatus) {
    let reply = "";
    if (requestStatus === "accepted") {
      reply = "✅ Aceptada";
      return reply;
    } else if (requestStatus === "refused") {
      reply = "❌ Rechazada";
      return reply;
    } else {
      reply = "❓Pendiente";
    }
    return reply;
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
          {requests.map((request) => (
            <div
              className="flex justify-center align-center m-1"
              key={request._id}
            >
              <div className="w-full bg-pink-dark flex flex-row rounded-full p-2 text-white text-sm items-center md:mx-20 md:text-lg">
                <div className="w-1/6 p-1">
                  <span className="font-bold">Nombre: </span>
                  <span>{request.reqAnimalName}</span>
                </div>
                <div className="w-1/6 ml-1 p-1">
                  <span className="font-bold">Tipo: </span>
                  <span>{request.reqAnimalSpecie}</span>
                </div>
                <div className="w-1/6 ml-1 p-1">
                  <span className="font-bold">Raza: </span>
                  <span>{request.reqAnimalBreed}</span>
                </div>
                <div className="w-1/6 ml-1 p-1">
                  <span className="font-bold">Cedente: </span>
                  <span>{request.transferName}</span>
                </div>
                <div className="w-2/6 flex justify-end ml-3 text-center">
                  <div className="bg-blue-dark px-2 rounded-full">
                    <span className="font-bold">Estado de solicitud: </span>
                    <span>{ReqStatus(request.status)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <hr className="mt-5 border-blue-light border border-double" />
        <div className="flex flex-col mt-5">
          <div className="w-5/6 flex justify-center w-full">
            <p className="p-2 bg-blue-lightest text-blue-dark rounded-full text-center mx-1">
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
