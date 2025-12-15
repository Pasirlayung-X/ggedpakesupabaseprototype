import React from 'react';
import Accordion from '../../components/Accordion'; // Import Accordion

interface ContentPageProps {
  onAdvance?: () => void; // Optional. Only present if it's the current section and not the last overall.
}

const SolusiDukung: React.FC<ContentPageProps> = ({ onAdvance }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Dukungan Konsumen</h2>
            <Accordion title="Dukung Peternakan Berkelanjutan" defaultOpen={true}>
                <div className="text-lg text-gray-600 space-y-4 text-center">
                    <p>Sebagai konsumen, pilihan Anda memiliki kekuatan. Pilihlah produk dari peternak lokal yang Anda tahu menerapkan praktik-praktik ramah lingkungan dan bertanggung jawab.</p>
                    <p className="font-semibold text-emerald-700">Pembelian Anda adalah bentuk dukungan langsung bagi usaha mereka dalam mengurangi jejak karbon dan praktik peternakan yang lebih etis.</p>
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

export default SolusiDukung;