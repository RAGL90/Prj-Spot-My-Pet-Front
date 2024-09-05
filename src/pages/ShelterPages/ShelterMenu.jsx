import Navbar from "@/components/Navbar";
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
      <div className="flex flex-col justify-start min-h-screen py-3 text-blue-dark text-center text-3xl">
        {isShelterLoggedIn ? (
          <div>
            <p className={`${color} text-sm`}>{message}</p>
            <h1>Bienvenid@s a nuestra página {shelter.name}</h1>
            <h3 className="mt-2 text-2xl text-pink-dark">¿Que deseas hacer?</h3>
            <div className="flex justify-center text-lg space-x-5 mt-5">
              <div>Añadir animal para adopción</div>
              <div>Ver tus animales</div>
              <div>Ver solicitudes</div>
              <div>Revisar información de tu perfil</div>
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
