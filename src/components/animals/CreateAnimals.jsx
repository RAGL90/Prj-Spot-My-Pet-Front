import React, { useState } from "react";
import ModalScreen from "../ModalScreen";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { object, string } from "yup";

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
      is: (value) => value === "Perros",
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
    birthDate: string()
      .required(
        "Indicar fecha de nacimiento del animal, en caso de no conocerla indicar una aproximada"
      )
      .matches(
        /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/,
        "La fecha debe estar en el formato día/mes/año o DD/MM/YYYY. Ej: 31/12/2021"
      ),
    //Con regex se "fuerza" el formateo del día para proporcionar una fecha correcta
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
    // Hacer el fetch
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
          <div className="text-center text-pink-dark">
            <h1 className="text-2xl">Registrar mascota</h1>
            <div className="p-3">
              <p className="italic">
                Recuerda que siendo usuario sólo puedes añadir:
                <p className="underline font-bold py-1"> 3 animales por año</p>
                Con el fin de mejorar la visibilidad de las protectoras y evitar
                posibles abusos de los usuarios.
              </p>
            </div>
            <hr className="border-pink-dark" />
            <div className="w-full bg-blue-dark flex flex-col items-center justify-center text-white">
              {/*                                      EMPIEZA FORMULARIO CON FORMIK */}
              <Formik
                initialValues={{
                  specie: "",
                  size: "",
                  name: "",
                  hairType: "",
                  numberID: "",
                  breed: "",
                  birthDate: "",
                  physicFeatures: "",
                  gender: "",
                  mainColor: "",
                  description: "",
                }}
                onSubmit={(values) => {
                  saveAnimal(values);
                }}
                validationSchema={validationSchemaYup}
              >
                <Form className="w-full max-w-lg p-5">
                  {/* Specie */}
                  <div className="flex flex-col mb-4">
                    <label htmlFor="specie" className="mb-2 text-xl">
                      Especie de la mascota:
                    </label>
                    <Field
                      as="select"
                      name="specie"
                      className="text-blue-dark p-2 rounded"
                    >
                      <option value="">Selecciona especie del animal</option>
                      <option value="Perros">Perro</option>
                      <option value="Gatos">Gato</option>
                      <option value="Roedores">Roedor</option>
                      <option value="Aves">Ave</option>
                      <option value="Otros">Otra especie</option>
                    </Field>
                    <ErrorMessage
                      name="specie"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  {/* Name */}
                  <div className="flex flex-col mb-4">
                    <label htmlFor="name" className="mb-2 text-xl">
                      Nombre:
                    </label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Nombre de la mascota"
                      className="p-2 rounded"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  {/* Size */}
                  <div className="flex flex-col mb-4">
                    <label htmlFor="size" className="mb-2 text-xl">
                      Tamaño del animal:
                    </label>
                    <div className="text-sm text-justify">
                      <hr className="border-blue-light" />
                      <ul>
                        <li>
                          <b>Grande</b>: Más de 25Kg o más de 60cm desde el
                          suelo a la espalda
                        </li>
                        <li>
                          <b>Mediano</b>: Entre 10 y 25Kg o de 35 a 60cm desde
                          el suelo a la espalda
                        </li>
                        <li>
                          <b>Pequeño</b>: Por debajo de 10Kg e inferior a 35 cm
                          de espalda al suelo
                        </li>
                      </ul>
                      <hr className="border-blue-light mb-3" />
                    </div>
                    <Field
                      as="select"
                      name="size"
                      className="text-blue-dark p-2 rounded"
                    >
                      <option value="">Selecciona especie del animal</option>
                      <option value="Grande">Grande</option>
                      <option value="Mediano">Mediano</option>
                      <option value="Pequeño">Pequeño</option>
                    </Field>
                    <ErrorMessage
                      name="size"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  {/* HairType */}
                  <div className="flex flex-col mb-4">
                    <label htmlFor="hairType" className="mb-2 text-xl">
                      Tipo de pelaje:
                    </label>
                    <Field
                      type="text"
                      name="hairType"
                      placeholder="*Indicar tipo de pelaje ('ninguno' si no tiene)"
                      className="p-2 rounded"
                    />
                    <ErrorMessage
                      name="hairType"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  {/* numberID */}
                  <div className="flex flex-col mb-4">
                    <label htmlFor="numberID" className="text-xl">
                      Número de identificación:
                    </label>
                    <p className="italic mb-2">
                      (Este campo no es obligatorio)
                    </p>
                    <Field
                      type="text"
                      name="numberID"
                      placeholder="Indicar cifras del chip identificativo o ID propio"
                      className="p-2 rounded"
                    />
                    <ErrorMessage
                      name="numberID"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  {/* Breed */}
                  <div className="flex flex-col mb-4">
                    <label htmlFor="breed" className="text-xl mb-2">
                      Raza del animal:
                    </label>
                    <Field
                      type="text"
                      name="breed"
                      placeholder="Indicar raza del animal"
                      className="p-2 rounded"
                    />
                    <ErrorMessage
                      name="breed"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  {/* Birthdate */}
                  <div className="flex flex-col mb-4">
                    <label htmlFor="birthDate" className="text-xl">
                      Fecha de nacimiento:
                    </label>
                    <p className="italic mb-2">
                      (En caso de no conocer la fecha, indicar una fecha
                      aproximada)
                    </p>
                    <Field
                      type="text"
                      name="birthDate"
                      placeholder="Ej: 21/12/1999"
                      className="p-2 rounded"
                    />
                    <ErrorMessage
                      name="birthDate"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  {/* PhysicFeatures */}
                  <div className="flex flex-col mb-4">
                    <label htmlFor="physicFeatures" className="text-xl mb-2">
                      Características físicas:
                    </label>
                    <Field
                      type="text"
                      name="physicFeatures"
                      placeholder="Ej: Patitas negras, mancha canela en cabeza"
                      className="p-2 rounded"
                    />
                    <ErrorMessage
                      name="physicFeatures"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
                  >
                    Crear animal
                  </button>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </ModalScreen>
    </div>
  );
}
