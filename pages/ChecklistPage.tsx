
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import type { ChecklistItem, DailyLog, UserProfile } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GoogleGenAI } from "@google/genai";

// Data default untuk inisialisasi user baru
const DEFAULT_TASKS = [
  { task: "Manajemen Pakan", description: "Berikan suplemen pakan yang dapat mengurangi emisi metana." },
  { task: "Pengelolaan Kotoran", description: "Bersihkan kandang dan kumpulkan kotoran untuk diolah." },
  { task: "Instalasi Biogas", description: "Olah kotoran menjadi biogas untuk energi terbarukan." },
  { task: "Pembuatan Kompos", description: "Proses kotoran menjadi kompos untuk mengurangi emisi." },
  { task: "Kesehatan Ternak", description: "Pastikan ternak sehat untuk efisiensi pencernaan." },
];

interface ChecklistPageProps {
  user: User | null;
  isLoggedIn: boolean;
}

const ChecklistPage: React.FC<ChecklistPageProps> = ({ user, isLoggedIn }) => {
  // State Data
  const [tasks, setTasks] = useState<ChecklistItem[]>([]);
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  
  // State UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<ChecklistItem | null>(null); // Jika null, berarti mode "Tambah"
  
  // State Form
  const [formTask, setFormTask] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // State AI
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

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

  // --- LOGIKA STREAK DAN XP ---
  const updateStreakAndXp = async () => {
      if (!user) return;
      
      try {
          // 1. Ambil profil pengguna saat ini
          const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();

          if (profileError) throw profileError;
          if (!profile) return; // Seharusnya tidak terjadi jika RLS benar

          const lastDate = profile.last_completed_date;
          
          // 2. Jangan lakukan apa-apa jika sudah complete hari ini
          if (lastDate === todayStr) return;

          let newStreak = profile.current_streak || 0;
          const yesterday = getYesterdayStr(todayStr);

          // 3. Hitung streak baru
          if (lastDate === yesterday) {
              newStreak += 1; // Lanjutkan streak
          } else {
              newStreak = 1; // Streak putus, mulai dari 1
          }

          // 4. Hitung XP yang didapat
          const xpGained = 10 + Math.floor(newStreak / 2); // 10 XP dasar + bonus streak
          let newXp = (profile.xp || 0) + xpGained;
          let newLevel = profile.level || 1;
          
          // 5. Cek kenaikan level
          let xpForNextLevel = newLevel * 100;
          if (newXp >= xpForNextLevel) {
              newLevel += 1;
              newXp -= xpForNextLevel;
              // Bisa tambahkan notifikasi level up di sini jika diinginkan
          }

          // 6. Update profil
          const updates: Partial<UserProfile> = {
              current_streak: newStreak,
              longest_streak: Math.max(profile.longest_streak || 0, newStreak),
              last_completed_date: todayStr,
              xp: newXp,
              level: newLevel
          };

          const { error: updateError } = await supabase
              .from('profiles')
              .update(updates)
              .eq('id', user.id);
          
          if (updateError) throw updateError;
          
      } catch (err: any) {
          console.error("Gagal update streak:", err.message);
      }
  };

  // --- CRUD OPERATIONS ---

  // 1. Fetch Tasks (Read) & Seed Default
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
    } catch (err: any) {
      console.error("Error fetching tasks:", err);
      // Fallback to static if DB fails just to show something
      setTasks(DEFAULT_TASKS.map((t, i) => ({ ...t, id: i + 1 }))); 
    }
  }, [isLoggedIn, user]);

  // 2. Fetch Daily Logs (Read History)
  const fetchDailyLogs = useCallback(async () => {
    if (!isLoggedIn || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
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
      if (data) {
        data.forEach((log: any) => {
          logsMap.set(log.log_date, log.completed_items || []);
        });
      }

      const processedLogs: DailyLog[] = [];
      const tempCompletedItems = new Set<number>();

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

        if (dateStrKey === todayStr) {
          items.forEach((id: number) => tempCompletedItems.add(id));
        }
      }

      setDailyLogs(processedLogs);
      setCompletedItems(tempCompletedItems);

    } catch (err: any) {
      console.error("Error fetching logs:", err);
      setError("Gagal memuat data checklist.");
    } finally {
      setLoading(false);
    }
  }, [todayStr, isLoggedIn, user]);

  // Initial Load
  useEffect(() => {
    const init = async () => {
        await fetchTasks();
        await fetchDailyLogs();
    };
    init();
  }, [fetchTasks, fetchDailyLogs]);

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

  // --- AI ADVISOR LOGIC ---
  const analyzeTaskWithAI = async () => {
    if (!formTask.trim()) return;
    
    setIsAnalyzing(true);
    setAiFeedback(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
          Bertindaklah sebagai ahli peternakan sapi dan mitigasi gas rumah kaca.
          Analisis tugas berikut yang ingin ditambahkan peternak ke checklist harian mereka:
          
          Nama Tugas: ${formTask}
          Deskripsi: ${formDesc}
          
          Apakah tugas ini membantu mengurangi emisi gas metana (CH4) atau gas rumah kaca lainnya dari peternakan sapi?
          
          Berikan jawaban singkat (maksimal 3 kalimat) dengan nada yang menyemangati. 
          Jika tugas ini bagus, katakan kenapa. Jika tidak berhubungan langsung, berikan tips singkat agar lebih ramah lingkungan.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        setAiFeedback(response.text);
    } catch (err: any) {
        console.error("AI Error:", err);
        setAiFeedback("Maaf, Asisten AI sedang istirahat sebentar. Coba lagi nanti.");
    } finally {
        setIsAnalyzing(false);
    }
  };


  // 3. Create / Update Task
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
    } catch (err: any) {
      alert("Gagal menyimpan tugas: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Delete Task
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
    } catch (err: any) {
        alert("Gagal menghapus: " + err.message);
    }
  };

  // --- CHECKLIST LOGIC ---

  const saveChecklistLog = async (currentSet: Set<number>) => {
      if (!user) return;
      const itemsArray = Array.from(currentSet);
      try {
        const { error } = await supabase
            .from('daily_checklist_logs')
            .upsert({
            user_id: user.id,
            log_date: todayStr,
            completed_items: itemsArray,
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

    const wasJustCompleted = !completedItems.has(itemId);
    const firstCompletionToday = completedItems.size === 0 && wasJustCompleted;

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

    // Jalankan logika streak HANYA saat tugas pertama diselesaikan hari itu
    if (firstCompletionToday) {
        await updateStreakAndXp();
    }
  };

  // --- UI HELPERS ---

  const openAddModal = () => {
      setEditingTask(null);
      setFormTask('');
      setFormDesc('');
      setAiFeedback(null);
      setShowModal(true);
  };

  const openEditModal = (item: ChecklistItem) => {
      setEditingTask(item);
      setFormTask(item.task);
      setFormDesc(item.description);
      setAiFeedback(null);
      setShowModal(true);
  };

  const closeModal = () => {
      setShowModal(false);
      setEditingTask(null);
      setAiFeedback(null);
  };

  const progressPercentage = tasks.length > 0 ? (completedItems.size / tasks.length) * 100 : 0;
  const chartColors = { today: '#16A34A', other: '#86EFAC', text: '#6b7280' };

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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Tambah Tugas
                </button>
            )}
        </div>
        
        <div className="md:grid md:grid-cols-2 md:gap-8">
            <div className="flex flex-col h-full">
                {loading && <p className="text-emerald-600 animate-pulse mb-2">Menyelaraskan data...</p>}
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 mb-6 relative overflow-hidden">
                    <div className="bg-emerald-600 h-4 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2" style={{ width: `${progressPercentage}%` }}>
                       <span className="text-[10px] font-bold text-white">{Math.round(progressPercentage)}%</span>
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
                                className="h-5 w-5 rounded border-gray-300 bg-gray-100 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                disabled={!isLoggedIn || loading}
                                />
                            </div>
                            
                            <div className="ml-3 flex-1 cursor-pointer select-none" onClick={(e) => { 
                                // Prevent toggle when clicking actions
                                if ((e.target as HTMLElement).closest('button')) return;
                                handleToggle(item.id); 
                            }}>
                                <span className={`font-medium text-gray-900 transition-all ${completedItems.has(item.id) ? 'line-through text-gray-400' : ''}`}>
                                    {item.task}
                                </span>
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
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => handleDeleteTask(item.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                    title="Hapus Tugas"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        ))
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

                         {/* AI Consultant Section */}
                         <div className="pt-2">
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Asisten Cerdas GG-ed</span>
                             </div>
                             
                             {!aiFeedback ? (
                                 <button
                                    type="button"
                                    onClick={analyzeTaskWithAI}
                                    disabled={!formTask || isAnalyzing}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-indigo-200 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                    {isAnalyzing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className="text-sm font-medium">Sedang Menganalisa...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 9a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 5H12a1 1 0 01-1-1zM12 9a1 1 0 011-1h2.586l-1.293-1.293a1 1 0 111.414-1.414l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L15.586 10H13a1 1 0 01-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm font-medium">Tanya Asisten AI: Apakah ini membantu kurangi Metana?</span>
                                        </>
                                    )}
                                 </button>
                             ) : (
                                 <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 animate-page-enter">
                                     <div className="flex items-start">
                                         <div className="flex-shrink-0 mt-0.5">
                                            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                         </div>
                                         <div className="ml-3">
                                             <h4 className="text-sm font-bold text-indigo-800">Saran Asisten AI:</h4>
                                             <p className="mt-1 text-sm text-indigo-700">{aiFeedback}</p>
                                         </div>
                                         <button 
                                            type="button" 
                                            onClick={() => setAiFeedback(null)} 
                                            className="ml-auto flex-shrink-0 text-indigo-400 hover:text-indigo-600"
                                         >
                                             <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                             </svg>
                                         </button>
                                     </div>
                                 </div>
                             )}
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