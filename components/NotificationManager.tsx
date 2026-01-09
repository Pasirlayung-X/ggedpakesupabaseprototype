
import React, { useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import type { UserProfile } from '../types';

interface NotificationManagerProps {
  userId: string | undefined;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ userId }) => {
  const scheduledTimeRef = useRef<string | null>(null);
  const timeoutIdRef = useRef<number | null>(null);

  // Fungsi untuk membersihkan notifikasi yang terjadwal
  const clearScheduledNotification = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
      scheduledTimeRef.current = null;
    }
  };

  // Fungsi untuk menjadwalkan notifikasi
  const scheduleNotification = (time: string) => {
    // Hapus notifikasi yang sudah ada jika ada
    clearScheduledNotification();
    
    // Pastikan izin sudah diberikan
    if (Notification.permission !== 'granted') {
      console.log('Izin notifikasi belum diberikan.');
      return;
    }

    const [hour, minute] = time.split(':').map(Number);
    const now = new Date();
    
    let notificationTime = new Date();
    notificationTime.setHours(hour, minute, 0, 0);

    // Jika waktu notifikasi sudah lewat hari ini, set untuk besok
    if (notificationTime <= now) {
      notificationTime.setDate(notificationTime.getDate() + 1);
    }
    
    const delay = notificationTime.getTime() - now.getTime();
    
    if (delay > 0) {
      timeoutIdRef.current = window.setTimeout(() => {
        new Notification('Waktunya Checklist GG-ed!', {
          body: 'Jangan lupa mengisi checklist harian Anda untuk menjaga streak!',
          icon: '/sergio.png', // Menggunakan logo baru
          badge: '/sergio.png', // Ikon untuk taskbar/status bar di beberapa OS
          tag: 'gg-ed-daily-reminder', // Mencegah notifikasi duplikat
        });
        // Jadwalkan ulang untuk besok setelah notifikasi muncul
        scheduleNotification(time);
      }, delay);

      scheduledTimeRef.current = time;
    }
  };

  useEffect(() => {
    const fetchProfileAndSchedule = async () => {
      if (!userId) {
        clearScheduledNotification();
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('notification_enabled, notification_time')
          .eq('id', userId)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          const profile = data as Partial<UserProfile>; // Use Partial for safety
          if (profile.notification_enabled && profile.notification_time) {
            // Hanya jadwalkan ulang jika waktu berubah atau belum terjadwal
            if (profile.notification_time !== scheduledTimeRef.current) {
              scheduleNotification(profile.notification_time);
            }
          } else {
            clearScheduledNotification();
          }
        }
      } catch (err) {
        console.error("Error fetching profile for notifications:", err);
      }
    };
    
    fetchProfileAndSchedule();
    
    // Listener untuk perubahan di tabel profil (misal, dari halaman profil)
    const channel = supabase.channel(`realtime:profiles:${userId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
        (payload) => {
          const updatedProfile = payload.new as UserProfile;
          if (updatedProfile) {
            if (updatedProfile.notification_enabled && updatedProfile.notification_time) {
              if (updatedProfile.notification_time !== scheduledTimeRef.current || !timeoutIdRef.current) {
                scheduleNotification(updatedProfile.notification_time);
              }
            } else {
              clearScheduledNotification();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      clearScheduledNotification();
    };
  }, [userId]);

  return null; // Komponen ini tidak merender UI apapun
};

export default NotificationManager;
