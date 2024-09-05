import React, { useState } from "react";
//Importación de RUTAS
import { BASE_URL } from "@/core/config/configDev";
import { useRouter } from "next/router";
//Importaciones de REDUX, solo vamos a usar -> login <- :
import { useDispatch } from "react-redux";
import { loginShelter } from "@/components/shelters/Redux/ShelterLoginAction";

export default function UserLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [pswd, setPassword] = useState("");
  const [reply, setReply] = useState({ value: "", color: "" });

  //Usamos router, en caso de éxito enviamos a la protectora a su panel
  const router = useRouter();

  //Declaraciones de REDUX:
  const dispatch = useDispatch();

  //Handler del botón de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    async function fetchLogin() {
      try {
        //FETCH en POST enviando JSON con "email" y "pswd" (datos que espera el back):
        console.log("Se intenta el fetch!");

        const response = await fetch(`${BASE_URL}shelter/login`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ email, pswd }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("refreshToken", data.data.refreshToken);
          setReply({
            value: "Acceso autorizado",
            color: "text-blue-dark",
          });
          //Disparamos acción login de REDUX
          dispatch(loginShelter());
          if (onLoginSuccess) {
            //Activamos la función heredada para provocar el cierre de la ventana modal
            onLoginSuccess();
            router.push("/ShelterPages/ShelterMenu");
          }
        } else {
          setReply({
            value: `Datos de usuario de protectora incorrecto ${data.message}`,
            color: "text-red",
          });
          console.log(
            "Conexión realizada, datos de usuario protectora incorrectos",
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
    <div className="flex flex-col justify-center items-center p-4">
      <h2 className="text-center text-blue-dark text-2xl mb-4">
        🫂 Acceso Protectoras
      </h2>
      <form className="w-5/6" onSubmit={handleSubmit}>
        <div>
          <div className="w-1/4 text-blue-dark font-bold">
            <label>Email:</label>
          </div>
          <div className="border border-blue-medium rounded">
            <input
              type="email"
              id="email"
              className="w-full border-2 border-solid border-blue shadow text-blue-dark rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="my-4">
          <div className="w-1/4 text-blue-dark font-bold">
            <label>Contraseña:</label>
          </div>
          <div className="border border-blue-medium rounded-lg">
            <input
              className="w-full text-blue-dark shadow rounded-lg"
              type="password"
              id="password"
              value={pswd}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="justify-center text-center my-4">
          <button
            type="submit"
            className="w-3/4 bg-pink-dark rounded-full hover:bg-blue-dark"
          >
            Iniciar sesión
          </button>
        </div>
        <div className="flex flex-row justify-between space-x-4">
          <div>
            {/* <a
              href="/UsersPages/UserRegister"
              className="text-blue-dark text-sm"
            >
              Registrarse
            </a> */}
          </div>
          <div>
            <a href="/" className="p-2 text-pink-medium text-sm">
              Olvidé la contraseña (ED)
            </a>
          </div>
        </div>
        <div>
          <p className={`${reply.color} text-center mt-4`}>{reply.value}</p>
        </div>
      </form>
    </div>
  );
}
