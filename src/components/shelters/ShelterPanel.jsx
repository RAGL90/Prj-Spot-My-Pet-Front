//Este panel solo se activará cuando redux indique que el estado es true en el logueo de usuario
import React from "react";
import { useDispatch, useSelector } from "react-redux"; //useDispatch para logout
import { logoutShelter } from "./Redux/ShelterLoginAction";

export default function ShelterPanel() {
  //Declaraciones de REDUX:
  const dispatch = useDispatch();
  //Guardamos en constante el estado actual de Redux
  const isShelterLoggedIn = useSelector(
    (state) => state.shelterLogin.isShelterLoggedIn
  );

  //Funcion de Logout
  const handleLogOut = () => {
    //En el log out eliminamos los tokens y hacemos desaparecere el panel del usuario
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    //Disparamos estado logout en redux
    dispatch(logoutShelter());
  };

  if (!isShelterLoggedIn) {
    //Si el usuario no está logueado este componente no se muestra
    return null;
  }

  return (
    <div className="flex flex-col mb-2 font-Comfortaa justify-center space-y-2 md:space-y-0 md:flex-row md:space-x-4 transition-opacity duration-300 bg-blue-dark py-2">
      <div className="w-auto bg-blue-lightest text-xl text-center text-blue-dark border rounded-full p-2 shadow hover:bg-blue-medium hover:text-white">
        <div>🐱🐶🐰🐹🦜</div>
        <a href="/ShelterPages/ShelterAnimals">Gestionar animales</a>
      </div>
      <div className="w-auto bg-blue-lightest text-xl text-center text-blue-dark border rounded-full p-2 shadow hover:bg-blue-medium hover:text-white">
        <div>📝</div>
        <a href="/ShelterPages/ShelterRequestPage">Ir a solicitudes</a>
      </div>
      <div className="w-auto bg-blue-lightest text-xl text-center text-blue-dark border rounded-full p-2 shadow hover:bg-blue-medium hover:text-white">
        <div>🫂</div>
        <a href="/ShelterPages/ShelterProfile">Ver / Modificar perfil</a>
      </div>
      <div className="w-auto bg-blue-lightest text-xl text-center text-blue-dark border rounded-full p-2 shadow hover:bg-blue-medium hover:text-white">
        <div>🔓</div>
        <button onClick={handleLogOut}> Desconectar</button>
      </div>
    </div>
  );
}
