import React from "react";
import { ResponsivePie } from "@nivo/pie";

const ProductCategorySummaryPieChart = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Filtrar los datos de bajo porcentaje
    const filteredData = data.filter(item => (item.value / total) >= 0.05);
    const lowPercentageData = data.filter(item => (item.value / total) < 0.05);

    // Mapeo de colores fijo para mantener la consistencia visual entre el gráfico y la leyenda
    const colorPalette = [
        "#E63946", "#F4A261", "#E9C46A", "#2A9D8F", "#264653", "#A8DADC", "#457B9D", "#1D3557"
    ];

    // Asignar los colores al dataset para usarlos tanto en la gráfica como en la leyenda
    const coloredData = filteredData.map((item, index) => ({
        ...item,
        color: colorPalette[index % colorPalette.length]  // Ciclo de colores si hay más elementos
    }));

    return (
        <div style={{ 
            maxWidth: "600px", 
            margin: "0 auto", 
            padding: "30px", 
            borderRadius: "25px", 
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)", 
            backgroundColor: "#ffffff"
        }}>
            {/* Título */}
            <h2 className="text-3xl font-bold text-center mb-3">Resumen por Categoría de Producto</h2>
            <p className="text-center text-gray-700 mb-8">Visualización de la distribución de productos por categoría.</p>

            {/* Gráfico de pastel */}
            <div style={{ height: "400px", marginBottom: "40px" }}>
                <ResponsivePie
                    data={coloredData}
                    margin={{ top: 50, right: 100, bottom: 100, left: 100 }}
                    innerRadius={0.5}
                    padAngle={1.5}
                    cornerRadius={6}
                    colors={coloredData.map(item => item.color)}
                    borderWidth={2}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.5]] }}
                    radialLabelsSkipAngle={10}
                    radialLabelsTextColor="#333"
                    radialLabelsLinkColor={{ from: 'color' }}
                    sliceLabelsSkipAngle={10}
                    sliceLabelsTextColor="#333"
                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                    enableArcLabels={true}
                    animate={true}
                    motionConfig="gentle"
                    tooltip={({ datum }) => (
                        <div style={{
                            padding: "8px 12px",
                            background: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}>
                            <strong style={{ color: datum.color }}>
                                {datum.id}: {datum.value.toLocaleString()} ({((datum.value / total) * 100).toFixed(2)}%)
                            </strong>
                        </div>
                    )}
                />
            </div>

            {/* ✅ Leyenda de Colores corregida con colores 100% sincronizados */}
            <div style={{
                marginTop: "20px",
                padding: "10px",
                textAlign: "center"
            }}>
                <h3 className="text-lg font-semibold mb-2">Leyenda de Colores:</h3>
                <ul style={{ 
                    listStyleType: "none", 
                    display: "flex", 
                    justifyContent: "center", 
                    flexWrap: "wrap", 
                    padding: 0
                }}>
                    {coloredData.map((item, index) => (
                        <li key={index} style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "5px 10px"
                        }}>
                            <span style={{
                                display: "inline-block",
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                backgroundColor: item.color,
                                marginRight: "10px"
                            }}></span>
                            {item.id}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Tabla con categorías de bajo porcentaje */}
            {lowPercentageData.length > 0 && (
                <div style={{
                    marginTop: "30px",
                    padding: "20px",
                    borderRadius: "15px",
                    backgroundColor: "#f1f1f1",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}>
                    <h3 className="text-xl font-semibold mb-4 text-center">Categorías con Bajo Porcentaje:</h3>
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {lowPercentageData.map(item => (
                            <li key={item.id} style={{ marginBottom: "8px", fontWeight: "bold" }}>
                                <span style={{
                                    display: "inline-block",
                                    width: "18px",
                                    height: "18px",
                                    borderRadius: "50%",
                                    backgroundColor: colorPalette[item.index % colorPalette.length],
                                    marginRight: "10px"
                                }}></span>
                                {item.id}: {item.value.toLocaleString()} ({((item.value / total) * 100).toFixed(2)}%)
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProductCategorySummaryPieChart;
