import React from 'react';

interface ContentPageProps {
  onAdvance?: () => void; // Optional. Only present if it's the current section and not the last overall.
}

const SolusiPeternak: React.FC<ContentPageProps> = ({ onAdvance }) => {
    return (
        <div className="bg-white p-12 rounded-lg shadow-xl border border-gray-200 text-center animate-page-enter">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">Solusi untuk Peternak Sapi</h2>
            <p className="text-xl text-gray-600">
                Temukan langkah-langkah konkret yang bisa Anda terapkan di peternakan Anda untuk mengurangi emisi metana, meningkatkan efisiensi, dan bahkan menciptakan sumber pendapatan baru.
            </p>
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

export default SolusiPeternak;