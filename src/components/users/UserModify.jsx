import React, { useEffect, useState } from "react";
import { Formik, Field, Form, useFormikContext, ErrorMessage } from "formik";
import { object, string, boolean } from "yup";
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

export default function UserModify(props) {
  //Animal para el formulario y onClose para cerrar el modal.
  const { user } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reply, setReply] = useState({ value: "", color: "" });

  const [userId, setUserId] = useState("");

  //********************************AREA DE VENTANA MODAL******************************/
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setUserId(user._id);
  }, []);
  //******************************** FIN - AREA DE VENTANA MODAL ******************************/

  //Esta función modifica el placeholder en función del tipo de NIF que inserta el usuario,
  const DynamicPlaceholderNIF = ({ name, ...props }) => {
    const { values } = useFormikContext();
    const tipoNIF = values.tipoNIF;

    let placeholder = "";
    if (tipoNIF === "DNI") {
      placeholder = "01234567A";
    } else if (tipoNIF === "NIE") {
      placeholder = "X0134567A";
    }

    return <Field {...props} name={name} placeholder={placeholder} />;
  };

  //Esto es para convertir los datos de fecha de UTC a Local, y viceversa (ignoramos horas, minutos etc...)
  const UTCtoLocalDate = (animalBirth) => {
    const date = new Date(animalBirth);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses en JavaScript empiezan en 0
    const year = date.getFullYear();
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  //FETCH EN MODO PATH PARA USER
  const saveUser = async (values) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const userNewData = { ...values, id: userId };
    console.log("FETCH INICIADO");

    try {
      const response = await fetch(BASE_URL + "user/user-panel", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "auth-token": token,
          accept: "*/*",
        },
        body: JSON.stringify(userNewData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Error durante la modificación del usuario: status: ${response.status}
          Mensaje: ${data.message}
          Error: ${data.error}`);
      }

      console.log("Usuario modificado correctamente ", data);

      setReply({ value: data.message, color: "text-greenL" });

      //Respuesta afirmativa guardamos el useState
      setUserId(data.userId);
      setIsSuccess(true);
    } catch (error) {
      console.log(error);
      setIsSuccess(false);
      setReply({ value: error.message, color: "text-red" });
    } finally {
      //Aqui entrará independientemente de que haya "Try" o haya "catch" de un error:
      setIsLoading(false);
    }
  };

  //En caso de respuesta satisfactoria en el fetch:
  useEffect(() => {
    // Creamos un timer de 2 segundos, para que el usuario pueda leer el mensaje:

    if (isSuccess) {
      const timer = setTimeout(() => {
        //Llamada a la función fethUser de UserProfile (padre)
        props.refreshUserData();

        //Cerramos la ventana modal
        handleCloseModal();

        //Vaciamos el mensaje
        setReply({ value: "", color: "" });

        //Dejamos isSucces a false
        setIsSuccess(false);
      }, 2000);

      // Limpieza para evitar problemas en caso de que el componente se desmonte antes de que el temporizador termine
      return () => clearTimeout(timer);
    }
  }, [isSuccess, props, handleCloseModal]);

  //Validador de Datos en Yup para Formik:
  const validationSchemaYup = object({
    email: string().required(
      "Indicar el email, recuerda que es tu principal punto de contacto en la plataforma"
    ),
    birth: string()
      .required("Indicar fecha de nacimiento")
      .matches(
        /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/,
        "La fecha debe estar en el formato día/mes/año o DD/MM/YYYY. Ej: 31/12/2021"
      ),
    name: string()
      .required(
        "Indicar nombre real del usuario, es necesario para el contrato de adopción"
      )
      .min(3, "Al menos debe tener tres carácteres")
      .max(
        15,
        "El nombre es excesivamente largo ¿Estas seguro de que es su nombre?"
      ),
    lastname: string()
      .required(
        "Indicar apellido real del usuario, es necesario para el contrato de adopción"
      )
      .min(3, "Al menos debe tener tres carácteres")
      .max(
        15,
        "El apellido es excesivamente largo ¿Estas seguro de que es su apellido?"
      ),
    tipoNif: string().notRequired().oneOf(["DNI", "NIE", ""]),
    NIF: string().notRequired(),
    province: string()
      .required(
        "Indicar la provincia, necesario para ubicar a los animales que puedas crear en la plataforma"
      )
      .oneOf(provincias),
    locality: string().required(
      "Es necesario para afinar la dirección del domicilio, que será facilitada a las protectoras y para establecer el contrato de adopción"
    ),
    address: string().required(
      "Es obligatorio indicar la dirección, muchas protectoras lo requieren para hacer un seguimiento del estado de los animales"
    ),
    phone: string()
      .required(
        "El teléfono será utilizado exclusivamente para protectoras o usuarios, que solicites adopción"
      )
      .matches(
        /^[679]\d{8}$/,
        "No es necesario indicar +34, en caso de número extranjero contacte con nosotros"
      ),
    typeHouse: string()
      .notRequired()
      .oneOf(["Piso", "Chalet", "Casa", "Otro", "-"]),
    ownHouse: string().notRequired().oneOf(["Propia", "Alquiler", "-"]),
    gardenWall: boolean().notRequired(),
  });

  return (
    <div className="text-center pt-1">
      <div>
        <button
          className="rounded-full bg-blue-dark shadow-xl text-white-light text-2xl p-2 mb-2 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-blue-medium duration-300"
          onClick={() => handleOpenModal()}
        >
          📝 Editar Perfil
        </button>
      </div>
      <ModalScreen isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="text-blue-dark">
          <h1 className="bg-blue-dark text-2xl text-center text-white my-2">
            Modificando el usuario: {user.name}
          </h1>
          <div className="flex justify-center rounded-xl p-2">
            <Formik
              initialValues={{
                email: user.email,
                tipoNIF: user.tipoNIF,
                NIF: user.NIF,
                birth: UTCtoLocalDate(user.birth),
                name: user.name,
                lastname: user.lastname,
                province: user.province,
                locality: user.locality,
                address: user.address,
                phone: user.phone,
                typeHouse: user.typeHouse,
                ownHouse: user.ownHouse,
                gardenWall: user.gardenWall,
              }}
              validationSchema={validationSchemaYup}
              onSubmit={(values) => {
                saveUser(values);
              }}
            >
              <Form className="bg-pink-softest my-3 rounded-xl border shadow-xl p-2 max-w-md">
                <div className="flex justify-between items-center m-1">
                  <div className="w-1/4 min-w-[150px] text-right">
                    <span>Email: </span>
                  </div>
                  <div className="w-3/4">
                    <Field
                      type="text"
                      name="email"
                      placeholder="Correo Electrónico"
                      className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center m-1">
                  <div className="w-1/4 min-w-[150px] text-right">
                    <span>Tipo de NIF: </span>
                  </div>
                  <div className="w-3/4 min-w-[150px] ">
                    <Field
                      as="select"
                      name="tipoNIF"
                      className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                    >
                      <option value=""> Seleccionar... </option>
                      <option value="DNI">DNI</option>
                      <option value="NIE">NIE</option>
                    </Field>
                  </div>
                </div>

                <div className="flex justify-between items-center m-1">
                  <div className="w-1/4 min-w-[150px] text-right">
                    <span>NIF: </span>
                  </div>
                  <div className="w-3/4 min-w-[150px]">
                    <DynamicPlaceholderNIF
                      name="NIF"
                      type="text"
                      className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center m-1">
                  <div className="w-1/4 min-w-[150px] text-right">
                    <span>Fecha de nacimiento: </span>
                  </div>
                  <div className="w-3/4 min-w-[150px]">
                    <Field
                      type="text"
                      name="birth"
                      placeholder="ej: 31/01/2024"
                      className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center m-1">
                  <div className="w-1/4 min-w-[150px] text-right">
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
                <div className="flex justify-between items-center m-1">
                  <div className="w-1/4 min-w-[150px] text-right">
                    <span>Apellidos: </span>
                  </div>
                  <div className="w-3/4 min-w-[150px]">
                    <Field
                      type="text"
                      name="lastname"
                      placeholder="Tus apellidos"
                      className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center m-1">
                  <div className="w-1/4 min-w-[150px] text-right">
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
                <div className="flex justify-between items-center m-1">
                  <div className="w-1/4 min-w-[150px] text-right">
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
                <div className="flex justify-between items-center m-1">
                  <div className="w-1/4 min-w-[150px] text-right">
                    <span>Dirección: </span>
                  </div>
                  <div className="w-3/4 min-w-[150px]">
                    <Field
                      type="text"
                      name="address"
                      placeholder="Dirección con Codigo Postal"
                      className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center m-1">
                  <div className="w-1/4 min-w-[150px] text-right">
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
                <div className="my-3 m-1">
                  <p className="text-pink-dark text-center">
                    <b>
                      Las siguientes preguntas son para evaluar el domicilio
                      dónde viviría el animal
                    </b>
                  </p>
                </div>
                <div className="flex justify-between items-center m-1">
                  <div className="w-1/4 min-w-[150px] text-right">
                    <span>Tipo de domicilio: </span>
                  </div>
                  <div className="w-3/4 min-w-[150px]">
                    <Field
                      as="select"
                      name="typeHouse"
                      className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                    >
                      <option value="-"> Seleccionar... </option>
                      <option value="Piso">Piso</option>
                      <option value="Chalet">Chalet</option>
                      <option value="Casa">Casa</option>
                      <option value="Otro">Otro</option>
                    </Field>
                  </div>
                </div>
                <div className="flex justify-between items-center m-1">
                  <div className="w-1/4 min-w-[150px] text-right">
                    <span>¿Es domicilio propio? </span>
                  </div>
                  <div className="w-3/4 min-w-[150px]">
                    <Field
                      as="select"
                      name="ownHouse"
                      className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                    >
                      <option value="-"> Seleccionar...</option>
                      <option value="Propio">Domicilio propio</option>
                      <option value="Alquiler">Alquiler</option>
                      <option value="Otro">Otra forma</option>
                      <option value="-">No deseo facilitarlo</option>
                    </Field>
                  </div>
                </div>
                <p className="my-4 mb-0 text-center">
                  En caso de disponer jardín propio
                </p>
                <div className="flex justify-between items-center m-1">
                  <div className="w-1/4 min-w-[150px] text-right mt-2">
                    <span>¿Está vallado o amurallado?</span>
                  </div>
                  <div className="w-3/4 min-w-[150px]">
                    <Field
                      as="select"
                      name="gardenWall"
                      className="ml-1 pl-1 w-full border border-blue-dark rounded-full shadow-xl hover:bg-white hover:border-red focus:outline-none focus:ring-1"
                    >
                      <option value="false">Seleccionar...</option>
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                      <option value="false">No deseo facilitarlo</option>
                    </Field>
                  </div>
                </div>
                <div className="flex justify-center m-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-auto px-2 text-xl bg-white-bright rounded-full border border-pink-dark hover:bg-blue-dark hover:text-white shadow-xl"
                  >
                    Actualizar perfil
                  </button>
                </div>
                <div>
                  <p className={`${reply.color} text-center`}>{reply.value}</p>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </ModalScreen>
    </div>
  );
}
