import React from 'react';
import Accordion from '../../components/Accordion'; // Import Accordion

interface ContentPageProps {
  onAdvance?: () => void; // Optional. Only present if it's the current section and not the last overall.
}

const DefinisiGRK: React.FC<ContentPageProps> = ({ onAdvance }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Tentang Gas Rumah Kaca</h2>
      <Accordion title="Apa itu Gas Rumah Kaca (GRK)?" defaultOpen={true}>
        <div className="text-gray-600 space-y-4">
          <p>
            Gas Rumah Kaca (GRK) adalah gas-gas di atmosfer bumi yang berfungsi seperti kaca di dalam rumah kaca. Mereka memerangkap panas matahari dan mencegahnya lolos kembali ke luar angkasa. Tanpa efek rumah kaca alami ini, bumi akan menjadi terlalu dingin untuk dihuni.
          </p>
          <p>
            Namun, aktivitas manusia, terutama sejak Revolusi Industri, telah meningkatkan konsentrasi gas-gas ini secara drastis, menyebabkan "efek rumah kaca yang diperkuat" dan memicu pemanasan global.
          </p>
          <p>Gas rumah kaca utama yang menjadi perhatian meliputi:</p>
          <ul className="list-disc list-inside space-y-2 pl-4 marker:text-emerald-500">
            <li><strong>Karbon Dioksida (CO2):</strong> Berasal dari pembakaran bahan bakar fosil (batu bara, minyak, gas), deforestasi, dan proses industri.</li>
            <li><strong>Metana (CH4):</strong> Berasal dari sektor pertanian (termasuk peternakan), tempat pembuangan sampah, dan produksi bahan bakar fosil.</li>
            <li><strong>Dinitrogen Oksida (N2O):
              </strong> Berasal dari praktik pertanian (penggunaan pupuk nitrogen) dan pembakaran bahan bakar fosil.
            </li>
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

export default DefinisiGRK;