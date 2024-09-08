import { BASE_URL } from "@/core/config/configDev";
import React, { useEffect, useState } from "react";
import ModalScreen from "../ModalScreen";
import { useDispatch, useSelector } from "react-redux"; //useDispatch para logout
import { logoutShelter } from "./Redux/logoutShelter";
import Link from "next/link";

export default function ShelterDelete({ shelter }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reply, setReply] = useState({ value: "", color: "" });

  const handleConfirmButton = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}shelter/panel/${shelter.id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          "auth-token": token,
          accept: "*/*",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setReply({
          value: `Error durante el borrado del usuario: ${
            data.message || "Error desconocido, contacte con nosotros"
          }`,
          color: "text-red",
        });
        return;
      }
      setReply({ value: `${data.message}`, color: "text-greenL" });
      setIsSuccess(true);
    } catch (error) {
      setReply({
        value: `Error al borrar el usuario: ${error.message}`,
        color: "text-red",
      });
      return;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      //Disparamos estado logout en redux
      dispatch(logoutShelter());
    }
  }, [isSuccess]);

  //Declaraciones de REDUX para desconexión!:
  const dispatch = useDispatch();

  return (
    <div>
      <div className="flex flex-col">
        <h1 className="bg-red-dark text-2xl text-center text-white my-2">
          😥 Borrar cuenta: {shelter.name}
        </h1>
      </div>
      <div className="py-2 bg-blue-dark text-white text-justify ">
        <ul className="px-5 ml-2 list-disc ">
          <li>
            Si han tenido algún problema ¡Puedes contactarnos para que os
            ayudemos a resolverlo! (Recordad que esta plataforma está enfocada a
            vosotras las asociaciones y protectoras.)
          </li>
          <br />
          <li>
            Recordad que si habeis tenido un proceso de adopción en la
            plataforma, SpotMyPet, Spot My Pet se reserva el derecho a conservar
            los datos mínimos legales durante el tiempo imprescindible, para
            garantizar el bienestar de los animales y usuarios.
          </li>
        </ul>
      </div>
      <div className="bg-pink-dark text-white text-center text-xl p-2">
        <p>¿Están seguros de eliminar vuestra cuentra de asociación?</p>
      </div>
      <div className="w-full flex flex-row justify-center my-3 space-x-10">
        <button
          className="w-1/3 text-2xl bg-red-dark rounded-full shadow"
          disabled={isLoading}
          onClick={handleConfirmButton}
        >
          Sí
        </button>
        <button
          className="w-1/3 text-2xl bg-blue-dark rounded-full shadow"
          onClick={handleCloseModal}
        >
          No
        </button>
      </div>
      <div>
        <p className={`${reply.color} text-center`}>{reply.value}</p>
      </div>
      <div className="my-2 w-full flex justify-center">
        {/* Botón de desconexión del usuario */}
        {isSuccess ? (
          <button
            className="p-2 text-2xl bg-greenL text-black font-weight rounded-full hover:border-2 hover:border-pink-dark hover:bg-pink-dark hover:text-blue-dark"
            onClick={handleLogOut}
          >
            Desconectar
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
