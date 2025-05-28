import React from "react";
import cemexLogo from "../assets/images/logo-cemex.png"; // Usa tu base64 o import real

const cardStyle = {
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 4px 24px #0001",
  padding: 24,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minHeight: 220,
  marginBottom: 0,
};

const labelStyle = { color: "#888", fontSize: 12, marginBottom: 4 };
const numberStyle = { fontWeight: 600, fontSize: 24, marginBottom: 0 };

const PDFDashboardPanel = React.forwardRef((props, ref) => {
  const {
    clientName = "Cliente",
    fecha = "",
    pedidos = 0,
    entregas = 0,
    cumplimiento = 0,
    complianceChart,
    distributionChart,
    dailySummaryChart,
    // Puedes agregar más charts o props aquí
  } = props;

  return (
    <div
      ref={ref}
      style={{
        width: "794px",
        minHeight: "1123px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "16px",
        padding: "40px 36px",
        fontFamily: "Inter, Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Dashboard del Cliente</h1>
          <div style={{ color: "#888", fontSize: 14 }}>{fecha}</div>
        </div>
        <img src={cemexLogo} alt="Cemex" style={{ height: 36 }} />
      </div>

      <div style={{ height: 1, background: "#eee", margin: "20px 0" }} />

      {/* KPIs */}
      <div style={{ display: "flex", gap: 40, marginBottom: 32 }}>
        <div>
          <div style={labelStyle}>PEDIDOS</div>
          <div style={numberStyle}>{pedidos}</div>
        </div>
        <div>
          <div style={labelStyle}>ENTREGAS</div>
          <div style={numberStyle}>{entregas}</div>
        </div>
        <div>
          <div style={labelStyle}>% CUMPLIMIENTO</div>
          <div style={numberStyle}>{cumplimiento}%</div>
        </div>
      </div>

      {/* Resumen cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 32,
        }}
      >
        <div style={cardStyle}>
          <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>Cumplimiento General</div>
          {complianceChart}
          <div style={{ fontSize: 14, color: "#888", marginTop: 8 }}>
            Porcentaje de cumplimiento en los pedidos desde que inició el estudio
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>Distribución de Productos</div>
          {distributionChart}
          <div style={{ fontSize: 14, color: "#888", marginTop: 8 }}>
            Leyenda de colores
          </div>
        </div>
      </div>

      {/* Card de aprovechamiento */}
      <div style={{ ...cardStyle, marginBottom: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>Resumen Diario de Aprovechamiento</div>
        {dailySummaryChart}
        <div style={{ fontSize: 14, color: "#888", marginTop: 8 }}>
          Porcentaje de dailyilizaciones
        </div>
      </div>
      {/* Agrega más bloques/cards según lo que necesites */}
    </div>
  );
});

export default PDFDashboardPanel;