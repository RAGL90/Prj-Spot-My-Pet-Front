import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { object, string, boolean } from "yup";
import { BASE_URL } from "@/core/config/configDev";
import UploadPhoto from "@/components/animals/UploadPhoto";

export default function ShelterCreateAnimals({ onClose }) {
  const [animalSpecie, setAnimalSpecie] = useState(""); // Para manejar la especie
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [animalId, setAnimalId] = useState(""); // Necesario para subir las fotos
  const [reply, setReply] = useState({ value: "", color: "" }); // Para mensajes de error o éxito

  const handleChangeSpecie = (e, setFieldValue) => {
    const { value } = e.target;
    setAnimalSpecie(value);
    setFieldValue("specie", value);
  };

  // Esquema de validación con Yup
  const validationSchemaYup = object({
    specie: string()
      .required("Indicar la especie para clasificar correctamente a la mascota")
      .oneOf(
        ["Perros", "Gatos", "Roedores", "Aves", "Otros"],
        "Especie no válida, seleccione una de las opciones disponibles"
      ),
    size:
      animalSpecie === "Perros"
        ? string().required("Para los perros es obligatorio indicar el tamaño")
        : string().notRequired(),
    name: string()
      .required("Indicar nombre del animal")
      .min(2, "Al menos debe tener dos carácteres")
      .max(15, "El nombre es excesivamente largo"),
    hairType: string().required("Indicar el tipo y tamaño del pelo"),
    numberID: string().notRequired(),
    breed: string().required("La raza del animal es obligatoria"),
    birthDate: string()
      .required("Indicar fecha de nacimiento, o aproximada")
      .matches(
        /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/,
        "La fecha debe estar en formato DD/MM/YYYY. Ej: 31/12/2021"
      ),
    physicFeatures: string().notRequired(),
    gender: string()
      .required("Por favor, indique el sexo del animal")
      .oneOf(["hembra", "macho"]),
    mainColor: string().required("Indicar el color principal del pelaje"),
    description: string().required("Describa el comportamiento o carácter"),
    cost: string().notRequired(),
    urgent: boolean().notRequired(),
  });

  const saveAnimal = async (values) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const animal = { ...values };

    try {
      const response = await fetch(BASE_URL + "shelter/animal", {
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
        setReply({ value: `Error: ${data.message}`, color: "text-red-500" });
        throw new Error(`Error: ${data.message}`);
      }

      // Éxito en la creación
      setAnimalId(data.animalId);
      setReply({
        value: "Animal creado correctamente",
        color: "text-green-500",
      });
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!isSuccess ? (
        <div className="flex flex-col text-blue-dark mb-5 ">
          <div className="text-center text-pink-dark">
            <h1 className="text-2xl my-5 text-blue-dark">Registrar mascota</h1>
            <hr className="border-pink-dark" />

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
                cost: "",
                urgent: false,
              }}
              onSubmit={(values) => saveAnimal(values)}
              validationSchema={validationSchemaYup}
            >
              {({ setFieldValue }) => (
                <Form className="w-full max-w-lg p-5 bg-blue-dark text-white">
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
                      <option value="">*Selecciona especie del animal</option>
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
                            <b>Grande</b>: Más de 25Kg o más de 60cm (desde el
                            suelo a la espalda)
                          </li>
                          <li className="py-1">
                            <b>Mediano</b>: Entre 10 y 25Kg o entre los 35cm a
                            60cm
                          </li>
                          <li className="py-1">
                            <b>Pequeño</b>: Por debajo de 10Kg e inferior a 35
                            cm
                          </li>
                        </ul>
                        <hr className="border-blue-light mb-3" />
                      </div>
                      <Field
                        as="select"
                        name="size"
                        className="text-blue-dark p-2 rounded"
                      >
                        <option value="">* Selecciona tamaño del perro</option>
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
                    <label htmlFor="physicFeatures" className="text-xl mb-2">
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
                      (Indicar cifras del chip si se dispone, o identificacion
                      interna para protectoras)
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
                  {/* Cost */}
                  <div className="flex flex-col mb-4">
                    <label htmlFor="cost" className="mb-2 text-xl">
                      Costes de adopción:
                    </label>
                    <Field
                      type="text"
                      name="cost"
                      placeholder="Indicar los costes de adopción, sin simbolo"
                      className="text-blue-dark p-2 rounded"
                    />

                    <ErrorMessage
                      name="cost"
                      component="div"
                      className="text-white bg-red text-xs mt-1 rounded"
                    />
                  </div>
                  {/* Urgente */}
                  <div className="flex flex-col mb-4">
                    <label htmlFor="urgent" className="mb-2 text-xl">
                      ¿Adopción urgente?
                    </label>
                    <p>(La mascota se mostrará de forma prioritaria)</p>
                    <Field
                      as="select"
                      name="urgent"
                      className="text-blue-dark p-2 rounded"
                    >
                      <option value="false">No</option>
                      <option value="true">Sí, es urgente</option>
                    </Field>
                    <ErrorMessage
                      name="cost"
                      component="div"
                      className="text-white bg-red text-xs mt-1 rounded"
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
      ) : (
        <div>
          <div className="w-full text-2xl text-blue-dark text-center pb-2">
            <p>¡Mascota registrada con éxito! ✅</p>
            <p className="text-sm">
              Ahora añade sus fotos si las tienes a mano.
            </p>
            <hr />
          </div>
          <UploadPhoto animalId={animalId} />
        </div>
      )}
    </div>
  );
}
