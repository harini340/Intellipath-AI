import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (() => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (supabaseUrl === 'https://your-project-url.supabase.co') return false;
  if (supabaseAnonKey === 'your-anon-key') return false;
  
  try {
    new URL(supabaseUrl);
    return true;
  } catch {
    return false;
  }
})();

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null as any;
