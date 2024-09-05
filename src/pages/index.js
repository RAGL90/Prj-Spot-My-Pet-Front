import React from "react";
//Componentes Propios
import AnimalLoad from "@/components/AnimalLoad";
import Navbar from "@/components/Navbar";
import UserPanel from "@/components/users/UserPanel";

export default function Home() {
  return (
    <div className="bg-background">
      <Navbar />
      <div className="flex flex-col justify-start min-h-screen py-3">
        <UserPanel />
        <div className="w-full h-2 bg-pink-dark shadow"></div>
        <main className="w-full max-w-sm mx-auto">
          {/* Botones o enlaces del menú aquí */}
        </main>
        <AnimalLoad />
      </div>
    </div>
  );
}
