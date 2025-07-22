/// <reference types="vite/client" />
/// <reference types="@supabase/supabase-js" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // mais variáveis de ambiente...
}

declare global {
  interface Window {
    // Adiciona a tipagem para o objeto supabase global (opcional)
    supabase?: any;
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
