import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
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
    const { clientId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const dashboardRef = useRef(); // Referencia para capturar todo el dashboard
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
            console.log(`📌 clientId recibido: ${clientId}`);
            fetchAllChartData();
        } else {
            console.warn("⚠️ clientId no está definido aún.");
        }
    }, [clientId]);

    const fetchAllChartData = async () => {
        setLoading(true);
        try {
            const fetchData = async (endpoint, isCompliance = false) => {
                try {
                    const url = isCompliance 
                        ? `${API_URL.replace('/api', '')}/${endpoint}?client_id=${clientId}` 
                        : `${API_URL}/${endpoint}?client_id=${clientId}`;
                    console.log(`🔍 Solicitando: ${url}`);
                    const response = await axios.get(url);
                    console.log(`✅ Respuesta de ${endpoint}:`, response.data);
                    return response.data;
                } catch (error) {
                    console.error(`❌ Error en ${endpoint}:`, error);
                    return [];
                }
            };

            // Obtener datos de cada endpoint
            const rawComplianceData = await fetchData("/api/compliance-summary", true);
            const rawDailyTrendData = await fetchData("api/daily-trend");
            const rawMonthlyProductData = await fetchData("api/monthly-product-allocation");
            const rawDistributionByCenterData = await fetchData("api/distribution-by-center");
            const rawDailySummaryData = await fetchData("api/daily-summary");
            const rawPendingOrdersData = await fetchData("api/pending-orders");
            const rawProductCategoryData = await fetchData("api/product-category-summary");
            const rawDailyDeliveryData = await fetchData("api/daily-delivery-report");
            const rawReportDeliveryData = await fetchData("api/report-delivery-trends");
            const rawDeliveryReportData = await fetchData("api/delivery-report");

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
            setError("❌ Error al obtener los datos del cliente.");
        } finally {
            setLoading(false);
        }
    };

    // 📄 Exportar PDF en varias páginas con los 10 gráficos
    const exportToPDF = () => {
        if (!dashboardRef.current) return;
        
        html2canvas(dashboardRef.current, { scale: 2, windowWidth: dashboardRef.current.scrollWidth }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 190;
            const pageHeight = 297; // Altura de página A4 en mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 10;

            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`dashboard_cliente_${clientId}.pdf`);
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard del Cliente</h1>

            {/* Botón de exportación */}
            <button 
                onClick={exportToPDF} 
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            >
                📄 Exportar a PDF
            </button>

            <div ref={dashboardRef} className="bg-white p-4 shadow-lg">
                {loading ? (
                    <p className="text-blue-500">Cargando datos...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
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
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;
