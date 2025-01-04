import React, { useState } from "react";
import axios from "axios";

const PublishGraph = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [clientID, setClientID] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleClientChange = (event) => {
    setClientID(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile || !clientID) {
      alert("Por favor, seleccione un archivo y un cliente.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("clientID", clientID); // Asociar el gráfico al cliente

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data); // Mostrar el resultado del procesamiento
    } catch (error) {
      console.error("Error al procesar el archivo:", error);
      alert("Hubo un error al procesar el archivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Publicar Gráficos</h1>
      <div className="bg-white p-6 rounded shadow-md">
        <label className="block mb-2 font-semibold">Seleccionar Cliente:</label>
        <input
          type="text"
          placeholder="ID del Cliente"
          value={clientID}
          onChange={handleClientChange}
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
        />

        <label className="block mb-2 font-semibold">Subir Archivo:</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Procesando..." : "Subir y Generar Gráfico"}
        </button>
      </div>

      {result && (
        <div className="mt-8 bg-green-100 p-4 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">Resultado del Procesamiento</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PublishGraph;
