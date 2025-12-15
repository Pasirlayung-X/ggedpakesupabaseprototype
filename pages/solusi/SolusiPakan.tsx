import React from 'react';
import { LeafIcon } from '../../components/icons/LeafIcon';
import Accordion from '../../components/Accordion'; // Import Accordion

interface ContentPageProps {
  onAdvance?: () => void; // Optional. Only present if it's the current section and not the last overall.
}

const SolusiPakan: React.FC<ContentPageProps> = ({ onAdvance }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Manajemen Pakan Ternak</h2>
            <Accordion title="Strategi Mengurangi Metana Melalui Pakan" defaultOpen={true}>
                <div className="flex items-center mb-6">
                    <div className="p-4 bg-emerald-100 rounded-full mr-5">
                        <LeafIcon className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Tujuan: Mengubah proses pencernaan sapi.</h3>
                </div>
                <div className="text-lg text-gray-600 space-y-4 pl-20">
                    <ul className="list-disc list-inside space-y-2 pl-2 marker:text-emerald-500">
                        <li><strong>Suplemen Pakan:</strong> Pertimbangkan penambahan suplemen khusus ke dalam pakan. Beberapa contoh termasuk tanin, saponin, atau minyak esensial yang terbukti dapat mengurangi produksi metana dalam rumen sapi.</li>
                        <li><strong>Kualitas Pakan Tinggi:</strong> Berikan pakan berkualitas tinggi yang kaya nutrisi dan mudah dicerna. Pakan yang lebih efisien dicerna akan mengurangi jumlah metana yang dihasilkan per unit produk (susu atau daging).</li>
                        <li><strong>Pakan Bervariasi:</strong> Perkenalkan variasi pakan seperti hijauan berkualitas, silase, atau pakan konsentrat seimbang untuk mendukung pencernaan optimal.</li>
                        <li><strong>Konsultasi Ahli:</strong> Bekerja sama dengan ahli nutrisi ternak. Mereka dapat membantu merancang ransum pakan yang optimal dan sesuai dengan kebutuhan spesifik ternak Anda, sambil mempertimbangkan aspek mitigasi metana.</li>
                    </ul>
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