import React, { useState } from "react";
//Componentes Propios
import AnimalLoad from "@/components/AnimalLoad";
import Navbar from "@/components/Navbar";
import UserPanel from "@/components/users/UserPanel";
import ShelterPanel from "@/components/shelters/ShelterPanel";

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

export default function Home() {
  //Creamos objeto para usarlo como query en la búsqueda de animales
  const [filters, setFilters] = useState({
    name: "",
    gender: "",
    specie: "",
    breed: "",
    size: "",
    specie: "",
    province: "",
  });

  // Función para manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="bg-background">
      <Navbar />
      <div className="flex flex-col justify-start min-h-screen">
        <UserPanel />
        <ShelterPanel />
        <div className="w-full bg-blue-light shadow p-4 text-blue-dark border-b-2 border-blue-dark">
          <form className="grid grid-cols-2 gap-4 lg:grid-cols-6 lg:gap-2 text">
            {/* Input para nombre */}
            <div className="flex flex-col">
              <label className="text-blue-dark font-bold" htmlFor="name">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                className="p-2 rounded"
                placeholder="Buscar por nombre"
              />
            </div>

            {/* Select para género */}
            <div className="flex flex-col">
              <label className="text-blue-dark font-bold" htmlFor="gender">
                Género
              </label>
              <select
                id="gender"
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="p-2 rounded"
              >
                <option value="">Todos</option>
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
            </div>

            {/* Input para breed */}
            <div className="flex flex-col">
              <label className="text-blue-dark font-bold" htmlFor="breed">
                Raza del animal
              </label>
              <input
                type="text"
                id="breed"
                name="breed"
                value={filters.breed}
                onChange={handleFilterChange}
                className="p-2 rounded"
                placeholder="Ej: Caniche, conejo, loro, etc"
              />
            </div>

            {/* Input para specie */}
            <div className="flex flex-col">
              <label className="text-blue-dark font-bold" htmlFor="specie">
                Especie
              </label>
              <select
                id="specie"
                name="specie"
                value={filters.specie}
                onChange={handleFilterChange}
                className="p-2 rounded"
              >
                <option value="">Todos</option>
                <option value="Perros">Perros 🐶</option>
                <option value="Gatos">Gatos 🐱</option>
                <option value="Roedores">Roedores 🐹🐰</option>
                <option value="Aves">Aves 🦜</option>
                <option value="Otros">Otros 🐾</option>
              </select>
            </div>

            {/* Select para tamaño */}
            <div className="flex flex-col">
              <label className="text-blue-dark font-bold" htmlFor="size">
                Tamaño
              </label>
              <select
                id="size"
                name="size"
                value={filters.size}
                onChange={handleFilterChange}
                className="p-2 rounded"
              >
                <option value="">Todos</option>
                <option value="Pequeño">Pequeño</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
              </select>
            </div>

            {/* Select para provincia */}
            <div className="flex flex-col">
              <label className="text-blue-dark font-bold" htmlFor="location">
                Provincia
              </label>
              <select
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="p-2 rounded"
              >
                <option value="">Todas</option>
                {provincias.map((provincia, index) => (
                  <option key={index} value={provincia}>
                    {provincia}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        <AnimalLoad filters={filters} />
      </div>
    </div>
  );
}
