
import React from 'react';
import Accordion from '../../components/Accordion'; // Import Accordion

interface ContentPageProps {
  onAdvance?: () => void; // Optional. Only present if it's the current section and not the last overall.
}

const SolusiKesehatan: React.FC<ContentPageProps> = ({ onAdvance }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Kesehatan & Genetika Ternak</h2>
            <Accordion title="Ternak Sehat, Lingkungan Bersih: Mengoptimalkan Efisiensi Ternak" defaultOpen={true}>
                <div className="flex items-start mb-6">
                    <div className="p-4 bg-emerald-100 rounded-full mr-5 flex items-center justify-center h-20 w-20 flex-shrink-0">
                         <span className="text-5xl" role="img" aria-label="health emoji">❤️‍🩹</span>
                    </div>
                     <div>
                        <h3 className="text-2xl font-bold text-gray-800">Tujuan: Meningkatkan efisiensi ternak secara keseluruhan.</h3>
                        <p className="text-gray-600 mt-1">Sapi yang sehat dan produktif secara alami menghasilkan lebih sedikit emisi per kilogram produk yang dihasilkan.</p>
                    </div>
                </div>
                <div className="text-lg text-gray-600 space-y-4">
                    <ul className="list-disc list-inside space-y-2 pl-2 marker:text-emerald-500">
                        <li><strong>Ternak Sehat = Efisiensi Lebih Tinggi:</strong> Sapi yang sehat memiliki sistem pencernaan yang lebih efisien. Ini berarti mereka dapat mengubah pakan menjadi produk (susu atau daging) dengan lebih baik, sehingga menghasilkan lebih sedikit metana per unit produk. Pastikan program kesehatan ternak yang baik termasuk vaksinasi dan penanganan penyakit.</li>
                        <li><strong>Program Pemuliaan Selektif:</strong> Melalui program pemuliaan dan seleksi genetik, peternak dapat memilih sapi yang secara alami lebih efisien dalam mencerna pakan dan menghasilkan emisi metana yang lebih rendah. Ini adalah strategi jangka panjang yang berkelanjutan.</li>
                        <li><strong>Manajemen Stres:</strong> Kurangi faktor stres pada ternak (misalnya, kepadatan kandang, suhu ekstrem) karena stres dapat mempengaruhi pencernaan dan kesehatan secara keseluruhan.</li>
                    </ul>

                     <div className="mt-6 pt-4 border-t border-gray-200 bg-emerald-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-emerald-800">💡 Terkait Checklist Harian: "Kesehatan Ternak"</h4>
                        <p className="text-gray-700 text-base mt-1">
                            Mencentang tugas ini menunjukkan Anda telah melakukan pemeriksaan kesehatan rutin, memberikan vitamin atau vaksinasi sesuai jadwal, dan memastikan lingkungan kandang nyaman dan bebas stres untuk ternak Anda.
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

export default SolusiKesehatan;
