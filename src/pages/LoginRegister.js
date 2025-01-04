import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // Inicializa el hook de navegación

  const togglePanel = () => {
    setIsLogin(!isLogin);
  };

  const handleRegister = (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario
    // Simula el registro (puedes incluir lógica de API aquí)
    console.log("Usuario registrado exitosamente");
    // Redirige al dashboard después del registro
    navigate("/upload");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-[800px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Contenedor principal */}
        <div
          className={`absolute top-0 left-0 w-full h-full flex transition-transform duration-500 ${
            isLogin ? "" : "-translate-x-1/2"
          }`}
        >
          {/* Sección de login */}
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
          {/* Sección de registro */}
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
        {/* Panel de fondo */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-500 to-blue-700 flex flex-col items-center justify-center text-white transition-transform duration-500 ${
            isLogin ? "" : "translate-x-full"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">
            {isLogin ? "¡Hola, amigo!" : "¡Bienvenido de nuevo!"}
          </h2>
          <p className="mb-4">
            {isLogin
              ? "¿No tienes una cuenta? Regístrate aquí."
              : "¿Ya tienes cuenta? Inicia sesión aquí."}
          </p>
          <button
            onClick={togglePanel}
            className="bg-white text-blue-700 px-6 py-2 rounded shadow hover:bg-gray-100"
          >
            {isLogin ? "Regístrate" : "Iniciar Sesión"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
