
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
                <div className="flex items-start mb-6">
                     <div className="p-4 bg-emerald-100 rounded-full mr-5 flex items-center justify-center h-20 w-20 flex-shrink-0">
                        <span className="text-5xl" role="img" aria-label="compost emoji">♻️</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">Tujuan: Mencegah pelepasan metana dari kotoran.</h3>
                        <p className="text-gray-600 mt-1">Kotoran yang menumpuk tanpa oksigen adalah pabrik metana. Dengan pengelolaan yang tepat, kita bisa menghentikannya.</p>
                    </div>
                </div>
                <div className="text-lg text-gray-600 space-y-4">
                    <ul className="list-disc list-inside space-y-2 pl-2 marker:text-emerald-500">
                        <li><strong>Digester Biogas:</strong> Ini adalah investasi terbaik untuk peternakan. Dengan membangun digester biogas, Anda dapat menangkap metana dari kotoran dan mengubahnya menjadi energi terbarukan (listrik atau panas) sambil mengurangi emisi GRK secara signifikan.</li>
                        <li><strong>Pengomposan Aerobik:</strong> Olah kotoran menjadi kompos. Proses pengomposan yang dilakukan secara aerobik (dengan kehadiran oksigen yang cukup, misal dengan cara dibolak-balik) akan menghasilkan CO2, bukan metana, yang jauh lebih ramah lingkungan.</li>
                        <li><strong>Pembersihan Rutin:</strong> Jaga kebersihan kandang dan kumpulkan kotoran secepatnya. Penyimpanan kotoran dalam kondisi kering atau padat dapat membatasi kondisi anaerobik yang memicu produksi metana.</li>
                        <li><strong>Pemisahan Padat-Cair:</strong> Pertimbangkan sistem yang memisahkan bagian padat dan cair dari kotoran. Bagian padat dapat dikomposkan, sementara bagian cair dapat diolah lebih lanjut atau digunakan sebagai pupuk cair.</li>
                    </ul>
                     <div className="mt-6 pt-4 border-t border-gray-200 bg-emerald-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-emerald-800">💡 Terkait Checklist Harian: "Pengelolaan Kotoran" & "Pembuatan Kompos"</h4>
                        <p className="text-gray-700 text-base mt-1">
                            Mencentang tugas-tugas ini berarti Anda telah membersihkan kandang dan mulai mengolah kotoran dengan benar, baik dengan memasukkannya ke dalam digester biogas atau memulai proses pengomposan aerobik.
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

export default SolusiKotoran;
