import React, { useState } from "react";
import Image from "next/image";
import UserLogin from "@/auth/UserLogin";
import ModalScreen from "./ModalScreen";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);

  const handleLoginSuccess = () => {
    //Este handler es llamado cuando el usuario logue con éxito
    setShowUserLogin(false); //Fin de la ventana modal
  };

  return (
    <nav className="bg-background h-[110px] flex justify-between items-center px-4">
      <div className="flex items-center md:w-full">
        <Link href="/" passHref>
          <div className="max-h-[80px] w-[150px]">
            <Image
              src="/Spot My Pet logo.svg"
              alt="Spot My Pet logo"
              width={150}
              height={50}
              layour="fill"
              objectFit="contain"
            />
          </div>
        </Link>
        <div className="w-full flex justify-center text-center p-5 md:width">
          <h1 className="sm:text-l md:text-2xl font-Comfortaa text-pink-medium text-center md:w-full">
            ¡Encuentra y adopta a tu futuro mejor amigo!
          </h1>
        </div>
      </div>
      <div className="hidden md:flex space-x-4 font-Comfortaa">
        <button
          onClick={
            () => setShowUserLogin(true)
            //Activamos la ventana Modal
          }
          className="text-xl text-center text-pink-dark"
        >
          Usuarios
        </button>
        <a href="#" className="text-xl text-center text-pink-dark">
          Protectoras
        </a>
        <a href="#" className="text-xl text-pink-dark flex items-center">
          Contacto
        </a>
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
        <div className="absolute top-16 left-0 w-full bg-pink-dark flex flex-col  items-center md:hidden">
          <div className="w-full">
            <a
              href="#"
              className="block text-center text-white-bright border border-white py-2"
            >
              Inicio
            </a>
          </div>
          <div className="w-full">
            <button
              onClick={() => setShowUserLogin(true)}
              className="w-full block text-center text-white-bright border border-white py-2"
            >
              Usuarios
            </button>
          </div>
          <div className="w-full">
            <a
              href="#"
              className="block text-center border border-white text-white-bright py-2"
            >
              Protectoras
            </a>
          </div>
          <div className="w-full">
            <a
              href="#"
              className="block text-center border border-white border-b-blue-light text-white-bright py-2"
            >
              Contacto
            </a>
          </div>
        </div>
      )}
      <ModalScreen
        isOpen={showUserLogin}
        onClose={() => setShowUserLogin(false)}
      >
        {/* Le pasamos al UserLogin la función del modal para cuando se active cerrarlo */}
        <UserLogin onLoginSuccess={handleLoginSuccess} />
      </ModalScreen>
    </nav>
  );
}
