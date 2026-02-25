import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { renderAvatar } from '../components/AvatarSelector';

interface Profile {
  id: string;
  username: string;
  avatar_id: string;
  level: number;
  xp: number;
}

const LeaderboardPage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_id, level, xp')
          .order('level', { ascending: false })
          .order('xp', { ascending: false })
          .limit(10);

        if (error) throw error;
        if (data) setProfiles(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-page-enter">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Papan Peringkat</h1>
      {loading ? (
        <div className="text-center text-gray-500">Memuat data...</div>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile, index) => {
            const isCurrentUser = profile.id === currentUserId;
            const medals = ['🥇', '🥈', '🥉'];
            return (
              <div key={profile.id} className={`flex items-center p-4 rounded-xl border transition-all duration-300 ${isCurrentUser ? 'bg-emerald-100 border-emerald-300 shadow-md' : 'bg-gray-50 border-gray-200'}`}>
               <span className="text-xl font-bold text-gray-500 w-8">{index + 1}</span>
               <div className="flex items-center flex-1 ml-4">
                 {renderAvatar(profile.avatar_id, 'w-12 h-12 rounded-full')}
                 <div className="ml-4">
                   <p className="font-semibold text-gray-800">{profile.username} {index < 3 && <span className="ml-1">{medals[index]}</span>}</p>
                   <p className="text-sm text-gray-500">Level {profile.level}</p>
                 </div>
               </div>
               <div className="text-right">
                  <p className="font-bold text-emerald-600 text-lg">{profile.xp} XP</p>
               </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
