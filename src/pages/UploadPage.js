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

    const baseUrl = "https://backend-processing.onrender.com/api";

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
            const formData = new FormData();
            formData.append("file", file);
            formData.append("client_id", selectedClientId);

            const responses = await Promise.all([
                axios.post(`${baseUrl}/compliance-summary`, formData),
                axios.post(`${baseUrl}/api/daily-trend`, formData),
                axios.post(`${baseUrl}/api/monthly-product-allocation`, formData),
                axios.post(`${baseUrl}/api/distribution-by-center`, formData),
                axios.post(`${baseUrl}/api/daily-summary`, formData),
                axios.post(`${baseUrl}/api/pending-orders`, formData),
                axios.post(`${baseUrl}/api/product-category-summary`, formData),
                axios.post(`${baseUrl}/api/daily-delivery-report`, formData),
                axios.post(`${baseUrl}/api/report-delivery-trends`, formData),
                axios.post(`${baseUrl}/api/delivery-report`, formData)
            ]);

            setComplianceData(Object.entries(responses[0].data).map(([key, value]) => ({ id: key, label: key, value })));
            setDailyTrendData(responses[1].data.map(entry => ({ x: entry["Fecha Entrega"], y: entry["Cantidad entrega"] })));
            setMonthlyProductData(responses[2].data.map(entry => ({ Mes: entry["Mes"], Cantidad: entry["Cantida Pedido"] })));
            setDistributionByCenterData(responses[3].data.map(entry => ({ id: entry["Centro"], label: entry["Centro"], value: entry["Cantidad entrega"] })));
            setDailySummaryData(responses[4].data.map(entry => ({ x: entry["Fecha Entrega"], y: entry["Cantidad entrega"] })));
            setPendingOrdersData(responses[5].data.map(entry => ({ id: entry["Material"], label: entry["Material"], value: entry["Cantidad confirmada"] })));
            setProductCategorySummaryData(responses[6].data.map(entry => ({ id: entry["Texto breve de material"], label: entry["Texto breve de material"], value: entry["Cantida Pedido"] })));
            setDailyDeliveryReportData(responses[7].data.map(entry => ({ x: entry["Fecha"], y: entry["Total Entregado"] })));
            setReportDeliveryTrendsData(responses[8].data.map(entry => ({ x: entry["Fecha Entrega"], y: entry["Cantidad entrega"] })));
            setDeliveryReportData(responses[9].data.map(entry => ({ x: entry["Fecha Entrega"], y: entry["Cantidad entrega"] })));
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
