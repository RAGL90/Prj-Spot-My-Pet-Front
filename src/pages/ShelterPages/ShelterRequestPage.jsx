import Navbar from "@/components/Navbar";
import RequestViewAction from "@/components/shelters/RequestViewAction";
import ShelterPanel from "@/components/shelters/ShelterPanel";
import ShelterRequest from "@/components/shelters/ShelterRequest";
import { BASE_URL } from "@/core/config/configDev";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ShelterRequestPage() {
  //1º En un UseEffect hacemos un fetch con todos los datos de la Protectora.
  //Guardar datos recibidos en un state:
  const [shelter, setShelter] = useState({});
  //Manejar los estados por si colocamos loaders:
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  //Manejo de mensajes para mostrar al usuario:
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState({ value: "", color: "" });
  const [color, setColor] = useState("");

  // Verificamos si la protectora está logueada
  const isShelterLoggedIn = useSelector(
    (state) => state.shelterLogin.isShelterLoggedIn
  );

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

  //Queremos que haga un fetch al perfil y setearlo para el manejo
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

  //Fetch del contrato:
  const handleViewContract = async (requestId) => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}shelter/request/${requestId}`, {
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

      const blob = await response.blob(); // Transformar la respuesta en un BLOB (Binary Large OBject) que es el PDF

      /* Creamos una URL local para que el navegador acceda como nueva URL para poder abrirla despues en una pestaña */
      const url = window.URL.createObjectURL(blob);

      /* Damos la orden al navegador de abrir nuestra nueva URL, con titulo "_blank"
      Se añade los parámetros:
       · noopener -> Para aumentar seguridad, evitamos que la nueva pestaña pueda manipular la ventana original (Evita ataques dónde se cambia la página)
       · noreferrrer -> Es también por seguridad, evita que sea rastreada y muestre el origen de la URL que hizo la solicitud. Evitando información sensible (que la tiene, siendo un contrato) 
       */
      window.open(url, "_blank", "noopener,noreferrer");

      /* Limpiamos nuestro servidor de esta URL temporal a 100 ms, de forma que no consuma recursos y libere memoria
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

  return (
    <div className="bg-background">
      <Navbar />
      <ShelterPanel />
      <div className="flex flex-col justify-start min-h-screen text-blue-dark text-center text-3xl">
        {isShelterLoggedIn ? (
          <div className="mt-10">
            <ShelterRequest fillRequestState={fillRequestState} />
          </div>
        ) : (
          <div>
            <p className="text-5xl">ERROR 404 : Esta página no existe</p>
          </div>
        )}
        <div>
          <p className="text-center text-2xl text-blue-dark my-5">
            {requests.length > 0 ? (
              <div>
                {status}: {requests.length}{" "}
              </div>
            ) : (
              <></>
            )}
          </p>
          {requests.length > 0 && (
            <div className="flex justify-center flex-wrap text-base gap-3">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className={`p-3 mx-5 my-3 rounded ${bgColor} shadow-xl`}
                >
                  <div className="mb-2 bg-white text-blue-dark px-2 rounded-xl">
                    <span className="font-bold">Estado: </span>
                    <span>
                      {request.status === "accepted"
                        ? "Aceptada ✅"
                        : request.status === "pending"
                        ? "Pendiente ❔"
                        : "Rechazada ❌"}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-bold">Mascota:</span>{" "}
                    {request.reqAnimalName}
                  </div>
                  <div className="mb-2">
                    <span className="font-bold">Raza:</span>{" "}
                    {request.reqAnimalSpecie}
                  </div>
                  <div className="mb-4">
                    <span className="font-bold">Solicitante:</span>{" "}
                    {request.applicantName} {request.applicantLastName}
                  </div>
                  <div>
                    {request.status === "accepted" ? (
                      <button
                        className="bg-white text-greenL px-1 rounded-xl font-bold hover:bg-blue-dark hover:text-white mb-3"
                        disabled={isLoading}
                        onClick={() => handleViewContract(request._id)}
                      >
                        Ver contrato de adopción
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                  <RequestViewAction request={request} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
