import { BASE_URL } from "@/core/config/configDev";
import React, { useEffect, useState } from "react";

export default function ShelterDeleteAnimal({ animal }) {
  const [animalId, setAnimalId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    setAnimalId(animal._id);
  }, []);

  useEffect(() => {
    //En caso de éxito cerramos la ventana modal automáticamente
    if (isSuccess) {
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, "5000");
    }
  }, [isSuccess]);

  const handleConfirmButton = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(BASE_URL + "shelter/animal", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          "auth-token": token,
          accept: "*/*",
        },
        body: JSON.stringify({
          animalId: animalId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorResponse = await response.json();
        setMessage(
          `Error durante el borrado de la mascota: ${
            errorResponse.message || "Error desconocido"
          }`
        );
        setColor("text-red");
        return;
      }
      setMessage("¡Mascota dada de baja correctamente!");
      setColor("text-green");
      setIsSuccess(true);
    } catch (error) {
      setMessage(`Error al subir las imágenes: ${error.message}`);
      setColor("text-red");
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-red-light text-white text-center mt-2">
      <p className="text-2xl">⚠️</p>
      <p>
        <span>¿Estás seguro/a de querer eliminar el registro de </span>
        <span className="font-bold underline text-yellow-200">
          {animal.name}
        </span>
        <span> y todos sus datos en la plataforma?</span>
      </p>
      <button
        className="w-1/12 bg-red-dark border-2 border-blue-dark rounded shadow my-2 py-1 hover:bg-black"
        onClick={handleConfirmButton}
      >
        Sí
      </button>
      <div className="w-full py-2">
        <p className={`text-2xl ${color} text-center`}>{message}</p>
      </div>
    </div>
  );
}
