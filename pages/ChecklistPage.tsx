import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { User } from '@supabase/supabase-js';
import type { ChecklistItem, DailyLog } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ALL_CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 1, task: "Manajemen Pakan", description: "Berikan suplemen pakan yang dapat mengurangi emisi metana." },
  { id: 2, task: "Pengelolaan Kotoran", description: "Bersihkan kandang dan kumpulkan kotoran untuk diolah." },
  { id: 3, task: "Instalasi Biogas", description: "Olah kotoran menjadi biogas untuk energi terbarukan." },
  { id: 4, task: "Pembuatan Kompos", description: "Proses kotoran menjadi kompos untuk mengurangi emisi." },
  { id: 5, task: "Kesehatan Ternak", description: "Pastikan ternak sehat untuk efisiensi pencernaan." },
];

interface ChecklistPageProps {
  user: User;
  isLoggedIn: boolean; // Tambahkan prop ini
}

const ChecklistPage: React.FC<ChecklistPageProps> = ({ user, isLoggedIn }) => {
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const fetchChecklistData = useCallback(async () => {
    if (!isLoggedIn) {
      // Jangan fetch data jika belum login
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Menyimulasikan jeda jaringan
      await new Promise(res => setTimeout(res, 500));

      // Membuat data dummy untuk 7 hari terakhir
      const processedLogs = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const isToday = i === 0;
        // Beri data acak, tapi pastikan hari ini mulai dari 2 item selesai
        const completed_count = isToday ? 2 : Math.floor(Math.random() * (ALL_CHECKLIST_ITEMS.length + 1));
        return {
          date: dateStr.substring(5), // "MM-DD"
          completed_count: completed_count,
        };
      }).reverse();
      
      setDailyLogs(processedLogs);

      // Mengatur item yang selesai untuk hari ini berdasarkan data dummy
      const todayLog = processedLogs.find(log => log.date === todayStr.substring(5));
      if (todayLog) {
          const initialCompleted = new Set<number>();
          for (let i = 1; i <= todayLog.completed_count; i++) {
              initialCompleted.add(ALL_CHECKLIST_ITEMS[i-1].id);
          }
          setCompletedItems(initialCompleted);
      }

    } catch (err: any) {
      setError("Gagal memuat data dummy checklist.");
    } finally {
      setLoading(false);
    }
  }, [todayStr, isLoggedIn]); // Tambahkan isLoggedIn sebagai dependency

  useEffect(() => {
    fetchChecklistData();
  }, [fetchChecklistData]);

  const handleToggle = (itemId: number) => {
    if (!isLoggedIn) return; // Hanya izinkan toggle jika sudah login

    const newCompletedItems = new Set(completedItems);
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
  };

  const progressPercentage = (completedItems.size / ALL_CHECKLIST_ITEMS.length) * 100;
  // Chart colors fixed to light mode
  const chartColors = { today: '#16A34A', other: '#86EFAC', text: '#6b7280' };
  

  return (
    <div className="max-w-4xl mx-auto relative"> {/* Tambahkan relative di sini */}
        <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 h-full transition-all duration-300 ${!isLoggedIn ? 'blur-sm pointer-events-none' : ''}`}>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Checklist Harian</h2>
        <p className="text-md text-gray-500 mb-6">Tandai tugas yang telah Anda selesaikan hari ini untuk melacak progres mitigasi metana.</p>
        
        <div className="md:grid md:grid-cols-2 md:gap-8">
            <div>
                 <p className="text-sm text-gray-500 mb-2">Tanggal: {new Date(todayStr).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                
                {loading && <p>Memuat checklist...</p>}
                {error && <p className="text-red-500">{error}</p>}
                
                {!loading && !error && (
                    <>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <div className="space-y-4">
                        {ALL_CHECKLIST_ITEMS.map((item) => (
                        <div key={item.id} className="flex items-start p-2 rounded-md hover:bg-gray-50">
                            <input
                            id={`item-${item.id}`}
                            type="checkbox"
                            checked={completedItems.has(item.id)}
                            onChange={() => handleToggle(item.id)}
                            className="h-5 w-5 rounded border-gray-300 bg-gray-100 text-emerald-600 focus:ring-emerald-500 mt-1 cursor-pointer"
                            disabled={!isLoggedIn} // Disable checkbox if not logged in
                            />
                            <label htmlFor={`item-${item.id}`} className="ml-3 text-sm flex-1 cursor-pointer">
                            <span className="font-medium text-gray-900">{item.task}</span>
                            <p className="text-gray-500">{item.description}</p>
                            </label>
                        </div>
                        ))}
                    </div>
                    </>
                )}
            </div>
            
            <div className="mt-8 md:mt-0">
                 <h4 className="text-xl font-semibold text-gray-800 mb-4 text-center">Progres 7 Hari Terakhir</h4>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                    <BarChart data={dailyLogs} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: chartColors.text }} />
                        <YAxis allowDecimals={false} domain={[0, ALL_CHECKLIST_ITEMS.length]} fontSize={12} tickLine={false} axisLine={false} tick={{ fill: chartColors.text }}/>
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
            </div>
        </div>
        </div>
        {!isLoggedIn && ( // Overlay jika belum login
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 rounded-xl text-white text-2xl font-bold z-10">
              Silakan Masuk untuk Mengakses Checklist Harian
          </div>
        )}
    </div>
  );
};

export default ChecklistPage;