
import React from 'react';

const avatarData = [
  { 
    id: 'cow-1', 
    unlockLevel: 1, 
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#BBF7D0" />
        <path d="M25 68 C27 62, 35 60, 40 68 C43 75, 38 80, 25 80 C20 80, 18 75, 25 68 Z" fill="#2E6C4D" />
        <circle cx="35" cy="45" r="5" fill="#1F2937" />
        <circle cx="65" cy="45" r="5" fill="#1F2937" />
        <path d="M40 60 Q50 70 60 60" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
        <path d="M20 35 L30 25 M80 35 L70 25" stroke="#2E6C4D" strokeWidth="4" strokeLinecap="round" />
      </svg>
    )
  },
  { 
    id: 'farmer-1', 
    unlockLevel: 3, 
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#FEF3C7" />
        <path d="M30 80 Q50 90 70 80 V100 H30 V80 Z" fill="#D97706" />
        <circle cx="50" cy="50" r="20" fill="#FDE68A" />
        <path d="M30 40 H70 L60 20 H40 L30 40 Z" fill="#B45309" />
        <circle cx="43" cy="50" r="2" fill="#4B5563" />
        <circle cx="57" cy="50" r="2" fill="#4B5563" />
        <path d="M45 58 Q50 62 55 58" stroke="#4B5563" strokeWidth="2" />
      </svg>
    )
  },
  { 
    id: 'plant', 
    unlockLevel: 6, 
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#D1FAE5" />
        <path d="M50 80 V40" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
        <path d="M50 60 Q70 50 70 30 Q50 40 50 60" fill="#10B981" />
        <path d="M50 60 Q30 50 30 30 Q50 40 50 60" fill="#34D399" />
      </svg>
    )
  },
  { 
    id: 'cow-2', 
    unlockLevel: 10, 
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#BFDBFE" />
        <rect x="30" y="40" width="40" height="30" rx="10" fill="#374151" />
        <circle cx="40" cy="50" r="4" fill="white" />
        <circle cx="60" cy="50" r="4" fill="white" />
        <path d="M45 60 H55" stroke="white" strokeWidth="2" />
        <path d="M25 35 L35 45 M75 35 L65 45" stroke="#374151" strokeWidth="4" />
      </svg>
    )
  },
  { 
    id: 'farmer-2', 
    unlockLevel: 15, 
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#FECACA" />
        <circle cx="50" cy="55" r="22" fill="#FCA5A5" />
        <path d="M25 45 C25 30, 75 30, 75 45" fill="#4B5563" />
        <circle cx="43" cy="55" r="2" fill="#1F2937" />
        <circle cx="57" cy="55" r="2" fill="#1F2937" />
        <path d="M47 62 H53" stroke="#1F2937" strokeWidth="2" />
      </svg>
    )
  },
  { 
    id: 'methane', 
    unlockLevel: 20, 
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#E5E7EB" />
        <circle cx="50" cy="50" r="15" fill="#6B7280" />
        <circle cx="50" cy="25" r="8" fill="#9CA3AF" />
        <circle cx="75" cy="50" r="8" fill="#9CA3AF" />
        <circle cx="50" cy="75" r="8" fill="#9CA3AF" />
        <circle cx="25" cy="50" r="8" fill="#9CA3AF" />
        <line x1="50" y1="33" x2="50" y2="42" stroke="#6B7280" strokeWidth="2" />
        <line x1="67" y1="50" x2="58" y2="50" stroke="#6B7280" strokeWidth="2" />
        <line x1="50" y1="67" x2="50" y2="58" stroke="#6B7280" strokeWidth="2" />
        <line x1="33" y1="50" x2="42" y2="50" stroke="#6B7280" strokeWidth="2" />
      </svg>
    )
  },
];

const avatarsMap = new Map(avatarData.map(a => [a.id, a.svg]));

interface AvatarSelectorProps {
  selectedAvatarId: string;
  onSelect: (id: string) => void;
  userLevel: number;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selectedAvatarId, onSelect, userLevel }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
      {avatarData.map((avatar) => {
        const isUnlocked = userLevel >= avatar.unlockLevel;
        const isSelected = selectedAvatarId === avatar.id;

        return (
          <div
            key={avatar.id}
            onClick={() => isUnlocked && onSelect(avatar.id)}
            title={isUnlocked ? `Pilih avatar ${avatar.id}` : `Buka di Level ${avatar.unlockLevel}`}
            className={`relative rounded-full p-2 border-4 transition-all duration-200 transform ${
              isUnlocked ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'
            } ${
              isSelected ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-105' : 'border-transparent hover:border-emerald-200'
            }`}
          >
            <div className={!isUnlocked ? 'grayscale opacity-50' : ''}>
              {avatar.svg}
            </div>
            {!isUnlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            )}
          </div>
        )
      })}
    </div>
  );
};

// Helper untuk render avatar di tempat lain
export const renderAvatar = (id: string, className = "w-10 h-10") => {
    const svg = avatarsMap.get(id) || avatarsMap.get('cow-1');
    return (
        <div className={className}>
            {svg}
        </div>
    )
}