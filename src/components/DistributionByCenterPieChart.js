import React from "react";
import { ResponsivePie } from "@nivo/pie";

const DistributionByCenterPieChart = ({ data }) => {
    // Calcular el total
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Evitar errores si los valores son nulos o menores a 0
    if (total === 0 || data.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
                <h2>No hay datos disponibles para mostrar el gráfico.</h2>
            </div>
        );
    }

    // Separar los datos: valores altos y bajos
    const lowPercentageData = data.filter(item => (item.value / total) < 0.05);
    const highPercentageData = data.filter(item => (item.value / total) >= 0.05);

    // Asignación de colores manual para asegurar consistencia
    const colorScheme = [
        "#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#7E57C2", "#FF9800", "#009688"
    ];

    const pieChartData = highPercentageData.map((item, index) => ({
        ...item,
        color: colorScheme[index % colorScheme.length] // Asegurar colores cíclicos
    }));

    return (
        <div style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            backgroundColor: "#fff"
        }}>
            <h2 className="text-3xl font-bold text-center">Distribución por Centro</h2>
            <p className="text-center mb-6 text-gray-600">Visualización de la distribución de productos por centros logísticos.</p>

            {/* Gráfico Pie Chart */}
            <div style={{ height: "400px" }}>
                <ResponsivePie
                    data={pieChartData}
                    margin={{ top: 50, right: 80, bottom: 50, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    colors={pieChartData.map(item => item.color)} // Colores directos
                    borderWidth={2}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
                    radialLabelsSkipAngle={10}
                    radialLabelsTextColor="#333333"
                    radialLabelsLinkColor={{ from: 'color' }}
                    sliceLabelsSkipAngle={10}
                    sliceLabelsTextColor="#333333"
                    enableArcLabels={true}
                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                    tooltip={({ datum }) => (
                        <div style={{
                            padding: "5px 10px",
                            background: "#ffffff",
                            border: "1px solid #ccc",
                            borderRadius: "5px"
                        }}>
                            <strong>{datum.id}:</strong> {datum.value.toLocaleString()} ({((datum.value / total) * 100).toFixed(2)}%)
                        </div>
                    )}
                />
            </div>

            {/* Leyenda de colores con colores sincronizados */}
            <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                flexWrap: "wrap", 
                marginTop: "20px" 
            }}>
                {pieChartData.map((item, index) => (
                    <div key={index} style={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: "15px"
                    }}>
                        <div style={{
                            width: "15px",
                            height: "15px",
                            backgroundColor: item.color,
                            borderRadius: "50%",
                            marginRight: "8px"
                        }} />
                        <span>{item.id}</span>
                    </div>
                ))}
            </div>

            {/* Tabla de centros con bajo porcentaje */}
            {lowPercentageData.length > 0 && (
                <div style={{
                    marginTop: "30px",
                    padding: "20px",
                    borderRadius: "12px",
                    backgroundColor: "#f9fafb",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                }}>
                    <h3 className="text-xl font-semibold text-center mb-4">Centros con Bajo Porcentaje</h3>
                    <ul style={{ listStyle: "none", paddingLeft: 0, textAlign: "center" }}>
                        {lowPercentageData.map(item => (
                            <li key={item.id} style={{ marginBottom: "8px", fontWeight: "500" }}>
                                <strong>{item.id}:</strong> {item.value.toLocaleString()} ({((item.value / total) * 100).toFixed(2)}%)
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DistributionByCenterPieChart;
