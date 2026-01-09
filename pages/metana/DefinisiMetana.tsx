
import React from 'react';
import Accordion from '../../components/Accordion'; // Import Accordion

interface ContentPageProps {
  onAdvance?: () => void; // Optional. Only present if it's the current section and not the last overall.
}

const DefinisiMetana: React.FC<ContentPageProps> = ({ onAdvance }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Tentang Gas Metana</h2>
      <Accordion title="Apa itu Gas Metana (CH4)?" defaultOpen={true}>
        <div className="flex items-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full mr-4">
            <span className="text-4xl" role="img" aria-label="gas emoji">💨</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Metana (CH4)</h3>
        </div>
        <div className="text-lg text-gray-600 space-y-4 pl-16">
          <p>Metana (CH4) adalah gas rumah kaca yang sangat kuat. Meskipun jumlahnya di atmosfer lebih sedikit daripada CO2, kemampuannya dalam memerangkap panas jauh lebih tinggi dalam jangka pendek.</p>
          <p className="font-semibold text-blue-700">Karena masa hidupnya yang lebih singkat di atmosfer (sekitar 12 tahun), mengurangi emisi metana dianggap sebagai salah satu cara tercepat untuk memperlambat laju pemanasan global.</p>
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

export default DefinisiMetana;
