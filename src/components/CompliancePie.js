import React from 'react';
import { ResponsivePie } from '@nivo/pie';

const CompliancePie = ({ data }) => {
    return (
        <div className="mt-12" style={{ height: "400px", width: "400px" }}>
            <h2 className="text-2xl font-bold mb-4">Cumplimiento General</h2>
            <ResponsivePie
                data={data}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: 'nivo' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                enableRadialLabels={true}
                enableSliceLabels={true}
            />
        </div>
    );
};

export default CompliancePie;
