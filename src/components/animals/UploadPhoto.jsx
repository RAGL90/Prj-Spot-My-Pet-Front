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

    //Creamos el formData construyendo el array de la lista de archivos con nombre image:
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("image", files[i]);
    }

    //Ya preparado el formData, comenzamos el fetch:
    setIsUploading(true);
    const token = localStorage.getItem("token");
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
        throw new Error("Error al subir imagen");
      }

      setMessage("¡Fotos guardadas correctamente!");
      setColor("text-green");
      setUploadSuccess(true);
    } catch (error) {
      setMessage(`Error al subir las imágenes: ${error.message}`);
      setColor("text-red");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full flex flex col text-pink-dark w-full justify-center content-center items-center">
      <div className="w-5/6 justify-center">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            name="image"
            accept="image/*"
            multiple
            max="5"
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
