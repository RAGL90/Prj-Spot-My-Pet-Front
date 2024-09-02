import Navbar from "@/components/Navbar";
import UserPanel from "@/components/users/UserPanel";
import { BASE_URL } from "@/core/config/configDev";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function UserProfile() {
  //Explicación de los useStates
  //Guardar datos recibidos en un state:
  const [user, setUser] = useState({});
  //Manejar los estados por si colocamos loaders:
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  //Manejo de mensajes para mostrar al usuario:
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");

  const isLoggedIn = useSelector((state) => state.login.userLog); // Verificamos si el usuario está logueado

  //Queremos que haga un fetch al perfil
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);

    async function fetchData() {
      setIsLoading(true);

      try {
        const response = await fetch(`${BASE_URL}user/user-panel`, {
          // Asegúrate de usar `await` aquí
          method: "GET",
          headers: {
            Accept: "*/*",
            "auth-token": token,
          },
        });

        const data = await response.json(); // Ahora `response` está correctamente esperada y `data` puede ser parseado.
        if (!response.ok) {
          setMessage(
            `Error al obtener datos de usuario: ${
              data.message || "Error desconocido"
            }`
          );
          setColor("text-red-dark");
          console.log("Error recibido: ", data.message); // Mover dentro del bloque de error
          return; // Evita más ejecución si hay un error
        }
        console.log("Se recibe respuesta satisfactoria");
        setUser(data.data);
        setIsSuccess(true);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setMessage(`Error al conectarse al servidor: ${error.message}`);
        setColor("text-red-dark");
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="flex flex-col justify-start min-h-screen overflow-scroll py-6">
        <UserPanel />
        <div className="w-full h-2 bg-pink-dark shadow">
          <div className="mt-4 text-center text-blue-dark">
            {isLoggedIn ? (
              <div>
                <h1>{user.name}</h1>
                <h1>{user.lastname}</h1>
              </div>
            ) : (
              <div>
                <p>No estás logueado!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
