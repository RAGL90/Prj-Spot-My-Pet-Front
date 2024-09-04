import { BASE_URL } from "@/core/config/configDev";
import React, { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import { useSelector } from "react-redux";
import UserPanel from "@/components/users/UserPanel";
import RequestReceipt from "@/components/users/RequestReceipt";

export default function UserRequests() {
  //UseStates:
  const [requests, setRequests] = useState([]); //Almacenamos los requests:
  const [token, setToken] = useState(null); //Insertamos el token
  //Para los fetch
  const [isLoading, setIsLoading] = useState(false); //Para deshabilitar el botón y no hacer múltiples fetchs
  const [isSuccess, setIsSuccess] = useState(false); //Por si queremos hacer un evento tras un exito

  const [user, setUser] = useState({}); //Para guardar los datos de user, necesitamos ver si tiene solicitudes aceptadas.
  const [requestReceipts, setRequestReceipts] = useState(false); //Indica si hay solicitudes recibidas o no.

  const [reply, setReply] = useState({ value: "", color: "" }); //Mensaje del estado del fetch

  const isLoggedIn = useSelector((state) => state.login.userLog); // Verificamos si el usuario está logueado

  //UseEffect al cargar página para establecer Token (innecesario...)
  useEffect(() => {
    async function initializeToken() {
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
      }
    }
    initializeToken();
  }, []);

  useEffect(() => {
    fetchData();
  }, [requests]);

  //Para saber si hay que mostrar solicitudes tendremos que recibir los datos de usuario
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}user/user-panel`, {
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
        setReply({
          value: `Error al obtener datos de usuario: ${
            data.message || "Error desconocido"
          }`,
          color: "text-red-dark",
        });
        return;
      }
      if (data.data.requests.length > 0) {
        setRequestReceipts(true);
      }
      setIsSuccess(true);
    } catch (error) {
      console.log("Error en la conexión con el servidor...");

      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  //Otro use effect para llamar la fn loadUserRequest cuando esté logueado.
  useEffect(() => {
    console.log("Is logged In?", isLoggedIn);
    console.log("Token Number", token);

    if (isLoggedIn && token) {
      loadUserRequests();
      fetchData();
    }
  }, [isLoggedIn, token]);

  //Función de carga de solicitudes, usando el useState para guardar el array de solicitudes
  async function loadUserRequests() {
    try {
      const fetchedRequests = await fetchRequests();
      setRequests(fetchedRequests);
    } catch (error) {
      console.error(
        "Fallo durante la carga de solicitudes de adopción del usuario:",
        error
      );
      setRequests([]); // Si hay error, se crea un array vacío
    }
  }

  //Fetch de los request (solicitudes)
  async function fetchRequests() {
    const res = await fetch(`${BASE_URL}user/request`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "auth-token": token,
      },
    });
    if (!res.ok) {
      throw new Error(
        `Error durante la carga de solicitudes: ${res.status} ${res.statusText}`
      );
    }
    const requestData = await res.json();
    console.log(requestData);

    return Array.isArray(requestData.data)
      ? requestData.data.filter((item) => item !== null)
      : [];
  }

  //Fetch del contrato:
  const handleViewContract = async (requestId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}user/request/${requestId}`, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "auth-token": token,
        },
      });
      if (!response.ok) {
        setReply({
          value: `Error al obtener el contrato ${response.message}`,
          color: "text-red",
        });
      }
      console.log("OK");
      const blob = await response.blob(); // Transforma la respuesta en un BLOB (Binary Large OBject) que es el PDF
      /* Creamos una URL local para que el navegador acceda como nueva URL para poder abrirla despues en una pestaña */
      const url = window.URL.createObjectURL(blob);

      /* Damos la orden al navegador de abrir nuestra nueva URL, con titulo "_blank"
      Se añade los parámetros:
       · noopener -> Para aumentar seguridad, evitamos que la nueva pestaña pueda manipular la ventana original (Evita ataques dónde se cambia la página)
       · noreferrrer -> Es también por seguridad, evita que sea rastreada y muestre el origen de la URL que hizo la solicitud. Evitando información sensible (que la tiene, siendo un contrato) 
       */
      window.open(url, "_blank", "noopener,noreferrer");

      /* Limpiamos nuestro servidor de esta URL temporal, de forma que no consuma recursos y libere memoria
         el usuario aún tendrá en la memoria de su navegador el PDF por lo tanto no le afecta liberar la URL */
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      setReply({
        value: `Error al obtener el contrato ${error.message}`,
        color: "text-red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = (transferEmail, reqAnimalName, applicantName) => {
    const subject = encodeURIComponent(`Consulta sobre ${reqAnimalName}`);
    const body = encodeURIComponent(
      `Hola! soy ${applicantName}, \n Me gustaría saber en que estado se encuentra mi solicitud en Spot My Pet`
    );
    return `mailto:${transferEmail}?subject=${subject}&body=${body}`;
  };

  //Switch para establecer el mensaje
  function ReqStatus(requestStatus) {
    switch (requestStatus) {
      case "accepted":
        return "✅ Aceptada";
      case "refused":
        return "❌ Rechazada";
      default:
        return "❓ Pendiente";
    }
  }

  //Función de estilo
  function AnimalType(requestAnimalType, requestAnimalBreed) {
    switch (requestAnimalType) {
      case "Perros":
        return "🐶 Perro";
      case "Gatos":
        return "🐱 Gato";
      case "Roedores":
        return "🐰🐹 Roedor";
      case "Aves":
        return "🦜 Ave";
      default:
        //Si está como especie: "Otros", estará especificado en la raza
        return `🐾 ${requestAnimalBreed}`;
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="flex flex-col justify-start min-h-screen py-6">
        <UserPanel />
        <div className="w-full h-2 bg-pink-dark shadow"></div>
        <div className="w-full flex flex-col gap-2 justify-center align-center">
          <h2 className="text-center text-blue-dark text-2xl mt-1">
            Estado de solicitudes enviadas
          </h2>
          {requestReceipts === true ? <RequestReceipt /> : <></>}

          <hr className="w-full flex flex-wrap gap-2 justify-center align-center " />
          <div className="flex flex-wrap justify-center">
            {isLoggedIn ? (
              requests.map((request) => (
                <div
                  className="w-1/2 flex justify-center align-center m-1 flex-wrap bg-pink-dark rounded-xl shadow-xl p-2 text-white text-sm text-center items-center md:mx-20 md:text-lg md:w-1/2"
                  key={request._id}
                >
                  <div className="flex-auto min-w-0 p-1">
                    <div className="flex-auto min-w-0 p-1 ">
                      <span className="font-bold mr-2 italic">Nombre: </span>
                      <span>{request.reqAnimalName}</span>
                    </div>
                    <div className="flex-auto min-w-0 p-1 ">
                      <span className="font-bold italic">Tipo: </span>
                      <span>
                        {AnimalType(
                          request.reqAnimalSpecie,
                          request.reqAnimalBreed
                        )}
                      </span>
                    </div>
                    <div className="flex-auto min-w-0 p-1">
                      <span className="font-bold italic">Raza: </span>
                      <span>{request.reqAnimalBreed}</span>
                    </div>
                    <div className="flex-auto min-w-0 p-1">
                      <span className="font-bold italic">Cedente: </span>
                      <span>{request.transferName}</span>
                    </div>
                    <div className="flex-auto min-w-0 ml-1 p-1">
                      <span className="font-bold italic">Provincia: </span>
                      <span>{request.transferProvince}</span>
                    </div>
                    <div className="flex justify-center min-w-0 p-1">
                      <a
                        href={handleContact(
                          request.transferEmail,
                          request.reqAnimalName,
                          request.applicantName
                        )}
                      >
                        <button className="bg-blue-dark p-2 rounded-full text-m transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-white-light hover:text-blue-dark duration-300">
                          📧 Contactar
                        </button>
                      </a>
                    </div>
                    <div className="flex min-w-0 ml-1 p-1 justify-center">
                      <div className="bg-blue-dark px-5 rounded-xl content-center shadow-xl flex flex-col justify-center item-center text-center md:w-1/2">
                        <span className="font-bold italic">
                          Estado de solicitud:{" "}
                        </span>
                        <span>{ReqStatus(request.status)}</span>
                        {request.status === "accepted" ? (
                          <div>
                            <button
                              className="bg-greenL text-l md:text-xl justify-end rounded-xl my-2 md:rounded-full text-white-light md:p-1 mb-2 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-white-light hover:text-greenL duration-300"
                              onClick={() => handleViewContract(request._id)}
                              disabled={isLoading}
                            >
                              Ver contrato de adopción 😻
                            </button>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <p className="text-3xl text-red text-center underline">
                  Inicie sesion para mostrar resultados de este panel
                </p>
              </div>
            )}
          </div>
        </div>
        <div>
          <p className={`${reply.color} text-center`}>{reply.value}</p>
        </div>
        <hr className="mt-5 border-blue-light border border-double" />

        <div className="flex flex-col mt-5">
          <div className="w-5/6 flex justify-center w-full">
            <p className="p-2 bg-blue-lightest text-blue-dark rounded-full text-center mx-1 shadow-xl">
              Si tienes alguna duda con el estado de tu solicitud, te
              recomendamos contactar con el cedente o actual propietario del
              animal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
