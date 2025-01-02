import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 min-h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-5xl font-bold mb-4">Bienvenido a la Plataforma</h1>
      <p className="text-lg max-w-lg text-center mb-8">
        Aquí podrás visualizar tus reportes y realizar análisis de datos con una
        experiencia moderna y optimizada.
      </p>
      <Link to="/login">
        <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-gray-200 transition">
          Explora el Dashboard
        </button>
      </Link>
    </div>
  );
};

export default Home;
