import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaFacebook, FaApple, FaGoogle } from "react-icons/fa";
import LoginImage from "../assets/login-image.jpg";

const LoginPage = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Columna Izquierda */}
      <div className="relative hidden lg:flex flex-col items-center justify-center">
        <img
          src={LoginImage}
          alt="Inventario Forestal"
          className="absolute w-full h-full object-cover"
        />
        <div className="relative bg-black bg-opacity-50 p-8 rounded-lg">
          <h1 className="text-5xl font-bold text-white text-center">
            INVENTARIO FORESTAL NACIONAL
          </h1>
        </div>
      </div>

      {/* Columna Derecha */}
      <div className="bg-brand-green flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold text-white mb-4">Iniciar sesión</h1>
          <p className="text-gray-300 mb-6">
            Si no tiene un registro de cuenta{" "}
            <Link to="/registro" className="text-green-400 hover:underline">
              ¡Puedes registrarte aquí!
            </Link>
          </p>

          <form className="space-y-6">
            <div className="relative">
              <MdOutlineEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Ingrese su correo"
                className="w-full bg-gray-800 text-white py-3 pl-10 pr-4 rounded-lg outline-none border border-transparent focus:border-green-500"
              />
            </div>
            <div className="relative">
              <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Ingrese su contraseña"
                className="w-full bg-gray-800 text-white py-3 pl-10 pr-4 rounded-lg outline-none border border-transparent focus:border-green-500"
              />
            </div>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember">Acuérdate de mí</label>
              </div>
              <a href="#" className="hover:underline">
                ¿Has olvidado tu contraseña?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-white text-brand-green font-bold py-3 rounded-full hover:bg-gray-200 transition-colors"
            >
              Iniciar sesión
            </button>
          </form>

          <div className="mt-8 text-center text-gray-400">
            <p>o continuar con</p>
            <div className="flex justify-center gap-4 mt-4">
              <button className="bg-gray-800 p-3 rounded-full hover:bg-gray-700">
                <FaFacebook className="text-white" />
              </button>
              <button className="bg-gray-800 p-3 rounded-full hover:bg-gray-700">
                <FaApple className="text-white" />
              </button>
              <button className="bg-gray-800 p-3 rounded-full hover:bg-gray-700">
                <FaGoogle className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
