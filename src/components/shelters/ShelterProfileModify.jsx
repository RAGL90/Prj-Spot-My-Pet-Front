import React, { useEffect, useState } from "react";
import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import { object, string, array, url } from "yup";
import { BASE_URL } from "@/core/config/configDev";
import ModalScreen from "../ModalScreen";

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

export default function ShelterProfileModify({ shelter, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reply, setReply] = useState({ value: "", color: "" });

  const [shelterId, setShelterId] = useState("");

  //FETCH EN MODO PATH PARA SHELTER
  const saveShelter = async (values) => {
    console.log("SE INTENTA FETCH");

    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
    const shelterNewData = { ...values }; // Asegúrate de que shelter.id es el ID correcto a usar

    try {
      const response = await fetch(`${BASE_URL}shelter/panel/${shelter._id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "auth-token": token,
          accept: "*/*",
        },
        body: JSON.stringify(shelterNewData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `Error durante la modificación: ${response.status}, ${data.message}, ${data.error}`
        );
      }

      console.log("Perfil modificado correctamente ", data);
      setReply({ value: data.message, color: "text-greenL" });
      setIsSuccess(true);
    } catch (error) {
      console.log("Error modificando el perfil: ", error);
      setReply({ value: error.message, color: "text-red" });
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  //En caso de respuesta satisfactoria en el fetch:
  useEffect(() => {
    // Creamos un timer de 2 segundos, para que el usuario pueda leer el mensaje:

    if (isSuccess) {
      const timer = setTimeout(() => {
        //Vaciamos el mensaje
        setReply({ value: "", color: "" });

        //Dejamos isSucces a false
        setIsSuccess(false);
        onClose();
      }, 2000);

      // Limpieza para evitar problemas en caso de que el componente se desmonte antes de que el temporizador termine
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  //Validador de Datos en Yup para Formik:
  const validationSchemaYup = object({
    email: string().required("Indicar el email."),
    name: string()
      .required("Indicar nombre de la Asociación")
      .min(3, "Debe tener al menos tres caracteres")
      .max(50, "El nombre es demasiado largo"),
    tipoNif: string().notRequired().oneOf(["DNI", "NIE", "CIF", ""]),
    NIF: string().notRequired(),
    province: string().required("Es necesario la provincia").oneOf(provincias),
    locality: string().required("Es necesario la localidad"),
    address: string().required("Es obligatorio indicar la dirección"),
    phone: string()
      .required("Se requiere un número de teléfono")
      .matches(/^[679]\d{8}$/, "Número de teléfono inválido"),
    web: string().notRequired(),
    socialMedia: array().of(string().url("Debe ser una URL válida")),
  });

  return (
    <div className="text-blue-dark">
      <div className="bg-blue-dark py-1">
        <h1 className="text-2xl text-center text-white my-2">
          Protectora: {shelter.name}
        </h1>
      </div>
      <div className="flex justify-center rounded-xl p-2">
        <Formik
          initialValues={{
            email: shelter.email,
            tipoNIF: shelter.tipoNIF,
            NIF: shelter.NIF,
            name: shelter.name,
            province: shelter.province,
            locality: shelter.locality,
            address: shelter.address,
            phone: shelter.phone,
            web: shelter.web || "",
            socialMedia: shelter.socialMedia || [""],
          }}
          validationSchema={validationSchemaYup}
          onSubmit={(values, actions) => {
            console.log("Intentando enviar datos:", values); // Log para verificar los datos
            saveShelter(values)
              .then(() => {
                actions.setSubmitting(false); // Cambiar estado de submitting
              })
              .catch((err) => {
                console.error("Error al actualizar", err);
                actions.setSubmitting(false); // Manejar error y restablecer el estado
              });
          }}
          validateOnChange={true} // Validar en cada cambio
          validateOnBlur={true} // Validar al perder foco
        >
          {/* Con esto obligamos a actualizar a Formik cuando se cambia shelter */}
          {({ values }) => (
            <Form className="bg-pink-softest my-3 rounded-xl border shadow-xl p-2 max-w-md">
              {/* EMAIL */}
              <div className="flex flex-col justify-between items-center m-1">
                <div className="w-1/12 min-w-[150px] text-center font-bold">
                  <span>Email: </span>
                </div>
                <div className="w-full">
                  <Field
                    type="text"
                    name="email"
                    placeholder="Correo Electrónico"
                    className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                  />
                </div>
              </div>
              {/* TipoNIF */}
              <div className="flex justify-between items-center m-1">
                <div className="w-1/4 min-w-[150px] text-right font-bold">
                  <span>Tipo de NIF: </span>
                </div>
                <div className="w-3/4 min-w-[150px] ">
                  <Field
                    as="select"
                    name="tipoNIF"
                    className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                  >
                    <option value=""> Seleccionar... </option>
                    <option value="CIF">CIF</option>
                    <option value="DNI">DNI</option>
                    <option value="NIE">NIE</option>
                  </Field>
                </div>
              </div>

              {/* NIF */}
              <div className="flex justify-between items-center m-1">
                <div className="w-1/4 min-w-[150px] text-right font-bold">
                  <span>NIF: </span>
                </div>
                <div className="w-3/4 min-w-[150px]">
                  <Field
                    type="text"
                    name="NIF"
                    placeholder="NIF (obligatorio)"
                    className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                  />
                </div>
              </div>
              {/* Nombre Protectora */}
              <div className="flex justify-between items-center m-1">
                <div className="w-1/4 min-w-[150px] text-right font-bold">
                  <span>Nombre: </span>
                </div>
                <div className="w-3/4 min-w-[150px]">
                  <Field
                    type="text"
                    name="name"
                    placeholder="Tu nombre"
                    className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                  />
                </div>
              </div>
              {/* Provincia */}
              <div className="flex justify-between items-center m-1">
                <div className="w-1/4 min-w-[150px] text-right font-bold">
                  <span>Provincia: </span>
                </div>
                <div className="w-3/4 min-w-[150px]">
                  <Field
                    as="select"
                    name="province"
                    className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                  >
                    <option value=""> Selecciona una provincia</option>
                    {provincias.map((provincia) => (
                      <option key={provincia} value={provincia}>
                        {provincia}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              {/* Localidad */}
              <div className="flex justify-between items-center m-1">
                <div className="w-1/4 min-w-[150px] text-right font-bold">
                  <span>Localidad: </span>
                </div>
                <div className="w-3/4 min-w-[150px]">
                  <Field
                    type="text"
                    name="locality"
                    placeholder="Tu localidad o municipio"
                    className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                  />
                </div>
              </div>
              {/* Dirección */}
              <div className="flex flex-col justify-between items-center my-3">
                <div className="w-auto min-w-[150px] text-right">
                  <span className="font-bold">Dirección </span>
                  <span className="italic">(indicar Código Postal) </span>
                </div>
                <div className="w-full min-w-[150px]">
                  <Field
                    type="text"
                    name="address"
                    placeholder="Dirección con Codigo Postal"
                    className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                  />
                </div>
              </div>
              {/* Teléfono */}
              <div className="flex justify-between items-center m-1">
                <div className="w-1/4 min-w-[150px] text-right font-bold">
                  <span>Teléfono: </span>
                </div>
                <div className="w-3/4 min-w-[150px]">
                  <Field
                    type="text"
                    name="phone"
                    placeholder="Ej: 654321987 (Sin prefijo)"
                    className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center m-1">
                <div className="w-3/4 min-w-[150px] text-center font-bold">
                  <span>Web de la asociación: </span>
                </div>
                <div className="w-3/4 min-w-[150px]">
                  <Field
                    type="text"
                    name="web"
                    placeholder="Si dispone (opcional)"
                    className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                  />
                </div>
              </div>

              {/* Campo especial para añadir las redes sociales */}
              <hr className="my-3" />
              <div>
                <h3 className="text-blue-dark text-center font-bold">
                  Redes Sociales:
                </h3>
                <FieldArray name="socialMedia">
                  {({ insert, remove, push }) => (
                    <div>
                      {values.socialMedia.length > 0 &&
                        values.socialMedia.map((social, index) => (
                          <div key={index} className="flex items-center my-2">
                            <Field
                              name={`socialMedia.${index}`}
                              placeholder="URL de la red social"
                              className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                            />
                            <button
                              type="button"
                              className="text-red ml-2"
                              onClick={() => remove(index)} // Función para eliminar un campo
                            >
                              Eliminar
                            </button>
                            <ErrorMessage
                              name={`socialMedia.${index}`}
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                        ))}
                      <div className="flex justify-center mb-3">
                        <button
                          type="button"
                          className="text-blue ml-1 mt-1 font-bold text-white px-2 bg-blue-dark rounded-xl hover:bg-white hover:text-blue-dark"
                          onClick={() => push("")} // Función para añadir un nuevo campo
                        >
                          Añadir otra red social
                        </button>
                      </div>
                    </div>
                  )}
                </FieldArray>
              </div>
              <hr />

              <div className="flex justify-center m-3">
                <button
                  type="submit"
                  disabled={isLoading} // Solo deshabilitado mientras se está enviando
                  className="w-auto px-2 text-xl bg-white-bright rounded-full border border-pink-dark hover:bg-greenL hover:text-white shadow-xl"
                >
                  {isLoading ? "Actualizando..." : "Actualizar perfil"}
                </button>
              </div>
              <div>
                <p className={`${reply.color} text-center`}>{reply.value}</p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
