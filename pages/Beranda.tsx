
import React from 'react';
import { Page } from '../App';

const StepCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}> = ({ icon, title, description, buttonText, onClick }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col text-center h-full border border-transparent hover:border-emerald-300">
    <div className="p-4 bg-emerald-100 rounded-full mb-4 self-center flex items-center justify-center h-20 w-20">
      <span className="text-4xl">{icon}</span>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4 flex-grow">{description}</p>
    <button
      onClick={onClick}
      className="mt-auto px-6 py-2 font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors duration-300"
    >
      {buttonText}
    </button>
  </div>
);

const Beranda: React.FC<{ onNavigate: (main: Page['main'], sub?: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="space-y-16">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-emerald-800">Halo, Peternak Cerdas!</h2>
      </div>
      <div className="text-center bg-white p-10 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex justify-center mb-6">
          <img src="/sergio.png" alt="Logo" className="w-28 h-auto" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 mb-4">
          GG-ed: Greenhouse Gas Education
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600">
          Selamat datang di GG-ed, pusat informasi mitigasi metana untuk peternak sapi. Mari bersama-sama belajar, beraksi, dan berkontribusi untuk peternakan yang lebih efisien, menguntungkan, dan ramah lingkungan.
        </p>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Langkah Anda Menuju Peternakan Berkelanjutan</h2>
        <p className="text-gray-600 mb-8">Ikuti alur ini untuk mendapatkan manfaat maksimal dari platform kami.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard
            icon="💨"
            title="1. Pahami Masalahnya"
            description="Pelajari tentang Gas Rumah Kaca (GRK) dan Metana, serta dampaknya terhadap lingkungan dan peternakan Anda."
            buttonText="Mulai Belajar"
            onClick={() => onNavigate('grk')} // Navigasi langsung ke halaman SemuaGRK tanpa sub-path
          />
          <StepCard
            icon="🐄"
            title="2. Temukan Solusinya"
            description="Temukan langkah-langkah praktis dan solusi inovatif yang bisa Anda terapkan langsung di peternakan."
            buttonText="Lihat Solusi"
            onClick={() => onNavigate('solusi')} // Navigasi langsung ke halaman SemuaSolusi tanpa sub-path
          />
          <StepCard
            icon="✅"
            title="3. Lacak Progres Anda"
            description="Gunakan checklist harian kami untuk membangun kebiasaan baru dan melihat kemajuan Anda dari waktu ke waktu."
            buttonText="Buka Checklist"
            onClick={() => onNavigate('checklist')}
          />
        </div>
      </div>
    </div>
  );
};

export default Beranda;
