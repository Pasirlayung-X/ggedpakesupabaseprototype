
import React, { useState } from 'react';
import Accordion from '../../components/Accordion';

interface ContentPageProps {
  onAdvance?: () => void;
}

const partDescriptions = {
  inlet: { title: "1. Saluran Masuk (Inlet)", text: "Di sinilah kotoran sapi segar yang dicampur dengan air (slurry) dimasukkan ke dalam sistem." },
  digester: { title: "2. Tangki Pencerna (Digester)", text: "Bagian utama di mana mikroorganisme bekerja tanpa oksigen untuk mengurai kotoran dan menghasilkan biogas. Biasanya dibangun di bawah tanah untuk menjaga suhu tetap stabil." },
  gas: { title: "3. Saluran Gas", text: "Pipa ini menyalurkan biogas (metana) yang terkumpul di bagian atas tangki ke tempat penampungan atau langsung ke kompor/generator." },
  outlet: { title: "4. Saluran Keluar (Outlet)", text: "Mengeluarkan sisa kotoran yang telah diolah (bio-slurry), yang merupakan pupuk organik berkualitas tinggi." },
};

const SolusiBiogas: React.FC<ContentPageProps> = ({ onAdvance }) => {
  const [hoveredPart, setHoveredPart] = useState<keyof typeof partDescriptions | null>(null);

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Panduan Sistem Biogas Sederhana</h2>
      
      <Accordion title="Diagram Interaktif Sistem Biogas" defaultOpen={true}>
        <div className="text-center">
            <p className="text-gray-600 mb-4">Arahkan kursor atau sentuh titik-titik merah pada diagram untuk melihat penjelasan setiap bagian.</p>
            <div className="w-full max-w-2xl mx-auto">
              <svg viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg">
                <style>
                  {`
                    .hotspot-circle {
                      transition: r 0.2s ease-in-out, opacity 0.2s;
                      cursor: pointer;
                    }
                    @keyframes pulse {
                      0% { r: 4; opacity: 1; }
                      50% { r: 6; opacity: 0.7; }
                      100% { r: 4; opacity: 1; }
                    }
                    .hotspot-pulse {
                      animation: pulse 2s infinite;
                    }
                  `}
                </style>
                {/* Ground */}
                <rect x="0" y="50" width="300" height="100" fill="#D2B48C" />
                <text x="5" y="65" fontSize="8" fill="#8B4513">Tanah</text>

                {/* Digester Tank */}
                <ellipse cx="150" cy="100" rx="80" ry="40" fill="#A9A9A9" onMouseEnter={() => setHoveredPart('digester')} onMouseLeave={() => setHoveredPart(null)} />
                <text x="135" y="105" fontSize="10" fill="white">Digester</text>

                {/* Inlet Pipe */}
                <path d="M 20 20 L 70 75" stroke="#696969" strokeWidth="5" fill="none" onMouseEnter={() => setHoveredPart('inlet')} onMouseLeave={() => setHoveredPart(null)} />
                <rect x="10" y="10" width="20" height="20" fill="#808080" onMouseEnter={() => setHoveredPart('inlet')} onMouseLeave={() => setHoveredPart(null)} />

                {/* Outlet Pipe */}
                <path d="M 230 75 L 280 20" stroke="#696969" strokeWidth="5" fill="none" onMouseEnter={() => setHoveredPart('outlet')} onMouseLeave={() => setHoveredPart(null)} />
                <rect x="270" y="10" width="20" height="20" fill="#808080" onMouseEnter={() => setHoveredPart('outlet')} onMouseLeave={() => setHoveredPart(null)} />

                {/* Gas Pipe */}
                <path d="M 150 60 L 150 20 L 200 20" stroke="#F4A460" strokeWidth="3" fill="none" onMouseEnter={() => setHoveredPart('gas')} onMouseLeave={() => setHoveredPart(null)} />
                <text x="205" y="25" fontSize="8" fill="#D2691E">🔥 Ke Kompor</text>
                
                {/* Hotspots */}
                <g className="hotspot-group">
                  <circle cx="30" cy="30" r="4" fill="red" className="hotspot-circle hotspot-pulse" onMouseEnter={() => setHoveredPart('inlet')} onMouseLeave={() => setHoveredPart(null)} />
                </g>
                 <g className="hotspot-group">
                  <circle cx="150" cy="80" r="4" fill="red" className="hotspot-circle hotspot-pulse" onMouseEnter={() => setHoveredPart('digester')} onMouseLeave={() => setHoveredPart(null)} />
                </g>
                 <g className="hotspot-group">
                  <circle cx="175" cy="20" r="4" fill="red" className="hotspot-circle hotspot-pulse" onMouseEnter={() => setHoveredPart('gas')} onMouseLeave={() => setHoveredPart(null)} />
                </g>
                <g className="hotspot-group">
                  <circle cx="270" cy="30" r="4" fill="red" className="hotspot-circle hotspot-pulse" onMouseEnter={() => setHoveredPart('outlet')} onMouseLeave={() => setHoveredPart(null)} />
                </g>
              </svg>
            </div>
            <div className="mt-4 p-4 min-h-[80px] bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center transition-all duration-300">
                {hoveredPart ? (
                    <div className="text-left animate-page-enter">
                        <h4 className="font-bold text-emerald-700">{partDescriptions[hoveredPart].title}</h4>
                        <p className="text-gray-800">{partDescriptions[hoveredPart].text}</p>
                    </div>
                ) : (
                    <p className="text-gray-500">Arahkan kursor ke titik merah untuk info.</p>
                )}
            </div>
        </div>
      </Accordion>

      <Accordion title="Video Penjelasan" defaultOpen={true}>
        <div className="aspect-w-16 aspect-h-9">
           <iframe
                className="w-full h-full rounded-lg"
                style={{aspectRatio: "16/9"}}
                src="https://www.youtube.com/embed/-AuzetKlTzA"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
            </iframe>
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
