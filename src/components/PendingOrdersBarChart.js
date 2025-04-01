import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const PendingOrdersBarChart = ({ data }) => {
    if (data.length === 0 || data.every(item => item['Cantidad confirmada'] === 0)) {
        return (
            <div
                style={{
                    height: '400px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        backgroundColor: '#e6fffa',
                        padding: '25px 40px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center',
                    }}
                >
                    <h2 style={{ color: '#0f5132', fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                        Sin Pedidos Pendientes
                    </h2>
                    <p style={{ color: '#0f5132', fontSize: '15px' }}>
                        Actualmente no hay materiales con pedidos pendientes por entregar. ✅
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ height: '400px' }}>
            <ResponsiveBar
                data={data}
                keys={['Cantidad confirmada']}
                indexBy="Material"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'nivo' }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Material',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Cantidad confirmada',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                enableLabel={false}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
            />
        </div>
    );
};

export default PendingOrdersBarChart;