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
    <div className="flex flex-col mb-2 font-Comfortaa justify-center md:flex-row md:space-x-4 transition-opacity duration-300">
      <div className="w-auto bg-pink-softest text-xl text-center text-blue-dark border rounded-full p-2 shadow hover:bg-blue-medium hover:text-white">
        <a href="/UsersPages/UserAnimalManage">🐱🐶 Mis animales</a>
      </div>
      <div className="w-auto bg-pink-softest text-xl text-center text-blue-dark border rounded-full p-2 shadow hover:bg-blue-medium hover:text-white">
        <a href="/UsersPages/UserRequests">📝 Estado de solicitudes</a>
      </div>
      <div className="w-auto bg-pink-softest text-xl text-center text-blue-dark border rounded-full p-2 shadow hover:bg-blue-medium hover:text-white">
        <a href="/">👤 Ver / Modificar perfil</a>
      </div>
      <div className="w-auto bg-pink-softest text-xl text-center text-blue-dark border rounded-full p-2 shadow hover:bg-blue-medium hover:text-white">
        <button onClick={handleLogOut}>🔓 Desconectar</button>
      </div>
    </div>
  );
}
