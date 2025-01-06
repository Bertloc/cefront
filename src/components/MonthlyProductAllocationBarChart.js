// components/MonthlyProductAllocationBarChart.js
import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const MonthlyProductAllocationBarChart = ({ data }) => {
    return (
        <div style={{ height: "400px", width: "600px" }}>
            <ResponsiveBar
                data={data}
                keys={['Cantidad']}
                indexBy="Mes"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                groupMode="grouped"
                colors={{ scheme: 'nivo' }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Mes',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Cantidad',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
            />
        </div>
    );
};

export default MonthlyProductAllocationBarChart;



