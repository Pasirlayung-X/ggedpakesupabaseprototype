
import { createClient } from '@supabase/supabase-js';

// ===================================================================
// KONFIGURASI SUPABASE - WAJIB DIISI
// ===================================================================
// Ganti nilai string kosong di bawah ini dengan kredensial dari
// dasbor proyek Supabase Anda (Settings > API).

const supabaseUrl = 'https://hphigcpyvwveipbetxiy.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaGlnY3B5dnd2ZWlwYmV0eGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNjM2OTUsImV4cCI6MjA4MDczOTY5NX0.yaTEVcDblG-bizFv8sdV0KCMbrbiENq1fOu6snpwpaU';

// ===================================================================

// FIX: Removed comparison to placeholder strings to resolve TypeScript error.
// The check now only ensures the variables are not empty.
if (!supabaseUrl || !supabaseAnonKey) {
    // Pesan galat ini akan ditangkap oleh ErrorBoundary untuk menampilkan panduan
    throw new Error('Supabase URL/Key is not configured. Please add your credentials in services/supabase.ts.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);