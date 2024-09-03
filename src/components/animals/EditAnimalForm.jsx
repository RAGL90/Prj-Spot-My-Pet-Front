import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { object, string } from "yup";
import AnimalPhotoSlider from "../AnimalPhotoSlider";
import { BASE_URL } from "@/core/config/configDev";

export default function EditAnimalForm(props) {
  //Animal para el formulario y onClose para cerrar el modal.
  const { animal, onClose } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [animalSpecie, setAnimalSpecie] = useState(animal.specie);
  const [photos, setPhotos] = useState(animal.photo);
  const [animalId, setAnimalId] = useState("");

  useEffect(() => {
    setAnimalId(animal._id);
  }, [animal._id]);

  useEffect(() => {
    setAnimalSpecie(animal.specie); // Inicializa con el valor actual de la prop `animal`
  }, [animal.specie]); // Agrega una dependencia aquí para asegurarte de que se actualiza si cambia la prop

  const handleChangeSpecie = (e, setFieldValue) => {
    const { value } = e.target;
    setAnimalSpecie(value); //Guardamos en el useState el valor
    setFieldValue("specie", value); //Aseguramos a Formik que proceda con el cambio al valor
  };

  const UTCtoLocalDate = (animalBirth) => {
    const date = new Date(animalBirth);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses en JavaScript empiezan en 0
    const year = date.getFullYear();
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  const makeImagePrimary = (index) => {
    if (index !== 0) {
      const newPhotos = [...photos];
      const primaryPhoto = newPhotos.splice(index, 1)[0];
      newPhotos.unshift(primaryPhoto);
      setPhotos(newPhotos);
      console.log("El nuevo array de fotos es: " + newPhotos);
    }
  };

  const saveAnimal = async (values) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const animal = { ...values, photo: photos, id: animalId };

    try {
      const response = await fetch(BASE_URL + "user/animal", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "auth-token": token,
          accept: "*/*",
        },
        body: JSON.stringify(animal),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Error durante la modificación del animal: status: ${response.status}
          Mensaje: ${data.message}
          Error: ${data.error}`);
      }

      console.log("Animal modificado correctamente ", data);
      //Respuesta afirmativa guardamos el useState
      setAnimalId(data.animalId);
    } catch (error) {
      console.log(error);
      setIsSuccess(false);
    } finally {
      //Aqui entrará independientemente de que haya "Try" o haya "catch" de un error:
      setIsLoading(false);
    }
  };

  //Validador de Datos en Yup para Formik:
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

  return (
    <div className="text-center pt-1">
      <hr className="border-2 border-pink-dark" />
      <h1 className="text-2xl py-2">Modificando la mascota: {animal.name}</h1>
      <div className="bg-pink-softest flex justify-center rounded-xl p-2">
        <Formik
          initialValues={{
            specie: animal.specie,
            size: animal.size,
            name: animal.name,
            hairType: animal.hairType,
            numberID: animal.numberID,
            breed: animal.breed,
            birthDate: UTCtoLocalDate(animal.birthDate),
            physicFeatures: animal.physicFeatures,
            gender: animal.gender,
            mainColor: animal.mainColor,
            description: animal.description,
          }}
          enableReinitialize={true} //Nos permite que el usuario modifique otro animal directamente
          validationSchema={validationSchemaYup}
          onSubmit={(values) => {
            saveAnimal(values);
          }}
        >
          {({ setFieldValue }) => (
            <Form className="bg-pink-dark w-full max-w-lg p-5 border-2 border-blue-dark rounded-xl shadow-xl">
              <AnimalPhotoSlider
                animal={animal}
                nonResponsive={true}
                allowSetMainImage={true}
                onSetMainImage={makeImagePrimary}
              />
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
                  className="text-white bg-red text-xs mt-1 rounded"
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
                  className="text-white bg-red text-xs mt-1 rounded"
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
                  <option value="">*Selecciona género o sexo del animal</option>
                  <option value="hembra">♀ Hembra</option>
                  <option value="macho">♂ Macho </option>
                </Field>
                <ErrorMessage
                  name="gender"
                  component="div"
                  className="text-white bg-red text-xs mt-1 rounded"
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
                        <b>Grande</b>: Más de 25Kg o más de 60cm (desde el suelo
                        a la espalda)
                      </li>
                      <li className="py-1">
                        <b>Mediano</b>: Entre 10 y 25Kg o entre los 35cm a 60cm
                      </li>
                      <li className="py-1">
                        <b>Pequeño</b>: Por debajo de 10Kg e inferior a 35 cm
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
                    className="text-white bg-red text-xs mt-1 rounded"
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
                  className="text-white bg-red text-xs mt-1 rounded"
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
                  className="text-white bg-red text-xs mt-1 rounded"
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
                  className="text-white bg-red text-xs mt-1 rounded"
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
                  className="text-white bg-red text-xs mt-1 rounded"
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
                  className="text-white bg-red text-xs mt-1 rounded"
                />
              </div>
              {/* Birthdate */}
              <div className="flex flex-col mb-4">
                <label htmlFor="birthDate" className="text-xl">
                  Fecha de nacimiento:
                </label>
                <p className="italic mb-2 text-sm">
                  (En caso de no conocer la fecha, indicar una fecha aproximada)
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
                  className="text-white bg-red text-xs mt-1 rounded"
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
                  className="text-white bg-red text-xs mt-1 rounded"
                />
              </div>
              <div className="flex flex-col"></div>
              <button
                type="submit"
                className="bg-blue-medium text-white px-4 my-2 py-2 rounded-full hover:bg-blue-dark hover:text-white hover:font-bold md:mx-2"
              >
                Aceptar Cambios
              </button>
              <button
                type="button"
                className="bg-red-light hover:bg-red-dark hover:font-bold text-white p-2 rounded-full shadow-xl "
                onClick={() => onClose()}
              >
                ❌ Cancelar Cambios
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
