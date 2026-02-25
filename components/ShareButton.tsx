import React from 'react';

interface ShareButtonProps {
  shareText: string;
  shareUrl: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ shareText, shareUrl }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Progres Saya di GreenHouse Gas Edu',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Tautan progres telah disalin ke clipboard!');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md flex items-center justify-center space-x-2"
    >
      <span className="text-xl">🚀</span>
      <span>Bagikan Progres Saya</span>
    </button>
  );
};

export default ShareButton;
