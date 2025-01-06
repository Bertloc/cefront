// components/DistributionByCenterPieChart.js
import React from "react";
import { ResponsivePie } from "@nivo/pie";

const DistributionByCenterPieChart = ({ data }) => {
    return (
        <div style={{ height: "400px", width: "400px" }}>
            <h2 className="text-2xl font-bold mb-4">Distribución por Centro</h2>
            <ResponsivePie
                data={data}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: 'set2' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                radialLabelsSkipAngle={10}
                radialLabelsTextColor="#333333"
                radialLabelsLinkColor={{ from: 'color' }}
                sliceLabelsSkipAngle={10}
                sliceLabelsTextColor="#333333"
            />
        </div>
    );
};

export default DistributionByCenterPieChart;
