
import React, { useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import type { UserProfile } from '../types';

interface NotificationManagerProps {
  userId: string | undefined;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ userId }) => {
  const lastCheckMinuteRef = useRef<number | null>(null);

  useEffect(() => {
    if (!userId) return;

    let intervalId: number;

    const checkAndNotify = async () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      
      // Hindari spam notifikasi di menit yang sama
      if (lastCheckMinuteRef.current === currentMinutes) return;

      try {
        // Ambil settings terbaru (bisa dioptimalkan dengan context, tapi fetch aman untuk ketepatan)
        const { data, error } = await supabase
          .from('profiles')
          .select('notification_enabled, notification_time')
          .eq('id', userId)
          .single();

        if (error || !data) return;

        if (data.notification_enabled && data.notification_time) {
          const [settingHour, settingMinute] = data.notification_time.split(':').map(Number);

          if (currentHours === settingHour && currentMinutes === settingMinute) {
             // Waktu cocok!
             lastCheckMinuteRef.current = currentMinutes;
             
             if (Notification.permission === 'granted') {
                 new Notification("Waktunya Checklist Ternak!", {
                     body: "Jangan lupa isi checklist harian Anda untuk mitigasi gas metana.",
                     // PENTING: Path ini memerlukan file `logo.svg` fisik di direktori publik (root) Anda.
                     icon: "/logo.svg" 
                 });
             }
          }
        }
      } catch (err) {
          console.error("Error checking notification", err);
      }
    };

    // Cek setiap 10 detik agar akurat
    intervalId = window.setInterval(checkAndNotify, 10000);

    return () => clearInterval(intervalId);
  }, [userId]);

  return null; // Komponen logika saja, tidak render UI
};

export default NotificationManager;
