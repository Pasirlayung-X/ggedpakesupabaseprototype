import React, { useState } from 'react';
import DefinisiMetana from './DefinisiMetana';
import SumberMetana from './SumberMetana';
import EfekMetana from './EfekMetana';
import FungsiMetana from './FungsiMetana';
import DataMetana from './DataMetana';
import PageStepper from '../../components/PageStepper';

interface SemuaMetanaProps {
  onFinish: () => void;
}

const SemuaMetana: React.FC<SemuaMetanaProps> = ({ onFinish }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const sections = [
    { id: 'definisi', component: DefinisiMetana },
    { id: 'sumber', component: SumberMetana },
    { id: 'efek', component: EfekMetana },
    { id: 'fungsi', component: FungsiMetana },
    { id: 'data', component: DataMetana },
  ];

  const handleAdvance = () => {
    setCurrentSectionIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div className="space-y-8 animate-page-enter">
      <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 text-center mb-8">
        Mengenal Gas Metana dari Peternakan Sapi
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

export default SemuaMetana;