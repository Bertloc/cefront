import React from "react";

const SliderPanel = ({ isLogin, togglePanel }) => {
  return (
    <div
      className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r ${
        isLogin ? "from-blue-500 to-indigo-600" : "from-green-500 to-teal-600"
      } text-white flex flex-col items-center justify-center p-8 transition-transform duration-500 ${
        isLogin ? "" : "-translate-x-full"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">
        {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
      </h2>
      <p className="mb-6">
        {isLogin
          ? "Regístrate para obtener acceso completo a nuestra plataforma."
          : "Inicia sesión para continuar en nuestra plataforma."}
      </p>
      <button
        onClick={togglePanel}
        className="px-4 py-2 border-2 border-white rounded-lg hover:bg-white hover:text-gray-800"
      >
        {isLogin ? "Regístrate" : "Iniciar Sesión"}
      </button>
    </div>
  );
};

export default SliderPanel;

