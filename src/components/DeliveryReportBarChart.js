// components/DeliveryReportBarChart.js
import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const DeliveryReportBarChart = ({ data }) => {
    return (
        <div style={{ height: "400px", width: "600px" }}>
            <ResponsiveBar
                data={data}
                keys={['Cantidad entrega']}
                indexBy="Fecha Entrega"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                groupMode="stacked"
                colors={{ scheme: 'set2' }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Fecha de Entrega',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Cantidad Entregada',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20
                    }
                ]}
            />
        </div>
    );
};

export default DeliveryReportBarChart;
