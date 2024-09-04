import React, { useEffect, useState } from "react";
import ModalScreen from "../ModalScreen";

export default function RequestReceipt() {
  //********************************AREA DE VENTANA MODAL******************************/
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  //******************************** FIN - AREA DE VENTANA MODAL ******************************/

  return (
    <div className="text-center">
      <button
        className="w-auto text-blue-dark bg-blue-lightest p-2 rounded-full"
        onClick={() => handleOpenModal()}
      >
        Ver solicitudes Recibidas
      </button>
      <ModalScreen isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="text-blue-dark">
          <h1 className="bg-blue-dark text-2xl text-center text-white my-2">
            Solicitudes Recibidas
          </h1>
        </div>
      </ModalScreen>
    </div>
  );
}
