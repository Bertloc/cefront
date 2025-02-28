import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

const API_URL = "https://backend-processing.onrender.com/api";

const ClientDashboard = () => {
    const { clientId } = useParams();  // Obtiene el clientId desde la URL
    const [clientData, setClientData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // Estado para los gráficos
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

    useEffect(() => {
        if (clientId) {
            fetchClientData();
            fetchAllChartData();
        }
    }, [clientId]);

    const fetchClientData = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/get-client-orders/${clientId}`);
            setClientData(response.data);
        } catch (err) {
            setError("No se encontraron datos para este cliente.");
        }
    };

    const fetchAllChartData = async () => {
        setLoading(true);
        try {
            const fetchData = async (endpoint, isCompliance = false) => {
                try {
                    const url = isCompliance
                        ? `${API_URL}/${endpoint}?client_id=${clientId}`  // SIN `/api/`
                        : `${API_URL}/api/${endpoint}?client_id=${clientId}`; // CON `/api/`
                    const response = await axios.get(url);
                    return response.data;
                } catch (error) {
                    console.error(`Error en ${endpoint}:`, error);
                    return [];
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
            const rawDeliveryReportData = await fetchData("delivery-report");

            setChartData({
                complianceData: Object.entries(rawComplianceData).map(([key, value]) => ({
                    id: key,
                    label: key,
                    value: value
                })),
                dailyTrendData: rawDailyTrendData.map(entry => ({
                    x: entry["Fecha Entrega"],
                    y: entry["Cantidad entrega"]
                })),
                monthlyProductData: rawMonthlyProductData.map(entry => ({
                    Mes: entry.Mes,
                    Material: entry["Texto Breve Material"],
                    Cantidad: entry["Cantida Pedido"]
                })),
                distributionByCenterData: rawDistributionByCenterData.map(entry => ({
                    id: entry["Centro"],
                    label: entry["Centro"],
                    value: entry["Cantidad entrega"]
                })),
                dailySummaryData: rawDailySummaryData.map(entry => ({
                    x: entry["Fecha Entrega"],
                    y: entry["% Aprovechamiento"]
                })),
                pendingOrdersData: rawPendingOrdersData.map(entry => ({
                    id: entry["Material"],
                    label: entry["Material"],
                    value: entry["Cantidad confirmada"]
                })),
                productCategorySummaryData: rawProductCategoryData.map(entry => ({
                    id: entry["Texto breve de material"],
                    label: entry["Texto breve de material"],
                    value: entry["Cantida Pedido"]
                })),
                dailyDeliveryReportData: rawDailyDeliveryData.map(entry => ({
                    x: entry["Fecha"],
                    y: entry["Total Entregado"]
                })),
                reportDeliveryTrendsData: rawReportDeliveryData.map(entry => ({
                    x: entry["Fecha Entrega"],
                    y: entry["Cantidad entrega"]
                })),
                deliveryReportData: rawDeliveryReportData
            });

        } catch (err) {
            setError("Error al obtener los datos del cliente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard del Cliente</h1>

            {error && <p className="text-red-500">{error}</p>}
            {loading && <p className="text-blue-500 font-semibold">Cargando datos...</p>}

            {clientData && (
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold">ID de Cliente: {clientId}</h2>
                    <p className="text-lg">Nombre del Cliente: {clientData[0]?.nombre_solicitante || "Desconocido"}</p>
                    <p className="text-lg">Tienes {clientData.length} pedidos registrados.</p>
                </div>
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

export default ClientDashboard;
