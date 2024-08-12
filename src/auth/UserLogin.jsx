import { BASE_URL } from "@/core/config/configDev";
import React, { useContext, useState } from "react";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [pswd, setPassword] = useState("");
  const [reply, setReply] = useState({ value: "", color: "" });

  //Handler del botón de envío

  const handleSubmit = async (e) => {
    e.preventDefault();
    async function fetchLogin() {
      try {
        //FETCH en POST enviando JSON con "email" y "pswd" (datos que espera el back):
        const response = await fetch(`${BASE_URL}user/login`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ email, pswd }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Se ha recogido" + data.data.token);

          localStorage.setItem("token", data.data.token);
          localStorage.setItem("refreshToken", data.data.refreshToken);
          setReply({
            value: "Acceso autorizado",
            color: "text-blue-dark",
          });
          console.log("Acceso autorizado", data);
        } else {
          setReply({
            value: `Datos de usuario incorrecto ${data.message}`,
            color: "text-red",
          });
          console.log(
            "Conexión realizada, datos de usuario incorrectos",
            data.message
          );
        }
      } catch (error) {
        setReply({
          value: `Error de conexión: ${error.message}`,
          color: "text-red",
        });
        console.log("Problema de conexión al lanzar fetch: " + error.message);
      }
    }
    fetchLogin();
  };

  return (
    <div className="flex justify-center items-center p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-blue-dark text-sm font-bold p-2">
            Email:
          </label>
          <div className="border border-blue-medium rounded">
            <input
              type="email"
              id="email"
              className="w-full border-2 border-solid border-blue shadow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="text-lg text-blue-medium p-2">
          <label className="block text-blue-dark text-sm font-bold mb-2">
            Contraseña:
          </label>
          <div className="border border-blue-medium rounded">
            <input
              className="w-full text-blue-dark shadow"
              type="password"
              id="password"
              value={pswd}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="bg-pink-dark my-1 text-center rounded my-4">
          <button type="submit">Iniciar sesión</button>
        </div>
        <div className="flex space-x-4">
          <a href="/UsersPages/UserRegister" className="text-blue-dark text-sm">
            Registrarse
          </a>
          <a href="/" className="p-2 text-pink-medium text-sm">
            Olvidé la contraseña
          </a>
        </div>
        <div>
          <p className={`${reply.color} text-center mt-4`}>{reply.value}</p>
        </div>
      </form>
    </div>
  );
}
