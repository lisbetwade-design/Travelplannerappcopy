import { createClient } from '@supabase/supabase-js';

// These environment variables should be defined in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: Supabase URL or Anon Key is missing. Please check your .env file.');
  console.error('The app will not function correctly without proper Supabase credentials.');
}

// Use placeholder values if not configured to prevent runtime errors
// The app will show appropriate error messages to the user
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// API endpoint for the backend server
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

if (!API_BASE_URL) {
  console.error('ERROR: API_BASE_URL is missing. Please check your .env file.');
}
