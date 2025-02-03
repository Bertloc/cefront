import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService"; // Importar la función de login

const Login = () => {
  const [username, setUsername] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await login(username, contraseña);
      alert(data.mensaje); // Mensaje de éxito

      // Guardar usuario en localStorage para mantener la sesión (opcional)
      localStorage.setItem('user', JSON.stringify(data));

      // Redirigir al dashboard u otra página
      navigate("/dashboard");
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Iniciar Sesión
        </h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              Usuario
            </label>
            <input id="username" type="text" placeholder="Ingresa tu usuario"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Contraseña
            </label>
            <input id="password" type="password" placeholder="Ingresa tu contraseña"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
