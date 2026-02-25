import React from 'react';

interface LevelUpModalProps {
  newLevel: number;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ newLevel, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 max-w-sm w-full text-center transform animate-scale-in">
        <h2 className="text-4xl font-bold text-yellow-500 mb-4">LEVEL UP!</h2>
        <p className="text-gray-600 mb-2">Selamat, Anda telah mencapai</p>
        <p className="text-6xl font-bold text-emerald-600 mb-6">Level {newLevel}</p>
        <div className="text-5xl mb-6">🎉🏆✨</div>
        <p className="text-sm text-gray-500 mb-6">Terus tingkatkan progres Anda dan buka hadiah-hadiah menarik lainnya!</p>
        <button
          onClick={onClose}
          className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-all duration-300 shadow-md"
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;
