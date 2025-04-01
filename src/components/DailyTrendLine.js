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
            className="mt-12 px-6 py-10 bg-white rounded-2xl shadow-xl"
            style={{ height: "500px", width: "100%" }}
        >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-gray-800">Tendencia Diaria</h2>
            <p className="text-center text-sm md:text-base text-gray-500 mb-6">
                Representación gráfica de la cantidad de productos entregados por fecha.
            </p>
            
            <ResponsiveLine
                data={[{ id: 'Tendencia Diaria', data: formattedData }]}
                margin={{ top: 50, right: 40, bottom: 80, left: 60 }}
                xScale={{ type: 'time', format: 'native' }}
                xFormat="time:%d %b"
                yScale={{ type: 'linear', min: 0, max: 'auto' }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    format: '%d %b',
                    tickValues: 'every 3 days',
                    tickSize: 5,
                    tickPadding: 8,
                    tickRotation: -30,
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
                pointSize={8}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                colors={{ scheme: 'set2' }}
                useMesh={true}
                enableArea={true}
                areaBlendMode="normal"
                areaOpacity={0.25}
                areaBaselineValue={0}
                theme={{
                    axis: {
                        ticks: {
                            text: {
                                fontSize: 12,
                                fill: '#555'
                            }
                        },
                        legend: {
                            text: {
                                fontSize: 14,
                                fill: '#333'
                            }
                        }
                    }
                }}
            />
        </div>
    );
};

export default DailyTrendLine;
