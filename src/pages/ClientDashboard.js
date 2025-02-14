import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "https://backend-processing.onrender.com/api";  // ✅ Ajusta la URL del backend

const ClientDashboard = () => {
    const { clientId } = useParams();  // ✅ Obtiene el clientId de la URL
    const [clientData, setClientData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const response = await axios.get(`${API_URL}/get-client-orders/${clientId}`);
                setClientData(response.data);
            } catch (err) {
                setError("No se encontraron datos para este cliente.");
            }
        };

        fetchClientData();
    }, [clientId]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Bienvenido al Dashboard del Cliente</h1>
            
            {error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : clientData ? (
                <>
                    <h2>ID de Cliente: {clientId}</h2>
                    <p>Nombre del Cliente: {clientData[0]?.nombre_solicitante || "Desconocido"}</p>
                    <p>Tienes {clientData.length} pedidos registrados.</p>
                </>
            ) : (
                <p>Cargando datos del cliente...</p>
            )}
        </div>
    );
};

export default ClientDashboard;
