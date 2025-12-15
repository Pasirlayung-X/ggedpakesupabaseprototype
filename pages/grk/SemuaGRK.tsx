import React, { useState } from 'react';
import DefinisiGRK from './DefinisiGRK';
import PenyebabGRK from './PenyebabGRK';
import EfekGRK from './EfekGRK';
import DataGRK from './DataGRK';
import PageStepper from '../../components/PageStepper';

interface SemuaGRKProps {
  onFinish: () => void;
}

const SemuaGRK: React.FC<SemuaGRKProps> = ({ onFinish }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const sections = [
    { id: 'definisi', component: DefinisiGRK },
    { id: 'penyebab', component: PenyebabGRK },
    { id: 'efek', component: EfekGRK },
    { id: 'data', component: DataGRK },
  ];

  const handleAdvance = () => {
    setCurrentSectionIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div className="space-y-8 animate-page-enter">
      <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 text-center mb-8">
        Memahami Gas Rumah Kaca
      </h1>

      {sections.map((section, index) => {
        if (index <= currentSectionIndex) { // Render semua bagian yang sudah dan sedang aktif
          const Component = section.component;
          const isCurrentSection = index === currentSectionIndex;
          const isLastSectionInList = index === sections.length - 1;

          return (
            <Component
              key={section.id}
              // Hanya berikan prop onAdvance ke bagian yang sedang aktif DAN BUKAN bagian terakhir dari list
              onAdvance={isCurrentSection && !isLastSectionInList ? handleAdvance : undefined}
            />
          );
        }
        return null;
      })}

      {currentSectionIndex === sections.length - 1 && ( // Tampilkan PageStepper hanya jika semua bagian telah dilihat
        <PageStepper onFinish={onFinish} />
      )}
    </div>
  );
};

export default SemuaGRK;