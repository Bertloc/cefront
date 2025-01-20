import React from "react";
import { ResponsiveLine } from "@nivo/line";

const ReportDeliveryTrendsLineChart = ({ data }) => {
    const formattedData = data.map(item => ({
        x: new Date(item.x).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        y: item.y
    }));

    return (
        <div style={{
            maxWidth: "550px", 
            margin: "0 auto", 
            padding: "20px", 
            borderRadius: "20px", 
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)", 
            backgroundColor: "#ffffff"
        }}>
            <h2 className="text-3xl font-bold text-center mb-2">Tendencias de Entrega</h2>
            <p className="text-center text-gray-600 mb-6">
                Representación gráfica de la cantidad de productos entregados por fecha.
            </p>

            {/* Gráfico de línea */}
            <div style={{ height: "400px" }}>
                <ResponsiveLine
                    data={[{ id: 'Tendencias de Entrega', data: formattedData }]}
                    margin={{ top: 50, right: 60, bottom: 60, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -20,
                        legend: 'Fecha de Entrega',
                        legendOffset: 45,
                        legendPosition: 'middle'
                    }}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Cantidad Entregada',
                        legendOffset: -50,
                        legendPosition: 'middle'
                    }}
                    lineWidth={2}
                    colors={{ scheme: 'set2' }}
                    pointSize={8}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    enableArea={true}
                    areaOpacity={0.15}
                    useMesh={true}
                    tooltip={({ point }) => (
                        <div style={{
                            padding: "5px 10px",
                            background: "#fff",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                        }}>
                            <strong>{point.data.x}: {point.data.y}</strong>
                        </div>
                    )}
                />
            </div>

            {/* Leyenda del gráfico */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 'bold'
                }}>
                    <div style={{
                        width: '15px',
                        height: '15px',
                        backgroundColor: '#66c2a5',
                        borderRadius: '50%'
                    }}></div>
                    Tendencias de Entrega
                </div>
            </div>
        </div>
    );
};

export default ReportDeliveryTrendsLineChart;
