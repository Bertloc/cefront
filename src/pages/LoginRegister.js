import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, clientLogin } from "../services/authService"; // Agregar clientLogin
import SliderPanel from "./SliderPanel";

const LoginRegister = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [username, setUsername] = useState("");
  const [clientId, setClientId] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePanel = () => {
    setIsAdmin(!isAdmin);
    setError(""); // Resetear error al cambiar entre login de admin y cliente
  };

  // Manejar el inicio de sesión del administrador
  const handleAdminLogin = async (event) => {
    event.preventDefault();
    setError("");
    try {
        const data = await login(username, contraseña);
        localStorage.setItem("userRole", data.rol);
        localStorage.setItem("username", data.usuario);
        
        if (data.rol === "admin") {
            navigate("/upload");
        } else {
            setError("Acceso denegado para este usuario");
        }
    } catch (err) {
        setError("Usuario o contraseña incorrectos");
    }
  };

  // Manejar el inicio de sesión del cliente
  const handleClientLogin = async (event) => {
    event.preventDefault();
    setError("");
    
    const sanitizedClientId = clientId.trim(); // Eliminar espacios en blanco
    
    if (sanitizedClientId === "") {
      setError("El ID de Solicitante no puede estar vacío");
      return;
    }

    try {
        const response = await clientLogin(sanitizedClientId); // Enviar clientId sin espacios extra
        console.log("Respuesta del backend:", response); // Debugging

        if (response.success) {
            navigate(`/ClientDashboard/${sanitizedClientId}`);
        } else {
            setError("ID de Solicitante no encontrado");
        }
    } catch (err) {
        console.error("Error en la autenticación:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Error al verificar el cliente");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-[800px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex w-full h-full">
          {/* Sección de Login Admin */}
          <div className="w-1/2 flex flex-col items-center justify-center p-8">
            <h2 className="text-3xl font-bold mb-4">Inicio de Sesión Admin</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form className="w-full" onSubmit={handleAdminLogin}>
              <input type="text" placeholder="Usuario" className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
                value={username} onChange={(e) => setUsername(e.target.value)} required />
              <input type="password" placeholder="Contraseña" className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
                value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Iniciar Sesión
              </button>
            </form>
          </div>

          {/* Sección de Login Cliente */}
          <div className="w-1/2 flex flex-col items-center justify-center p-8">
            <h2 className="text-3xl font-bold mb-4">Inicio de Sesión Cliente</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form className="w-full" onSubmit={handleClientLogin}>
              <input 
                type="text" 
                placeholder="ID de Solicitante" 
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
                value={clientId} 
                onChange={(e) => setClientId(e.target.value)} 
                required 
              />
              <button 
                type="submit" 
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                disabled={clientId.trim() === ""} // Botón deshabilitado si clientId está vacío
              >
                Iniciar Sesión Cliente
              </button>
            </form>
          </div>
        </div>

        <SliderPanel isLogin={isAdmin} togglePanel={togglePanel} />
      </div>
    </div>
  );
};

export default LoginRegister;
