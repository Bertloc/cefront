import React from "react";

const SliderPanel = ({ isLogin, togglePanel }) => {
  return (
    <div
      className={`absolute top-0 w-1/2 h-full bg-gradient-to-r ${
        isLogin ? "from-blue-500 to-indigo-600 left-0" : "from-green-500 to-teal-600 left-1/2"
      } text-white flex flex-col items-center justify-center p-8 transition-all duration-500`}
    >
      <h2 className="text-2xl font-bold mb-4">
        {isLogin ? "¿ERES ADMIN?" : "¿ERES CLIENTE?"}
      </h2>
      <p className="mb-6">
        {isLogin
          ? "Inicia sesión como admin para encontrar funciones innovadoras."
          : "Inicia sesión como cliente para gestionar tus pedidos y seguimiento."}
      </p>
      <button
        onClick={togglePanel}
        className="px-4 py-2 border-2 border-white rounded-lg hover:bg-white hover:text-gray-800"
      >
        {isLogin ? "Iniciar Sesión como Admin" : "Iniciar Sesión como Cliente"}
      </button>
    </div>
  );
};

export default SliderPanel;
