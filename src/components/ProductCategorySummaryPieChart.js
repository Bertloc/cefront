// components/ProductCategorySummaryPieChart.js
import React from "react";
import { ResponsivePie } from "@nivo/pie";

const ProductCategorySummaryPieChart = ({ data }) => {
    return (
        <div style={{ height: "400px", width: "600px" }}>
            <h2 className="text-2xl font-bold mb-4">Resumen por Categoría de Producto</h2>
            <ResponsivePie
                data={data}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: "nivo" }}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                enableRadialLabels={true}
                radialLabel={(d) => `${d.label}: ${d.value}`}
                enableSliceLabels={true}
                sliceLabel={(d) => `${d.value}`}
                legends={[
                    {
                        anchor: "bottom",
                        direction: "row",
                        justify: false,
                        translateY: 56,
                        itemsSpacing: 10,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: "#333",
                        symbolSize: 18,
                        symbolShape: "circle",
                    },
                ]}
            />
        </div>
    );
};

export default ProductCategorySummaryPieChart;
