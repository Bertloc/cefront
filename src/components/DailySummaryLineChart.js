
import React from "react";
import { ResponsiveLine } from "@nivo/line";

const DailySummaryLineChart = ({ data }) => {
    return (
        <div style={{
            maxWidth: "650px",
            margin: "0 auto",
            padding: "20px",
            borderRadius: "20px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            backgroundColor: "#ffffff"
        }}>
            <h2 className="text-3xl font-bold text-center mb-2">Resumen Diario de Aprovechamiento</h2>
            <p className="text-center text-gray-600 mb-6">
                Porcentaje de aprovechamiento de entregas por día.
            </p>

            <div style={{ height: "400px" }}>
                <ResponsiveLine
                    data={[{ id: "Resumen Diario", data }]}
                    margin={{ top: 50, right: 60, bottom: 60, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 0, max: 100 }}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -20,
                        legend: 'Fecha de Entrega',
                        legendOffset: 45,
                        legendPosition: 'middle'
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: '% Aprovechamiento',
                        legendOffset: -50,
                        legendPosition: 'middle'
                    }}
                    pointSize={10}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    colors={{ scheme: 'set1' }}
                    useMesh={true}
                    enableArea={true}
                    areaOpacity={0.15}
                    enableSlices="x"
                    tooltip={({ point }) => (
                        <div style={{
                            padding: "5px 10px",
                            background: "#fff",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                        }}>
                            <strong>{point.data.x}: {point.data.y}%</strong>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default DailySummaryLineChart;
