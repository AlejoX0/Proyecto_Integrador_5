import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import {
  RiLockPasswordLine,
  RiEyeLine,
  RiEyeCloseLine,
} from "react-icons/ri";
import { FaFacebook, FaApple, FaGoogle } from "react-icons/fa";
import LoginImage from "../assets/image-login.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Por favor, complete todos los campos.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      localStorage.setItem("authToken", data.token);
      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <p className="bg-red-500 text-white text-center p-2 rounded-lg">
                {error}
              </p>
            )}

            <div className="relative">
              <MdOutlineEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Ingrese su correo"
                className="w-full bg-gray-800 text-white py-3 pl-10 pr-4 rounded-lg outline-none border border-transparent focus:border-green-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Ingrese su contraseña"
                className="w-full bg-gray-800 text-white py-3 pl-10 pr-10 rounded-lg outline-none border border-transparent focus:border-green-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400"
              >
                {showPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
              </button>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-400">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember">Acuérdate de mí</label>
              </div>
              {/* Eliminado el link de recuperación de contraseña */}
            </div>

            <button
              type="submit"
              className="w-full bg-white text-brand-green font-bold py-3 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Redes Sociales (sin cambios) */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;