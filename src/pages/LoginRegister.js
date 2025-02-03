import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, login } from "../services/authService"; // Importar funciones de autenticación
import SliderPanel from "./SliderPanel";

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePanel = () => {
    setIsLogin(!isLogin);
    setError(""); // Resetear error al cambiar entre login y registro
  };

  // 👉 Función para manejar el registro de usuario
  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await register(username, correo, contraseña);
      alert(data.mensaje); // Mensaje de éxito
      setTimeout(() => {
        navigate("/upload"); // Redirigir a la página de subida
      }, 500);
    } catch (err) {
      setError("Error al registrar usuario");
    }
  };

  // 👉 Función para manejar el inicio de sesión
  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await login(username, contraseña);
      alert(data.mensaje); // Mostrar mensaje de éxito
      navigate("/upload"); // Redirigir a la página de subida si es correcto
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-[800px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
        
        <div className="flex w-full h-full">
          {/* 🟢 Sección de Login */}
          <div className="w-1/2 flex flex-col items-center justify-center p-8">
            <h2 className="text-3xl font-bold mb-4">Iniciar Sesión</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>} {/* Muestra error si ocurre */}
            <form className="w-full" onSubmit={handleLogin}>
              <input type="text" placeholder="Nombre de Usuario" className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
                value={username} onChange={(e) => setUsername(e.target.value)} required />
              <input type="password" placeholder="Contraseña" className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
                value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Iniciar Sesión
              </button>
            </form>
          </div>

          {/* 🟢 Sección de Registro */}
          <div className="w-1/2 flex flex-col items-center justify-center p-8">
            <h2 className="text-3xl font-bold mb-4">Regístrate</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>} {/* Muestra error si ocurre */}
            <form className="w-full" onSubmit={handleRegister}>
              <input type="text" placeholder="Nombre de Usuario" className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
                value={username} onChange={(e) => setUsername(e.target.value)} required />
              <input type="email" placeholder="Correo Electrónico" className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
                value={correo} onChange={(e) => setCorreo(e.target.value)} required />
              <input type="password" placeholder="Contraseña" className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
                value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                Registrarme
              </button>
            </form>
          </div>
        </div>

        <SliderPanel isLogin={isLogin} togglePanel={togglePanel} />
      </div>
    </div>
  );
};

export default LoginRegister;
