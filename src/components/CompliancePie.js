import React from 'react';
import { ResponsivePie } from '@nivo/pie';

const CompliancePie = ({ data }) => {
    // Filtrar solo los datos con valor mayor a cero
    const filteredData = data.filter(item => item.value > 0);
    const total = filteredData.reduce((sum, item) => sum + item.value, 0);
    const normalizedData = filteredData.map(item => ({
        ...item,
        value: ((item.value / total) * 100).toFixed(2)
    }));

    return (
        <div 
            className="mt-12 flex flex-col items-center justify-center shadow-xl rounded-lg bg-white p-10"
            style={{ height: "600px", width: "600px" }}
        >
            {/* ✅ Título y descripción */}
            <h2 className="text-4xl font-bold mb-4 text-center text-gray-800">Cumplimiento General</h2>
            <p className="text-lg text-gray-600 mb-8 text-center">
                Representación del cumplimiento de los pedidos con base en su estado.
            </p>

            {/* ✅ Gráfico mejorado sin valores cero */}
            <ResponsivePie
                data={normalizedData}
                margin={{ top: 40, right: 100, bottom: 100, left: 100 }}
                innerRadius={0.6}
                padAngle={1.5}
                cornerRadius={6}
                colors={["#4CAF50", "#FF9800", "#F44336", "#2196F3"]}
                borderWidth={3}
                borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
                
                // ✅ Ocultar etiquetas si no hay datos
                enableRadialLabels={true}
                radialLabel={d => `${d.id}: ${d.value}%`}
                radialLabelsSkipAngle={15}
                radialLabelsTextColor="#333"
                radialLabelsLinkColor={{ from: 'color' }}
                radialLabelsLinkStrokeWidth={2}

                enableSliceLabels={true}
                sliceLabel={({ value }) => `${value}%`}
                sliceLabelsSkipAngle={10}
                sliceLabelsTextColor="#222"

                // ✅ Tooltip con valores dinámicos
                tooltip={({ id, value, color }) => (
                    <div style={{ padding: '10px', borderRadius: '5px', border: `2px solid ${color}`, background: 'white' }}>
                        <strong style={{ color }}>{id}</strong>: {value}% del total
                    </div>
                )}
            />

            {/* ✅ Leyenda mejorada: Solo mostrar si hay datos */}
            <div className="mt-8 flex justify-center space-x-6">
                {normalizedData.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <div style={{ backgroundColor: item.color, width: '20px', height: '20px', marginRight: '10px', borderRadius: '50%' }} />
                        <span className="text-lg font-semibold">{item.id}: {item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompliancePie;
