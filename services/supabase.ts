// FIX: Add a triple-slash directive to include Vite client types, which makes TypeScript aware of `import.meta.env` and resolves compilation errors.
/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

// ===================================================================
// KONFIGURASI SUPABASE
// ===================================================================

// Hardcoded fallback (untuk development cepat/preview)
const SUPABASE_URL_FALLBACK = 'https://hphigcpyvwveipbetxiy.supabase.co'; 
const SUPABASE_ANON_KEY_FALLBACK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaGlnY3B5dnd2ZWlwYmV0eGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNjM2OTUsImV4cCI6MjA4MDczOTY5NX0.yaTEVcDblG-bizFv8sdV0KCMbrbiENq1fOu6snpwpaU';

// ===================================================================

// Deteksi environment variable dengan aman (mendukung Vite dan standard process.env)
const getEnv = (key: string) => {
  // Dengan "vite/client" di tsconfig.json, TypeScript sekarang mengenali import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || import.meta.env[`VITE_${key}`];
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
};

const supabaseUrl = getEnv('SUPABASE_URL') || SUPABASE_URL_FALLBACK;
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY') || SUPABASE_ANON_KEY_FALLBACK;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL/Key is not configured. Please add your credentials in services/supabase.ts');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);