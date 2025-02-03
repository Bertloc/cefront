import React from "react";

const SliderPanel = ({ isLogin, togglePanel }) => {
  return (
    <div
      className={`absolute top-0 w-1/2 h-full bg-gradient-to-r ${
        isLogin ? "from-blue-500 to-indigo-600 left-0" : "from-green-500 to-teal-600 left-1/2"
      } text-white flex flex-col items-center justify-center p-8 transition-all duration-500`}
    >
      <h2 className="text-2xl font-bold mb-4">
        {isLogin ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
      </h2>
      <p className="mb-6">
        {isLogin
          ? "Inicia sesión para continuar en nuestra plataforma."
          : "Regístrate para obtener acceso completo a nuestra plataforma."}
      </p>
      <button
        onClick={togglePanel}
        className="px-4 py-2 border-2 border-white rounded-lg hover:bg-white hover:text-gray-800"
      >
        {isLogin ? "Iniciar Sesión" : "Registrate"}
      </button>
    </div>
  );
};

export default SliderPanel;
