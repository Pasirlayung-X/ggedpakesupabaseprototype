import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { User } from '@supabase/supabase-js';
import { avatarData } from '../components/AvatarSelector';

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {avatarData.map((avatar) => {
            const isUnlocked = userLevel >= avatar.unlockLevel;
            return (
              <div key={avatar.id} className="text-center">
                <div className={`relative p-2 rounded-full border-4 transition-all duration-300 ${isUnlocked ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-gray-100'}`}>
                  <div className={`w-24 h-24 mx-auto ${!isUnlocked ? 'filter grayscale opacity-50' : ''}`}>
                    {avatar.svg}
                  </div>
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="mt-2 font-bold text-gray-800">{avatar.name}</p>
                {isUnlocked ? (
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Terbuka</p>
                ) : (
                  <p className="text-xs text-gray-500 font-medium">Buka di Level {avatar.unlockLevel}</p>
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
