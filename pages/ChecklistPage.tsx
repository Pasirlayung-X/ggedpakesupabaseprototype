
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import type { ChecklistItem, DailyLog, UserProfile } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Data default untuk inisialisasi user baru (Daily Routine)
const DEFAULT_TASKS = [
  { task: "Pemberian Pakan Pagi", description: "Berikan pakan berkualitas pada pukul 07:00." },
  { task: "Pembersihan Kandang", description: "Bersihkan sisa pakan dan kotoran agar lingkungan sehat." },
  { task: "Pemeriksaan Air Minum", description: "Pastikan wadah air minum terisi penuh dan bersih." },
  { task: "Pemantauan Kesehatan", description: "Cek kondisi fisik ternak, pastikan tidak ada yang lesu." },
  { task: "Pengolahan Limbah", description: "Kumpulkan kotoran harian untuk proses biogas/kompos." },
  { task: "Pemberian Pakan Sore", description: "Berikan pakan tambahan pada pukul 16:00." },
];

interface ChecklistPageProps {
  user: User | null;
  isLoggedIn: boolean;
}

const ChecklistPage: React.FC<ChecklistPageProps> = ({ user, isLoggedIn }) => {
  // State Data
  const [tasks, setTasks] = useState<ChecklistItem[]>([]);
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [claimedItems, setClaimedItems] = useState<Set<number>>(new Set());
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isFetched, setIsFetched] = useState(false); // Flag untuk mencegah overwrite data saat loading
  
  // State UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<ChecklistItem | null>(null); // Jika null, berarti mode "Tambah"
  const [claiming, setClaiming] = useState(false); // State untuk loading tombol klaim
  const [alreadyClaimedToday, setAlreadyClaimedToday] = useState(false);
  
  // State Form
  const [formTask, setFormTask] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Menggunakan tanggal lokal dalam format YYYY-MM-DD
  const todayStr = useMemo(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset*60*1000));
    return localDate.toISOString().split('T')[0];
  }, []);

  // Helper untuk mendapatkan tanggal kemarin
  const getYesterdayStr = (today: string): string => {
      const todayDate = new Date(today);
      todayDate.setDate(todayDate.getDate() - 1);
      return todayDate.toISOString().split('T')[0];
  }

  // --- LOGIKA STREAK DAN XP (MANUAL TRIGGER) ---
  const handleClaimXP = async () => {
      if (!user || !profile) return;
      
      const newItemsToClaim = Array.from(completedItems).filter(id => !claimedItems.has(id));
      
      if (newItemsToClaim.length === 0) {
          alert("Semua tugas yang dipilih sudah diklaim XP-nya!");
          return;
      }

      setClaiming(true);
      
      try {
          const currentProfile = { ...profile };
          const lastDate = currentProfile.last_completed_date;
          const yesterday = getYesterdayStr(todayStr);
          let newStreak = currentProfile.current_streak || 0;

          // 1. Hitung Streak (Hanya bertambah jika ini klaim PERTAMA hari ini)
          if (lastDate !== todayStr) {
              if (lastDate === yesterday) {
                  newStreak += 1;
              } else {
                  newStreak = 1;
              }
          }

          // 2. Hitung XP Baru (Hanya untuk item yang baru diklaim)
          const xpGained = newItemsToClaim.length * 10; // 10 XP per tugas baru
          
          let newXp = (currentProfile.xp || 0) + xpGained;
          let newLevel = currentProfile.level || 1;
          
          // 3. Cek kenaikan level
          let xpForNextLevel = Math.floor(100 * Math.pow(1.25, newLevel - 1));
          let leveledUp = false;
          while (newXp >= xpForNextLevel) {
              newLevel += 1;
              newXp -= xpForNextLevel;
              leveledUp = true;
              xpForNextLevel = Math.floor(100 * Math.pow(1.25, newLevel - 1));
          }

          // 4. Update profil
          const { error: updateError } = await supabase
              .from('profiles')
              .upsert({
                  id: user.id,
                  current_streak: newStreak,
                  longest_streak: Math.max(currentProfile.longest_streak || 0, newStreak),
                  last_completed_date: todayStr,
                  xp: newXp,
                  level: newLevel
              });
          
          if (updateError) throw updateError;
          
          // 5. Update log untuk mencatat item yang sudah diklaim
          const updatedClaimedItems = new Set([...Array.from(claimedItems), ...newItemsToClaim]);
          const { error: logError } = await supabase
              .from('daily_checklist_logs')
              .upsert({
                  user_id: user.id,
                  log_date: todayStr,
                  completed_items: Array.from(completedItems),
                  claimed_items: Array.from(updatedClaimedItems)
              }, { onConflict: 'user_id, log_date' });

          if (logError) throw logError;

          setClaimedItems(updatedClaimedItems);
          
          let successMsg = `Berhasil klaim +${xpGained} XP!`;
          if (leveledUp) successMsg += `\n🎉 Level Up! Anda sekarang Level ${newLevel}!`;
          alert(successMsg);

          await fetchProfile();
          
      } catch (err: any) {
          alert("Gagal klaim XP: " + err.message);
      } finally {
          setClaiming(false);
      }
  };

  // --- CRUD OPERATIONS ---

  // 1. Fetch Profile (Read)
  const fetchProfile = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile(data);
        setAlreadyClaimedToday(data.last_completed_date === todayStr);
      } else {
        // Buat profil default jika belum ada
         const defaultProfile: UserProfile = {
            id: user.id,
            username: user.user_metadata?.username || 'Peternak',
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
        setAlreadyClaimedToday(false);
      }
    } catch (err) {
       console.error("Gagal memuat profil di checklist", err);
    }
  }, [user, todayStr]);

  // 2. Fetch Tasks (Read) & Seed Default
  const fetchTasks = useCallback(async () => {
    if (!isLoggedIn || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('checklist_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('id', { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        // Seed default tasks jika user belum punya tugas
        const seedData = DEFAULT_TASKS.map(t => ({ ...t, user_id: user.id }));
        const { data: newData, error: seedError } = await supabase
            .from('checklist_tasks')
            .insert(seedData)
            .select();
            
        if (seedError) throw seedError;
        setTasks(newData || []);
      } else {
        setTasks(data);
      }
    } catch (err: unknown) {
      console.error("Error fetching tasks:", err);
      // Fallback to static if DB fails just to show something
      setTasks(DEFAULT_TASKS.map((t, i) => ({ ...t, id: i + 1 }))); 
    }
  }, [isLoggedIn, user]);

  // 3. Fetch Daily Logs (Read History)
  const fetchDailyLogs = useCallback(async () => {
    if (!isLoggedIn || !user) {
      setLoading(false);
      return;
    }

    setError(null);
    try {
      const d = new Date();
      d.setDate(d.getDate() - 6); 
      const sevenDaysAgo = d.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('daily_checklist_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('log_date', sevenDaysAgo)
        .order('log_date', { ascending: true });

      if (error) throw error;

      const logsMap = new Map();
      let todayLogData: any = null;
      
      if (data) {
        data.forEach((log: any) => {
          logsMap.set(log.log_date, log.completed_items || []);
          if (log.log_date === todayStr) todayLogData = log;
        });
      }

      const processedLogs: DailyLog[] = [];
      const tempCompletedItems = new Set<number>();
      const tempClaimedItems = new Set<number>();

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStrKey = d.toISOString().split('T')[0];
        const displayDate = dateStrKey.substring(5); 

        const items: number[] = logsMap.get(dateStrKey) || [];
        
        processedLogs.push({
          date: displayDate,
          completed_count: items.length
        });

        if (dateStrKey === todayStr && todayLogData) {
          (todayLogData.completed_items || []).forEach((id: number) => tempCompletedItems.add(id));
          (todayLogData.claimed_items || []).forEach((id: number) => tempClaimedItems.add(id));
        }
      }

      setDailyLogs(processedLogs);
      setCompletedItems(tempCompletedItems);
      setClaimedItems(tempClaimedItems);
      setIsFetched(true);

    } catch (err: unknown) {
      console.error("Error fetching logs:", err);
      setError("Gagal memuat data checklist.");
    } finally {
      setLoading(false);
    }
  }, [todayStr, isLoggedIn, user]);

  // Initial Load
  useEffect(() => {
    const init = async () => {
        setLoading(true);
        await fetchProfile();
        await fetchTasks();
        await fetchDailyLogs();
        setLoading(false);
    };
    init();
  }, [fetchProfile, fetchTasks, fetchDailyLogs]);

  // --- CLEANUP LOGIC ---
  useEffect(() => {
    if (tasks.length > 0 && completedItems.size > 0) {
      const taskIds = new Set(tasks.map(t => t.id));
      const validIds = Array.from(completedItems).filter(id => taskIds.has(id));
      if (validIds.length !== completedItems.size) {
        const newSet = new Set(validIds);
        setCompletedItems(newSet);
        setDailyLogs(prevLogs =>
            prevLogs.map(log =>
                log.date === todayStr.substring(5)
                    ? { ...log, completed_count: newSet.size }
                    : log
            )
        );
      }
    }
  }, [tasks, completedItems, todayStr]);

  // Create / Update Task
  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    try {
      if (editingTask) {
        // UPDATE
        const { error } = await supabase
          .from('checklist_tasks')
          .update({ task: formTask, description: formDesc })
          .eq('id', editingTask.id);

        if (error) throw error;

        setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, task: formTask, description: formDesc } : t));
      } else {
        // CREATE
        const { data, error } = await supabase
          .from('checklist_tasks')
          .insert([{ user_id: user.id, task: formTask, description: formDesc }])
          .select();

        if (error) throw error;
        if (data) setTasks(prev => [...prev, ...data]);
      }
      closeModal();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert("Gagal menyimpan tugas: " + message);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Task
  const handleDeleteTask = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tugas ini? Riwayat checklist untuk tugas ini tetap ada, tapi tugas akan hilang dari daftar hari ini.")) return;
    
    try {
        const { error } = await supabase
            .from('checklist_tasks')
            .delete()
            .eq('id', id);
        
        if (error) throw error;

        setTasks(prev => prev.filter(t => t.id !== id));
        if (completedItems.has(id)) {
            const newSet = new Set<number>(completedItems);
            newSet.delete(id);
            setCompletedItems(newSet);
            await saveChecklistLog(newSet);
        }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        alert("Gagal menghapus: " + message);
    }
  };

  // --- CHECKLIST LOGIC ---

  const saveChecklistLog = async (currentSet: Set<number>) => {
      if (!user || !isFetched) return; // Jangan simpan jika data belum beres di-fetch
      const itemsArray = Array.from(currentSet);
      try {
        const { error } = await supabase
            .from('daily_checklist_logs')
            .upsert({
            user_id: user.id,
            log_date: todayStr,
            completed_items: itemsArray,
            claimed_items: Array.from(claimedItems)
            }, {
            onConflict: 'user_id, log_date'
            });
        if (error) throw error;
      } catch (err) {
          console.error("Auto-save failed", err);
      }
  };

  const handleToggle = async (itemId: number) => {
    if (!isLoggedIn || !user) return;
    
    // Cegah uncheck jika sudah diklaim
    if (claimedItems.has(itemId)) {
        alert("Tugas ini sudah diklaim XP-nya dan tidak dapat dibatalkan hari ini.");
        return;
    }

    const newCompletedItems = new Set<number>(completedItems);
    if (newCompletedItems.has(itemId)) {
      newCompletedItems.delete(itemId);
    } else {
      newCompletedItems.add(itemId);
    }
    setCompletedItems(newCompletedItems);

    setDailyLogs(prevLogs =>
      prevLogs.map(log =>
        log.date === todayStr.substring(5)
          ? { ...log, completed_count: newCompletedItems.size }
          : log
      )
    );
    
    await saveChecklistLog(newCompletedItems);
  };

  // --- UI HELPERS ---

  const openAddModal = () => {
      setEditingTask(null);
      setFormTask('');
      setFormDesc('');
      setShowModal(true);
  };

  const openEditModal = (item: ChecklistItem) => {
      setEditingTask(item);
      setFormTask(item.task);
      setFormDesc(item.description);
      setShowModal(true);
  };

  const closeModal = () => {
      setShowModal(false);
      setEditingTask(null);
  };

  const progressPercentage = tasks.length > 0 ? (completedItems.size / tasks.length) * 100 : 0;
  const chartColors = { today: '#16A34A', other: '#86EFAC', text: '#6b7280' };
  const hasNewItemsToClaim = Array.from(completedItems).some(id => !claimedItems.has(id));
  const allItemsClaimed = completedItems.size > 0 && Array.from(completedItems).every(id => claimedItems.has(id));

    return (
    <div className="max-w-4xl mx-auto relative">
        <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-full transition-all duration-300 ${!isLoggedIn ? 'blur-sm pointer-events-none' : ''}`}>
        
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Checklist Harian</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Tanggal: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
            {isLoggedIn && (
                <button 
                    onClick={openAddModal}
                    className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-sm text-sm font-medium"
                >
                    <span className="mr-2">➕</span>
                    Tambah Tugas
                </button>
            )}
        </div>
        
        <div className="md:grid md:grid-cols-2 md:gap-8">
            <div className="flex flex-col h-full">
                {loading && <p className="text-emerald-600 animate-pulse mb-2">Menyelaraskan data...</p>}
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                
                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between items-end mb-1.5">
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Progres Hari Ini</span>
                        <span className="text-xs font-bold text-emerald-600">{completedItems.size} dari {tasks.length} Tugas Selesai</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden shadow-inner">
                        <div 
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-4 rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2" 
                            style={{ width: `${progressPercentage}%` }}
                        >
                           {progressPercentage > 15 && (
                               <span className="text-[10px] font-black text-white drop-shadow-sm">{Math.round(progressPercentage)}%</span>
                           )}
                        </div>
                    </div>
                </div>

                {/* Checklist Items */}
                <div className="space-y-3 flex-grow overflow-y-auto max-h-[500px] pr-2">
                    {tasks.length === 0 && !loading ? (
                         <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                            <p>Belum ada tugas checklist.</p>
                            <button onClick={openAddModal} className="text-emerald-600 font-semibold hover:underline mt-2">Buat tugas pertama Anda</button>
                         </div>
                    ) : (
                        tasks.map((item) => (
                        <div key={item.id} className="group flex items-start p-3 rounded-lg border border-transparent hover:bg-gray-50 hover:border-gray-200 transition-all duration-200">
                            <div className="pt-1">
                                <input
                                id={`item-${item.id}`}
                                type="checkbox"
                                checked={completedItems.has(item.id)}
                                onChange={() => handleToggle(item.id)}
                                className={`h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer ${claimedItems.has(item.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!isLoggedIn || loading || claimedItems.has(item.id)}
                                />
                            </div>
                            
                            <div className="ml-3 flex-1 cursor-pointer select-none" onClick={(e) => { 
                                // Prevent toggle when clicking actions
                                if ((e.target as HTMLElement).closest('button')) return;
                                handleToggle(item.id); 
                            }}>
                                <div className="flex items-center space-x-2">
                                    <span className={`font-medium text-gray-900 transition-all ${completedItems.has(item.id) ? 'line-through text-gray-400' : ''}`}>
                                        {item.task}
                                    </span>
                                    {claimedItems.has(item.id) && (
                                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">Klaim ✓</span>
                                    )}
                                </div>
                                <p className={`text-sm text-gray-500 mt-0.5 ${completedItems.has(item.id) ? 'text-gray-300' : ''}`}>
                                    {item.description}
                                </p>
                            </div>

                            {/* Action Buttons (Visible on Hover) */}
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                <button 
                                    onClick={() => openEditModal(item)}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                    title="Edit Tugas"
                                >
                                    <span className="text-base">✏️</span>
                                </button>
                                <button 
                                    onClick={() => handleDeleteTask(item.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                    title="Hapus Tugas"
                                >
                                    <span className="text-base">🗑️</span>
                                </button>
                            </div>
                        </div>
                        ))
                    )}
                </div>
                
                 {/* TOMBOL UPDATE TUGAS / KLAIM XP */}
                 <div className="mt-4 pt-3 border-t border-gray-100">
                    <button
                        onClick={handleClaimXP}
                        disabled={loading || claiming || tasks.length === 0 || (!hasNewItemsToClaim && allItemsClaimed) || (completedItems.size === 0 && !allItemsClaimed)}
                        className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-md transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2
                            ${allItemsClaimed && !hasNewItemsToClaim
                                ? 'bg-green-700 cursor-not-allowed'
                                : (hasNewItemsToClaim ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gray-300 cursor-not-allowed text-gray-500')
                            }`}
                    >
                        {claiming ? (
                             <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Menghitung Progres...</span>
                             </>
                        ) : (allItemsClaimed && !hasNewItemsToClaim) ? (
                             <>
                                <span>✔️</span>
                                <span>Semua XP Sudah Diklaim</span>
                             </>
                        ) : (
                             <>
                                <span>🏅</span>
                                <span>{hasNewItemsToClaim ? `Klaim XP (${Array.from(completedItems).filter(id => !claimedItems.has(id)).length} Tugas Baru)` : 'Selesaikan Tugas'}</span>
                             </>
                        )}
                    </button>
                    {allItemsClaimed && !hasNewItemsToClaim && (
                        <p className="text-xs text-center text-emerald-600 mt-2 font-medium">Luar biasa! Semua tugas hari ini sudah tuntas.</p>
                    )}
                    {!allItemsClaimed && !hasNewItemsToClaim && (
                        <p className="text-xs text-center text-gray-500 mt-2">Centang tugas baru untuk klaim XP tambahan.</p>
                    )}
                 </div>
            </div>
            
            <div className="mt-8 md:mt-0 flex flex-col">
                 <h4 className="text-xl font-semibold text-gray-800 mb-4 text-center">Progres 7 Hari Terakhir</h4>
                <div className="flex-grow min-h-[250px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyLogs} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: chartColors.text }} />
                        <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} tick={{ fill: chartColors.text }}/>
                        <Tooltip 
                        cursor={{fill: 'rgba(22, 163, 74, 0.1)'}}
                        contentStyle={{ backgroundColor: '#fff', border: `1px solid #ddd`, borderRadius: '8px' }}
                        labelStyle={{ fontWeight: 'bold', color: '#111827' }}
                        formatter={(value) => [`${value} tugas`, 'Selesai']}
                        />
                        <Bar dataKey="completed_count" name="Tugas Selesai" barSize={20} radius={[4, 4, 0, 0]}>
                        {dailyLogs.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.date === todayStr.substring(5) ? chartColors.today : chartColors.other} />
                        ))}
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-6 p-4 bg-emerald-50 rounded-lg text-center">
                    <p className="text-sm text-emerald-800 italic">
                        "Konsistensi kecil setiap hari membawa perubahan besar bagi bumi."
                    </p>
                </div>
            </div>
        </div>
        </div>

        {/* MODAL EDIT/ADD */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4 animate-page-enter">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800">
                            {editingTask ? 'Edit Tugas' : 'Tambah Tugas Baru'}
                        </h3>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <form onSubmit={handleSaveTask} className="p-6 space-y-4 overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tugas</label>
                            <input 
                                type="text" 
                                required
                                maxLength={50}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Contoh: Bersihkan Kandang"
                                value={formTask}
                                onChange={(e) => setFormTask(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi (Opsional)</label>
                            <textarea 
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Detail singkat tentang tugas..."
                                value={formDesc}
                                onChange={(e) => setFormDesc(e.target.value)}
                            />
                        </div>

                        <div className="pt-4 flex space-x-3 border-t border-gray-100 mt-2">
                            <button 
                                type="button" 
                                onClick={closeModal}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSaving}
                                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium disabled:bg-emerald-400"
                            >
                                {isSaving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {!isLoggedIn && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 rounded-xl text-white text-2xl font-bold z-10 backdrop-blur-sm px-4 text-center">
              Silakan Masuk untuk Mengelola Checklist Anda
          </div>
        )}
    </div>
  );
};

export default ChecklistPage;
