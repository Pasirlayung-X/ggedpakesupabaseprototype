
import React from 'react';
import Accordion from '../../components/Accordion';

interface ContentPageProps {
  onAdvance?: () => void;
}

const SolusiBiogas: React.FC<ContentPageProps> = ({ onAdvance }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Panduan Sistem Biogas Sederhana</h2>
      
      <Accordion title="Video Penjelasan Praktis" defaultOpen={true}>
        <p className="text-center text-gray-600 mb-4">Tonton video berikut untuk mendapatkan gambaran visual yang jelas tentang cara kerja dan pembuatan sistem biogas skala rumah tangga.</p>
        <div className="aspect-w-16 aspect-h-9">
           <iframe
                className="w-full h-full rounded-lg shadow-md"
                style={{aspectRatio: "16/9"}}
                src="https://www.youtube.com/embed/-AuzetKlTzA"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
            </iframe>
        </div>
      </Accordion>

      <Accordion title="Langkah-Langkah Utama Pembuatan (Penjelasan Teks)" defaultOpen={true}>
        <div className="text-lg text-gray-700 space-y-4">
            <p>Video di atas memberikan panduan lengkap. Berikut adalah rangkuman langkah-langkah kunci yang perlu diperhatikan:</p>
            <ol className="list-decimal list-inside space-y-3 pl-2 marker:text-emerald-600 marker:font-bold">
                <li>
                    <strong>Persiapan Lokasi & Bahan:</strong> Pilih lokasi yang dekat dengan kandang untuk memudahkan pengangkutan kotoran. Siapkan bahan utama seperti drum bekas (untuk digester dan penampung gas), pipa PVC, dan selang.
                </li>
                <li>
                    <strong>Pembuatan Lubang Pipa:</strong> Buat lubang pada drum digester untuk pipa masuk (inlet) dan pipa keluar (outlet). Pastikan ukurannya pas dan bisa ditutup rapat untuk mencegah kebocoran.
                </li>
                <li>
                    <strong>Instalasi Pipa:</strong> Pasang pipa inlet (tempat memasukkan kotoran) dan outlet (tempat keluar ampas/slurry). Gunakan lem pipa dan sealant untuk memastikan semua sambungan kedap udara dan air.
                </li>
                 <li>
                    <strong>Sistem Penampung Gas:</strong> Gunakan sistem dua drum di mana satu drum terbalik di dalam drum lain yang berisi air. Ini berfungsi sebagai segel air dan penampung gas yang aman. Hubungkan pipa gas dari digester ke penampung ini.
                </li>
                <li>
                    <strong>Pengisian Awal & Operasional:</strong> Campurkan kotoran sapi segar dengan air (perbandingan sekitar 1:1) dan masukkan ke dalam digester hingga sekitar 80% penuh. Tunggu beberapa minggu hingga proses fermentasi menghasilkan gas pertama. Setelah itu, Anda bisa memasukkan kotoran baru setiap hari.
                </li>
            </ol>
             <div className="mt-6 pt-4 border-t border-gray-200 bg-emerald-50 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-800">💡 Terkait Checklist Harian: "Instalasi Biogas"</h4>
                <p className="text-gray-700 text-base mt-1">
                    Saat Anda mencentang tugas ini, itu berarti Anda telah melakukan operasional harian sistem biogas, seperti memasukkan campuran kotoran baru (slurry) ke dalam digester atau menggunakan gas yang telah dihasilkan untuk memasak.
                </p>
            </div>
        </div>
      </Accordion>
      
      {onAdvance && (
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

export default SolusiBiogas;
