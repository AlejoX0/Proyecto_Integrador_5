import React from "react";
import { Link } from "react-router-dom"; // Para el enlace "iniciar sesión aquí"

// Importamos los íconos que vamos a usar
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";


// Importamos la imagen que guardaste en assets
import RegisterImage from "../assets/register-image.jpg";

const RegisterPage = () => {
  return (
    // Contenedor principal que divide la pantalla en 2 columnas
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      {/* Columna Izquierda: Imagen (se oculta en pantallas pequeñas) */}
      <div className="hidden lg:block">
        <img 
          src={RegisterImage} 
          alt="Bosque frondoso" 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Columna Derecha: Formulario de Registro */}
      <div className="bg-brand-green flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full">
          
          {/* Título y enlace para ir a Login */}
          <h1 className="text-4xl font-bold text-white mb-4">Registrarse</h1>
          <p className="text-gray-300 mb-6">
            Si ya tiene un registro de cuenta{" "}
            <Link to="/" className="text-green-400 hover:underline">
              ¡Puedes iniciar sesión aquí!
            </Link>
          </p>

          {/* Formulario */}
          <form className="space-y-6">
            {/* Campo de Email */}
            <div className="relative">
              <MdOutlineEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Ingrese su dirección de correo electrónico"
                className="w-full bg-gray-800 text-white py-3 pl-10 pr-4 rounded-lg outline-none border border-transparent focus:border-green-500"
              />
            </div>
            
            {/* Campo de Nombre de Usuario */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Ingrese su nombre de usuario"
                className="w-full bg-gray-800 text-white py-3 pl-10 pr-4 rounded-lg outline-none border border-transparent focus:border-green-500"
              />
            </div>
            
            {/* Campo de Contraseña */}
            <div className="relative">
              <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Ingrese su contraseña"
                className="w-full bg-gray-800 text-white py-3 pl-10 pr-4 rounded-lg outline-none border border-transparent focus:border-green-500"
              />
            </div>

            {/* Campo de Confirmar Contraseña */}
            <div className="relative">
              <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                className="w-full bg-gray-800 text-white py-3 pl-10 pr-4 rounded-lg outline-none border border-transparent focus:border-green-500"
              />
            </div>

            {/* Botón de Enviar */}
            <button
              type="submit"
              className="w-full bg-white text-brand-green font-bold py-3 rounded-full hover:bg-gray-200 transition-colors"
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;