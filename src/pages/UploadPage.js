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
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishSuccess, setPublishSuccess] = useState(false);
    const [publishMessage, setPublishMessage] = useState("");

    const baseUrl = "https://backend-processing.onrender.com/api";

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setPublishSuccess(false);
        setClients([]);  // Se limpia la lista de clientes hasta que se publique
    };

    const handlePublish = async () => {
        if (!file || isPublishing || publishSuccess) return;
        setIsPublishing(true);
        setPublishMessage("⏳ Publicando archivo...");
    
        const formData = new FormData();
        formData.append("file", file);
    
        try {
            const response = await axios.post(`${baseUrl}/api/publish-data`, formData, { withCredentials: true }, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                setPublishMessage("✅ Publicación exitosa.");
                setPublishSuccess(true);
                fetchClients(); // Obtener la lista de clientes desde la base de datos
            } else {
                setPublishMessage("❌ Error en la publicación.");
            }
        } catch (error) {
            setPublishMessage("❌ Error al conectar con el servidor.");
        } finally {
            setIsPublishing(false);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/get-clients`);
            setClients(response.data);
        } catch (err) {
            setError("Error al obtener la lista de clientes.");
        }
    };

    const handleClientSelect = async (selectedClientId) => {
        setClientId(selectedClientId);
        setLoading(true);

        try {
            const response = await axios.get(`${baseUrl}/api/get-client-orders/${selectedClientId}`);
            const data = response.data;

            setComplianceData(Object.entries(data.compliance_summary).map(([key, value]) => ({ id: key, label: key, value })));
            setDailyTrendData(data.daily_trend.map(entry => ({ x: entry.fecha_entrega, y: entry.cantidad_entrega })));
            setMonthlyProductData(data.monthly_product_allocation.map(entry => ({ Mes: entry.mes, Cantidad: entry.cantidad_pedido })));
            setDistributionByCenterData(data.distribution_by_center.map(entry => ({ id: entry.centro, label: entry.centro, value: entry.cantidad_entrega })));
            setDailySummaryData(data.daily_summary.map(entry => ({ x: entry.fecha_entrega, y: entry.cantidad_entrega })));
            setPendingOrdersData(data.pending_orders.map(entry => ({ id: entry.material, label: entry.material, value: entry.cantidad_confirmada })));
            setProductCategorySummaryData(data.product_category_summary.map(entry => ({ id: entry.texto_breve_material, label: entry.texto_breve_material, value: entry.cantidad_pedido })));
            setDailyDeliveryReportData(data.daily_delivery_report.map(entry => ({ x: entry.fecha, y: entry.total_entregado })));
            setReportDeliveryTrendsData(data.report_delivery_trends.map(entry => ({ x: entry.fecha_entrega, y: entry.cantidad_entrega })));
            setDeliveryReportData(data.delivery_report.map(entry => ({ x: entry.fecha_entrega, y: entry.cantidad_entrega })));
        } catch (err) {
            setError("Error al obtener los datos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">Carga de Archivo y Selección de Clientes</h1>

            <input type="file" onChange={handleFileChange} className="p-2 border rounded mb-4" />
            <button onClick={handlePublish} className={`px-4 py-2 rounded mt-4 ${!file || isPublishing || publishSuccess ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white"}`} disabled={!file || isPublishing || publishSuccess}>
                {isPublishing ? "Publicando archivo..." : publishSuccess ? "Publicación exitosa" : "Publicar"}
            </button>
            {publishMessage && <p className="text-green-500 mt-4">{publishMessage}</p>}

            {publishSuccess && clients.length > 0 && (
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

            {loading && <div className="mt-4 text-blue-500 font-semibold">Cargando datos...</div>}
            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="grid grid-cols-2 gap-4 mt-6">
                {complianceData.length > 0 && <CompliancePieChart data={complianceData} />}
                {dailyTrendData.length > 0 && <DailyTrendLineChart data={dailyTrendData} />}
                {monthlyProductData.length > 0 && <MonthlyProductAllocationBarChart data={monthlyProductData} />}
                {distributionByCenterData.length > 0 && <DistributionByCenterPieChart data={distributionByCenterData} />}
            </div>
        </div>
    );
};

export default UploadPage;
