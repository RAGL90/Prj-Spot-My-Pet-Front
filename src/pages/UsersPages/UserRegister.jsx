import Navbar from "@/components/Navbar";
import UserFormikReg from "@/components/users/UserFormikReg";
import Image from "next/image";
import React from "react";

//https://formik.org/docs/api/formik

export default function UserRegister() {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-background pb-7">
        <Navbar />
      </div>
      <hr className="border-1 border-blue-lightest" />
      <div>
        <h1 className="bg-pink-softest text-2xl text-blue-medium text-center p-1">
          Inscríbete para adoptar a tu nueva mascota
        </h1>
        <h3 className="bg-pink-dark text-xl text-white-bright text-center py-1">
          ¡Conoce nuestras normas!
        </h3>

        <div className="bg-pink-dark text-base text-white-bright text-justify py-1 pl-2 font-Comfortaa flex justify-center">
          <div className="w-5/6 md:w-1/2">
            <ul className="list-disc leading-normal">
              <li>
                Las asociaciones o protectoras, y aquellos usuarios que cedan al
                animal, se reservan el derecho de aceptar o denegar las
                solicitudes con total libertad.
              </li>
              <li>
                Con el fin de evitar abusos y proporcionar más prioridad a las
                protectoras, los usuarios tienen un límite de:<br></br>
                <b>
                  Tres adopciones y tres inscripciones de animales para adoptar
                  anuales.
                </b>
              </li>
              <li>
                Aquellos usuarios que deseen realizar una solicitud de adopción,{" "}
                <u>
                  están obligados legalmente a proporcionar sus datos correctos.
                </u>
                <br></br>
                <p className="text-sm text-center py-2">
                  *Estos datos solo serán utilizados exclusivamente para las
                  protectoras y usuarios receptores de la solicitud con el fin
                  de la evaluación y gestión de la solicitud de adopción, para
                  finalmente generar un contrato de adopción.
                </p>
              </li>
            </ul>
            <h2 className="text-xl text-center">
              <u>Registrándote te comprometes a respetar estas normas</u>
            </h2>
          </div>
        </div>
        {/*Comienzo de Registro - Nuevo Usuario con Formik */}
        <div className="bg-blue-lightest text-blue-dark flex flex-col md:flex-row justify-center ">
          <div className="flex items-center justify-center py-4 animate-pulse md:pr-4 md:justify-end md:py-0">
            <Image
              src="/imageComponents/registerImage.svg"
              alt="Registrate y adopta a tus mascota"
              width={600}
              height={700}
              className="w-1/2 justify-center object-contain md:w-full"
            />
          </div>
          <div>
            <UserFormikReg />
          </div>
        </div>
      </div>
    </div>
  );
}
