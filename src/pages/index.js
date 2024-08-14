import React from "react";

//Componentes Propios
import AnimalLoad from "@/components/AnimalLoad";
import Navbar from "@/components/Navbar";
import UserPanel from "@/components/users/UserPanel";

export default function Home() {
  return (
    <div className="bg-background">
      <Navbar />
      <div className="flex flex-col justify-start min-h-screen  py-6">
        <UserPanel />
        <div className="w-full my-1 bg-pink-dark">
          <h2>Animal</h2>
        </div>
        <main className="w-full max-w-sm mx-auto my-4">
          {/* Botones o enlaces del menú aquí */}
        </main>
        <AnimalLoad />
      </div>
    </div>
  );
}
