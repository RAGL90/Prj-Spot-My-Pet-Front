import Navbar from "@/components/Navbar";
import RequestViewAction from "@/components/shelters/RequestViewAction";
import ShelterRequest from "@/components/shelters/ShelterRequest";
import { BASE_URL } from "@/core/config/configDev";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ShelterMenu() {
  //1º En un UseEffect hacemos un fetch con todos los datos de la Protectora.
  //Guardar datos recibidos en un state:
  const [shelter, setShelter] = useState({});
  //Manejar los estados por si colocamos loaders:
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  //Manejo de mensajes para mostrar al usuario:
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");

  const isShelterLoggedIn = useSelector(
    (state) => state.shelterLogin.isShelterLoggedIn
  ); // Verificamos si la protectora está logueada

  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("");
  const [bgColor, setBgColor] = useState("");

  //Creamos una función que SERÁ USADA por el hijo ShelterRequest - de forma muestre las solicitudes filtradas:
  const fillRequestState = (requestList, stRequest) => {
    //Primero seteamos status para mostrar a las protectoras que tipo de solicitud se trata
    if (!stRequest) {
      setStatus("Todas las solicitudes");
      setBgColor("bg-pink-dark text-white");
    } else {
      switch (stRequest) {
        case "accepted":
          setStatus("Solicitudes Aceptadas");
          setBgColor("bg-greenL text-white");
          break;
        case "pending":
          setStatus("Solicitudes Pendientes");
          setBgColor("bg-yellow text-white");
          break;
        case "refused":
          setStatus("Solicitudes Canceladas");
          setBgColor("bg-red-dark text-white");
          break;

        default:
          setStatus("");
          break;
      }
    }
    //Finalmente seteamos el array de solicitudes
    setRequests(requestList);
  };

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
          `Error al obtener datos de usuario: ${
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
  //2º Enviamos esos datos a los módulos que sean necesarios.
  return (
    <div className="bg-background">
      <Navbar />
      <div className="flex flex-col justify-start min-h-screen text-blue-dark text-center text-3xl">
        {isShelterLoggedIn ? (
          <div>
            <h1 className="pt-5">
              Bienvenid@s a nuestra página {shelter.name}
            </h1>
            <div className="bg-pink-dark py-2 mt-3 ">
              <h3 className="text-2xl text-white">¿Que deseas hacer?</h3>
            </div>
            <div className="flex justify-center text-lg space-x-5 mt-20">
              <div>
                <a
                  className="bg-blue-dark shadow-xl p-5 rounded-full text-white hover:text-blue-dark hover:bg-white"
                  href="ShelterAnimals"
                >
                  Añadir animal / Ver tus animales
                </a>
              </div>
              <div>
                <a
                  className="bg-blue-dark shadow-xl p-5 rounded-full text-white hover:text-blue-dark hover:bg-white"
                  href="ShelterProfile"
                >
                  Ver perfil Asociación
                </a>
              </div>
            </div>
            <div className="flex justify-center text-lg space-x-5 mt-20">
              <div>
                <a
                  className="bg-blue-dark shadow-xl p-5 rounded-full text-white hover:text-blue-dark hover:bg-white"
                  href="ShelterRequestPage"
                >
                  Ver Solicitudes
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-5xl">ERROR 404 : Esta página no existe</p>
          </div>
        )}
      </div>
    </div>
  );
}
