import { BASE_URL } from "@/core/config/configDev";
import { Field, Form, Formik, useFormikContext } from "formik";
import React from "react";

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

      if (!response.ok) {
        throw new Error("Conexión rechazada por el servidor");
      }
      const data = await response.json();
      console.log("Respuesta del servidor: ", data);
    } catch (error) {
      console.error("Error al enviar el formulario: ", error);
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
        <Form className="my-3">
          <div className="m-1">
            <span className="w-1/2">Email: </span>
            <Field
              type="text"
              name="email"
              placeholder="Correo Electrónico"
              className="ml-1 pl-1 w-1/2 border border-blue-dark rounded"
            />
          </div>
          <div className="m-1">
            <span>Contraseña: </span>
            <Field
              type="password"
              name="pswd"
              placeholder="Contraseña"
              className="ml-1 pl-1 w-1/2 border border-blue-dark rounded"
            />
          </div>
          <div className="m-1">
            <span>Tipo de NIF: </span>
            <Field
              as="select"
              name="tipoNIF"
              className="ml-1 pl-1 w-1/2 border border-blue-dark rounded"
            >
              <option value=""> Selecciona... </option>
              <option value="DNI">DNI</option>
              <option value="NIE">NIE</option>
            </Field>
          </div>
          <div className="m-1">
            <span>NIF: </span>
            <DynamicPlaceholderNIF
              name="NIF"
              type="text"
              className="ml-1 pl-1 w-1/2 border border-blue-dark rounded"
            />
          </div>
          <div className="m-1">
            <span>Fecha de nacimiento: </span>
            <Field
              type="text"
              name="birth"
              placeholder="ej: 31/01/2024"
              className="ml-1 pl-1 w-1/2 border border-blue-dark rounded"
            />
          </div>
          <div className="m-1">
            <span>Nombre: </span>
            <Field
              type="text"
              name="name"
              placeholder="Tu nombre"
              className="ml-1 pl-1 w-1/2 border border-blue-dark rounded"
            />
          </div>
          <div className="m-1">
            <span>Apellidos: </span>
            <Field
              type="text"
              name="lastname"
              placeholder="Tus apellidos"
              className="ml-1 pl-1 w-1/2 border border-blue-dark rounded"
            />
          </div>
          <div className="m-1">
            <span>Provincia: </span>
            <Field
              as="select"
              name="province"
              className="ml-1 pl-1 w-1/2 border border-blue-dark rounded"
            >
              <option value=""> Selecciona una provincia</option>
              {provincias.map((provincia) => (
                <option key={provincia} value={provincia}>
                  {provincia}
                </option>
              ))}
            </Field>
          </div>
          <div className="m-1">
            <span>Localidad: </span>
            <Field
              type="text"
              name="locality"
              className="ml-1 pl-1 w-1/2 border border-blue-dark rounded"
            />
          </div>
          <div className="m-1">
            <span>Dirección: </span>
            <Field
              type="text"
              name="address"
              placeholder="Tu dirección completa - Código postal incluido"
              className="ml-1 pl-1 w-1/2 border border-blue-dark rounded"
            />
          </div>
          <div className="m-1">
            <span>Teléfono: </span>
            <Field
              type="text"
              name="phone"
              placeholder="Ej: 654321987 (Sin prefijo)"
              className="ml-1 pl-1 w-1/2 border border-blue-dark rounded"
            />
          </div>
          <div className="my-3 m-1">
            <p className="text-pink-dark text-center">
              <b>
                Las siguientes preguntas son para evaluar las condiciones dónde
                viviría el animal
              </b>
            </p>
          </div>
          <div className="m-1">
            <span>Tipo de domicilio: </span>
            <Field
              as="select"
              name="typeHouse"
              className="ml-1 pl-1 w-1/2 border border-blue-dark rounded"
            >
              <option value="-"> Selecciona... </option>
              <option value="Piso">Piso</option>
              <option value="Chalet">Chalet</option>
              <option value="Casa">Casa</option>
              <option value="Otro">Otro</option>
            </Field>
          </div>
          <div className="m-1">
            <span>¿Es su propio domicilio? </span>
            <Field
              as="select"
              name="ownHouse"
              className="ml-1 pl-1 w-1/2 border border-blue-dark rounded"
            >
              <option value="-"> Seleccionar...</option>
              <option value="Propio">Domicilio propio</option>
              <option value="Alquiler">Alquiler</option>
              <option value="Otro">Otra forma</option>
              <option value="-">No deseo facilitarlo</option>
            </Field>
          </div>
          <div className="m-1">
            <p>
              (En caso de disponer jardín propio) <br></br> ¿Se encuentra
              vallado o amurallado?
            </p>
            <Field
              as="select"
              name="gardenWall"
              className="ml-1 pl-1 w-1/2 border border-blue-dark rounded"
            >
              <option value="false">Seleccionar...</option>
              <option value="true">Sí</option>
              <option value="false">No</option>
              <option value="false">No deseo facilitarlo</option>
            </Field>
          </div>
          <div className="flex justify-center mb-2">
            <button
              type="submit"
              className="w-1/3 text-xl bg-background rounded border border-pink-dark"
            >
              Registrarse!
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
