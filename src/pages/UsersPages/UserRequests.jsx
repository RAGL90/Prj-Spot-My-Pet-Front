import { BASE_URL } from "@/core/config/configDev";
import React, { useEffect, useState } from "react";

export default function UserRequests() {
  const [requests, setRequests] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  async function fetchRequests() {
    const res = await fetch(`${BASE_URL}user/request`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "auth-token": token,
      },
    });
    if (!res.ok) {
      throw new Error(`Error durante la carga de solicitudes: ${res.status}
            ${res.error.message}`);
    }

    const requestData = await res.json();
    return requestData.data;
  }

  useEffect(() => {
    async function loadUserRequests() {
      try {
        const fetchedRequests = await fetchRequests;
        setRequests(fetchedRequests);
      } catch (error) {
        console.error(
          "Fallo durante la carga de solicitudes de adopcion del usuario:",
          error
        );
        setRequests([]); // Si hay error, se crea un array vacío
      }
    }
    loadUserRequests();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {requests.map((request) => (
        <div key={request._id}>
          <p>{request.reqAnimalName}</p>
        </div>
      ))}
    </div>
  );
}
