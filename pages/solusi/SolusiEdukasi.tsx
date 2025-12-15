import React from 'react';
import Accordion from '../../components/Accordion'; // Import Accordion

interface ContentPageProps {
  onAdvance?: () => void; // Optional, but SolusiEdukasi won't display a button
}

const SolusiEdukasi: React.FC<ContentPageProps> = () => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Edukasi & Advokasi</h2>
            <Accordion title="Suarakan Perubahan: Pentingnya Edukasi dan Advokasi" defaultOpen={true}>
                <div className="text-lg text-gray-600 space-y-4 text-center">
                    <p>Pengetahuan adalah kekuatan. Bagikan informasi dan pemahaman yang Anda dapatkan di platform GG-ed ini kepada keluarga, teman, dan komunitas Anda. Semakin banyak orang yang sadar, semakin besar potensi perubahan.</p>
                    <p>Selain itu, dukunglah kebijakan pemerintah dan inisiatif swasta yang mempromosikan pertanian berkelanjutan, energi terbarukan seperti biogas, serta penelitian dan pengembangan teknologi mitigasi metana. Partisipasi aktif Anda dapat mendorong perubahan sistemik yang lebih besar.</p>
                </div>
            </Accordion>
        </div>
    );
};

export default SolusiEdukasi;