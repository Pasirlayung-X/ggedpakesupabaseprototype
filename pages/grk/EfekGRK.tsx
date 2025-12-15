import React from 'react';
import Accordion from '../../components/Accordion'; // Import Accordion

interface ContentPageProps {
  onAdvance?: () => void; // Optional. Only present if it's the current section and not the last overall.
}

const EfekGRK: React.FC<ContentPageProps> = ({ onAdvance }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Dampak Peningkatan GRK</h2>
      <Accordion title="Efek Peningkatan Gas Rumah Kaca" defaultOpen={true}>
        <div className="text-gray-600 space-y-4">
          <p className="mb-4">
            Peningkatan konsentrasi GRK di atmosfer menyebabkan pemanasan global, yang memicu serangkaian dampak luas terhadap iklim dan ekosistem, termasuk pada sektor peternakan itu sendiri.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-emerald-500 font-bold mr-3 mt-1">✓</span>
              <span className="text-gray-700"><strong>Pemanasan Global:</strong> Peningkatan suhu rata-rata bumi, menyebabkan cuaca ekstrem seperti kekeringan, banjir, dan badai yang lebih sering dan intens.</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-500 font-bold mr-3 mt-1">✓</span>
              <span className="text-gray-700"><strong>Perubahan Pola Cuaca:</strong> Mengganggu siklus tanam, ketersediaan air bersih, dan dapat mempengaruhi kualitas serta kuantitas pakan ternak.</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-500 font-bold mr-3 mt-1">✓</span>
              <span className="text-gray-700"><strong>Kenaikan Permukaan Laut:</strong> Mencairnya gletser dan es di kutub menyebabkan kenaikan permukaan laut, mengancam wilayah pesisir.</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-500 font-bold mr-3 mt-1">✓</span>
              <span className="text-gray-700"><strong>Stres Panas pada Ternak:</strong> Suhu yang lebih tinggi dapat menyebabkan stres panas pada sapi, yang menurunkan produktivitas susu dan daging, serta meningkatkan kerentanan terhadap berbagai penyakit.</span>
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

export default EfekGRK;