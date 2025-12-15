import React from 'react';

const TentangGGEdu: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200 text-center animate-page-enter">
      <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-700 mb-4">
        Tentang GG-ed
      </h2>
      <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-6">
        GG-ed adalah singkatan dari <span className="font-semibold text-emerald-600">Greenhouse Gas Education</span>.
      </p>
      <p className="max-w-3xl mx-auto text-lg text-gray-600">
        Kami hadir sebagai platform edukasi online yang didedikasikan untuk memberdayakan para peternak sapi dalam memahami dan memitigasi emisi gas rumah kaca, khususnya metana, yang berasal dari limbah peternakan. Melalui informasi yang mudah diakses dan solusi praktis, kami bertujuan untuk membantu menciptakan praktik peternakan yang lebih berkelanjutan, efisien, dan ramah lingkungan.
      </p>
    </div>
  );
};

export default TentangGGEdu;