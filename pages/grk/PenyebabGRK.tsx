import React from 'react';
import Accordion from '../../components/Accordion'; // Import Accordion

interface ContentPageProps {
  onAdvance?: () => void; // Optional. Only present if it's the current section and not the last overall.
}

const PenyebabGRK: React.FC<ContentPageProps> = ({ onAdvance }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Penyebab Peningkatan GRK</h2>
      <Accordion title="Penyebab Utama Peningkatan Gas Rumah Kaca" defaultOpen={true}>
        <div className="text-gray-600 space-y-4">
          <p>
            Peningkatan emisi Gas Rumah Kaca (GRK) didorong oleh berbagai aktivitas manusia di berbagai sektor. Memahami sumber-sumber ini penting untuk menemukan solusi yang efektif.
          </p>
          <ul className="list-disc list-inside space-y-3 text-gray-700 marker:text-emerald-500">
            <li>
              <strong>Pembakaran Bahan Bakar Fosil:</strong> Ini adalah sumber terbesar emisi CO2. Penggunaan batu bara, minyak, dan gas untuk pembangkit listrik, transportasi (mobil, pesawat), dan pemanasan gedung melepaskan sejumlah besar karbon yang telah tersimpan jutaan tahun ke atmosfer.
            </li>
            <li>
              <strong>Pertanian, Kehutanan, dan Penggunaan Lahan:</strong> Sektor ini merupakan sumber utama emisi metana (dari fermentasi enterik pada ternak ruminansia dan sawah) dan dinitrogen oksida (dari pupuk sintetis). Deforestasi (penebangan hutan) untuk lahan pertanian juga berkontribusi besar karena mengurangi kemampuan bumi untuk menyerap CO2.
            </li>
            <li>
              <strong>Industri:</strong> Proses industri tertentu, seperti produksi semen, baja, dan bahan kimia, melepaskan GRK secara langsung. Penggunaan energi dari bahan bakar fosil untuk menjalankan mesin-mesin pabrik juga sangat signifikan.
            </li>
            <li>
              <strong>Pengelolaan Limbah:</strong> Sampah organik (sisa makanan, daun) yang menumpuk di Tempat Pembuangan Akhir (TPA) akan terurai secara anaerobik (tanpa oksigen) dan menghasilkan metana, gas rumah kaca yang kuat.
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

export default PenyebabGRK;