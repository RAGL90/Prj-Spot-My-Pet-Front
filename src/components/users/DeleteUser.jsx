import { BASE_URL } from "@/core/config/configDev";
import React, { useEffect, useState } from "react";
import ModalScreen from "../ModalScreen";
import { useDispatch, useSelector } from "react-redux"; //useDispatch para logout
import { logout } from "./LoginActions";
import Link from "next/link";

export default function DeleteUser({ user }) {
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reply, setReply] = useState({ value: "", color: "" });

  //********************************AREA DE VENTANA MODAL******************************/
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setUserId("");
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setUserId(user._id);
  }, []);
  //******************************** FIN - AREA DE VENTANA MODAL ******************************/

  const handleConfirmButton = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(BASE_URL + "user/user-panel", {
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

  //Declaraciones de REDUX:
  const dispatch = useDispatch();

  const handleLogOut = () => {
    //En el log out eliminamos los tokens y hacemos desaparecere el panel del usuario
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    //Disparamos estado logout en redux
    dispatch(logout());
  };

  return (
    <div>
      <div>
        <button
          className="rounded-full bg-red-dark shadow-xl text-white-light text-l p-2 m-2 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-red-light duration-300"
          onClick={() => handleOpenModal()}
        >
          ❌ Eliminar cuenta
        </button>
      </div>
      <ModalScreen isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="flex flex-col">
          <h1 className="bg-red-dark text-2xl text-center text-white my-2">
            😥 Borrar usuario: {user.name}
          </h1>
        </div>
        <div className="py-2 bg-blue-dark text-white text-justify ">
          <ul className="px-5 ml-2 list-disc ">
            <li>
              ¡Si has tenido algún problema puedes contactarnos para ayudarte a
              resolverlo!
            </li>
            <br />
            <li>
              Recuerda que si has participado en un proceso de adopción,
              SpotMyPet se reserva el derecho a conservar un mínimo de tus
              datos, para garantizar el bienestar de los animales.
            </li>
          </ul>
        </div>
        <div className="bg-pink-dark text-white text-center text-xl p-2">
          <p>¿Estás seguro/a de eliminar tu usuario?</p>
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
      </ModalScreen>
    </div>
  );
}
