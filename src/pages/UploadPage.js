// pages/UploadPage.js
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
    const [clients, setClients] = useState([]);
    const [clientId, setClientId] = useState(null);
    const [error, setError] = useState("");

    // Estados de los gráficos
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

    const baseUrl = "https://backend-processing.onrender.com/api";

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Por favor, selecciona un archivo.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(`${baseUrl}/upload`, formData);
            const sortedClients = response.data.clientes.sort((a, b) =>
                a["Nombre Solicitante"].localeCompare(b["Nombre Solicitante"])
            );
            setClients(sortedClients);
            setError("");
        } catch (err) {
            setError("Error al cargar el archivo.");
        } finally {
            setLoading(false);
        }
    };

    const handleClientSelect = async (selectedClientId) => {
        setClientId(selectedClientId);
        setLoading(true);

        try {
            // � Ahora solo consultamos los gráficos ya generados en Supabase
            const response = await axios.get(`${baseUrl}/get-graphics/${selectedClientId}`);

            const graphics = response.data;
            if (!graphics.length) {
                setError("Aún no hay gráficos generados para este cliente.");
                setLoading(false);
                return;
            }

            // Asignar datos a los gráficos correctos
            graphics.forEach(graph => {
                switch (graph.tipo_grafico) {
                    case "cumplimiento":
                        setComplianceData(Object.entries(graph.datos).map(([key, value]) => ({ id: key, label: key, value })));
                        break;
                    case "tendencia_diaria":
                        setDailyTrendData(graph.datos.fecha.map((date, index) => ({ x: date, y: graph.datos.cantidad[index] })));
                        break;
                    case "asignacion_mensual":
                        setMonthlyProductData(graph.datos.map(entry => ({ Mes: entry.Mes, Cantidad: entry.Cantidad })));
                        break;
                    case "distribucion_centro":
                        setDistributionByCenterData(graph.datos.map(entry => ({ id: entry.Centro, label: entry.Centro, value: entry.CantidadEntrega })));
                        break;
                    case "resumen_diario":
                        setDailySummaryData(graph.datos.map(entry => ({ x: entry.Fecha, y: entry.CantidadEntrega })));
                        break;
                    case "pedidos_pendientes":
                        setPendingOrdersData(graph.datos.map(entry => ({ id: entry.Material, label: entry.Material, value: entry.CantidadConfirmada })));
                        break;
                    case "categoria_producto":
                        setProductCategorySummaryData(graph.datos.map(entry => ({ id: entry.Producto, label: entry.Producto, value: entry.Cantidad })));
                        break;
                    case "reporte_entrega":
                        setDailyDeliveryReportData(graph.datos.map(entry => ({ x: entry.Fecha, y: entry.TotalEntregado })));
                        break;
                    case "tendencia_entrega":
                        setReportDeliveryTrendsData(graph.datos.map(entry => ({ x: entry.Fecha, y: entry.Cantidad })));
                        break;
                    case "reporte_final":
                        setDeliveryReportData(graph.datos.map(entry => ({ x: entry.Fecha, y: entry.Cantidad })));
                        break;
                    default:
                        break;
                }
            });

        } catch (err) {
            setError("Error al obtener los gráficos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">Carga de Archivo y Selección de Clientes</h1>

            <input type="file" onChange={handleFileChange} className="p-2 border rounded mb-4" />
            <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">Subir Archivo</button>

            {loading && <div className="mt-4 text-blue-500 font-semibold">Procesando archivo...</div>}
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {clients.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-2xl font-bold mb-4">Seleccionar Cliente</h2>
                    <select onChange={(e) => handleClientSelect(e.target.value)} className="p-2 border rounded">
                        <option value="">Selecciona un cliente</option>
                        {clients.map(client => (
                            <option key={client.Solicitante} value={client.Solicitante}>{client["Nombre Solicitante"]}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-6">
                {complianceData.length > 0 && <CompliancePieChart data={complianceData} />}
                {dailyTrendData.length > 0 && <DailyTrendLineChart data={dailyTrendData} />}
                {monthlyProductData.length > 0 && <MonthlyProductAllocationBarChart data={monthlyProductData} />}
                {distributionByCenterData.length > 0 && <DistributionByCenterPieChart data={distributionByCenterData} />}
                {dailySummaryData.length > 0 && <DailySummaryLineChart data={dailySummaryData} />}
                {pendingOrdersData.length > 0 && <PendingOrdersBarChart data={pendingOrdersData} />}
                {productCategorySummaryData.length > 0 && <ProductCategorySummaryPieChart data={productCategorySummaryData} />}
                {dailyDeliveryReportData.length > 0 && <DailyDeliveryReportLineChart data={dailyDeliveryReportData} />}
                {reportDeliveryTrendsData.length > 0 && <ReportDeliveryTrendsLineChart data={reportDeliveryTrendsData} />}
                {deliveryReportData.length > 0 && <DeliveryReportBarChart data={deliveryReportData} />}
            </div>
        </div>
    );
};

export default UploadPage;
