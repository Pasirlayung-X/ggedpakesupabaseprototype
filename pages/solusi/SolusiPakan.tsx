
import React from 'react';
import Accordion from '../../components/Accordion'; // Import Accordion

interface ContentPageProps {
  onAdvance?: () => void; // Optional. Only present if it's the current section and not the last overall.
}

const SolusiPakan: React.FC<ContentPageProps> = ({ onAdvance }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Manajemen Pakan Ternak</h2>
            <Accordion title="Strategi Mengurangi Metana Melalui Pakan" defaultOpen={true}>
                <div className="flex items-start mb-6">
                    <div className="p-4 bg-emerald-100 rounded-full mr-5 flex items-center justify-center h-20 w-20 flex-shrink-0">
                        <span className="text-5xl" role="img" aria-label="leaf emoji">🌿</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">Tujuan: Mengubah proses pencernaan sapi.</h3>
                        <p className="text-gray-600 mt-1">Dengan mengoptimalkan pakan, kita bisa membuat pencernaan sapi lebih efisien dan menghasilkan lebih sedikit metana.</p>
                    </div>
                </div>
                <div className="text-lg text-gray-600 space-y-4">
                    <ul className="list-disc list-inside space-y-2 pl-2 marker:text-emerald-500">
                        <li><strong>Suplemen Pakan:</strong> Pertimbangkan penambahan suplemen khusus ke dalam pakan. Beberapa contoh termasuk tanin, saponin, atau minyak esensial yang terbukti dapat mengurangi produksi metana dalam rumen sapi.</li>
                        <li><strong>Kualitas Pakan Tinggi:</strong> Berikan pakan berkualitas tinggi yang kaya nutrisi dan mudah dicerna. Pakan yang lebih efisien dicerna akan mengurangi jumlah metana yang dihasilkan per unit produk (susu atau daging).</li>
                        <li><strong>Pakan Bervariasi:</strong> Perkenalkan variasi pakan seperti hijauan berkualitas, silase, atau pakan konsentrat seimbang untuk mendukung pencernaan optimal.</li>
                        <li><strong>Konsultasi Ahli:</strong> Bekerja sama dengan ahli nutrisi ternak. Mereka dapat membantu merancang ransum pakan yang optimal dan sesuai dengan kebutuhan spesifik ternak Anda, sambil mempertimbangkan aspek mitigasi metana.</li>
                    </ul>

                    <div className="mt-6 pt-4 border-t border-gray-200 bg-emerald-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-emerald-800">💡 Terkait Checklist Harian: "Manajemen Pakan"</h4>
                        <p className="text-gray-700 text-base mt-1">
                            Saat Anda mencentang tugas ini, itu berarti Anda telah menerapkan salah satu strategi di atas. Misalnya, memberikan suplemen yang direkomendasikan atau memastikan ransum pakan hari itu memiliki kualitas terbaik.
                        </p>
                    </div>
                </div>
            </Accordion>
            {onAdvance && ( // Hanya render tombol jika prop onAdvance diberikan
                <div className="flex justify-center mt-8">
                    <button
                        onClick={onAdvance}
                        className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors duration-300 shadow-md"
                        aria-label="Lanjutkan ke topik berikutnya"
                    >
                        Kalau sudah mengerti.. LANJUT
                    </button>
                </div>
            )}
        </div>
    );
};

export default SolusiPakan;
