// URLs da aplicação
export const APP_URLS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  RESET_PASSWORD: '/reset-password',
  AUTH_CALLBACK: '/auth/callback',
  DASHBOARD: '/dashboard',
  STUDY_PLAN: '/plano-estudos',
  EXAMS: '/simulados',
  CALENDAR: '/calendario',
  PROFILE: '/perfil',
} as const;

// URLs da API
export const API_URLS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    SESSION: '/api/auth/session',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
  },
  STUDY_PLANS: {
    GENERATE: '/api/study-plans/generate',
    GET_CURRENT: '/api/study-plans/current',
    UPDATE_PROGRESS: '/api/study-plans/progress',
  },
  EXAMS: {
    LIST: '/api/exams',
    DETAIL: (id: string) => `/api/exams/${id}`,
    SUBMIT: (id: string) => `/api/exams/${id}/submit`,
  },
  QUESTIONS: {
    LIST: '/api/questions',
    DETAIL: (id: string) => `/api/questions/${id}`,
    ANSWER: (id: string) => `/api/questions/${id}/answer`,
  },
} as const;

// URLs externas
export const EXTERNAL_URLS = {
  SUPABASE_AUTH: 'https://glrdhaihzagnryzmmsuz.supabase.co/auth/v1',
  SUPABASE_STORAGE: 'https://glrdhaihzagnryzmmsuz.supabase.co/storage/v1',
  SUPABASE_REST: 'https://glrdhaihzagnryzmmsuz.supabase.co/rest/v1',
  TERMS: '/termos-de-uso',
  PRIVACY: '/politica-de-privacidade',
  SUPPORT: '/suporte',
} as const;

// Funções auxiliares para construir URLs
const buildUrl = (base: string, path: string, params: Record<string, string> = {}) => {
  const url = new URL(path, base);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
};

export const getSupabaseAuthUrl = (path: string, params: Record<string, string> = {}) => {
  return buildUrl(EXTERNAL_URLS.SUPABASE_AUTH, path, params);
};

export const getSupabaseStorageUrl = (path: string, params: Record<string, string> = {}) => {
  return buildUrl(EXTERNAL_URLS.SUPABASE_STORAGE, path, params);
};

export const getSupabaseRestUrl = (path: string, params: Record<string, string> = {}) => {
  return buildUrl(EXTERNAL_URLS.SUPABASE_REST, path, params);
};
