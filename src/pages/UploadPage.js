import React, { useState } from "react";
import axios from "axios";
import CompliancePieChart from "../components/CompliancePie";
import DailyTrendLineChart from "../components/DailyTrendLine";
import MonthlyProductAllocationBarChart from "../components/MonthlyProductAllocationBarChart";
import DistributionByCenterPieChart from "../components/DistributionByCenterPieChart";
import DailySummaryLineChart from "../components/DailySummaryLineChart";
import PendingOrdersBarChart from "../components/PendingOrdersBarChart";
import ProductCategorySummaryPieChart from "../components/ProductCategorySummaryPieChart";
import DailyDeliveryReportLineChart from "../components/DailyDeliveryReportLineChart";
import ReportDeliveryTrendsLineChart from "../components/ReportDeliveryTrendsLineChart";
import DeliveryReportBarChart from "../components/DeliveryReportBarChart";

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [complianceData, setComplianceData] = useState([]);
    const [dailyTrendData, setDailyTrendData] = useState([]);
    const [monthlyProductData, setMonthlyProductData] = useState([]);
    const [distributionByCenterData, setDistributionByCenterData] = useState([]);
    const [dailySummaryData, setDailySummaryData] = useState([]);
    const [pendingOrdersData, setPendingOrdersData] = useState([]);
    const [productCategorySummaryData, setProductCategorySummaryData] = useState([]);
    const [dailyDeliveryReportData, setDailyDeliveryReportData] = useState([]);
    const [reportDeliveryTrendsData, setReportDeliveryTrendsData] = useState([]);
    const [deliveryReportData, setDeliveryReportData] = useState([]);
    const [error, setError] = useState("");
    const [clientId, setClientId] = useState(null);
    const [clients, setClients] = useState([]);
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishSuccess, setPublishSuccess] = useState(false);
    const [publishMessage, setPublishMessage] = useState("");

    const baseUrl = "https://backend-processing.onrender.com/api";

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handlePublish = async () => {
        if (!file || isPublishing || publishSuccess) return;
        setIsPublishing(true);
        setPublishMessage("⏳ Publicando archivo...");
    
        const formData = new FormData();
        formData.append("file", file);
    
        try {
            await axios.post(`${baseUrl}/api/publish-data`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setPublishMessage("✅ Publicación exitosa.");
            await handleFetchClientsFromDB();
        } catch (error) {
            setPublishMessage("⚠️ Publicación fallida, pero continuamos.");
            await handleFetchClientsFromDB();
        } finally {
            setIsPublishing(false);
        }
    };

    const handleFetchClientsFromDB = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/get-all-clients`);
            const sortedClients = response.data.sort((a, b) => a.nombre_solicitante.localeCompare(b.nombre_solicitante));
            setClients(sortedClients);
        } catch (err) {
            setError("Error al obtener la lista de clientes desde la base de datos.");
        }
    };

    const handleClientSelect = async (selectedClientId) => {
        setClientId(selectedClientId);
        setLoading(true);

        try {
            const response = await axios.get(`${baseUrl}/api/get-client-orders/${selectedClientId}`);
            setComplianceData(response.data.map(entry => ({ id: entry.estatus_pedido, label: entry.estatus_pedido, value: entry.cantidad_entrega })));
            setDailyTrendData(response.data.map(entry => ({ x: entry.fecha_entrega, y: entry.cantidad_entrega })));
            setMonthlyProductData(response.data.map(entry => ({ Mes: entry.fecha_creacion, Cantidad: entry.cantidad_pedido })));
            setDistributionByCenterData(response.data.map(entry => ({ id: entry.centro, label: entry.centro, value: entry.cantidad_entrega })));
            setDailySummaryData(response.data.map(entry => ({ x: entry.fecha_entrega, y: entry.cantidad_entrega })));
            setPendingOrdersData(response.data.map(entry => ({ id: entry.material, label: entry.material, value: entry.cantidad_confirmada })));
            setProductCategorySummaryData(response.data.map(entry => ({ id: entry.texto_breve_material, label: entry.texto_breve_material, value: entry.cantidad_pedido })));
            setDailyDeliveryReportData(response.data.map(entry => ({ x: entry.fecha_entrega, y: entry.cantidad_entrega })));
            setReportDeliveryTrendsData(response.data.map(entry => ({ x: entry.fecha_entrega, y: entry.cantidad_entrega })));
            setDeliveryReportData(response.data.map(entry => ({ x: entry.fecha_entrega, y: entry.cantidad_entrega })));
        } catch (err) {
            setError("Error al obtener los datos del cliente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">Carga de Archivo y Selección de Clientes</h1>

            <input type="file" onChange={handleFileChange} className="p-2 border rounded mb-4" />
            <button onClick={handlePublish} className="bg-blue-500 text-white px-4 py-2 rounded">Publicar Archivo</button>
            
            {loading && <div className="mt-4 text-blue-500 font-semibold">Procesando...</div>}
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {clients.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-2xl font-bold mb-4">Seleccionar Cliente</h2>
                    <select onChange={(e) => handleClientSelect(e.target.value)} className="p-2 border rounded">
                        <option value="">Selecciona un cliente</option>
                        {clients.map(client => (
                            <option key={client.solicitante} value={client.solicitante}>{client.nombre_solicitante}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default UploadPage;
