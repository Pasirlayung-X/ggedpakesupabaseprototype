import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LabelList, Cell } from 'recharts';

interface ContentPageProps {
  onAdvance?: () => void; // Optional, but DataMetana won't display a button
}

const gwpData = [
    { gas: 'CO2', value: 1, color: '#60A5FA' },
    { gas: 'Metana (CH4)', value: 28, color: '#F59E0B' },
];

const lifetimeData = [
    { gas: 'CO2', value: 1000, color: '#60A5FA' },
    { gas: 'Metana (CH4)', value: 12, color: '#F59E0B' },
];

const DataMetana: React.FC<ContentPageProps> = () => {
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
            <div className="max-w-4xl w-full mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Metana vs. CO2: Potensi & Peluang
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    Mari kita bandingkan dua gas rumah kaca utama ini untuk memahami mengapa metana (CH4) adalah target penting untuk aksi iklim cepat, meskipun jumlahnya di atmosfer lebih sedikit.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Potensi Pemanasan Global (GWP) Chart */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-bold text-xl text-blue-800 mb-4">1. Potensi Pemanasan Global (GWP-100)</h4>
                        <p className="text-sm text-gray-700 mb-4">Seberapa banyak panas yang dapat diperangkap oleh gas dibandingkan dengan CO2 selama 100 tahun.</p>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={gwpData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="gas" tickLine={false} axisLine={false} tick={axisTickStyle} />
                                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={axisTickStyle} label={{ value: 'GWP Relatif', angle: -90, position: 'insideLeft', offset: -10, fill: axisTickStyle.fill, fontSize: axisTickStyle.fontSize }} />
                                    <Tooltip
                                        contentStyle={tooltipContentStyle}
                                        itemStyle={tooltipItemStyle}
                                        formatter={(value, name) => [`${value}x CO2`, name]}
                                    />
                                    <Bar dataKey="value" name="GWP" barSize={40} radius={[4, 4, 0, 0]}>
                                        {gwpData.map((entry, index) => (
                                            <Cell key={`cell-gwp-${index}`} fill={entry.color} />
                                        ))}
                                        <LabelList dataKey="value" position="top" formatter={(value) => `${value}x`} fill="#4b5563" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-md text-blue-700 mt-4 font-semibold">
                            Metana <span className="text-blue-900 font-extrabold">{gwpData[1].value} kali</span> lebih kuat memerangkap panas daripada CO2!
                        </p>
                    </div>

                    {/* Masa Hidup di Atmosfer Chart */}
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <h4 className="font-bold text-xl text-amber-800 mb-4">2. Masa Hidup di Atmosfer (Tahun)</h4>
                        <p className="text-sm text-gray-700 mb-4">Berapa lama gas ini bertahan di atmosfer sebelum terurai.</p>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={lifetimeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="gas" tickLine={false} axisLine={false} tick={axisTickStyle} />
                                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={axisTickStyle} label={{ value: 'Tahun', angle: -90, position: 'insideLeft', offset: -10, fill: axisTickStyle.fill, fontSize: axisTickStyle.fontSize }} />
                                    <Tooltip
                                        contentStyle={tooltipContentStyle}
                                        itemStyle={tooltipItemStyle}
                                        formatter={(value, name) => [`${value} tahun`, name]}
                                    />
                                    <Bar dataKey="value" name="Masa Hidup" barSize={40} radius={[4, 4, 0, 0]}>
                                        {lifetimeData.map((entry, index) => (
                                            <Cell key={`cell-lifetime-${index}`} fill={entry.color} />
                                        ))}
                                        <LabelList dataKey="value" position="top" formatter={(value) => `${value} tahun`} fill="#4b5563" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-md text-amber-700 mt-4 font-semibold">
                            Metana hanya bertahan sekitar <span className="text-amber-900 font-extrabold">{lifetimeData[1].value} tahun</span>, jauh lebih singkat dari CO2!
                        </p>
                    </div>
                </div>

                <div className="text-left mt-8 p-6 bg-emerald-50 rounded-lg border border-emerald-200">
                    <h4 className="font-bold text-lg text-emerald-800 mb-2">Mengapa Ini Penting bagi Peternak?</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>Dampak Cepat:</strong> Mengurangi emisi metana dari peternakan akan memberikan hasil yang lebih cepat dalam memperlambat pemanasan global dibanding mengurangi CO2.</li>
                        <li><strong>Kontrol Langsung:</strong> Sebagai peternak, Anda memiliki kontrol langsung atas sumber-sumber metana (pakan dan kotoran) di operasional Anda.</li>
                        <li><strong>Peluang Inovasi:</strong> Mengelola metana bisa berarti energi baru (biogas) dan pupuk alami, mengubah masalah menjadi solusi!</li>
                    </ul>
                </div>
                <p className="text-sm text-gray-500 mt-6">
                    *Data GWP (Global Warming Potential) berdasarkan Laporan Penilaian ke-5 (AR5) IPCC. Angka dapat bervariasi antar laporan.
                </p>
            </div>
        </div>
    );
};

export default DataMetana;