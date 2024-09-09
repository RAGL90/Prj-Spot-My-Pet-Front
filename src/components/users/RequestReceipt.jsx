import React, { useEffect, useState } from "react";
import ModalScreen from "../ModalScreen";
import { BASE_URL } from "@/core/config/configDev";

export default function RequestReceipt() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("");
  const [bgColor, setBgColor] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");

  //********************************AREA DE VENTANA MODAL******************************/
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  //******************************** FIN - AREA DE VENTANA MODAL ******************************/
  useEffect(() => {
    fetchRequest();
  }, []);

  //Fetch para realizar consulta:
  const fetchRequest = async (status) => {
    setIsLoading(true);
    let url = `${BASE_URL}user/requests`;
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
      setIsSuccess(true);
      setRequests(data.data);
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
    <div className="text-center">
      <button
        className="w-auto text-blue-dark bg-blue-lightest p-2 rounded-full"
        onClick={() => handleOpenModal()}
      >
        Ver solicitudes Recibidas
      </button>
      <ModalScreen isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="text-blue-dark mb-2">
          <h1 className="bg-blue-dark text-2xl text-center text-white my-2">
            Solicitudes Recibidas
          </h1>
        </div>
        <div>
          {requests.length > 0 && (
            <div className="flex justify-center flex-wrap text-base gap-3">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className={`p-3 mx-5 my-3 rounded bg-blue-dark shadow-xl`}
                >
                  <div className="mb-2 bg-white text-blue-dark px-2 rounded-xl">
                    <span className="font-bold">Estado: </span>
                    <span>
                      {request.status === "accepted"
                        ? "Aceptada ✅"
                        : request.status === "pending"
                        ? "Pendiente ❔"
                        : "Rechazada ❌"}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-bold">Mascota:</span>{" "}
                    {request.reqAnimalName}
                  </div>
                  <div className="mb-2">
                    <span className="font-bold">Raza:</span>{" "}
                    {request.reqAnimalSpecie}
                  </div>
                  <div className="mb-4">
                    <span className="font-bold">Solicitante:</span>{" "}
                    {request.applicantName} {request.applicantLastName}
                  </div>
                  <div></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ModalScreen>
    </div>
  );
}
