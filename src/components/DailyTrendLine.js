import React from 'react';
import { ResponsiveLine } from '@nivo/line';

const DailyTrendLine = ({ data }) => {
    // Validación de fechas para evitar errores con valores nulos
    const formattedData = data
        .filter(item => item.x)
        .map(item => ({
            x: new Date(item.x), // Convertir a objeto Date
            y: item.y
        }));

    return (
        <div 
            className="mt-12 p-10 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center"
            style={{ height: "500px", width: "100%" }}
        >
            <h2 className="text-3xl font-bold text-center mb-2">Tendencia Diaria</h2>
            <p className="text-center text-gray-600 mb-6">
                Representación gráfica de la cantidad de productos entregados por fecha.
            </p>
            
            <ResponsiveLine
                data={[{ id: 'Tendencia Diaria', data: formattedData }]}
                margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
                xScale={{ type: 'time' }}
                xFormat="time:%d %b"
                yScale={{ type: 'linear', min: 0, max: 'auto' }}
                curve="natural"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    format: '%d %b',
                    tickValues: 'every 1 days',
                    tickSize: 5,
                    tickPadding: 10,
                    tickRotation: -20,
                    legend: 'Fecha de Entrega',
                    legendOffset: 50,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Cantidad Entregada',
                    legendOffset: -50,
                    legendPosition: 'middle'
                }}
                enablePoints={true}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                colors={{ scheme: 'set2' }}
                useMesh={true}
                enableArea={true}
                areaBlendMode="normal"
                areaOpacity={0.3}
                areaBaselineValue={0}
            />
        </div>
    );
};

export default DailyTrendLine;
