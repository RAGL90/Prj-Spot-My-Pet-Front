import React, { useState } from "react";
import ModalScreen from "../ModalScreen";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { date, object, string } from "yup";

const provincias = [
  "Álava",
  "Albacete",
  "Alicante",
  "Almería",
  "Asturias",
  "Ávila",
  "Badajoz",
  "Barcelona",
  "Burgos",
  "Cáceres",
  "Cádiz",
  "Cantabria",
  "Castellón",
  "Ciudad Real",
  "Córdoba",
  "La Coruña",
  "Cuenca",
  "Gerona",
  "Granada",
  "Guadalajara",
  "Guipúzcoa",
  "Huelva",
  "Huesca",
  "Jaén",
  "León",
  "Lérida",
  "Lugo",
  "Madrid",
  "Málaga",
  "Murcia",
  "Navarra",
  "Orense",
  "Palencia",
  "Las Palmas",
  "Pontevedra",
  "La Rioja",
  "Salamanca",
  "Segovia",
  "Sevilla",
  "Soria",
  "Tarragona",
  "Santa Cruz de Tenerife",
  "Teruel",
  "Toledo",
  "Valencia",
  "Valladolid",
  "Vizcaya",
  "Zamora",
  "Zaragoza",
  "Mallorca",
  "Menorca",
  "Ibiza",
  "Formentera",
  "Ceuta",
  "Melilla",
];

export default function CreateAnimals() {
  //********** Declaraciones y funciones para ventana Modal ***********
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  //----------                                            ----------

  //***********              Area de Formulario             ***********
  const validationSchemaYup = object({
    specie: string()
      .required("Indicar la especie para clasificación")
      .oneOf(
        ["Perros", "Gatos", "Roedores", "Aves", "Otros"],
        "Especie no válida, seleccione una de las opciones disponibles"
      ),
    size: string().when("specie", {
      is: "Perros",
      then: string()
        .oneOf(["Pequeño", "Mediano", "Grande"], "tamaño no válido")
        .required("Para los perros es obligatorio indicar el tamaño"),
      otherwise: string().notRequired(),
    }),
    name: string()
      .required("Indicar nombre del animal")
      .min(2, "Al menos debe tener dos carácteres")
      .max(
        15,
        "El nombre es excesivamente largo ¿Estas seguro de que es su nombre?"
      ),
    hairType: string().required(
      "Indicar el tipo y tamaño del pelo, Ej: corto fino, sin pelo, etc."
    ),
    numberID: string().notRequired(),
    breed: string().required(
      "La raza del animal es obligatoria para facilitar la búsqueda"
    ),
    birthDate: date().required(
      "Indicar fecha de nacimiento del animal, en caso de no conocerla indicar una aproximada Ej: 31/01/2024"
    ),
    physicFeatures: string().notRequired(),
    gender: string()
      .required("Por favor, indique el sexo o género del animal")
      .oneOf(["hembra", "macho"]),
    mainColor: string().required(
      "Indicar el color principal del pelaje del animal, si no tiene pelaje indicar - 'Sin pelaje' o 'piel'"
    ),
    description: string().required(
      "Indicar una descripcion más detallada del animal como el comportamiento o carácter"
    ),
    //En las protectoras incluir cost, y urgent.
  });

  const saveAnimal = (values) => {
    alert(JSON.stringify(values));
  };

  return (
    <div>
      <button
        className="rounded-full bg-pink-dark shadow-xl text-white-light p-2 mb-2 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-blue-medium duration-300"
        onClick={() => handleOpenModal()}
      >
        🐾 ¡Poner animal en adopción!
      </button>
      <ModalScreen isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="flex flex-col text-blue-dark mb-5">
          <div className="text-center">
            <h1 className="text-2xl">Añadir animal</h1>
            <div className="p-3">
              <p className="italic">
                Recuerda que siendo usuario sólo puedes añadir:
                <p className="underline font-bold py-1"> 3 animales por año</p>
                Con el fin de mejorar la visibilidad de las protectoras y evitar
                posibles abusos de los usuarios.
              </p>
            </div>
            <hr className="border-pink-dark" />
            <div className="w-max bg-blue-dark">
              <Formik
                initialValues={{
                  specie: "",
                  size: "",
                  name: "",
                  gender: "",
                  hairType: "",
                  numberID: "",
                  birthDate: "",
                  physicFeatures: "",
                  mainColor: "",
                  description: "",
                }}
                onSubmit={(values) => {
                  saveAnimal(values);
                }}
              ></Formik>
            </div>
          </div>
        </div>
      </ModalScreen>
    </div>
  );
}
