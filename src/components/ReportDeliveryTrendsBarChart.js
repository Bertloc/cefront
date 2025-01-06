// components/ReportDeliveryTrendsBarChart.js
import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const ReportDeliveryTrendsBarChart = ({ data }) => {
    return (
        <div style={{ height: '400px', width: '600px' }}>
            <h2 className="text-2xl font-bold mb-4">Tendencias de Entrega</h2>
            <ResponsiveBar
                data={data}
                keys={['Cantidad entrega']}
                indexBy="Fecha Entrega"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                colors={{ scheme: 'nivo' }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    legend: 'Fecha Entrega',
                    legendPosition: 'middle',
                    legendOffset: 32,
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Cantidad Entrega',
                    legendPosition: 'middle',
                    legendOffset: -40,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            />
        </div>
    );
};

export default ReportDeliveryTrendsBarChart;
