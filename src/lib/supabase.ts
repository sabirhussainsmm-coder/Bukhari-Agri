import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve Supabase URL & Anon Key from Environment or Local Storage
export function getSupabaseCredentials() {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('bukhari_supabase_url') || '' : '';
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('bukhari_supabase_anon_key') || '' : '';

  return {
    url: (storedUrl || envUrl).trim(),
    anonKey: (storedKey || envKey).trim()
  };
}

let supabaseInstance: SupabaseClient | null = null;

// Initialize Supabase Client
export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();

  if (!url || !anonKey) {
    return null;
  }

  try {
    if (!supabaseInstance) {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    }
    return supabaseInstance;
  } catch (error) {
    console.error("[Supabase Client Error]:", error);
    return null;
  }
}

// Reset client instance when user updates credentials in UI
export function resetSupabaseClient(newUrl: string, newAnonKey: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('bukhari_supabase_url', newUrl.trim());
    localStorage.setItem('bukhari_supabase_anon_key', newAnonKey.trim());
  }
  supabaseInstance = null;
  return getSupabaseClient();
}

// Check connection status
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; data?: any }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase URL or Anon Key is missing. Please enter them in Settings or .env file.'
    };
  }

  try {
    const { data, error } = await client.from('categories').select('count', { count: 'exact', head: true });
    if (error) {
      return {
        success: false,
        message: `Database error: ${error.message} (Code: ${error.code})`
      };
    }
    return {
      success: true,
      message: 'Successfully connected to Bukhari Agro Supabase PostgreSQL database!',
      data
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Network connection failed'
    };
  }
}
