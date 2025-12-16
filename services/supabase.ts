// FIX: The reference to "vite/client" and usage of `import.meta.env` were removed to prevent type resolution errors in the provided environment.
// Switched to using `process.env` to align with other parts of the app (e.g., Gemini API key) and fix type errors.
// This assumes the build tool is configured to provide these environment variables.

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
  // This function now relies on `process.env`, which is assumed to be available
  // in the build environment, similar to how the Gemini API key is accessed.
  if (typeof process !== 'undefined' && process.env) {
    // Standard Vite projects expose env vars with VITE_ prefix.
    // We check for the VITE_ prefixed version first, then the unprefixed one.
    return process.env[`VITE_${key}`] || process.env[key];
  }
  return undefined;
};

const supabaseUrl = getEnv('SUPABASE_URL') || SUPABASE_URL_FALLBACK;
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY') || SUPABASE_ANON_KEY_FALLBACK;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL/Key is not configured. Please add your credentials in services/supabase.ts or as environment variables (e.g., VITE_SUPABASE_URL).');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
