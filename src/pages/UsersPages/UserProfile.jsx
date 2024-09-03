import Navbar from "@/components/Navbar";
import UserModify from "@/components/users/UserModify";
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

  const UTCtoLocalDate = (animalBirth) => {
    const date = new Date(animalBirth);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses en JavaScript empiezan en 0
    const year = date.getFullYear();
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="flex flex-col justify-start min-h-screen overflow-scroll py-6">
        <UserPanel />
        <div className="w-full h-2 bg-pink-dark shadow">
          <div className="w-full mt-5 text-center text-blue-dark flex flex-col items-center justify-center">
            {isLoggedIn ? (
              <div className="md:flex md:flex-row md:items-start">
                <div className="w-auto bg-blue-lightest flex flex-col items-center justify-center border-2 border-pink-dark rounded-xl p-2">
                  <h3 className="text-center text-xl mt-2 font-bold bg-blue-light text-blue-dark rounded-xl px-2 shadow-xl mb-2">
                    👤 Datos de usuario
                  </h3>
                  {/* Name */}
                  <div className="w-full flex items-center p-2">
                    <span className="font-bold pr-1">Nombre:</span>
                    <span>{user.name}</span>
                  </div>
                  {/* Lastname */}
                  <div className="w-full flex items-center p-2">
                    <span className="font-bold pr-1">Apellido:</span>
                    <span>{user.lastname}</span>
                  </div>
                  {/* NIF */}
                  <div className="w-full flex items-center p-2">
                    <span className="font-bold pr-1">NIF:</span>
                    <span>{user.NIF}</span>
                  </div>

                  {/* BirthDay */}
                  <div className="w-full flex items-center p-2">
                    <span className="font-bold pr-1">Nacimiento:</span>
                    <span>{UTCtoLocalDate(user.birth)}</span>
                  </div>
                  {/* ********************************************** */}
                  <h3 className="text-center text-m mt-2 font-bold">
                    Datos de direción
                  </h3>
                  {/* Provincie */}
                  <div className="w-full flex items-center p-2">
                    <span className="font-bold pr-1">Provincia:</span>
                    <span>{user.province}</span>
                  </div>
                  {/* Locality */}
                  <div className="w-full flex items-center p-2">
                    <span className="font-bold pr-1">Localidad:</span>
                    <span>{user.locality}</span>
                  </div>
                  {/* Address */}
                  <div className="w-full flex items-center p-2">
                    <span className="font-bold pr-1">Dirección:</span>
                    <span>{user.address}</span>
                  </div>
                  {/* ********************************************** */}
                  <h3 className="text-center text-m mt-2 font-bold">
                    Datos de Contacto
                  </h3>
                  {/* Phone */}
                  <div className="w-full flex items-center p-2">
                    <span className="font-bold pr-1">Teléfono:</span>
                    <span>{user.phone}</span>
                  </div>
                  {/* Email */}
                  <div className="w-full flex items-center p-2">
                    <span className="font-bold pr-1">Email:</span>
                    <span>{user.email}</span>
                  </div>
                  {/* ********************************************** */}
                  <h3 className="text-center text-m mt-2 font-bold">
                    Informacion de domicilio
                  </h3>
                  {/* TypeHouse */}
                  <div className="w-full flex items-center p-2">
                    <span className="font-bold pr-1">Tipo de domicilio:</span>
                    <span>
                      {user.typeHouse === "-" ? "No indicado" : user.typeHouse}
                    </span>
                  </div>
                  {/* ownHouse */}
                  <div className="w-full flex items-center p-2">
                    <span className="font-bold pr-1">
                      Propietario del domicilio:
                    </span>
                    <span>
                      {user.ownHouse === "-" ? "No indicado" : user.ownHouse}
                    </span>
                  </div>
                  {/* gardenWall */}
                  <div className="w-full flex items-center p-2">
                    <span className="font-bold pr-1">
                      Dispone de jardin amurallado:
                    </span>
                    <span>
                      {user.gardenWall === false ? "No indicado" : "Sí"}
                    </span>
                  </div>
                  <div>
                    <UserModify user={user} />
                  </div>
                </div>
                {/* ********************************************** */}
                {/* ********************************************** */}
                <div className="my-2 md:ml-3 md:my-0 w-auto h-auto bg-pink-dark text-white-light flex flex-col items-center justify-center border-2 border-blue-dark rounded-xl p-3 shadow-xl">
                  <h3 className="text-center text-xl mt-2 font-bold bg-pink-softest text-blue-dark rounded-xl px-2 shadow-xl mb-2">
                    🐾 Datos de animales
                  </h3>
                  {/* animalsCreates (Número de Animales para adopción) */}
                  <div className="w-full flex items-center p-2">
                    <span className="font-bold pr-1">
                      Animales creados para adopción:
                    </span>
                    <span className="text-m">
                      {user.animalsCreated
                        ? user.animalsCreated.length
                        : "Ninguno"}
                    </span>
                  </div>
                  {/* Limites de adopciones */}
                  <div className="w-full flex items-center p-2">
                    <span className="font-bold pr-1">
                      Nº de adopciones restantes:
                    </span>
                    <span className="text-m">{3 - user.animalLimit}</span>
                  </div>
                  <div className="bg-pink-softest text-blue-dark italic rounded-full px-2">
                    <a href="/UsersPages/UserAnimalManage">Ver tus mascotas</a>
                  </div>
                </div>
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
