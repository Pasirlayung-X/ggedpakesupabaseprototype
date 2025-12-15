import React from 'react';
import Accordion from '../../components/Accordion'; // Import Accordion

interface ContentPageProps {
  onAdvance?: () => void; // Optional. Only present if it's the current section and not the last overall.
}

const FungsiMetana: React.FC<ContentPageProps> = ({ onAdvance }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Fungsi & Manfaat Metana</h2>
      <Accordion title="Dari Ancaman menjadi Harta Karun: Potensi Biogas" defaultOpen={true}>
        <div className="text-gray-600 space-y-4">
          <p>
            Meskipun menjadi masalah sebagai gas rumah kaca, metana juga merupakan komponen utama dari gas alam. Ini berarti metana yang dihasilkan dari limbah ternak dapat ditangkap dan dimanfaatkan sebagai sumber energi terbarukan, sebuah proses yang dikenal sebagai produksi biogas. Ini adalah contoh sempurna dari ekonomi sirkular.
          </p>
          
          <div>
            <h4 className="font-semibold text-gray-700">Proses Digester Anaerobik</h4>
            <p>
              Kotoran ternak dimasukkan ke dalam sebuah wadah tertutup yang disebut digester. Di dalamnya, tanpa adanya oksigen, mikroorganisme akan menguraikan bahan organik dan menghasilkan biogas. Biogas ini sebagian besar terdiri dari metana (50-75%) dan karbon dioksida.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">Manfaat 4-in-1 yang Luar Biasa</h4>
            <ul className="list-disc list-inside space-y-2 pl-4 marker:text-emerald-500">
              <li><strong>Energi Terbarukan:</strong> Biogas dapat digunakan langsung untuk memasak, penerangan, atau menjalankan generator untuk menghasilkan listrik, mengurangi ketergantungan pada gas elpiji dan bahan bakar fosil lainnya.</li>
              <li><strong>Pengurangan Emisi GRK:</strong> Proses ini menangkap metana yang seharusnya terlepas ke atmosfer. Saat biogas dibakar untuk energi, metana diubah menjadi CO2, yang potensi pemanasan globalnya jauh lebih rendah (efeknya berkurang 28 kali lipat).</li>
              <li><strong>Pupuk Organik Berkualitas Tinggi:</strong> Produk sampingan dari proses ini, yang disebut bio-slurry, adalah pupuk organik cair dan padat yang kaya nutrisi dan bebas patogen. Ini dapat meningkatkan kesuburan tanah dan mengurangi kebutuhan pupuk kimia.</li>
              <li><strong>Peningkatan Sanitasi Lingkungan:</strong> Mengelola kotoran melalui digester dapat mengurangi bau tidak sedap, populasi lalat, dan penyebaran penyakit, menciptakan lingkungan peternakan yang lebih sehat dan bersih.</li>
            </ul>
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

export default FungsiMetana;