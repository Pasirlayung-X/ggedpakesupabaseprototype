import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { User } from '@supabase/supabase-js';

// Definisikan semua avatar dan level yang dibutuhkan
const allAvatars = [
  { id: 'cow-1', name: 'Sapi Ceria', src: '/avatars/cow-1.png', levelRequired: 1 },
  { id: 'cow-2', name: 'Sapi Santai', src: '/avatars/cow-2.png', levelRequired: 1 },
  { id: 'chicken-1', name: 'Ayam Jago', src: '/avatars/chicken-1.png', levelRequired: 3 },
  { id: 'pig-1', name: 'Babi Bahagia', src: '/avatars/pig-1.png', levelRequired: 5 },
  { id: 'sheep-1', name: 'Domba Keren', src: '/avatars/sheep-1.png', levelRequired: 8 },
  { id: 'horse-1', name: 'Kuda Gagah', src: '/avatars/horse-1.png', levelRequired: 12 },
  { id: 'methane', name: 'Gas Metana', src: '/avatars/methane.png', levelRequired: 15, isSpecial: true },
  { id: 'sultan', name: 'Sultan', src: '/avatars/sultan.png', levelRequired: 99, isSpecial: true },
];

interface AvatarGalleryPageProps {
  user: User;
  onNavigate: (page: 'profile') => void;
}

const AvatarGalleryPage: React.FC<AvatarGalleryPageProps> = ({ user, onNavigate }) => {
  const [userLevel, setUserLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserLevel = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('level')
          .eq('id', user.id)
          .single();
        if (error) throw error;
        if (data) setUserLevel(data.level);
      } catch (error) {
        console.error('Error fetching user level:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserLevel();
  }, [user]);

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-page-enter">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Galeri Avatar</h1>
        <button 
          onClick={() => onNavigate('profile')}
          className="text-sm bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Kembali ke Profil
        </button>
      </div>
      
      {loading ? (
        <div className="text-center">Memuat...</div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
          {allAvatars.map((avatar) => {
            const isUnlocked = userLevel >= avatar.levelRequired;
            return (
              <div key={avatar.id} className="text-center">
                <div className={`relative p-2 rounded-full border-4 ${isUnlocked ? 'border-emerald-400' : 'border-gray-200'} ${avatar.isSpecial ? 'bg-purple-200' : 'bg-gray-100'}`}>
                  <img 
                    src={avatar.src} 
                    alt={avatar.name} 
                    className={`w-24 h-24 rounded-full transition-all duration-300 ${!isUnlocked ? 'filter grayscale opacity-50' : ''}`}
                  />
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <span className="text-white text-3xl">🔒</span>
                    </div>
                  )}
                </div>
                <p className="mt-2 font-semibold text-gray-700">{avatar.name}</p>
                {isUnlocked ? (
                  <p className="text-xs text-emerald-600 font-bold">Terbuka</p>
                ) : (
                  <p className="text-xs text-gray-500">Buka di Level {avatar.levelRequired}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AvatarGalleryPage;
