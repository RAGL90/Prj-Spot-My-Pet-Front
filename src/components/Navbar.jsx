import React, { useEffect, useState } from "react";
import Image from "next/image";
import UserLogin from "@/auth/UserLogin";
import ShelterLogin from "@/auth/ShelterLogin";
import ModalScreen from "./ModalScreen";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showShelterLogin, setShowShelterLogin] = useState(false);

  //********************************* FRASES DE CABECERA ****************************************/
  //Estados para modificar la frase en el Navbar
  const [fraseActual, setFraseActual] = useState(0);
  const [fade, setFade] = useState(true);

  // Array de frases a mostrar:
  const frases = [
    "Tu nuevo amigo te está esperando",
    "Cambia una vida, adopta una mascota",
    "Únete a la aventura de adoptar",
    "¡Encuentra y adopta a tu próximo mejor amigo!",
  ];

  // Función para cambiar entre frases de cabecera
  useEffect(() => {
    //Cambiamos de frases cada 10 segundos
    const interval = setInterval(() => {
      //Ocultamos la frase actual:
      setFade(false);

      //Pasamos a la siguiente frase, y un retraso para que emita el desvanecimiento
      setTimeout(() => {
        //Cambia de frase, incrementa en uno, pero sin salirse del indice del array
        setFraseActual(
          (prevFraseActual) => (prevFraseActual + 1) % frases.length
        );
        //Con la nueva frase, activamos el fade y que aparezca.
        setFade(true);
      }, 500); // 0,5 segundos para el efecto Fade In.
    }, 10000); // 10 segundos para el cambio de frase

    // Limpiamos el intervalo cuando el componente cambie
    return () => clearInterval(interval);
  }, [frases.length]); // Regenera el intervalo cuando la frase cambia

  //********************************* CONTROL DE VENTANA MODAL LOGIN ****************************************/
  //Boton de cerrar el modal, o clic en el exterior del modal
  const closeModal = () => {
    setShowUserLogin(false);
    setShowShelterLogin(false);
  };

  //Este handler es llamado cuando el usuario tiene éxito en iniciar sesion
  const handleLoginSuccess = () => {
    //Cerramos ventana modal en caso de éxito de los dos:
    setShowUserLogin(false);
    setShowShelterLogin(false);
  };

  // Función que maneja la apertura del modal de Usuarios
  const openUserLogin = () => {
    // Si el modal de protectoras está abierto, lo cerramos.
    if (showShelterLogin) {
      setShowShelterLogin(false);
    }
    // Y abrimos login de usuarios.
    setShowUserLogin(true);
  };

  // Función que maneja la apertura del modal de Protectoras
  const openShelterLogin = () => {
    // Si el modal de usuarios está abierto, lo cerramos.
    if (showUserLogin) {
      setShowUserLogin(false);
    }
    // Luego abrimos el modal de protectoras.
    setShowShelterLogin(true);
  };

  return (
    <nav className="bg-background h-[125px] flex justify-between pt-2 px-4 sticky top-0 z-50 border-b-2 border-b-blue-medium">
      <div className="flex md:w-full">
        <Link href="/" passHref>
          <div className="max-h-[80px] w-[150px]">
            <Image
              src="/Spot My Pet logo.svg"
              alt="Spot My Pet logo"
              width={150}
              height={50}
              layout="responsive"
              objectFit="fill"
            />
          </div>
        </Link>
        {/* El siguiente div le incluimos la transicion si hay fade le damos opacidad, si no se la quitamos para que "desaparezca" la frase */}
        <div
          className={`transition-opacity items-center duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          } w-full flex justify-center text-center p-5 md:width`}
        >
          <p className="text-xl md:text-4xl font-Comfortaa text-pink-medium text-center md:w-full">
            {frases[fraseActual]}
          </p>
        </div>
      </div>
      <div className="hidden md:flex md:flex-col font-Comfortaa">
        <div className="hidden md:flex md:pt-5 space-x-4 font-Comfortaa">
          <button
            onClick={openUserLogin}
            className="text-xl text-center text-pink-dark"
          >
            👤Usuarios
          </button>
          <button
            onClick={openShelterLogin}
            className="text-xl text-center text-pink-dark"
          >
            🫂Protectoras
          </button>
        </div>
      </div>
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="text-pink-dark">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="absolute top-16 left-0 w-full flex flex-col z-50 rounded items-center md:hidden">
          <div className="w-full">
            <button
              onClick={openUserLogin}
              className="w-full block text-center text-white-bright bg-pink-dark rounded-full border border-white py-2"
            >
              Usuario
            </button>
          </div>
          <div className="w-full">
            <button
              onClick={openShelterLogin}
              className="w-full block text-center text-white-bright bg-pink-dark rounded-full border border-white py-2"
            >
              Protectoras
            </button>
          </div>
          <div className="w-full">
            <a
              href="#"
              className="block text-center border border-white bg-pink-dark rounded-full text-white-bright py-2"
            >
              Contacto
            </a>
          </div>
        </div>
      )}
      <ModalScreen
        isOpen={showUserLogin || showShelterLogin}
        onClose={closeModal}
      >
        {showUserLogin && <UserLogin onLoginSuccess={handleLoginSuccess} />}
        {showShelterLogin && (
          <ShelterLogin onLoginSuccess={handleLoginSuccess} />
        )}
      </ModalScreen>
    </nav>
  );
}
