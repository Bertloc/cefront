import axios from 'axios';

const API_URL = 'https://backend-processing.onrender.com/api';

// Función para registrar un usuario
export const register = async (username, correo, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, 
            { username, correo, contraseña: password }, 
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    } catch (error) {
        console.error('Error en registro:', error.response?.data || error.message);
        throw new Error(error.response?.data?.mensaje || "Error en el registro");
    }
};

// Función para iniciar sesión
export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, 
            { username, contraseña: password }, 
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    } catch (error) {
        console.error('Error en login:', error.response?.data || error.message);
        throw new Error(error.response?.data?.mensaje || "Usuario o contraseña incorrectos");
    }
};
