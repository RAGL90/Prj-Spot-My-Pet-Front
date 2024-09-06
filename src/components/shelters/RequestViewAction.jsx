import React, { useEffect, useState } from "react";
import ModalScreen from "../ModalScreen";
import { BASE_URL } from "@/core/config/configDev";

export default function RequestViewAction({ request }) {
  const [refused, setRefused] = useState(false);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [actions, setActions] = useState(false);
  //Manejo de mensajes para mostrar al usuario:
  const [reply, setReply] = useState({ value: "", color: "" }); //Mensaje del estado del fetch

  //              ********** Declaraciones y funciones para ventana Modal ***********
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    //Reiniciamos valores en cada recarga del modal
    setReply({ value: "", colo: "" });
    setReason("");
    setIsLoading("");
    if (request.status === "pending" || request.status === "refused") {
      setActions(true);
    }
  }, [isModalOpen]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  //                **********                  Fin declaraciones ventana Modal         **********

  const handleContact = (
    applicantEmail,
    reqAnimalName,
    applicantName,
    transferName
  ) => {
    const subject = encodeURIComponent(
      `Consulta sobre tu solicitud de ${reqAnimalName} en SpotMyPet`
    );
    const body = encodeURIComponent(
      `Hola ${applicantName}! Somos de la asociación de animales, ${transferName} \n Te contactamos desde la plataforma Spot My Pet, hemos recibido tu solicitud y nos gustaría saber más sobre...`
    );
    return `mailto:${applicantEmail}?subject=${subject}&body=${body}`;
  };

  const handleRefused = () => {
    setRefused(true);
  };

  const handleChangeReason = (e) => {
    setReason(e.target.value);
  };

  const handleChoise = async (choice) => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const body = JSON.stringify({
        choice: choice,
        description: reason,
      });

      const response = await fetch(
        `${BASE_URL}shelter/request/${request._id}`,
        {
          method: "PATCH",
          headers: {
            Accept: "*/*",
            "auth-token": token,
            "Content-Type": "application/json",
          },
          body: body,
        }
      );
      if (!response.ok) {
        setReply({
          value: `Error en la transmision de decisión, motivo: ${response.message}`,
          color: "text-red",
        });
        return;
      }
      setIsSuccess(true);
      setReply({
        value: `Decision transmitida correctamente`,
        color: "text-greenL",
      });
    } catch (error) {
      setReply({
        value: `Error en la transmision de decisión, motivo: ${error.message}`,
        color: "text-red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
        onClick={() => handleOpenModal()}
      >
        Ver más
      </button>
      <ModalScreen isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="text-2xl text-blue-dark text-center">
          <span>Solicitud para </span>
          {request.reqAnimalName}
        </div>
        <div className="mt-5 text-blue-dark text-center">
          <hr />
          <p className="text-lg">Detalles de la mascota</p>
          <div className="flex flex-row px-5 items-center">
            <div className="w-1/2 my-1">
              <span className="pr-1 font-bold">Especie: </span>
              <span>{request.reqAnimalSpecie}</span>
            </div>
            <div className="w-1/2">
              <span className="pr-1 font-bold">Género: </span>
              <span>{request.reqAnimalGender}</span>
            </div>
          </div>
          <div className="flex flex-row px-5 items-center">
            <div className="w-1/2 my-1">
              <span className="pr-1 font-bold">Raza: </span>
              <span>{request.reqAnimalBreed}</span>
            </div>
            <div className="w-1/2 my-1">
              <span className="pr-1 font-bold">Coste: </span>
              <span>{request.reqAnimalCost} €</span>
            </div>
          </div>
          <div className="w-full">
            <span className="pr-1 font-bold">Color principal: </span>
            <span>{request.reqAnimalMainColor}</span>
          </div>
          {request.reqAnimalSize ? (
            <div className="w-1/2 my-1">
              <span className="pr-1 font-bold">Tamaño: </span>
              <span>{request.reqAnimalSize}</span>
            </div>
          ) : (
            <></>
          )}
          <hr className="mt-5" />
          <div className="text-blue-dark text-center">
            <p className="text-lg">Detalles del usuario:</p>
          </div>
          <div className="flex flex-row px-5 items-center">
            <div className="w-1/2 my-1">
              <span className="pr-1 font-bold">Nombre: </span>
              <p>{request.applicantName}</p>
            </div>
            <div className="w-1/2">
              <span className="pr-1 font-bold">Apellidos: </span>
              <p>{request.applicantLastname}</p>
            </div>
          </div>
          <div className="flex flex-row px-5 items-center">
            <div className="w-1/2 my-1">
              <span className="pr-1 font-bold">Provincia: </span>
              <span>{request.applicantProvince}</span>
            </div>
            <div className="w-1/2 my-1">
              <span className="pr-1 font-bold">Localidad: </span>
              <span>{request.applicantLocality}</span>
            </div>
          </div>
          <div className="w-full">
            <span className="pr-1 font-bold">Dirección: </span>
            <span>{request.applicantAddress}</span>
          </div>
          <hr className="mt-5" />
          <div>
            <p className="text-xl font-bold">Acciones</p>
          </div>
          <div>
            <p className="text-xl">Contactar:</p>
            <div className="flex my-3">
              <div className="w-1/2 content-center">
                <a
                  className="bg-blue-dark text-white p-2 rounded-full text-m transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-white-light hover:text-blue-dark duration-300"
                  href={`tel:${request.applicantPhone}`}
                >
                  📞Llamar a {request.applicantName}
                </a>
              </div>
              <div className="w-1/2">
                <a
                  href={handleContact(
                    request.applicantEmail,
                    request.reqAnimalName,
                    request.applicantName,
                    request.transferName
                  )}
                >
                  <button className="bg-blue-dark text-white p-2 rounded-full text-m transition ease-in-out delay-150  hover:bg-white-light hover:text-blue-dark duration-300">
                    📧 Escribir Email
                  </button>
                </a>
              </div>
            </div>
          </div>
          <div>
            {actions ? (
              <div>
                <p className="text-xl">Decidir solicitud:</p>
                <div className="flex justify-center space-x-10 my-5">
                  <button
                    className="bg-greenL text-white p-2 rounded-full shadow-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-white-light hover:text-blue-dark duration-300"
                    disabled={isLoading}
                    onClick={() => handleChoise("accepted")}
                  >
                    Aceptar Solicitud
                  </button>
                  <button
                    className="bg-red-dark text-white p-2 rounded-full shadow-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-white-light hover:text-blue-dark duration-300"
                    onClick={handleRefused}
                  >
                    Rechazar Solicitud
                  </button>
                </div>
                <div>
                  {refused ? (
                    <div>
                      <div className="mb-5">
                        <p className="text-red-dark font-bold text-l px-5">
                          ¿Deseas indicar al usuario algun motivo?
                        </p>
                        <div>
                          <input
                            type="text"
                            value={reason}
                            onChange={handleChangeReason}
                            className="text-input"
                          />
                        </div>
                        <button
                          className="bg-red-dark text-white p-2 my-5 rounded-full shadow-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-white-light hover:text-blue-dark duration-300"
                          disabled={isLoading}
                          onClick={() => handleChoise("refused")}
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xl">No se puede realizar acciones</p>
              </div>
            )}
          </div>
          <div>
            <p className={`${reply.color} text-center`}>{reply.value}</p>
          </div>
        </div>
      </ModalScreen>
    </div>
  );
}
