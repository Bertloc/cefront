import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { UserCircle, HelpCircle, FileDown, LineChart, ThumbsUp, Handshake, Building2 } from "lucide-react";
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
    const chartRefs = useRef([]);
    const [showHelp, setShowHelp] = useState(false);
    const [clientName, setClientName] = useState("");
    const [colorTheme, setColorTheme] = useState("blue");
    const [chartData, setChartData] = useState({
        complianceData: [],
        dailyTrendData: [],
        // monthlyProductData: [],
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
            fetchAllChartData();
            fetchClientName();
        }
    }, [clientId]);

    const fetchClientName = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/get-client-orders/${clientId}`);
            if (response.data && response.data.length > 0) {
            const match = response.data.find(item => String(item.solicitante) === String(clientId));
            const nombre = match?.nombre_solicitante || "Cliente";
            setClientName(nombre);
            setColorTheme(getClientColor(nombre));
            }
        } catch (err) {
            console.error("Error al obtener el nombre del cliente:", err);
        }
    };

    const getClientColor = (name) => {
        if (name.toLowerCase().includes("bugambilia")) return "blue";
        if (name.toLowerCase().includes("cementero")) return "gray";
        if (name.toLowerCase().includes("lozano")) return "green";
        return "blue";
    };

    const fetchAllChartData = async () => {
        setLoading(true);
        try {
            const fetchData = async (endpoint, isCompliance = false) => {
                try {
                    const url = isCompliance 
                        ? `${API_URL.replace('/api', '')}/${endpoint}?client_id=${clientId}`
                        : `${API_URL}/${endpoint}?client_id=${clientId}`;
                    const response = await axios.get(url);
                    return response.data;
                } catch (error) {
                    console.error(`❌ Error en ${endpoint}:`, error);
                    return [];
                }
            };

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
                complianceData: Object.entries(rawComplianceData).map(([key, value]) => ({ id: key, label: key, value: value })),
                dailyTrendData: rawDailyTrendData.map(entry => ({ x: entry["Fecha Entrega"], y: entry["Cantidad entrega"] })),
                monthlyProductData: rawMonthlyProductData.map(entry => ({ Mes: entry.Mes, Material: entry["Texto Breve Material"], Cantidad: entry["Cantida Pedido"] })),
                distributionByCenterData: rawDistributionByCenterData.map(entry => ({ id: entry["Centro"], label: entry["Centro"], value: entry["Cantidad entrega"] })),
                dailySummaryData: rawDailySummaryData.map(entry => ({ x: entry["Fecha Entrega"], y: entry["% Aprovechamiento"] })),
                pendingOrdersData: rawPendingOrdersData.map(entry => ({ id: entry["Material"], label: entry["Material"], value: entry["Cantidad confirmada"] })),
                productCategorySummaryData: rawProductCategoryData.map(entry => ({ id: entry["Texto breve de material"], label: entry["Texto breve de material"], value: entry["Cantida Pedido"] })),
                dailyDeliveryReportData: rawDailyDeliveryData.map(entry => ({ x: entry["Fecha"], y: entry["Total Entregado"] })),
                reportDeliveryTrendsData: rawReportDeliveryData.map(entry => ({ x: entry["Fecha Entrega"], y: entry["Cantidad entrega"] })),
                deliveryReportData: rawDeliveryReportData
            });

        } catch (err) {
            setError("❌ Error al obtener los datos del cliente.");
        } finally {
            setLoading(false);
        }
    };

    const exportToPDF = async () => {
        const pdf = new jsPDF("p", "mm", "a4");
        const margin = 10;
        const imgWidth = 90;
        const imgHeight = 70;
        let positionX = margin;
        let positionY = margin;
        const charts = chartRefs.current.filter(el => el !== null);

        for (let i = 0; i < charts.length; i++) {
            const canvas = await html2canvas(charts[i], { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
            pdf.addImage(imgData, "PNG", positionX, positionY, imgWidth, imgHeight);
            positionX = positionX === margin ? positionX + imgWidth + 10 : margin;
            positionY = positionX === margin ? positionY + imgHeight + 10 : positionY;
            if (positionY + imgHeight >= 270) {
                pdf.addPage();
                positionX = margin;
                positionY = margin;
            }
        }

        pdf.save(`dashboard_cliente_${clientId}.pdf`);
    };

    const cumplimiento = (() => {
        const despachado = chartData.complianceData.find(d => d.id === "Despachado")?.value || 0;
        const total = chartData.complianceData.reduce((sum, d) => sum + d.value, 0);
        return total ? ((despachado / total) * 100).toFixed(2) : "0.00";
    })();

    const totalPedidos = chartData.deliveryReportData.length;
    const entregados = chartData.dailyDeliveryReportData.reduce((sum, d) => sum + (d.y || 0), 0);
    const pendientes = chartData.pendingOrdersData.reduce((sum, d) => sum + (d.value || 0), 0);

    const primaryColor = {
        blue: "bg-blue-600",
        gray: "bg-gray-700",
        green: "bg-green-600"
    }[colorTheme];

    const hoverColor = {
        blue: "hover:bg-blue-700",
        gray: "hover:bg-gray-800",
        green: "hover:bg-green-700"
    }[colorTheme];

    return (
  <>
  
    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl shadow mb-6">
      <div className="flex items-center gap-4">
        <UserCircle size={40} className="text-blue-600" />
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {clientName || "Cliente"}
          </h1>
          <p className="text-sm text-gray-500">Dashboard de entregas</p>
        </div>
      </div>
    </div>

<div className="min-h-screen bg-gray-100 py-8 px-4 flex flex-col justify-between">
            <div>
                <div className="text-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold flex justify-center items-center gap-2">
                        <UserCircle className="w-7 h-7 text-blue-600" /> Dashboard del Cliente
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">Bienvenido, <span className="font-semibold">{clientName}</span></p>

                    <div className="flex justify-center mt-4">
                        <div className="bg-white shadow rounded-full px-5 py-2 flex items-center gap-3 border border-gray-200">
                            <div className={`${primaryColor} text-white rounded-full w-8 h-8 flex items-center justify-center font-bold uppercase text-sm`}>
                                {clientName?.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{clientName}</span>
                        </div>
                    </div>
                </div>

                {cumplimiento >= 90 && (
                    <div className="bg-green-100 border border-green-300 text-green-800 text-sm px-4 py-3 rounded-md flex items-center justify-center gap-2 mb-6 max-w-2xl mx-auto">
                        <ThumbsUp className="w-5 h-5" />
                        <span>¡Excelente! Tu operación tiene un cumplimiento del {cumplimiento}% esta semana. 🚛📦</span>
                    </div>
                )}

                <div className="flex justify-center mb-6">
                    <button
                        onClick={exportToPDF}
                        className={`${primaryColor} ${hoverColor} text-white px-4 py-2 rounded flex items-center gap-2`}
                        title="Exportar como PDF"
                    >
                        <FileDown className="w-5 h-5" />
                        Exportar a PDF
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 px-4">
                    <div className="bg-white rounded-xl shadow p-4 text-center">
                        <p className="text-sm text-gray-500">Total Pedidos</p>
                        <p className="text-xl font-bold">{totalPedidos}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center">
                        <p className="text-sm text-gray-500">Entregados</p>
                        <p className="text-xl font-bold">{entregados}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center">
                        <p className="text-sm text-gray-500">Pendientes</p>
                        <p className="text-xl font-bold">{pendientes}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center">
                        <p className="text-sm text-gray-500">% Cumplimiento</p>
                        <p className="text-xl font-bold">{cumplimiento}%</p>
                    </div>
                </div>

                <div className="text-center text-gray-600 text-sm mb-10">
                    De <span className="font-semibold">{totalPedidos}</span> pedidos programados, <span className="font-semibold">{entregados}</span> fueron entregados exitosamente.
                    {pendientes > 0 ? " Aún hay pedidos pendientes por entregar." : " ¡Operación sin fallos! 🎯"}
                </div>

                {loading ? (
  <p className="text-blue-600 text-center font-semibold">Cargando datos...</p>
) : error ? (
  <p className="text-red-600 text-center font-semibold">{error}</p>
) : (
  <div className="space-y-10 px-4">
    {/* Cumplimiento */}
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-600">
        <LineChart className="w-5 h-5" /> Cumplimiento
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        <div ref={(el) => (chartRefs.current[0] = el)} className="bg-white p-4 rounded-xl shadow">
          <CompliancePie data={chartData.complianceData} />
        </div>
      </div>
    </div>

    {/* Tendencias y Entregas */}
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-emerald-600">
        <LineChart className="w-5 h-5" /> Tendencias y Entregas
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        <div ref={(el) => (chartRefs.current[1] = el)} className="bg-white p-4 rounded-xl shadow">
          <DailyTrendLine data={chartData.dailyTrendData} />
        </div>
        <div ref={(el) => (chartRefs.current[2] = el)} className="bg-white p-4 rounded-xl shadow">
          <MonthlyProductAllocationBarChart data={chartData.monthlyProductData} />
        </div>
        <div ref={(el) => (chartRefs.current[8] = el)} className="bg-white p-4 rounded-xl shadow">
          <ReportDeliveryTrendsLineChart data={chartData.reportDeliveryTrendsData} />
        </div>
        <div ref={(el) => (chartRefs.current[7] = el)} className="bg-white p-4 rounded-xl shadow">
          <DailyDeliveryReportLineChart data={chartData.dailyDeliveryReportData} />
        </div>
      </div>
    </div>

    {/* Distribución y Categorías */}
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-pink-600">
        <LineChart className="w-5 h-5" /> Distribución y Categorías
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        <div ref={(el) => (chartRefs.current[3] = el)} className="bg-white p-4 rounded-xl shadow">
          <DistributionByCenterPieChart data={chartData.distributionByCenterData} />
        </div>
        <div ref={(el) => (chartRefs.current[6] = el)} className="bg-white p-4 rounded-xl shadow">
          <ProductCategorySummaryPieChart data={chartData.productCategorySummaryData} />
        </div>
      </div>
    </div>

    {/* Resúmenes y Pedidos Pendientes */}
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-orange-600">
        <LineChart className="w-5 h-5" /> Resúmenes y Pedidos Pendientes
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        <div ref={(el) => (chartRefs.current[4] = el)} className="bg-white p-4 rounded-xl shadow">
          <DailySummaryLineChart data={chartData.dailySummaryData} />
        </div>
        <div ref={(el) => (chartRefs.current[5] = el)} className="bg-white p-4 rounded-xl shadow">
          <PendingOrdersBarChart data={chartData.pendingOrdersData} />
        </div>
        <div ref={(el) => (chartRefs.current[9] = el)} className="bg-white p-4 rounded-xl shadow">
          <DeliveryReportBarChart data={chartData.deliveryReportData} />
        </div>
      </div>
    </div>
  </div>
)}

            </div>

            {showHelp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-2">¿Cómo funciona este panel?</h3>
                        <ul className="text-sm text-gray-700 list-disc list-inside">
                            <li>Este panel es exclusivo para tu empresa.</li>
                            <li>Los gráficos muestran entregas, cumplimiento y más.</li>
                            <li>Este panel es exclusivo para tu empresa.</li>
                            <li>Los gráficos muestran entregas, cumplimiento y más.</li>
                            <li>Puedes exportar los datos con el botón de arriba.</li>
                        </ul>
                        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setShowHelp(false)}>Cerrar</button>
                    </div>
                </div>
            )}

            <button
                onClick={() => setShowHelp(true)}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-40"
                title="Ayuda"
            >
                <HelpCircle className="w-5 h-5" />
            </button>

            <footer className="text-center text-sm text-gray-600 mt-12 pt-6 pb-4 border-t">
                <div className="flex justify-center items-center gap-2 mb-1">
                    <Handshake className="w-5 h-5 text-gray-500" />
                    <span>Gracias por confiar en nosotros, <strong>{clientName}</strong>. Estamos a tu servicio.</span>
                </div>
                © {new Date().getFullYear()} EcoLogistics Dashboard.
            </footer>
        </div>
  </>
);
};

export default ClientDashboard;
                           


