import cemexLogo from '../assets/images/logo-cemex.png';
import './ClientDashboard.css';
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  UserCircle, HelpCircle, FileDown, LineChart, ThumbsUp, Handshake,
  Building2, Truck, Percent, Download
} from "lucide-react";
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

const CHART_CARD_META = [
  {
    icon: "📈",
    title: "Tendencia Diaria",
    desc: "Productos entregados por fecha",
    legend: "Eje Y: Toneladas entregadas • Eje X: Fecha de entrega",
    Comp: DailyTrendLine,
    refIdx: 1,
    dataKey: "dailyTrendData",
    tooltip: "Visualiza la cantidad de productos entregados cada día."
  },
  {
    icon: "📊",
    title: "Asignación Mensual de Producto",
    desc: "Cantidad de productos asignados por mes",
    legend: "Eje Y: Cantidad asignada • Eje X: Mes",
    Comp: MonthlyProductAllocationBarChart,
    refIdx: 2,
    dataKey: "monthlyProductData",
    tooltip: "Resumen mensual de productos asignados por tipo."
  },
  {
    icon: "🔄",
    title: "Tendencias de Entrega",
    desc: "Comportamiento de entregas a lo largo del tiempo",
    legend: "Eje Y: Entregas • Eje X: Fecha",
    Comp: ReportDeliveryTrendsLineChart,
    refIdx: 8,
    dataKey: "reportDeliveryTrendsData",
    tooltip: "Tendencias globales de entregas por fecha."
  },
  {
    icon: "📅",
    title: "Reporte Diario de Entregas",
    desc: "Entregas totales cada día",
    legend: "Eje Y: Cantidad entregada • Eje X: Fecha",
    Comp: DailyDeliveryReportLineChart,
    refIdx: 7,
    dataKey: "dailyDeliveryReportData",
    tooltip: "Reporte diario de cantidad total entregada."
  },
  {
    icon: "🏭",
    title: "Distribución por Centro",
    desc: "Productos entregados por centro logístico",
    legend: "Eje Y: Toneladas • Eje X: Centro",
    Comp: DistributionByCenterPieChart,
    refIdx: 3,
    dataKey: "distributionByCenterData",
    tooltip: "Visualización de la distribución de entregas por centros."
  },
  {
    icon: "🧾",
    title: "Resumen por Categoría de Producto",
    desc: "Porcentaje de cada tipo de producto entregado",
    legend: "Eje Y: % entregado • Eje X: Categoría",
    Comp: ProductCategorySummaryPieChart,
    refIdx: 6,
    dataKey: "productCategorySummaryData",
    tooltip: "Porcentaje de entregas por tipo de producto."
  },
  {
    icon: "📊",
    title: "Resumen Diario de Aprovechamiento",
    desc: "Porcentaje de aprovechamiento diario",
    legend: "Eje Y: % aprovechamiento • Eje X: Fecha",
    Comp: DailySummaryLineChart,
    refIdx: 4,
    dataKey: "dailySummaryData",
    tooltip: "Porcentaje de aprovechamiento de la logística cada día."
  },
  {
    icon: "⏳",
    title: "Pedidos Pendientes",
    desc: "Cantidad de pedidos aún por entregar",
    legend: "Eje Y: Pedidos • Eje X: Material",
    Comp: PendingOrdersBarChart,
    refIdx: 5,
    dataKey: "pendingOrdersData",
    tooltip: "Pedidos pendientes por tipo de material."
  },
  {
    icon: "📝",
    title: "Reporte de Entrega",
    desc: "Detalle de entregas por reporte",
    legend: "Eje Y: Cantidad • Eje X: Reporte",
    Comp: DeliveryReportBarChart,
    refIdx: 9,
    dataKey: "deliveryReportData",
    tooltip: "Detalle de los reportes individuales de entrega."
  }
];

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
    <div className="cemex-layout">
      <aside className="cemex-sidebar glass-sidebar">
        <div className="sidebar-header">
          <a href="#dashboard">
            <img
              src={cemexLogo}
              alt="Cemex Logo"
              className="logo"
            />
          </a>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">Dashboard</a>
          <a href="#" className="nav-item">Entregas</a>
          <a href="#" className="nav-item">Estadísticas</a>
          <a href="#" className="nav-item">Reporte</a>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn">⏻</button>
        </div>
      </aside>

      <main className="cemex-dashboard-main">
        {/* HEADER */}
        <div className="cemex-dashboard-header glass-card">
          <div className="titles">
            <h2>Dashboard del Cliente</h2>
            <p>Bienvenido, {clientName}</p>
          </div>
          <button className="btn-export glass-btn" onClick={exportToPDF}>
            <Download size={18} className="mr-2" />
            Exportar a PDF
          </button>
        </div>

        <div className="cemex-content-wrapper">
          <div className="top-center">
            <div className="dashboard-title-row">
              <div />
              <div className="dashboard-title-main">
                <h1 className="main-title-glass flex justify-center items-center gap-2">
                  <UserCircle className="avatar-glow" /> Dashboard del Cliente
                </h1>
                <p className="text-gray-600 text-sm mt-1">Bienvenido, <span className="font-semibold gradient-text">{clientName}</span></p>
                <div className="flex justify-center mt-3">
                  <div className="avatar-card-glass">
                    <div className={`avatar-circle-glow ${primaryColor}`}>
                      {clientName?.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{clientName}</span>
                  </div>
                </div>
              </div>
              <div className="dashboard-title-main-right"></div>
            </div>
            {cumplimiento >= 90 && (
              <div className="kpi-success-alert glass-card">
                <ThumbsUp className="w-5 h-5" />
                <span>¡Excelente! Tu operación tiene un cumplimiento del {cumplimiento}% esta semana. 🚛📦</span>
              </div>
            )}
          </div>

          {/* RESUMEN KPI */}
          <div className="summary-cards-glass">
            <div className="summary-card-glass kpi-blue">
              <div className="kpi-icon-glass blue-glow"><Building2 size={40} /></div>
              <div>
                <p className="kpi-label">Total Pedidos</p>
                <p className="kpi-value">{totalPedidos}</p>
              </div>
            </div>
            <div className="summary-card-glass kpi-green">
              <div className="kpi-icon-glass green-glow"><Truck size={40} /></div>
              <div>
                <p className="kpi-label">Entregados</p>
                <p className="kpi-value">{entregados}</p>
              </div>
            </div>
            <div className="summary-card-glass kpi-red">
              <div className="kpi-icon-glass red-glow"><Percent size={40} /></div>
              <div>
                <p className="kpi-label">% Cumplimiento</p>
                <p className="kpi-value">{cumplimiento}%</p>
              </div>
            </div>
          </div>
          <div className="kpi-details-row">
            <span>
              De <span className="font-semibold">{totalPedidos}</span> pedidos programados, <span className="font-semibold">{entregados}</span> toneladas fueron entregados exitosamente.
              {pendientes > 0 ? " Aún hay pedidos pendientes por entregar." : " ¡Operación sin fallos! 🎯"}
            </span>
          </div>

          {/* SECCIÓN CUMPLIMIENTO */}
          <div className="section-title-row">
            <LineChart className="w-5 h-5" />
            <span className="section-title">Cumplimiento</span>
          </div>
          <div className="cumplimiento-flex-row">
            <div
              ref={el => chartRefs.current[0] = el}
              className="card-cumplimiento-general glass-card"
            >
              <h3 className="cumplimiento-title">Cumplimiento General</h3>
              <p className="cumplimiento-desc">
                Representación del cumplimiento de los pedidos con base en su estado.
              </p>
              <CompliancePie data={chartData.complianceData} />
              <p className="cumplimiento-valor">Despachado: {cumplimiento}%</p>
            </div>
            <div className="card-todo-en-orden glass-card">
              <p className="todo-title">
                ¡Todo en orden! <span className="emoji">🎯</span>
              </p>
              <p className="todo-desc">Todos los pedidos han sido despachados sin errores.</p>
              <div className="todo-icon">✅</div>
            </div>
          </div>

          {/* SECCIONES DE GRÁFICAS */}
          <div className="section-title-row">
            <LineChart className="w-5 h-5" />
            <span className="section-title kpi-green">Tendencias y Entregas</span>
          </div>
          <div className="dashboard-graphs">
            {CHART_CARD_META.slice(0, 4).map(meta => {
              const ChartComp = meta.Comp;
              return (
                <div key={meta.title} ref={el => chartRefs.current[meta.refIdx] = el} className="dashboard-card glass-card">
                  <div className="card-header">
                    <span className="card-icon">{meta.icon}</span>
                    <span className="card-title">{meta.title}</span>
                    <span className="tooltip-help" title={meta.tooltip}>?</span>
                  </div>
                  <div className="card-desc">{meta.desc}</div>
                  <ChartComp data={chartData[meta.dataKey]} />
                  <div className="card-legend">{meta.legend}</div>
                </div>
              );
            })}
          </div>

          <div className="section-title-row kpi-pink">
            <LineChart className="w-5 h-5" />
            <span className="section-title">Distribución y Categorías</span>
          </div>
          <div className="dashboard-graphs">
            {CHART_CARD_META.slice(4, 6).map(meta => {
              const ChartComp = meta.Comp;
              return (
                <div key={meta.title} ref={el => chartRefs.current[meta.refIdx] = el} className="dashboard-card glass-card">
                  <div className="card-header">
                    <span className="card-icon">{meta.icon}</span>
                    <span className="card-title">{meta.title}</span>
                    <span className="tooltip-help" title={meta.tooltip}>?</span>
                  </div>
                  <div className="card-desc">{meta.desc}</div>
                  <ChartComp data={chartData[meta.dataKey]} />
                  <div className="card-legend">{meta.legend}</div>
                </div>
              );
            })}
          </div>

          <div className="section-title-row kpi-orange">
            <LineChart className="w-5 h-5" />
            <span className="section-title">Resúmenes y Pedidos Pendientes</span>
          </div>
          <div className="dashboard-graphs">
            {CHART_CARD_META.slice(6).map(meta => {
              const ChartComp = meta.Comp;
              return (
                <div key={meta.title} ref={el => chartRefs.current[meta.refIdx] = el} className="dashboard-card glass-card">
                  <div className="card-header">
                    <span className="card-icon">{meta.icon}</span>
                    <span className="card-title">{meta.title}</span>
                    <span className="tooltip-help" title={meta.tooltip}>?</span>
                  </div>
                  <div className="card-desc">{meta.desc}</div>
                  <ChartComp data={chartData[meta.dataKey]} />
                  <div className="card-legend">{meta.legend}</div>
                </div>
              );
            })}
          </div>

          {/* HELP MODAL */}
          {showHelp && (
            <div className="help-modal">
              <div className="help-content glass-card">
                <h3 className="text-xl font-semibold mb-2">¿Cómo funciona este panel?</h3>
                <ul className="text-sm text-gray-700 list-disc list-inside">
                  <li>Este panel es exclusivo para tu empresa.</li>
                  <li>Los gráficos muestran entregas, cumplimiento y más.</li>
                  <li>Puedes exportar los datos con el botón de arriba.</li>
                  <li>Pasa el mouse sobre el "?" de cada gráfica si quieres entender rápido cada una.</li>
                </ul>
                <button className="close-help-btn glass-btn" onClick={() => setShowHelp(false)}>Cerrar</button>
              </div>
            </div>
          )}

          {/* AYUDA */}
          <button
            onClick={() => setShowHelp(true)}
            className="help-button-glass"
            title="Ayuda"
          >
            <HelpCircle className="w-6 h-6" />
          </button>

          {/* FOOTER */}
          <footer className="text-center text-sm text-gray-600 mt-12 pt-6 pb-4 border-t glass-card-footer">
            <div className="flex justify-center items-center gap-2 mb-1">
              <Handshake className="w-5 h-5 text-gray-500" />
              <span>Gracias por confiar en nosotros, <strong>{clientName}</strong>. Estamos a tu servicio.</span>
            </div>
            © {new Date().getFullYear()} CEMEX Dashboard.
          </footer>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;