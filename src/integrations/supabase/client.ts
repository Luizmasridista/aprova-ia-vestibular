import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Configurações do Supabase
export const SUPABASE_URL = "https://glrdhaihzagnryzmmsuz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdscmRoYWloemFnbnJ5em1tc3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMzc0OTQsImV4cCI6MjA2ODcxMzQ5NH0.6jwBiAxBZ83ZWBc0mHEcww8Tm_jAEVv_mNqjYd5xbPA";

// Criação do cliente Supabase com configurações otimizadas
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: {
      getItem: (key: string) => {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error('Erro ao acessar localStorage:', error);
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error('Erro ao salvar no localStorage:', error);
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Erro ao remover do localStorage:', error);
        }
      },
    },
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: process.env.NODE_ENV === 'development',
    // Configuração para evitar problemas de CORS
    storageKey: 'sb-glrdhaihzagnryzmmsuz-auth-token',
  },
  global: {
    headers: {
      'X-Client-Info': 'aprova-ae/1.0.0',
      'apikey': SUPABASE_PUBLISHABLE_KEY,
    },
  },
});

// Função para verificar a sessão atual
export const checkSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Erro ao verificar sessão:', error);
      return { session: null, error };
    }
    
    return { session, error: null };
  } catch (error) {
    console.error('Erro inesperado ao verificar sessão:', error);
    return { session: null, error };
  }
};

// Função para forçar atualização da sessão
export const refreshSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Erro ao atualizar sessão:', error);
      return { session: null, error };
    }
    
    return { session, error: null };
  } catch (error) {
    console.error('Erro inesperado ao atualizar sessão:', error);
    return { session: null, error };
  }
};

// Intercepta erros de autenticação
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Evento de autenticação:', event);
  
  if (event === 'SIGNED_OUT') {
    // Limpa o estado de autenticação
    console.log('Usuário desconectado');
  } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    console.log('Sessão atualizada:', {
      user: session?.user?.email,
      expiresAt: session?.expires_at
    });
  }
});