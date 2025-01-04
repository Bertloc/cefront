import React, { useState, useEffect } from "react";
import axios from "axios";
import { VictoryPie, VictoryBar, VictoryLine, VictoryLabel } from "victory";

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [complianceData, setComplianceData] = useState([]);
    const [error, setError] = useState("");
    const [clientId, setClientId] = useState(null);
    const [clients, setClients] = useState([]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Por favor, selecciona un archivo.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/upload",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setClients(response.data.clientes);
            setError("");
        } catch (err) {
            setError("Error al cargar el archivo o procesar los datos.");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleClientSelect = async (selectedClientId) => {
        setClientId(selectedClientId);
        setLoading(true);

        try {
            const response = await axios.get(
                `http://localhost:5000/api/api/get-client-data/${parseInt(selectedClientId)}`
            );
            alert(`Cliente seleccionado: ${response.data["Nombre Solicitante"]}`);
        } catch (err) {
            setError("Error al obtener los datos del cliente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">Carga de Archivo y Selección de Clientes</h1>

            <input type="file" onChange={handleFileChange} className="p-2 border rounded mb-4" />
            <button 
                onClick={handleUpload} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Subir Archivo
            </button>

            {loading && <div className="mt-4 text-blue-500 font-semibold">Procesando archivo... 🔄</div>}
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {clients.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-2xl font-bold mb-4">Seleccionar Cliente</h2>
                    <select
                        onChange={(e) => handleClientSelect(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="">Selecciona un cliente</option>
                        {clients.map((client) => (
                            <option key={client.Solicitante} value={client.Solicitante}>
                                {client["Nombre Solicitante"]}
                            </option>
                        ))}
                    </select>
                </div>
            )}

        </div>
    );
};

export default UploadPage;
