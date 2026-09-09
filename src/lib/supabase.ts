import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { CustomCategory, MLockItem } from '../types';

// Check environment variables or local storage configuration
export function getStoredSupabaseConfig() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('mlock_supabase_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('mlock_supabase_key') : null;

  const url = (envUrl && envUrl.trim() !== '') ? envUrl : (localUrl || '');
  const anonKey = (envKey && envKey.trim() !== '') ? envKey : (localKey || '');

  return { url: url.trim(), anonKey: anonKey.trim() };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mlock_supabase_url', url.trim());
    localStorage.setItem('mlock_supabase_key', anonKey.trim());
  }
}

export function clearSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('mlock_supabase_url');
    localStorage.removeItem('mlock_supabase_key');
  }
}

let supabaseInstance: SupabaseClient | null = null;
let currentConfigKey = '';

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey } = getStoredSupabaseConfig();
  if (!url || !anonKey || !url.startsWith('http')) {
    return null;
  }

  const configKey = `${url}___${anonKey}`;
  if (!supabaseInstance || currentConfigKey !== configKey) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
      currentConfigKey = configKey;
    } catch (err) {
      console.error('Error initializing Supabase client:', err);
      return null;
    }
  }

  return supabaseInstance;
}

export function isSupabaseConnected(): boolean {
  return getSupabase() !== null;
}

// Google OAuth Login
export async function signInWithGoogle() {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase no está configurado. Añade tu URL y Clave Anónima en la configuración.');
  }

  const redirectUrl = window.location.origin;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw error;
  return data;
}

// Sign Out
export async function signOut() {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Signout error:', error);
  }
}

// Storage: Upload PDF
export async function uploadPdfToSupabase(file: File, userId: string): Promise<{ path: string; url: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase no está configurado.');
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${userId}/${Date.now()}_${cleanName}`;

  const { error: uploadError } = await supabase.storage
    .from('mlock-files')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  // Get signed URL or public URL (signed URL is better for private vaults)
  const { data: signedData, error: signedError } = await supabase.storage
    .from('mlock-files')
    .createSignedUrl(filePath, 60 * 60 * 24); // 24 hours

  if (signedError || !signedData?.signedUrl) {
    // Fallback to public url if bucket is public
    const { data: publicData } = supabase.storage.from('mlock-files').getPublicUrl(filePath);
    return { path: filePath, url: publicData.publicUrl };
  }

  return { path: filePath, url: signedData.signedUrl };
}

// Delete PDF from Supabase
export async function deletePdfFromSupabase(filePath: string) {
  const supabase = getSupabase();
  if (!supabase || !filePath) return;
  try {
    await supabase.storage.from('mlock-files').remove([filePath]);
  } catch (err) {
    console.warn('Error deleting PDF from storage:', err);
  }
}
