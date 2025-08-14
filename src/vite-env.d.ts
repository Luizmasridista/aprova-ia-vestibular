/// <reference types="vite/client" />
/// <reference types="@supabase/supabase-js" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_GEMINI_MODEL: string;
  readonly VITE_GEMINI_API_URL: string;
  readonly VITE_DEEPSEEK_API_KEY: string;
  readonly VITE_DEEPSEEK_API_URL: string;
  // Add other environment variables as needed
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
