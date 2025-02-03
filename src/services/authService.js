import axios from 'axios';

const API_URL = 'https://backend-processing.onrender.com/api';

// � Función para registrar un usuario
export const register = async (username, correo, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            username,
            correo,
            contraseña: password  // ✅ Se usa "contraseña" para coincidir con el backend
        }, {
            headers: { "Content-Type": "application/json" }
        });

        return response.data;
    } catch (error) {
        console.error('Error en registro:', error.response?.data || error.message);
        throw new Error(error.response?.data?.mensaje || "Error en el registro");
    }
};

// � Función para iniciar sesión y obtener el rol del usuario
export const login = async (username, password) => {
    try {
        // ✅ Asegurar que enviamos "contraseña" (lo que espera el backend)
        const response = await axios.post(`${API_URL}/login`, {
            username,
            contraseña: password  // � Se mantiene "contraseña" para coincidir con el backend
        }, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("Respuesta del backend en login:", response.data);  // � Depuración

        // Extraer información de la respuesta
        const { usuario, rol } = response.data;

        if (usuario && rol) {
            // � Guardar usuario y rol en localStorage
            localStorage.setItem("username", usuario);
            localStorage.setItem("userRole", rol);

            return { mensaje: "Inicio de sesión exitoso", usuario, rol };
        } else {
            throw new Error("Respuesta del backend inválida");
        }
    } catch (error) {
        console.error('Error en login:', error.response?.data || error.message);
        throw new Error(error.response?.data?.mensaje || "Usuario o contraseña incorrectos");
    }
};
