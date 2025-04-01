
import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const MonthlyProductAllocationBarChart = ({ data }) => {
    const formattedData = data.map(item => ({
        ...item,
        Mes: new Date(item.Mes).toLocaleDateString('es-MX', { year: 'numeric', month: 'short' })
    }));

    return (
        <div 
            className="mt-12 p-10 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center"
            style={{ height: "500px", width: "100%" }}
        >
            <h2 className="text-3xl font-bold text-center mb-2">Asignación Mensual de Producto</h2>
            <p className="text-center text-gray-600 mb-6">
                Visualización mensual de la cantidad de productos asignados por tipo de material.
            </p>
            
            <ResponsiveBar
                data={formattedData}
                keys={['Cantidad']}
                indexBy="Mes"
                margin={{ top: 30, right: 30, bottom: 70, left: 60 }}
                padding={0.3}
                groupMode="grouped"
                colors={{ scheme: 'set2' }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -20,
                    legend: 'Mes',
                    legendPosition: 'middle',
                    legendOffset: 50
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Cantidad Asignada',
                    legendOffset: -50,
                    legendPosition: 'middle'
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                theme={{
                    axis: {
                        legend: {
                            text: { fontSize: 14, fill: '#333' }
                        },
                        ticks: {
                            text: { fontSize: 12, fill: '#555' }
                        }
                    },
                    labels: {
                        text: { fontSize: 12, fill: '#000' }
                    }
                }}
            />
        </div>
    );
};

export default MonthlyProductAllocationBarChart;
