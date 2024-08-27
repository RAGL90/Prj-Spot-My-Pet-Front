import React from "react";
import ReactDOM from "react-dom";

export default function ModalScreen({ isOpen, children, onClose }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      //Si el usuario hace clic fuera del modal, sale.
      onClose();
    }
  };

  return ReactDOM.createPortal(
    // Creamos un overlay (una pantalla sobre la principal) con un manejador de eventos
    // Si hace clic fuera del div "hijo" se ejecuta la función OverlayClick
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Creamos el div que contendra el modal, con stopPropagation para evitar que se cree un bucle de eventos*/}
      <div
        className="bg-white rounded-lg shadow-lg relative max-w-sm w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 m-0.5 text-3xl text-red"
          >
            &times;
          </button>
        </div>
        <div className="pt-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}
