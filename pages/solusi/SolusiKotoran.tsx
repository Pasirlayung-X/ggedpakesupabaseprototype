
import React from 'react';
import Accordion from '../../components/Accordion'; // Import Accordion

interface ContentPageProps {
  onAdvance?: () => void; // Optional. Only present if it's the current section and not the last overall.
}

const SolusiKotoran: React.FC<ContentPageProps> = ({ onAdvance }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Pengelolaan Kotoran Ternak</h2>
            <Accordion title="Ubah Limbah Menjadi Berkah: Pengelolaan Kotoran yang Efektif" defaultOpen={true}>
                <div className="flex items-center mb-6">
                    <div className="p-4 bg-emerald-100 rounded-full mr-5 flex items-center justify-center h-20 w-20">
                        <span className="text-5xl" role="img" aria-label="gas emoji">💨</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Tujuan: Mencegah pelepasan metana dari kotoran.</h3>
                </div>
                <div className="text-lg text-gray-600 space-y-4 pl-20">
                    <ul className="list-disc list-inside space-y-2 pl-2 marker:text-emerald-500">
                        <li><strong>Digester Biogas:</strong> Ini adalah investasi terbaik untuk peternakan besar. Dengan membangun digester biogas, Anda dapat menangkap metana dari kotoran dan mengubahnya menjadi energi terbarukan (listrik atau panas) sambil mengurangi emisi GRK secara signifikan.</li>
                        <li><strong>Pengomposan Aerobik:</strong> Olah kotoran menjadi kompos. Proses pengomposan yang dilakukan secara aerobik (dengan kehadiran oksigen yang cukup) akan menghasilkan karbon dioksida dan uap air, bukan metana, yang jauh lebih ramah lingkungan.</li>
                        <li><strong>Pembersihan Rutin:</strong> Jaga kebersihan kandang dan kumpulkan kotoran secepatnya. Penyimpanan kotoran dalam kondisi kering atau padat dapat membatasi kondisi anaerobik yang memicu produksi metana.</li>
                        <li><strong>Pemisahan Padat-Cair:</strong> Pertimbangkan sistem yang memisahkan bagian padat dan cair dari kotoran. Bagian padat dapat dikomposkan, sementara bagian cair dapat diolah lebih lanjut atau digunakan sebagai pupuk cair.</li>
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

export default SolusiKotoran;
