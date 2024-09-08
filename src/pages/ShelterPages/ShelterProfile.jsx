import Navbar from "@/components/Navbar";
import DeleteUser from "@/components/users/DeleteUser";

import ShelterPanel from "@/components/shelters/ShelterPanel";
import { BASE_URL } from "@/core/config/configDev";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalScreen from "@/components/ModalScreen";
import ShelterProfileModify from "@/components/shelters/ShelterProfileModify";

export default function ShelterProfile() {
  //Guardar datos recibidos del fetch en un state:
  const [shelter, setShelter] = useState({});
  //Manejar los estados por si colocamos loaders:
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  //Manejo de mensajes para mostrar al usuario:
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");

  //States para el manejo del modal
  const [reFetch, setReFetch] = useState(false);
  const [modifyShelter, setModifyShelter] = useState(false);
  const [deleteShelter, setDeleteShelter] = useState(false);

  //              ********** Declaraciones y funciones para ventana Modal ***********
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModifyShelter(false); // Esto asegura esconder el formulario
    setReFetch(true); // Actualizamos los nuevos datos del perfil
  };

  useEffect(() => {
    if (reFetch) {
      fetchData();
      setReFetch(false);
    }
  }, [reFetch]);

  //                **********                  Fin declaraciones ventana Modal         **********
  const handleButtonClick = (actionType) => {
    // Abre el modal en cualquier acción
    handleOpenModal();

    if (actionType === "modify") {
      setModifyShelter(true);
      setDeleteShelter(false);
      return;
    } else if (actionType === "delete") {
      setModifyShelter(true);
      setDeleteShelter(false);
    } else {
      console.log("Sin accion especificada");
      handleCloseModal(); // Cierra el modal si no hay acción
    }
  };

  const isShelterLoggedIn = useSelector(
    (state) => state.shelterLogin.isShelterLoggedIn
  ); // Verificamos si la protectora está logueada

  //Queremos que haga un fetch al perfil
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}shelter/panel`, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "auth-token": token,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(
          `Error al obtener datos de Asociación: ${
            data.message || "Error desconocido"
          }`
        );
        setColor("text-red-dark");
        return;
      }

      setShelter(data.data);
      setIsSuccess(true);
    } catch (error) {
      setMessage(`Error al conectarse al servidor: ${error.message}`);
      setColor("text-red-dark");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="flex flex-col bg-pink-softest justify-start min-h-screen overflow-scroll">
        <ShelterPanel />
        <div className="w-full mt-5 text-center text-blue-dark flex flex-col items-center justify-center">
          {isShelterLoggedIn ? (
            <div className="md:flex md:flex-row md:items-start">
              <div className="w-auto bg-blue-lightest flex flex-col items-center justify-center border-2 border-pink-dark rounded-xl p-2">
                <h3 className="text-center text-xl mt-2 font-bold bg-blue-light text-blue-dark rounded-xl px-2 shadow-xl mb-2">
                  🫂 Datos de Protectora
                </h3>
                {/* Name */}
                <div className="w-full flex items-center p-2">
                  <span className="font-bold pr-1">Nombre Protectora:</span>
                  <span>{shelter.name}</span>
                </div>
                {/* NIF */}
                <div className="w-full flex items-center p-2">
                  <span className="font-bold pr-1">NIF:</span>
                  <span>{shelter.NIF}</span>
                </div>
                {/* ********************************************** */}
                <h3 className="text-center text-m mt-2 font-bold">
                  Datos de direción
                </h3>
                {/* Provincie */}
                <div className="w-full flex items-center p-2">
                  <span className="font-bold pr-1">Provincia:</span>
                  <span>{shelter.province}</span>
                </div>
                {/* Locality */}
                <div className="w-full flex items-center p-2">
                  <span className="font-bold pr-1">Localidad:</span>
                  <span>{shelter.locality}</span>
                </div>
                {/* Address */}
                <div className="w-full flex items-center p-2">
                  <span className="font-bold pr-1">Dirección:</span>
                  <span>{shelter.address}</span>
                </div>
                {/* ********************************************** */}
                <h3 className="text-center text-m mt-2 font-bold">
                  Datos de Contacto
                </h3>
                {/* Phone */}
                <div className="w-full flex items-center p-2">
                  <span className="font-bold pr-1">Teléfono:</span>
                  <span>{shelter.phone}</span>
                </div>
                {/* Email */}
                <div className="w-full flex items-center p-2">
                  <span className="font-bold pr-1">Email:</span>
                  <span>{shelter.email}</span>
                </div>
                {/* Web */}
                <div className="w-full flex items-center p-2">
                  <span className="font-bold pr-1">Web:</span>
                  <a
                    href={
                      shelter.web && shelter.web.startsWith("http")
                        ? shelter.web
                        : shelter.web
                        ? `http://${shelter.web}`
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {shelter.web ? shelter.web : "No disponible"}
                  </a>
                </div>
                {/* RRSS */}
                <div className="w-full flex flex-col p-2">
                  <p className="font-bold pr-1">Redes Sociales:</p>
                  <ul className="list-none pl-2 text-left">
                    {shelter.socialMedia && shelter.socialMedia.length > 0 ? (
                      shelter.socialMedia.map((social, index) => (
                        <li className="mb-1" key={index}>
                          <a
                            href={social}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-dark underline"
                          >
                            {social}
                          </a>
                        </li>
                      ))
                    ) : (
                      <span>No hay redes sociales disponibles</span>
                    )}
                  </ul>
                </div>

                <div className="flex flex-col space-x-2 align-center">
                  <div>
                    <button
                      type="button"
                      className="w-full justify-center bg-blue-dark rounded-full text-white p-2 shadow hover:bg-pink-dark"
                      onClick={() => handleButtonClick("modify")}
                    >
                      Modificar Perfil
                    </button>
                  </div>
                  <div className="mt-3">
                    <button
                      className="rounded-full bg-red-dark shadow-xl text-white-light text-l p-2 m-2  transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-red-light duration-300"
                      onClick={() => handleOpenModal("delete")}
                    >
                      ❌ Eliminar cuenta
                    </button>
                  </div>
                </div>
              </div>
              {/* ********************************************** */}
              {/* ********************************************** */}
              <div className="my-2 md:ml-3 md:my-0 w-auto h-auto bg-pink-dark text-white-light flex flex-col items-center justify-center border-2 border-blue-dark rounded-xl p-3 shadow-xl">
                <h3 className="text-center text-xl mt-2 font-bold bg-pink-softest text-blue-dark rounded-xl px-2 shadow-xl mb-2">
                  🐾 Datos de animales
                </h3>
                {/* animalsCreates (Número de Animales para adopción) */}
                <div className="w-full p-2">
                  <p>Animales creados para adopción:</p>
                  <p className="text-lg text-center font-bold">
                    {shelter.animals ? shelter.animals.length : "Ninguno"}
                  </p>
                </div>

                <div className="rounded-full bg-blue-dark shadow-xl text-white-light text-l p-2 mb-2 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-pink-softest hover:text-blue-dark duration-300">
                  <a href="/UsersPages/UserAnimalManage">Ver mascotas</a>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p>No estás logueado!</p>
            </div>
          )}
        </div>
        <ModalScreen isOpen={isModalOpen} onClose={handleCloseModal}>
          {modifyShelter && (
            <ShelterProfileModify
              shelter={shelter}
              onClose={handleCloseModal}
            />
          )}
          {deleteShelter && (
            <ShelterDeleteAnimal shelter={shelter} onClose={handleCloseModal} />
          )}
        </ModalScreen>
      </div>
    </div>
  );
}
