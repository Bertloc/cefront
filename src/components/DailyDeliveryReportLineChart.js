// components/DailyDeliveryReportLineChart.js
import React from "react";
import { ResponsiveLine } from "@nivo/line";

const DailyDeliveryReportLineChart = ({ data }) => {
    return (
        <div style={{ height: "400px", width: "600px" }}>
            <h2 className="text-2xl font-bold mb-4">Reporte Diario de Entregas</h2>
            <ResponsiveLine
                data={[{ id: "Reporte Diario de Entregas", data: data }]}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", min: "auto", max: "auto", stacked: true, reverse: false }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: "bottom",
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Fecha Entrega",
                    legendOffset: 36,
                    legendPosition: "middle",
                }}
                axisLeft={{
                    orient: "left",
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Cantidad Entregada",
                    legendOffset: -40,
                    legendPosition: "middle",
                }}
                colors={{ scheme: "category10" }}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                useMesh={true}
                enableSlices="x"
            />
        </div>
    );
};

export default DailyDeliveryReportLineChart;
