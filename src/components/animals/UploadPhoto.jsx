import { BASE_URL } from "@/core/config/configDev";
import React, { useState } from "react";

export default function UploadPhoto(props) {
  //Desestructuramos el props recibido:
  const { animalId } = props;

  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    //Indicamos los archivos
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setMessage("Por favor, añada al menos una imagen");
      setColor("text-red");
      return;
    }

    //Creamos el formData construyendo el array con el nombre de los archivos que se enviaran con nombre "image":
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("image", files[i]);
    }
    console.log("El formData está construido: ", formData);
    console.log("El id es: ", animalId);

    //Ya preparado el formData, comenzamos el fetch:
    setIsUploading(true);
    const token = localStorage.getItem("token");
    console.log("Intentando subir imagen");
    console.log("DISPONEMOS DE TOKEN " + token);

    try {
      const response = await fetch(`${BASE_URL}upload/${animalId}`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "auth-token": token,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        setMessage(
          `Error al subir las imágenes: ${
            errorResponse.message || "Error desconocido"
          }`
        );
        setColor("text-red-dark");
        return;
      }

      setMessage("¡Fotos guardadas correctamente!");
      setColor("greenL");
      setUploadSuccess(true);
    } catch (error) {
      setMessage(`Error al subir las imágenes: ${error.message}`);
      setColor("text-red");
      return;
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center my-3 border-2 border-blue-dark rounded-xl">
      <div className="p-3 w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            name="image"
            accept="image/*"
            multiple
            className="w-full text-sm text-black file:mr-4 file:py-2 file:bg-pink-medium file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={handleFileChange}
          />
          <button
            type="submit"
            disabled={isUploading}
            className="w-full flex justify-center items-center px-4 py-2 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:bg-pink-300"
          >
            {isUploading ? "Subiendo..." : "Subir imágenes"}
          </button>

          <div className="w-full py-2">
            <p className={`text-2xl ${color} text-center`}>{message}</p>
          </div>
        </form>
      </div>
    </div>
  );
}
