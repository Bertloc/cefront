// components/ReportDeliveryTrendsLineChart.js
import React from 'react';
import { ResponsiveLine } from '@nivo/line';

const ReportDeliveryTrendsLineChart = ({ data }) => {
    return (
        <div style={{ height: "400px", width: "600px" }}>
            <ResponsiveLine
                data={[{ id: 'Tendencias de Entrega', data }]}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Fecha de Entrega',
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Cantidad Entregada',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                colors={{ scheme: 'set1' }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
            />
        </div>
    );
};

export default ReportDeliveryTrendsLineChart;
