import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Types for our database
export interface User {
  id: string;
  email: string;
  country: string;
  totalPTODays: number;
}

export interface Trip {
  id: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget?: string;
  activities?: string;
}

export interface TimeOff {
  date: Date;
}
