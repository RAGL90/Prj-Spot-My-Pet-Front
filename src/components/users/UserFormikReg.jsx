import { BASE_URL } from "@/core/config/configDev";
import { Field, Form, Formik, useFormikContext } from "formik";
import React, { useState } from "react";

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

//Función de placeholder dinámico en función de la respuesta tipoNIF
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

export default function UserFormikReg() {
  const [reply, setReply] = useState({ value: "", color: "" });

  const saveUser = async (values) => {
    const user = {
      ...values,
    };
    console.log("Datos del usuario: " + user);
    try {
      const response = await fetch(BASE_URL + "user/signup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      console.log("Respuesta del servidor: ", data);
      if (response.ok) {
        setReply({
          value: "Usuario registrado correctamente",
          color: "text-greenL",
        });
      } else {
        setReply({
          value: `Error en el registro: 
          ${data.message}
          ${data.error}`,
          color: "text-red",
        });
      }
    } catch (error) {
      console.error("Error al enviar el formulario: ", error);
      setReply({
        value: `Error en el registro, la conexión ha sido rechazada por el servidor`,
        color: "text-red",
      });
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          email: "",
          pswd: "",
          tipoNIF: "",
          NIF: "",
          birth: "",
          name: "",
          lastname: "",
          province: "",
          locality: "",
          address: "",
          phone: "",
          typeHouse: "",
          ownHouse: "",
          gardenWall: "",
        }}
        onSubmit={(values) => {
          //Enviamos  el objeto User al handler
          saveUser(values);
        }}
      >
        <Form className="my-3 rounded-xl border shadow-xl p-2 max-w-md">
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
              <span>Contraseña: </span>
            </div>
            <div className="w-3/4 min-w-[150px]">
              <Field
                type="password"
                name="pswd"
                placeholder="Contraseña"
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
                Las siguientes preguntas son para evaluar el domicilio dónde
                viviría el animal
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
            <div className="w-1/4 min-w-[150px] text-right">
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
              className="w-1/3 text-xl bg-white-bright rounded-full border border-pink-dark hover:bg-blue-dark hover:text-white shadow-xl"
            >
              Regístrate
            </button>
          </div>
          <div>
            <p className={`${reply.color} text-center`}>{reply.value}</p>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
