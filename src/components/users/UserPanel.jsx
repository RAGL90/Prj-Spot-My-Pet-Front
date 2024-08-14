//Este panel solo se activará cuando redux indique que el estado es true en el logueo de usuario
import React from "react";
import { useDispatch, useSelector } from "react-redux"; //useDispatch para logout
import { logout } from "./LoginActions";

export default function UserPanel() {
  //Declaraciones de REDUX:
  const dispatch = useDispatch();
  //Guardamos en constante el estado actual de Redux
  const isLoggedIn = useSelector((state) => state.login.userLog);

  //Funcion de Logout
  const handleLogOut = () => {
    //En el log out eliminamos los tokens y hacemos desaparecere el panel del usuario
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    //Disparamos estado logout en redux
    dispatch(logout());
  };

  if (!isLoggedIn) {
    //Si el usuario no está logueado este componente no se muestra
    return null;
  }

  return (
    <div className="md:flex space-x-4 font-Comfortaa justify-between">
      <a href="/" className="text-xl text-center text-pink-dark">
        🐱🐶 Mis animales
      </a>
      <a href="/" className="text-xl text-center text-pink-dark">
        📝 Estado de solicitudes
      </a>
      <a href="/" className="text-xl text-center text-pink-dark">
        👤 Ver / Modificar perfil
      </a>
      <button onClick={handleLogOut} className="text-xl text-pink-dark">
        🔓 Desconectar
      </button>
    </div>
  );
}
