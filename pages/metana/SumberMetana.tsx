
import React from 'react';
import Accordion from '../../components/Accordion'; // Import Accordion

interface ContentPageProps {
  onAdvance?: () => void;
  userRole?: string;
}

const SumberMetana: React.FC<ContentPageProps> = ({ onAdvance, userRole = 'peternak' }) => {
  const isUmum = userRole === 'umum';

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Sumber Metana</h2>
      <Accordion title={isUmum ? "Sumber Utama Metana" : "Sumber Metana dari Peternakan Sapi"} defaultOpen={true}>
        <div className="flex items-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full mr-4">
            <span className="text-4xl" role="img" aria-label="icon">{isUmum ? '🌍' : '🐄'}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Dari mana metana berasal?</h3>
        </div>
        <div className="text-lg text-gray-600 space-y-3 pl-16">
          {isUmum ? (
            <>
              <p>Metana dihasilkan dari berbagai aktivitas manusia dan proses alami. Sumber utama metana meliputi:</p>
              <ul className="list-disc list-inside space-y-2 pl-2 marker:text-blue-500">
                <li><strong>Pertanian & Peternakan:</strong> Sapi dan hewan ruminansia lainnya menghasilkan metana saat mencerna makanan (fermentasi enterik). Sawah padi yang tergenang air juga merupakan sumber besar.</li>
                <li><strong>Pengelolaan Sampah:</strong> Sampah organik (sisa makanan, sayuran) yang menumpuk di Tempat Pembuangan Akhir (TPA) terurai tanpa oksigen dan menghasilkan gas metana.</li>
                <li><strong>Bahan Bakar Fosil:</strong> Ekstraksi, pemrosesan, dan distribusi batu bara, minyak bumi, dan gas alam melepaskan metana ke atmosfer.</li>
              </ul>
            </>
          ) : (
            <>
              <p>Sumber utama metana di peternakan sapi berasal dari dua hal:</p>
              <ul className="list-disc list-inside space-y-2 pl-2 marker:text-blue-500">
                <li><strong>Fermentasi Enterik:</strong> Proses pencernaan alami pada sapi yang menghasilkan metana sebagai produk sampingan. Gas ini dikeluarkan terutama melalui <span className="font-bold">sendawa</span>, bukan kentut.</li>
                <li><strong>Limbah Kotoran:</strong> Saat kotoran sapi terurai dalam kondisi anaerobik (tanpa oksigen), seperti di laguna penampungan limbah, ia akan melepaskan gas metana dalam jumlah besar.</li>
              </ul>
            </>
          )}
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

export default SumberMetana;
