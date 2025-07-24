// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

// Usando as variáveis de ambiente do Vite
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!rawSupabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas. Verifique o arquivo .env');
}

// Corrigir URL se necessário (supabase.com -> supabase.co)
const supabaseUrl = rawSupabaseUrl.replace('supabase.com', 'supabase.co');

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);
