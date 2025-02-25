import React, { useState, useEffect } from "react";
import axios from "axios";
import CompliancePie from "../components/CompliancePie";
import DailyTrendLine from "../components/DailyTrendLine";
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
    const [error, setError] = useState("");
    const [clientId, setClientId] = useState(null);
    const [clients, setClients] = useState([]);
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishMessage, setPublishMessage] = useState("");

    // Estado unificado para los gráficos
    const [chartData, setChartData] = useState({
        complianceData: [],
        dailyTrendData: [],
        monthlyProductData: [],
        distributionByCenterData: [],
        dailySummaryData: [],
        pendingOrdersData: [],
        productCategorySummaryData: [],
        dailyDeliveryReportData: [],
        reportDeliveryTrendsData: [],
        deliveryReportData: []
    });

    const baseUrl = "https://backend-processing.onrender.com/api";

    useEffect(() => {
        handleFetchClientsFromDB();
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handlePublish = async () => {
        if (!file || isPublishing) return;
        setIsPublishing(true);
        setPublishMessage("⏳ Publicando archivo...");

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post(`${baseUrl}/api/publish-data`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setPublishMessage("✅ Publicación exitosa.");
            await handleFetchClientsFromDB();
        } catch (error) {
            setPublishMessage("⚠️ Publicación fallida.");
        } finally {
            setIsPublishing(false);
        }
    };

    const handleFetchClientsFromDB = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/get-all-clients`); // Verifica si el backend usa `/api/`
            const sortedClients = response.data.sort((a, b) => a.nombre_solicitante.localeCompare(b.nombre_solicitante));
            setClients(sortedClients);
        } catch (err) {
            setError("Error al obtener la lista de clientes.");
        }
    };



    
    const handleClientSelect = async (selectedClientId) => {
        setClientId(selectedClientId);
        setLoading(true);

        try {
            // Función para manejar las solicitudes con axios.get()
            const fetchData = async (endpoint, isCompliance = false) => {
                try {
                    const url = isCompliance 
                        ? `${baseUrl}/${endpoint}?client_id=${selectedClientId}`  // SIN `/api/`
                        : `${baseUrl}/api/${endpoint}?client_id=${selectedClientId}`; // CON `/api/`

                    const response = await axios.get(url);
                    return response.data;
                } catch (error) {
                    console.error(`Error en ${endpoint}:`, error);
                    return []; // Retorna array vacío en caso de error
                }
            };

            // Obtener datos de cada endpoint
            const rawComplianceData = await fetchData("compliance-summary", true);
            const rawDailyTrendData = await fetchData("daily-trend");
            const rawMonthlyProductData = await fetchData("monthly-product-allocation");
            const rawDistributionByCenterData = await fetchData("distribution-by-center");
            const rawDailySummaryData = await fetchData("daily-summary");
            const rawPendingOrdersData = await fetchData("pending-orders");
            const rawProductCategoryData = await fetchData("product-category-summary");
            const rawDailyDeliveryData = await fetchData("daily-delivery-report");
            const rawReportDeliveryData = await fetchData("report-delivery-trends");
            setChartData({
                complianceData: Object.entries(rawComplianceData).map(([key, value]) => ({
                    id: key,
                    label: key,
                    value: value
                })),
                dailyTrendData: rawDailyTrendData.map(entry => ({
                    x: entry["Fecha Entrega"],  // Convertir "Fecha Entrega" en "x"
                    y: entry["Cantidad entrega"] // Convertir "Cantidad entrega" en "y"
                })),
                monthlyProductData: rawMonthlyProductData.map(entry => ({
                    Mes: entry.Mes,  // El backend lo devuelve con "Mes"
                    Material: entry["Texto Breve Material"], // Ajustar clave para incluir el material
                    Cantidad: entry["Cantida Pedido"] // Ajustar la clave exacta del backend
                })),
                distributionByCenterData: rawDistributionByCenterData.map(entry => ({
                    id: entry["Centro"],   // Convertimos "Centro" en "id"
                    label: entry["Centro"], // Convertimos "Centro" en "label"
                    value: entry["Cantidad entrega"] // Convertimos "Cantidad entrega" en "value"
                })),
                dailySummaryData: rawDailySummaryData.map(entry => ({
                    x: entry["Fecha Entrega"],  // Convertimos "Fecha Entrega" en "x"
                    y: entry["% Aprovechamiento"] // Convertimos "% Aprovechamiento" en "y"
                })),
                pendingOrdersData: rawPendingOrdersData.map(entry => ({
                    id: entry["Material"],   // Convertimos "Material" en "id"
                    label: entry["Material"], // Convertimos "Material" en "label"
                    value: entry["Cantidad confirmada"] // Convertimos "Cantidad confirmada" en "value"
                })),
                productCategorySummaryData: rawProductCategoryData.map(entry => ({
                    id: entry["Texto breve de material"],   // Convertimos "Texto breve de material" en "id"
                    label: entry["Texto breve de material"], // Convertimos "Texto breve de material" en "label"
                    value: entry["Cantida Pedido"] // Convertimos "Cantida Pedido" en "value"
                })),
                dailyDeliveryReportData: rawDailyDeliveryData.map(entry => ({
                    x: entry["Fecha"],   // Convertimos "Fecha" en "x"
                    y: entry["Total Entregado"] // Convertimos "Total Entregado" en "y"
                })),
                reportDeliveryTrendsData: rawReportDeliveryData.map(entry => ({
                    x: entry["Fecha Entrega"],   // Convertimos "Fecha Entrega" en "x"
                    y: entry["Cantidad entrega"] // Convertimos "Cantidad entrega" en "y"
                })),
                deliveryReportData: await fetchData("delivery-report") // CON `/api/`
            });

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

            {isPublishing && <div className="mt-4 text-blue-500 font-semibold">{publishMessage}</div>}
            {loading && <div className="mt-4 text-blue-500 font-semibold">Procesando...</div>}
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {clients.length > 0 && (
                <select onChange={(e) => handleClientSelect(e.target.value)} className="p-2 border rounded">
                    <option value="">Selecciona un cliente</option>
                    {clients.map(client => (
                        <option key={client.solicitante} value={client.solicitante}>{client.nombre_solicitante}</option>
                    ))}
                </select>
            )}

            {/* Renderización de los gráficos solo si hay datos disponibles */}
            <div className="grid grid-cols-2 gap-6 mt-8">
                {chartData.complianceData.length > 0 && <CompliancePie data={chartData.complianceData} />}
                {chartData.dailyTrendData.length > 0 && <DailyTrendLine data={chartData.dailyTrendData} />}
                {chartData.monthlyProductData.length > 0 && <MonthlyProductAllocationBarChart data={chartData.monthlyProductData} />}
                {chartData.distributionByCenterData.length > 0 && <DistributionByCenterPieChart data={chartData.distributionByCenterData} />}
                {chartData.dailySummaryData.length > 0 && <DailySummaryLineChart data={chartData.dailySummaryData} />}
                {chartData.pendingOrdersData.length > 0 && <PendingOrdersBarChart data={chartData.pendingOrdersData} />}
                {chartData.productCategorySummaryData.length > 0 && <ProductCategorySummaryPieChart data={chartData.productCategorySummaryData} />}
                {chartData.dailyDeliveryReportData.length > 0 && <DailyDeliveryReportLineChart data={chartData.dailyDeliveryReportData} />}
                {chartData.reportDeliveryTrendsData.length > 0 && <ReportDeliveryTrendsLineChart data={chartData.reportDeliveryTrendsData} />}
                {chartData.deliveryReportData.length > 0 && <DeliveryReportBarChart data={chartData.deliveryReportData} />}
            </div>
        </div>
    );
};

export default UploadPage;
