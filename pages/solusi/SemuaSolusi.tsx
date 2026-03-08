
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
  userRole?: string;
}

const SemuaSolusi: React.FC<SemuaSolusiProps> = ({ onFinish, userRole = 'peternak' }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const allSections = [
    { id: 'peternak', component: SolusiPeternak, role: 'peternak' },
    { id: 'pakan', component: SolusiPakan, role: 'peternak' },
    { id: 'kotoran', component: SolusiKotoran, role: 'peternak' },
    { id: 'biogas', component: SolusiBiogas, role: 'peternak' },
    { id: 'kesehatan', component: SolusiKesehatan, role: 'peternak' },
    { id: 'sesama', component: SolusiSesama, role: 'umum' },
    { id: 'dukung', component: SolusiDukung, role: 'umum' },
    { id: 'sampah', component: SolusiSampah, role: 'umum' },
    { id: 'edukasi', component: SolusiEdukasi, role: 'umum' },
  ];

  const sections = allSections.filter(s => s.role === userRole);

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
