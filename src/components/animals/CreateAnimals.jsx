import React, { useEffect, useState } from "react";
import ModalScreen from "../ModalScreen";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { object, string } from "yup";
import { BASE_URL } from "@/core/config/configDev";

export default function CreateAnimals() {
  //              ********** Declaraciones y funciones para ventana Modal ***********
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  //                ----------                  Fin ventana Modal         ----------

  //                  ***********              Area de Formulario             ***********

  /*
  Explicación de UseState "animalSpecie":

  Necesitamos guardar la especie del animal dado que el formulario y sus requisitos se modifica:
    Si es un perro, el creador necesita añadir su tamaño, es un punto crítico para los usuarios conocer este detalle.
    Sin embargo, en otros tipos de animales, el tamaño no es decisivo e incluso no tiene sentido colocarlo, por lo que:

      1º Creamos useState de animalSpecie.
      2º Usamos un handler que será llamado en el selector ("select").
      3º El handler setea el hook en el valor indicado (perros), e indicar el valor a Formik para actualizar el cambio.
      4º El validador de YUP establece si size es obligatorio según este hook.
      5º Usamos el render de Formik para renderizar el formulario en función de los cambios proporcionados, hay que hacerlo antes del
      etiquetado de <Form>

  */
  const [animalSpecie, setAnimalSpecie] = useState("");
  const [isLoading, setIsLoading] = useState(false); //Iniciamos el fetch
  const [isSuccess, setIsSuccess] = useState(false); //Se modifica solo cuando el fetch se produce con éxito
  const [animalId, setAnimalId] = useState(""); //Lo necesitaremos para enviarselo "mascado" al componente de PhotoUpload.jsx

  const handleChangeSpecie = (e, setFieldValue) => {
    const { value } = e.target;
    setAnimalSpecie(value); //Guardamos en el useState el valor
    setFieldValue("specie", value); //Aseguramos a Formik que proceda con el cambio al valor
  };

  const validationSchemaYup = object({
    specie: string()
      .required("Indicar la especie para clasificar correctamente a la mascota")
      .oneOf(
        ["Perros", "Gatos", "Roedores", "Aves", "Otros"],
        "Especie no válida, seleccione una de las opciones disponibles"
      ),
    // size: string().notRequired(),
    size:
      animalSpecie === "Perros"
        ? string().required("Para los perros es obligatorio indicar el tamaño")
        : string().notRequired(),
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

  const saveAnimal = async (values) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const animal = { ...values };
    //Revisamos que esté todo:
    console.log(animal);

    try {
      const response = await fetch(BASE_URL + "user/animal", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "auth-token": token,
          accept: "*/*",
        },
        body: JSON.stringify(animal),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Error durante la creación del animal: status: ${response.status}
          Mensaje: ${data.message}
          Error: ${data.error}`);
      }

      console.log("Animal creado correctamente ", data);
      //Respuesta afirmativa guardamos el useState
      setAnimalId(data.animalId);
    } catch (error) {
      console.log(error);
    } finally {
      //Aqui entrará independientemente de que haya "Try" o haya "catch" de un error:
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (animalId) {
      console.log("Nuevo animalId: ", animalId);
      setIsSuccess(true); // Cambia el estado para indicar éxito después de actualizar el ID
    }
  }, [animalId]);

  return (
    <div>
      <button
        className="rounded-full bg-pink-dark shadow-xl text-white-light p-2 mb-2 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-blue-medium duration-300"
        onClick={() => handleOpenModal()}
      >
        🐾 ¡Poner animal en adopción!
      </button>
      <ModalScreen isOpen={isModalOpen} onClose={handleCloseModal}>
        {!isSuccess ? (
          <div className="flex flex-col text-blue-dark mb-5">
            <div className="text-center text-pink-dark">
              <h1 className="text-2xl">Registrar mascota</h1>
              <div className="p-3">
                <p className="italic">
                  Recuerda que siendo usuario sólo puedes añadir:
                  <p className="underline font-bold py-1">
                    {" "}
                    3 animales por año
                  </p>
                  Con el fin de mejorar la visibilidad de las protectoras y
                  evitar posibles abusos de los usuarios.
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
                  {({ setFieldValue }) => (
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
                          onChange={(e) => handleChangeSpecie(e, setFieldValue)}
                        >
                          <option value="">
                            *Selecciona especie del animal
                          </option>
                          <option value="Perros">Perro</option>
                          <option value="Gatos">Gato</option>
                          <option value="Roedores">Roedor</option>
                          <option value="Aves">Ave</option>
                          <option value="Otros">Otra especie</option>
                        </Field>
                        <ErrorMessage
                          name="specie"
                          component="div"
                          className="bg-pink-dark rounded text-red-500 text-sm mt-1"
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
                          placeholder="*Nombre de la mascota"
                          className="text-blue-dark p-2 rounded"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      {/* Gender */}
                      <div className="flex flex-col mb-4">
                        <label htmlFor="gender" className="mb-2 text-xl">
                          Género:
                        </label>
                        <Field
                          as="select"
                          name="gender"
                          className="text-blue-dark p-2 rounded"
                        >
                          <option value="">
                            *Selecciona género o sexo del animal
                          </option>
                          <option value="hembra">♀ Hembra</option>
                          <option value="macho">♂ Macho </option>
                        </Field>
                        <ErrorMessage
                          name="gender"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      {/* Size - Este campo solo se activará si se selecciona perro */}
                      {animalSpecie === "Perros" && (
                        <div className="flex flex-col mb-4">
                          <label htmlFor="size" className="mb-2 text-xl">
                            Tamaño del animal:
                          </label>
                          <div className="text-sm text-justify">
                            <hr className="border-blue-light" />
                            <ul>
                              <li className="py-1">
                                <b>Grande</b>: Más de 25Kg o más de 60cm (desde
                                el suelo a la espalda)
                              </li>
                              <li className="py-1">
                                <b>Mediano</b>: Entre 10 y 25Kg o entre los 35cm
                                a 60cm
                              </li>
                              <li className="py-1">
                                <b>Pequeño</b>: Por debajo de 10Kg e inferior a
                                35 cm
                              </li>
                            </ul>
                            <hr className="border-blue-light mb-3" />
                          </div>
                          <Field
                            as="select"
                            name="size"
                            className="text-blue-dark p-2 rounded"
                          >
                            <option value="">
                              * Selecciona tamaño del perro
                            </option>
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
                      )}

                      {/* Breed */}
                      <div className="flex flex-col mb-4">
                        <label htmlFor="breed" className="text-xl mb-2">
                          Raza del animal:
                        </label>
                        <Field
                          type="text"
                          name="breed"
                          placeholder="*Indicar raza del animal"
                          className="text-blue-dark p-2 rounded"
                        />
                        <ErrorMessage
                          name="breed"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      {/* mainColor */}
                      <div className="flex flex-col mb-4">
                        <label htmlFor="mainColor" className="text-xl mb-2">
                          Color principal:
                        </label>
                        <Field
                          type="text"
                          name="mainColor"
                          placeholder="*Indicar el color más destacable del animal"
                          className="text-blue-dark p-2 rounded"
                        />
                        <ErrorMessage
                          name="physicFeatures"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      {/* PhysicFeatures */}
                      <div className="flex flex-col mb-4">
                        <label
                          htmlFor="physicFeatures"
                          className="text-xl mb-2"
                        >
                          Características físicas:
                        </label>
                        <Field
                          type="text"
                          name="physicFeatures"
                          placeholder="*Ej: Patas delanteras negras"
                          className="text-blue-dark p-2 rounded"
                        />
                        <ErrorMessage
                          name="physicFeatures"
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
                          className="text-blue-dark p-2 rounded"
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
                        <p className="italic mb-2 text-sm">
                          (Indicar cifras del chip si se dispone, o
                          identificacion interna para protectoras)
                        </p>
                        <Field
                          type="text"
                          name="numberID"
                          placeholder="(No es obligatorio)"
                          className="text-blue-dark p-2 rounded"
                        />
                        <ErrorMessage
                          name="numberID"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      {/* Birthdate */}
                      <div className="flex flex-col mb-4">
                        <label htmlFor="birthDate" className="text-xl">
                          Fecha de nacimiento:
                        </label>
                        <p className="italic mb-2 text-sm">
                          (En caso de no conocer la fecha, indicar una fecha
                          aproximada)
                        </p>
                        <Field
                          type="text"
                          name="birthDate"
                          placeholder="*Ej: 21/12/1999"
                          className="text-blue-dark p-2 rounded"
                        />
                        <ErrorMessage
                          name="birthDate"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      {/* Description */}
                      <div className="flex flex-col mb-4">
                        <label htmlFor="description" className="mb-2 text-xl">
                          Descripción del animal:
                        </label>
                        <Field
                          type="text"
                          name="description"
                          placeholder="* Indicar su comportamiento o caracter"
                          className="text-blue-dark p-2 rounded"
                        />
                        <ErrorMessage
                          name="description"
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
                  )}
                </Formik>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="w-full text-2xl text-blue-dark text-center">
              <p>¡Animal creado con éxito!</p>
            </div>
            <button
              onClick={() => {
                handleCloseModal();
                // Aquí podrías también llamar a un método para abrir el próximo módulo/componente para subir fotos.
              }}
            >
              Continuar para añadir fotos
            </button>
          </div>
        )}
      </ModalScreen>
    </div>
  );
}
