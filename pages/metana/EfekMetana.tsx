import React from 'react';
import Accordion from '../../components/Accordion'; // Import Accordion

interface ContentPageProps {
  onAdvance?: () => void; // Optional. Only present if it's the current section and not the last overall.
}

const EfekMetana: React.FC<ContentPageProps> = ({ onAdvance }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Dampak & Potensi Metana</h2>
      <Accordion title="Efek & Potensi Gas Metana" defaultOpen={true}>
        <div className="text-gray-600 space-y-4">
          <p>
            Meskipun sering dibayangi oleh Karbon Dioksida (CO2), metana memiliki peran unik dan signifikan dalam perubahan iklim.
          </p>
          <div>
            <h4 className="font-semibold text-gray-700">Dampak Jangka Pendek yang Kuat</h4>
            <p>
              Metana bertanggung jawab atas sekitar 30% dari pemanasan global saat ini. Karena potensinya yang tinggi dalam memerangkap panas, peningkatan konsentrasi metana dapat dengan cepat menaikkan suhu global. Ini menjadikannya target penting untuk mitigasi iklim jangka pendek.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Pembentukan Ozon Troposferik</h4>
            <p>
              Di atmosfer, metana bereaksi secara kimia untuk membentuk ozon di lapisan troposfer (ozon "jahat"). Ozon ini adalah polutan udara berbahaya yang dapat merusak kesehatan manusia dan tanaman, serta juga merupakan gas rumah kaca.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Peluang Mitigasi Cepat</h4>
            <p>
              Karena masa hidupnya yang singkat, pengurangan emisi metana akan menurunkan konsentrasinya di atmosfer dengan cepat. Tindakan yang diambil hari ini untuk memotong emisi metana akan memberikan manfaat iklim yang terasa dalam beberapa dekade mendatang.
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

export default EfekMetana;