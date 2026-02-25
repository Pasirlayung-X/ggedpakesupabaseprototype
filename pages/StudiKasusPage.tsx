import React, { useState } from 'react';

const caseStudiesData = [
  {
    id: 1,
    title: 'Mengurangi Metana dengan Suplemen Pakan Sapi',
    summary: 'Sebuah peternakan di Belanda berhasil mengurangi emisi metana hingga 30% dengan memperkenalkan suplemen pakan rumput laut khusus.',
    image: 'https://picsum.photos/seed/case1/400/300',
    details: 'Peternakan \'De Groene Weide\' bekerja sama dengan Universitas Wageningen untuk menguji dampak suplemen pakan berbasis Asparagopsis taxiformis. Selama periode 6 bulan, 100 sapi perah diberi suplemen ini. Hasilnya menunjukkan penurunan emisi metana yang signifikan tanpa mempengaruhi produksi atau kualitas susu. Proyek ini sekarang sedang diperluas ke 20 peternakan lain di seluruh negeri.',
  },
  {
    id: 2,
    title: 'Manajemen Limbah Cerdas di Peternakan Babi',
    summary: 'Inovasi dalam penggunaan digester anaerobik mengubah limbah menjadi biogas dan pupuk organik, mengurangi emisi dan menciptakan sumber pendapatan baru.',
    image: 'https://picsum.photos/seed/case2/400/300',
    details: 'Di North Carolina, peternakan Smithfield Foods menginstal sistem digester anaerobik canggih. Sistem ini menangkap metana dari limbah babi dan mengubahnya menjadi gas alam terbarukan (RNG). RNG ini kemudian disuntikkan ke dalam jaringan pipa gas nasional. Selain mengurangi jejak karbon, proyek ini menghasilkan pendapatan tambahan bagi peternakan dan menghasilkan pupuk organik kaya nutrisi sebagai produk sampingan.',
  },
  {
    id: 3,
    title: 'Rotational Grazing untuk Kesehatan Tanah',
    summary: 'Peternak di Australia meningkatkan penyerapan karbon di tanah dan kesehatan ternak dengan menerapkan metode penggembalaan rotasi.',
    image: 'https://picsum.photos/seed/case3/400/300',
    details: 'Dengan memindahkan ternak secara teratur di antara padang rumput yang berbeda, tanah diberi waktu untuk pulih dan menumbuhkan kembali rumput yang lebih padat. Akar rumput yang lebih dalam membantu menyerap lebih banyak karbon dari atmosfer ke dalam tanah. Metode ini tidak hanya mengurangi emisi bersih tetapi juga meningkatkan kualitas pakan ternak, yang pada gilirannya meningkatkan kesehatan dan produktivitas mereka.',
  },
];

const StudiKasusPage: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<typeof caseStudiesData[0] | null>(null);

  return (
    <div className="animate-page-enter">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Studi Kasus</h1>
        <p className="text-gray-600 mt-2">Contoh nyata penerapan solusi untuk peternakan berkelanjutan.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {caseStudiesData.map((study) => (
          <div 
            key={study.id} 
            className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer border border-gray-100"
            onClick={() => setSelectedCase(study)}
          >
            <img src={study.image} alt={study.title} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{study.title}</h3>
              <p className="text-sm text-gray-600">{study.summary}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in" onClick={() => setSelectedCase(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 max-w-2xl w-full transform animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <img src={selectedCase.image} alt={selectedCase.title} className="w-full h-64 object-cover rounded-lg mb-6" referrerPolicy="no-referrer" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedCase.title}</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{selectedCase.details}</p>
            <button
              onClick={() => setSelectedCase(null)}
              className="mt-6 w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-all duration-300 shadow-md"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudiKasusPage;
