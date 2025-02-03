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

// Función para iniciar sesión y obtener el rol del usuario
export const login = async (username, password) => {
    try {
        // Hacer la solicitud de login
        const response = await axios.post(`${API_URL}/login`,
            { username, contraseña: password },
            { headers: { "Content-Type": "application/json" } }
        );

        const userId = response.data.user_id; // Obtener el ID del usuario desde el backend

        if (userId) {
            // Ahora, obtener el rol del usuario desde el backend
            const roleResponse = await axios.get(`${API_URL}/get-user-role?user_id=${userId}`);
            const userRole = roleResponse.data.role;

            // Guardar el rol y el ID en localStorage
            localStorage.setItem("userId", userId);
            localStorage.setItem("userRole", userRole);

            return { mensaje: "Inicio de sesión exitoso", role: userRole };
        } else {
            throw new Error("Usuario no encontrado");
        }
    } catch (error) {
        console.error('Error en login:', error.response?.data || error.message);
        throw new Error(error.response?.data?.mensaje || "Usuario o contraseña incorrectos");
    }
};
