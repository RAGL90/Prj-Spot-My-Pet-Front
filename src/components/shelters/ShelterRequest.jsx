import React, { useState } from "react";
//Importación de RUTAS
import { BASE_URL } from "@/core/config/configDev";
import ModalScreen from "../ModalScreen";

export default function ShelterRequest({ fillRequestState }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [color, setColor] = useState("");
  const [message, setMessage] = useState("");

  //              ********** Declaraciones y funciones para ventana Modal ***********
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  //                **********                  Fin declaraciones ventana Modal         **********

  //Fetch para realizar consulta:
  const fetchRequest = async (status) => {
    setIsLoading(true);
    let url = `${BASE_URL}shelter/requests`;
    if (status) {
      //En caso de que se envíe un status con el filtro añadimos la coletilla de query
      url += `?status=${encodeURIComponent(status)}`;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "auth-token": token,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(
          `Error al obtener datos de usuario: ${
            data.message || "Error desconocido"
          }`
        );
        setColor("text-red-dark");
        return;
      }
      fillRequestState(data.data, status);
      setIsSuccess(true);
      handleCloseModal();
      console.log(requests);
    } catch (error) {
      setMessage(`Error al conectarse al servidor: ${error.message}`);
      setColor("text-red-dark");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        className="bg-blue-dark text-white p-2 rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-blue-medium duration-300"
        onClick={() => handleOpenModal()}
      >
        Ver solicitudes
      </button>

      <ModalScreen
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        background={"bg-pink-dark"}
      >
        <div className="text-center my-3 text-white">
          <p className="text-4xl">📝</p>
          <h1 className="text-2xl mb-5">¿Que solicitudes quieres ver?</h1>
          <div className="flex flex-row space-x-3 px-5">
            <button
              className="bg-yellow text-white rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={() => fetchRequest("pending")}
              disabled={isLoading}
            >
              Solicitudes pendientes
            </button>
            <button
              className="bg-greenL text-white rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={() => fetchRequest("accepted")}
              disabled={isLoading}
            >
              Solicitudes aceptadas
            </button>
            <button
              className="bg-red-dark text-white rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={() => fetchRequest("refused")}
              disabled={isLoading}
            >
              Solicitudes rechazadas
            </button>
          </div>
          <div className="flex justify-center mt-2">
            <button
              className="bg-blue-dark text-white rounded-xl px-3 py-3 ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              onClick={() => fetchRequest()}
              disabled={isLoading}
            >
              Todas las solicitudes
            </button>
          </div>
          <div>
            <p className={`color`}>{message}</p>
          </div>
        </div>
      </ModalScreen>
    </div>
  );
}
