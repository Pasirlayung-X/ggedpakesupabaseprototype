
import React, { useState } from 'react';
import SolusiPeternak from './SolusiPeternak';
import SolusiPakan from './SolusiPakan';
import SolusiKotoran from './SolusiKotoran';
import SolusiBiogas from './SolusiBiogas'; // Import halaman baru
import SolusiKesehatan from './SolusiKesehatan';
import SolusiSesama from './SolusiSesama';
import SolusiDukung from './SolusiDukung';
import SolusiSampah from './SolusiSampah';
import SolusiEdukasi from './SolusiEdukasi';
import PageStepper from '../../components/PageStepper';

interface SemuaSolusiProps {
  onFinish: () => void;
}

const SemuaSolusi: React.FC<SemuaSolusiProps> = ({ onFinish }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const sections = [
    { id: 'peternak', component: SolusiPeternak },
    { id: 'pakan', component: SolusiPakan },
    { id: 'kotoran', component: SolusiKotoran },
    { id: 'biogas', component: SolusiBiogas }, // Tambahkan halaman baru di sini
    { id: 'kesehatan', component: SolusiKesehatan },
    { id: 'sesama', component: SolusiSesama },
    { id: 'dukung', component: SolusiDukung },
    { id: 'sampah', component: SolusiSampah },
    { id: 'edukasi', component: SolusiEdukasi },
  ];

  const handleAdvance = () => {
    setCurrentSectionIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div className="space-y-8 animate-page-enter">
      <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 text-center mb-8">
        Temukan Solusi Mitigasi Metana
      </h1>

      {sections.map((section, index) => {
        if (index <= currentSectionIndex) {
          const Component = section.component;
          const isCurrentSection = index === currentSectionIndex;
          const isLastSectionInList = index === sections.length - 1;

          return (
            <Component
              key={section.id}
              onAdvance={isCurrentSection && !isLastSectionInList ? handleAdvance : undefined}
            />
          );
        }
        return null;
      })}

      {currentSectionIndex === sections.length - 1 && (
        <PageStepper onFinish={onFinish} />
      )}
    </div>
  );
};

export default SemuaSolusi;
