import Navbar from "@/components/Navbar";
import React from "react";
import { useSelector } from "react-redux";

export default function UserAnimalManage() {
  const isLoggedIn = useSelector((state) => state.login.userLog); // Verificamos si el usuario está logueado

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="flex flex-col justify-start min-h-screen py-6">
        <div className="w-full h-2 bg-pink-dark shadow">
          <div className="mt-4 text-center text-blue-dark">
            {isLoggedIn ? (
              <div>
                <p>Estás logueado</p>
              </div>
            ) : (
              <div>
                <p>No estás logueado!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
