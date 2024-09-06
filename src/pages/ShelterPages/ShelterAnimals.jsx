import Navbar from "@/components/Navbar";
import ShelterPanel from "@/components/shelters/ShelterPanel";
import ShelterFetchAnimals from "@/components/shelters/ShelterFetchAnimals";
import { BASE_URL } from "@/core/config/configDev";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ShelterAnimals() {
  const isShelterLoggedIn = useSelector(
    (state) => state.shelterLogin.isShelterLoggedIn
  ); // Verificamos si la protectora está logueada
  return (
    <div className="bg-background">
      <Navbar />
      <div className="flex flex-col justify-start min-h-screen text-blue-dark text-center text-3xl">
        <ShelterPanel />
        {isShelterLoggedIn ? (
          <div>
            <ShelterFetchAnimals />
          </div>
        ) : (
          <p className="text-red text-2xl text-center">
            Error 404 - Lo lamentamos pero no disponemos de nada para mostrar
          </p>
        )}
      </div>
    </div>
  );
}
