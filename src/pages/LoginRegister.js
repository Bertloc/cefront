import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SliderPanel from "./SliderPanel"; // Importamos el panel deslizante

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const togglePanel = () => {
    setIsLogin(!isLogin);
  };

  const handleRegister = (event) => {
    event.preventDefault();
    console.log("Usuario registrado exitosamente");
    setTimeout(() => {
      navigate("/upload");
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-[800px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
        
        {/* Contenedor de Formularios - Siempre Fijo */}
        <div className="flex w-full h-full">
          {/* Sección de Login */}
          <div className="w-1/2 flex flex-col items-center justify-center p-8">
            <h2 className="text-3xl font-bold mb-4">Iniciar Sesión</h2>
            <form className="w-full">
              <input
                type="email"
                placeholder="Correo Electrónico"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
              />
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Iniciar Sesión
              </button>
            </form>
          </div>

          {/* Sección de Registro */}
          <div className="w-1/2 flex flex-col items-center justify-center p-8">
            <h2 className="text-3xl font-bold mb-4">Regístrate</h2>
            <form className="w-full" onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Nombre Completo"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
              />
              <input
                type="email"
                placeholder="Correo Electrónico"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
              />
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Registrarme
              </button>
            </form>
          </div>
        </div>

        {/* Panel Deslizante - Se Mueve */}
        <SliderPanel isLogin={isLogin} togglePanel={togglePanel} />
      </div>
    </div>
  );
};

export default LoginRegister;
