import React from 'react';
import Accordion from '../../components/Accordion'; // Import Accordion

interface ContentPageProps {
  onAdvance?: () => void; // Optional. Only present if it's the current section and not the last overall.
}

const SolusiSampah: React.FC<ContentPageProps> = ({ onAdvance }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Kurangi Sampah Makanan</h2>
            <Accordion title="Dampak Besar dari Piring Kita: Mengurangi Sampah Makanan" defaultOpen={true}>
                <div className="text-lg text-gray-600 space-y-4 text-center">
                    <p>Secara global, sekitar sepertiga dari makanan yang diproduksi terbuang sia-sia. Hal ini tidak hanya membuang sumber daya (air, energi, tanah) yang digunakan untuk memproduksinya, tetapi juga menghasilkan emisi gas rumah kaca yang signifikan saat makanan tersebut membusuk di tempat pembuangan sampah (khususnya metana).</p>
                    <p className="font-semibold text-emerald-700">Dengan mengurangi sampah makanan di rumah dan di komunitas, kita secara tidak langsung mengurangi tekanan pada seluruh rantai pasok pangan, termasuk peternakan, dan memitigasi emisi GRK.</p>
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

export default SolusiSampah;