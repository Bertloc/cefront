import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from '../services/authService';
import '../pages/LoginRegister.css';

const Login = () => {
    const [isAdmin, setIsAdmin] = useState(true);
    const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
    const [clientId, setClientId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAdminLogin = async () => {
        try {
            const success = await authService.adminLogin(adminCredentials);
            if (success) {
              navigate("/dashboard");
            } else {
                setError('Credenciales inválidas para admin.');
            }
        } catch (err) {
            setError('Error en el inicio de sesión.');
        }
    };

    const handleClientLogin = async () => {
        try {
            const exists = await authService.validateClient(clientId);
            if (exists) {
              navigate(`/ClientDashboard/${clientId}`);
            } else {
                setError('ID de Solicitante no encontrado.');
            }
        } catch (err) {
            setError('Error al verificar el cliente.');
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <div className="login-toggle">
                <button className={isAdmin ? "active" : ""} onClick={() => setIsAdmin(true)}>Admin</button>
                <button className={!isAdmin ? "active" : ""} onClick={() => setIsAdmin(false)}>Cliente</button>
            </div>
            {isAdmin ? (
                <div className="admin-login">
                    <input 
                        type="text" 
                        placeholder="Usuario" 
                        value={adminCredentials.username} 
                        onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={adminCredentials.password} 
                        onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                    />
                    <button onClick={handleAdminLogin}>Iniciar Sesión Admin</button>
                </div>
            ) : (
                <div className="client-login">
                    <input 
                        type="text" 
                        placeholder="ID de Solicitante" 
                        value={clientId} 
                        onChange={(e) => setClientId(e.target.value)}
                    />
                    <button onClick={handleClientLogin}>Iniciar Sesión Cliente</button>
                </div>
            )}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Login;
