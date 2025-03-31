import React, { useState, useEffect } from "react";
import axios from "axios";
import { UploadCloud, UserCircle, BarChart3, HelpCircle } from "lucide-react";
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
  const [showHelp, setShowHelp] = useState(false);

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
    deliveryReportData: [],
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
      const response = await axios.get(`${baseUrl}/api/get-all-clients`);
      const sortedClients = response.data.sort((a, b) =>
        a.nombre_solicitante.localeCompare(b.nombre_solicitante)
      );
      setClients(sortedClients);
    } catch (err) {
      setError("Error al obtener la lista de clientes.");
    }
  };

  const handleClientSelect = async (selectedClientId) => {
    setClientId(selectedClientId);
    setLoading(true);

    try {
      const fetchData = async (endpoint, isCompliance = false) => {
        try {
          const url = isCompliance
            ? `${baseUrl}/${endpoint}?client_id=${selectedClientId}`
            : `${baseUrl}/api/${endpoint}?client_id=${selectedClientId}`;
          const response = await axios.get(url);
          return response.data;
        } catch (error) {
          console.error(`Error en ${endpoint}:`, error);
          return [];
        }
      };

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
          value: value,
        })),
        dailyTrendData: rawDailyTrendData.map((entry) => ({
          x: entry["Fecha Entrega"],
          y: entry["Cantidad entrega"],
        })),
        monthlyProductData: rawMonthlyProductData.map((entry) => ({
          Mes: entry.Mes,
          Material: entry["Texto Breve Material"],
          Cantidad: entry["Cantida Pedido"],
        })),
        distributionByCenterData: rawDistributionByCenterData.map((entry) => ({
          id: entry["Centro"],
          label: entry["Centro"],
          value: entry["Cantidad entrega"],
        })),
        dailySummaryData: rawDailySummaryData.map((entry) => ({
          x: entry["Fecha Entrega"],
          y: entry["% Aprovechamiento"],
        })),
        pendingOrdersData: rawPendingOrdersData.map((entry) => ({
          id: entry["Material"],
          label: entry["Material"],
          value: entry["Cantidad confirmada"],
        })),
        productCategorySummaryData: rawProductCategoryData.map((entry) => ({
          id: entry["Texto breve de material"],
          label: entry["Texto breve de material"],
          value: entry["Cantida Pedido"],
        })),
        dailyDeliveryReportData: rawDailyDeliveryData.map((entry) => ({
          x: entry["Fecha"],
          y: entry["Total Entregado"],
        })),
        reportDeliveryTrendsData: rawReportDeliveryData.map((entry) => ({
          x: entry["Fecha Entrega"],
          y: entry["Cantidad entrega"],
        })),
        deliveryReportData: await fetchData("delivery-report"),
      });
    } catch (err) {
      setError("Error al obtener los datos del cliente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 flex justify-center items-center gap-2">
          <UploadCloud className="w-7 h-7 text-blue-600" />
          Carga de Archivo y Selección de Clientes
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Selecciona un archivo y un cliente para visualizar los dashboards personalizados.
        </p>

        <div className="bg-white max-w-3xl mx-auto rounded-xl shadow-md p-6 mb-10 flex flex-col gap-4 items-center">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full max-w-xs"
            aria-label="Seleccionar archivo"
            title="Selecciona un archivo Excel para subir"
          />
          <button
            onClick={handlePublish}
            disabled={!file || isPublishing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center gap-2"
            aria-label="Botón para publicar archivo"
            title="Publicar archivo al servidor"
          >
            <UploadCloud className="w-5 h-5" />
            {isPublishing ? "Publicando archivo..." : "Publicar Archivo"}
          </button>

          {clients.length > 0 && (
            <div className="flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-gray-600" />
              <select
                className="select select-bordered w-full max-w-xs"
                onChange={(e) => handleClientSelect(e.target.value)}
                defaultValue=""
                aria-label="Seleccionar cliente"
                title="Selecciona un cliente para cargar los gráficos"
              >
                <option disabled value="">
                  Selecciona un cliente
                </option>
                {clients.map((client) => (
                  <option key={client.solicitante} value={client.solicitante}>
                    {client.nombre_solicitante}
                  </option>
                ))}
              </select>
            </div>
          )}

          {publishMessage && <p className="text-sm font-medium text-blue-700 mt-2">{publishMessage}</p>}
          {loading && <p className="text-yellow-600 font-semibold">Procesando datos del cliente...</p>}
          {error && <p className="text-red-600 mt-4 font-semibold">{error}</p>}
        </div>

        <hr className="border-t border-gray-300 my-8 w-full max-w-6xl mx-auto" />
        <h2 className="text-2xl font-semibold text-center mb-6 flex justify-center items-center gap-2">
          <BarChart3 className="w-6 h-6 text-gray-700" /> Visualización de Datos
        </h2>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4">
          {chartData.complianceData.length > 0 && <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"><CompliancePie data={chartData.complianceData} /></div>}
          {chartData.dailyTrendData.length > 0 && <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"><DailyTrendLine data={chartData.dailyTrendData} /></div>}
          {chartData.monthlyProductData.length > 0 && <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"><MonthlyProductAllocationBarChart data={chartData.monthlyProductData} /></div>}
          {chartData.distributionByCenterData.length > 0 && <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"><DistributionByCenterPieChart data={chartData.distributionByCenterData} /></div>}
          {chartData.dailySummaryData.length > 0 && <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"><DailySummaryLineChart data={chartData.dailySummaryData} /></div>}
          {chartData.pendingOrdersData.length > 0 && <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"><PendingOrdersBarChart data={chartData.pendingOrdersData} /></div>}
          {chartData.productCategorySummaryData.length > 0 && <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"><ProductCategorySummaryPieChart data={chartData.productCategorySummaryData} /></div>}
          {chartData.dailyDeliveryReportData.length > 0 && <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"><DailyDeliveryReportLineChart data={chartData.dailyDeliveryReportData} /></div>}
          {chartData.reportDeliveryTrendsData.length > 0 && <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"><ReportDeliveryTrendsLineChart data={chartData.reportDeliveryTrendsData} /></div>}
          {chartData.deliveryReportData.length > 0 && <div className="bg-white p-4 rounded-xl shadow hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"><DeliveryReportBarChart data={chartData.deliveryReportData} /></div>}
        </div>
      </div>

      {/* Modal de ayuda */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-2">¿Cómo usar esta página?</h3>
            <ul className="text-sm text-gray-700 list-disc list-inside">
              <li>Sube un archivo Excel con datos válidos.</li>
              <li>Selecciona un cliente del menú desplegable.</li>
              <li>Los gráficos se cargarán automáticamente.</li>
            </ul>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setShowHelp(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Botón de ayuda */}
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-40"
        title="Ayuda"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 mt-12 py-6">
        © {new Date().getFullYear()} EcoLogistics Dashboard. Hecho con 💙 para el equipo logístico.
      </footer>
    </div>
  );
};

export default UploadPage;
