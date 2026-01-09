
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../services/supabase';
import type { User } from '@supabase/supabase-js';
import { AvatarSelector, renderAvatar } from '../components/AvatarSelector';
import type { UserProfile } from '../types';
import { Page } from '../App';

interface ProfilePageProps {
  user: User | null;
  onProfileUpdate: () => void; // Callback untuk refresh header
  onNavigate: (main: Page['main'], sub?: string) => void;
}

// --- TIER SYSTEM ---
const tiers = [
  { level: 1, name: "Anak Baru", desc: "Masih hijau, baru kenalan sama sistemnya.", color: "text-gray-500" },
  { level: 3, name: "Lumayan Nih", desc: "Mulai sering checklist, progres terlihat.", color: "text-green-600" },
  { level: 6, name: "Udah Jago", desc: "Keterampilan sudah solid, jadi kebiasaan.", color: "text-blue-600" },
  { level: 10, name: "Kelas Atas", desc: "Jago banget, dihormati. Udah pro di lingkungannya.", color: "text-purple-600" },
  { level: 15, name: "Sultan", desc: "Konsistensi dan dampaknya nggak ada lawan.", color: "text-amber-500" },
  { level: 20, name: "Dewa", desc: "Sulit dikalahkan. Performa selalu gila.", color: "text-red-600" },
  { level: 25, name: "Legenda Hidup", desc: "Namanya melegenda, diakui sebagai yang terbaik.", color: "text-black" }
];

const getTierInfo = (level: number) => {
    return tiers.slice().reverse().find(tier => level >= tier.level) || tiers[0];
};

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onProfileUpdate, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [username, setUsername] = useState('');
  const [avatarId, setAvatarId] = useState('cow-1');
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifTime, setNotifTime] = useState('08:00');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [lastLevel, setLastLevel] = useState<number | null>(null);

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 means no rows found, which is fine for new users

      if (data) {
        // Profile exists, use it
        setProfile(data);
        setUsername(data.username || user.user_metadata?.username || '');
        setAvatarId(data.avatar_id || 'cow-1');
        setNotifEnabled(data.notification_enabled || false);
        if (data.notification_time) {
            const timeParts = data.notification_time.split(':');
            setNotifTime(`${timeParts[0]}:${timeParts[1]}`);
        }
      } else {
        // Profile doesn't exist, create a default one for the UI
        const defaultProfile: UserProfile = {
            id: user.id,
            username: user.user_metadata?.username || '',
            avatar_id: 'cow-1',
            notification_enabled: false,
            notification_time: '08:00',
            level: 1,
            xp: 0,
            current_streak: 0,
            longest_streak: 0,
            last_completed_date: null,
        };
        setProfile(defaultProfile);
        setUsername(defaultProfile.username);
        setAvatarId(defaultProfile.avatar_id);
        setNotifEnabled(defaultProfile.notification_enabled);
        setNotifTime(defaultProfile.notification_time);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Gagal memuat profil.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if(profile) setLastLevel(profile.level); // Simpan level sebelum fetch
      fetchProfile();
    }
  }, [user]);
  
  // Efek untuk menampilkan pesan level up
  useEffect(() => {
      if (profile && lastLevel !== null && profile.level > lastLevel) {
          setMessage({ type: 'success', text: `Selamat! Anda telah mencapai Level ${profile.level} dan membuka hadiah baru!`});
          const timer = setTimeout(() => setMessage(null), 5000);
          return () => clearTimeout(timer);
      }
  }, [profile, lastLevel]);


  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert("Browser ini tidak mendukung notifikasi desktop.");
      return false;
    }
    if (Notification.permission === 'granted') return true;
    const permission = await Notification.requestPermission();
    if (permission === 'granted') return true;
    alert("Izin notifikasi ditolak. Mohon aktifkan di pengaturan browser Anda.");
    return false;
  };

  const handleToggleNotification = async (checked: boolean) => {
      if (checked) {
          const granted = await requestNotificationPermission();
          setNotifEnabled(granted);
      } else {
          setNotifEnabled(false);
      }
  };

  // --- ADMIN / CHEAT FUNCTION ---
  const handleAdminUpgrade = async () => {
    if (!user) return;
    if (!confirm("👑 Mode Sultan: Apakah Anda yakin ingin langsung naik ke Level 25 dan membuka semua fitur?")) return;
    
    setSaving(true);
    try {
        const updates = {
            id: user.id,
            level: 25,
            xp: 0, // Reset XP di level baru
            current_streak: 365,
            longest_streak: 365,
            avatar_id: 'methane' // Unlock avatar tertinggi
        };
        
        const { error } = await supabase.from('profiles').upsert(updates);
        if (error) throw error;
        
        await fetchProfile(); // Refresh data lokal
        onProfileUpdate(); // Refresh header
        alert("Berhasil! Anda sekarang adalah Legenda Hidup.");
    } catch (err: any) {
        alert("Gagal upgrade: " + err.message);
    } finally {
        setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);

    try {
      const updates: Partial<UserProfile> = {
        id: user.id,
        username,
        avatar_id: avatarId,
        notification_enabled: notifEnabled,
        notification_time: notifTime,
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;

      await supabase.auth.updateUser({ data: { username: username } });

      setMessage({ type: 'success', text: 'Profil berhasil disimpan!' });
      onProfileUpdate();
      // Refresh profile local state to match saved data
      await fetchProfile();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Gagal menyimpan profil: ' + error.message });
    } finally {
      setSaving(false);
    }
  };
  
  const currentTier = useMemo(() => profile ? getTierInfo(profile.level) : tiers[0], [profile]);
  const xpForNextLevel = useMemo(() => profile ? Math.floor(100 * Math.pow(1.25, profile.level - 1)) : 100, [profile]);
  const xpProgress = useMemo(() => profile ? (profile.xp / xpForNextLevel) * 100 : 0, [profile, xpForNextLevel]);

  if (!user) return <div className="p-8 text-center text-gray-500">Silakan login untuk mengatur profil.</div>;
  if (loading || !profile) return <div className="p-8 text-center text-emerald-600 animate-pulse">Memuat profil...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-page-enter">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Profil & Progres Saya</h1>
        <p className="text-gray-600">Atur profil, lacak pencapaian, dan buka hadiah baru!</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-emerald-100 h-36 relative">
             <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                 <div className="bg-white p-2 rounded-full shadow-md">
                     {renderAvatar(avatarId, "w-24 h-24")}
                 </div>
             </div>
        </div>
        
        <div className="p-8 pt-16">
            <div className="text-center mb-6">
                 <h2 className="text-2xl font-bold text-gray-800">{username || 'Peternak Cerdas'}</h2>
                 <p className={`text-sm font-semibold ${currentTier.color}`}>{currentTier.name} (Level {profile.level})</p>
                 <p className="text-xs text-gray-500 italic mt-1">"{currentTier.desc}"</p>
            </div>

            {/* Streak & XP Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Streak */}
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg flex items-center justify-around text-center">
                    <div>
                        <div className="flex items-center justify-center text-orange-500">
                            <span className="text-3xl mr-1">🔥</span>
                            <span className="text-3xl font-bold">{profile.current_streak}</span>
                        </div>
                        <p className="text-xs font-medium text-orange-700">Streak Saat Ini</p>
                    </div>
                     <div>
                        <div className="flex items-center justify-center text-gray-400">
                             <span className="text-2xl mr-1">🏆</span>
                            <span className="text-2xl font-semibold">{profile.longest_streak}</span>
                        </div>
                        <p className="text-xs text-gray-500">Rekor Streak</p>
                    </div>
                </div>
                {/* XP Progress */}
                <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-bold text-indigo-800">Progres Level {profile.level}</p>
                        <p className="text-xs font-semibold text-indigo-600">{profile.xp} / {xpForNextLevel} XP</p>
                    </div>
                    <div className="w-full bg-indigo-200 rounded-full h-3">
                        <div className="bg-indigo-500 h-3 rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }}></div>
                    </div>
                    <p className="text-xs text-indigo-500 mt-1 text-center">Dapatkan {xpForNextLevel - profile.xp} XP lagi untuk naik ke Level {profile.level + 1}!</p>
                </div>
            </div>
            
             {/* Quick Action Button */}
             <div className="mb-8 px-4">
                <button
                    onClick={() => onNavigate('checklist')}
                    className="w-full bg-amber-400 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-amber-500 transition-all duration-300 shadow-md transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                >
                    <span className="text-xl">📋</span>
                    <span>Buka Checklist Harian</span>
                </button>
            </div>


            {message && (
                <div className={`mb-6 p-3 rounded-lg text-sm transition-all duration-300 ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                    {message.text}
                </div>
            )}
            
            <form onSubmit={handleSave}>
                <div className="space-y-8">
                    {/* Avatar Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-4">Pilih Avatar (Buka dengan Level)</label>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <AvatarSelector selectedAvatarId={avatarId} onSelect={setAvatarId} userLevel={profile.level} />
                        </div>
                    </div>

                    <hr className="my-8 border-gray-100" />
                    
                    {/* General Settings */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Pengaturan Akun</h3>
                        <div className="space-y-4">
                            {/* Username */}
                            <div className="flex items-center">
                                <label htmlFor="username" className="w-1/3 text-sm font-medium text-gray-600">Nama Pengguna</label>
                                <input 
                                    type="text" 
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Nama Pengguna"
                                />
                            </div>
                            {/* Notifications */}
                             <div className="flex items-center">
                                <label className="w-1/3 text-sm font-medium text-gray-600">Pengingat Harian</label>
                                <div className="flex-1 flex items-center justify-between">
                                    <button 
                                        type="button"
                                        onClick={() => handleToggleNotification(!notifEnabled)}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${notifEnabled ? 'bg-emerald-600' : 'bg-gray-200'}`}
                                        role="switch"
                                        aria-checked={notifEnabled}
                                    >
                                        <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                    <div className={`flex items-center space-x-2 transition-opacity duration-300 ${notifEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                        <input 
                                            type="time" 
                                            value={notifTime}
                                            onChange={(e) => setNotifTime(e.target.value)}
                                            disabled={!notifEnabled}
                                            className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition duration-300 shadow-md disabled:bg-emerald-400"
                    >
                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>

            {/* ADMIN CHEAT BUTTON - HANYA MUNCUL JIKA USERNAME = 'dyas ganteng' */}
            {username.toLowerCase() === 'dyas ganteng' && (
                <div className="mt-8 pt-6 border-t border-purple-100">
                    <button
                        type="button"
                        onClick={handleAdminUpgrade}
                        className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition duration-300 shadow-lg flex items-center justify-center space-x-2 border-2 border-purple-400"
                    >
                        <span className="text-yellow-300 animate-pulse text-2xl">⚡️</span>
                        <span>AKTIFKAN MODE SULTAN (ADMIN)</span>
                    </button>
                    <p className="text-center text-xs text-purple-600 mt-2 font-mono">
                        Developer Access: Set Level 25 & Unlock All
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
