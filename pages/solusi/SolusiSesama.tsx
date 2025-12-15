import React from 'react';

interface ContentPageProps {
  onAdvance?: () => void; // Optional. Only present if it's the current section and not the last overall.
}

const SolusiSesama: React.FC<ContentPageProps> = ({ onAdvance }) => {
    return (
        <div className="bg-white p-12 rounded-lg shadow-xl border border-gray-200 text-center animate-page-enter">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">Peran Kita Bersama</h2>
            <p className="text-xl text-gray-600">
                Mitigasi perubahan iklim adalah tanggung jawab kolektif. Setiap individu memiliki peran dalam mendukung sistem pangan yang lebih berkelanjutan.
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

export default SolusiSesama;