import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "./info";

// Create a singleton Supabase client instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseInstance) {
    const supabaseUrl = `https://${projectId}.supabase.co`;
    const supabaseKey = publicAnonKey;
    
    console.log('Initializing Supabase client with URL:', supabaseUrl);
    console.log('Anon key length:', supabaseKey.length);
    
    supabaseInstance = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseInstance;
}