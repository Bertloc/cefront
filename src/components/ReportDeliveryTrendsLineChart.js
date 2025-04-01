
import React from "react";
import { ResponsiveLine } from "@nivo/line";

const ReportDeliveryTrendsLineChart = ({ data }) => {
    const formattedData = data.map(item => ({
        x: new Date(item.x).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        y: item.y
    }));

    return (
        <div className="mt-12 p-10 bg-white rounded-xl shadow-lg flex flex-col items-center"
            style={{ height: "520px", width: "100%" }}>
            <h2 className="text-3xl font-bold text-center mb-2 text-indigo-700">Tendencias de Entrega</h2>
            <p className="text-center text-gray-600 mb-6 text-sm max-w-2xl">
                Representación gráfica del comportamiento de las entregas a lo largo del tiempo.
            </p>

            <ResponsiveLine
                data={[{ id: 'Entregas', data: formattedData }]}
                margin={{ top: 40, right: 30, bottom: 70, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 0, max: 'auto' }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -20,
                    legend: 'Fecha de Entrega',
                    legendOffset: 50,
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
                lineWidth={3}
                colors={['#7c3aed']}
                pointSize={10}
                pointColor="#ffffff"
                pointBorderWidth={3}
                pointBorderColor="#7c3aed"
                enablePointLabel={false}
                useMesh={true}
                areaOpacity={0.25}
                enableArea={true}
                areaBaselineValue={0}
                tooltip={({ point }) => (
                    <div style={{
                        padding: "6px 12px",
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        fontSize: "13px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.15)"
                    }}>
                        <strong>{point.data.x}</strong><br />
                        {point.data.y} entregas
                    </div>
                )}
                theme={{
                    axis: {
                        ticks: {
                            text: { fontSize: 12, fill: "#444" },
                        },
                        legend: {
                            text: { fontSize: 14, fill: "#333" },
                        }
                    },
                    tooltip: {
                        container: {
                            fontSize: 12
                        }
                    }
                }}
            />
        </div>
    );
};

export default ReportDeliveryTrendsLineChart;
