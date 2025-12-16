
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
  // FIX: Cast `import.meta` to `any` to resolve TypeScript error about missing 'env' property.
  // This is a workaround because the Vite client types are not available in this context.
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env[key] || (import.meta as any).env[`VITE_${key}`];
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