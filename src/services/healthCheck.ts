import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Performs a lightweight ping to Supabase to keep the connection active.
 * Retries silently on failure.
 */
export async function pingSupabase(retries = 3): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  for (let i = 0; i < retries; i++) {
    try {
      // Lightweight query: just select the ID of one profile
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (!error) {
        console.log('[HealthCheck] Supabase ping successful');
        return true;
      }
      
      console.warn(`[HealthCheck] Ping attempt ${i + 1} failed:`, error.message);
    } catch (err) {
      console.warn(`[HealthCheck] Ping attempt ${i + 1} encountered an error:`, err);
    }

    // Wait 2 seconds before retrying
    if (i < retries - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return false;
}

/**
 * Starts a background interval to ping Supabase every 5 minutes.
 */
export function startHealthCheck() {
  // Initial ping
  pingSupabase();

  // Set interval for 5 minutes (300,000 ms)
  const interval = setInterval(() => {
    pingSupabase();
  }, 300000);

  return () => clearInterval(interval);
}
