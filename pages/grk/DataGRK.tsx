
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface ContentPageProps {
  onAdvance?: () => void; // Optional, but DataGRK won't display a button
}

const data = [
    { name: 'Peternakan', value: 14.5 },
    { name: 'Energi', value: 35 },
    { name: 'Industri', value: 24 },
    { name: 'Transportasi', value: 16 },
    { name: 'Lainnya', value: 10.5 },
];

// Fixed to light theme colors
const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#6B7280'];


const DataGRK: React.FC<ContentPageProps> = () => {
    // Tooltip style for consistency
    const tooltipContentStyle = {
        backgroundColor: '#ffffff',
        border: `1px solid #e5e7eb`,
        borderRadius: '0.5rem'
    };
    const tooltipItemStyle = { color: '#111827' };
    const axisTickStyle = { fill: '#4b5563', fontSize: 12 };

    return (
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
            <div className="max-w-3xl w-full mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Peran Peternakan dalam Emisi Global
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    Menurut Organisasi Pangan dan Pertanian (FAO), sektor peternakan menyumbang sekitar <span className="font-bold text-emerald-600">14.5%</span> dari total emisi gas rumah kaca global yang disebabkan oleh manusia. Angka ini mencakup seluruh rantai pasok, mulai dari produksi pakan, fermentasi enterik, hingga pengolahan limbah.
                </p>
                <div className="w-full" style={{ height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                        <PieChart>
                            <Tooltip
                                contentStyle={tooltipContentStyle}
                                itemStyle={tooltipItemStyle}
                            />
                            <Legend iconType="circle" wrapperStyle={{ color: '#374151' }}/>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                 <div className="text-left mt-8 p-6 bg-emerald-50 rounded-lg border border-emerald-200">
                    <h4 className="font-bold text-lg text-emerald-800 mb-2">Poin Penting:</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Meskipun sektor energi dan industri menjadi kontributor terbesar, peternakan memiliki peran yang signifikan dan tidak dapat diabaikan.</li>
                        <li>Emisi dari peternakan didominasi oleh metana (CH4), gas rumah kaca yang sangat kuat, menjadikannya target penting untuk mitigasi.</li>
                        <li>Solusi di sektor peternakan, seperti manajemen pakan dan limbah, menawarkan peluang besar untuk mengurangi emisi secara efektif.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DataGRK;