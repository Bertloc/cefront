// components/DailySummaryLineChart.js
import React from "react";
import { ResponsiveLine } from "@nivo/line";

const DailySummaryLineChart = ({ data }) => {
    return (
        <div style={{ height: "400px", width: "600px" }}>
            <h2 className="text-2xl font-bold mb-4">Resumen Diario</h2>
            <ResponsiveLine
                data={[{ id: "Resumen Diario", data }]}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Fecha Entrega',
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Cantidad Entregada',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                colors={{ scheme: 'nivo' }}
                useMesh={true}
                enableSlices="x"
            />
        </div>
    );
};

export default DailySummaryLineChart;
