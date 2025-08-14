import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { APP_URLS } from '@/config/urls';
import { securityService } from '@/lib/services/securityService';

type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
};

type AuthActions = {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, userData?: Record<string, unknown>) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  updateProfile: (data: Record<string, string | number | boolean | null>) => Promise<{ error: Error | null }>;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  const navigate = useNavigate();

  const handleAuthStateChange = useCallback(
    async (event: AuthChangeEvent, session: Session | null) => {
      console.log('🔐 Auth state change:', event, 'User:', session?.user?.email);
      
      setState((prev) => ({
        ...prev,
        user: session?.user ?? null,
        session,
        loading: false,
      }));

      // Redirecionamentos baseados no evento de autenticação
      // Removido redirecionamento automático para dashboard no SIGNED_IN
      // para permitir navegação livre entre seções
      if (event === 'SIGNED_OUT') {
        console.log('🚪 Redirecting to login after sign out');
        navigate(APP_URLS.LOGIN);
      } else if (event === 'PASSWORD_RECOVERY') {
        console.log('🔑 Redirecting to reset password');
        navigate(APP_URLS.RESET_PASSWORD, { replace: true });
      }
    },
    [navigate]
  );

  // Inicializa a sessão e configura o listener de mudanças de autenticação
  useEffect(() => {
    // Verifica a sessão atual
    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        console.log('👤 Session found:', session?.user?.email || 'No user');
        
        // Apenas atualiza o estado sem redirecionar
        setState((prev) => ({
          ...prev,
          user: session?.user ?? null,
          session,
          loading: false,
        }));
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Erro desconhecido'),
          loading: false,
        }));
      }
    };

    initializeAuth();

    // Configura o listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Limpa a subscrição quando o componente é desmontado
    return () => {
      subscription?.unsubscribe();
    };
  }, [handleAuthStateChange]);

  // Função para fazer login
  const signIn = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Log successful login
      setTimeout(() => securityService.logAuthEvent('login'), 0);
      
      // Redireciona para a página salva ou dashboard como fallback
      const returnTo = sessionStorage.getItem('returnTo') || APP_URLS.DASHBOARD;
      sessionStorage.removeItem('returnTo');
      navigate(returnTo, { replace: true });
      
      return { error: null };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      const authError = error instanceof Error ? error : new Error('Erro ao fazer login');
      setState((prev) => ({ ...prev, error: authError }));
      return { error: authError };
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Função para cadastrar um novo usuário
  const signUp = async (email: string, password: string, userData: Record<string, unknown> = {}) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      console.log('🔐 Iniciando cadastro para:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName || '',
            ...userData,
          },
          emailRedirectTo: `${window.location.origin}${APP_URLS.AUTH_CALLBACK}?returnTo=${encodeURIComponent(APP_URLS.DASHBOARD)}`,
        },
      });

      console.log('🔍 Resposta do signUp:', { data, error });

      if (error) {
        console.error('❌ Erro no signUp:', error);
        throw error;
      }
      
      // Se o email já estiver confirmado, redireciona para o dashboard
      if (data?.user?.identities && data.user.identities.length === 0) {
        console.warn('⚠️ Usuário já existe:', email);
        return { 
          error: new Error('Este email já está cadastrado. Por favor, faça login.') 
        };
      }
      
      // Log successful signup
      setTimeout(() => securityService.logAuthEvent('signup'), 0);
      
      return { error: null };
    } catch (error) {
      console.error('❌ Erro ao cadastrar usuário:', error);
      const authError = error instanceof Error 
        ? error 
        : new Error('Erro ao cadastrar usuário');
      
      setState((prev) => ({ ...prev, error: authError }));
      return { error: authError };
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Função para fazer logout
  const signOut = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Log logout event
      setTimeout(() => securityService.logAuthEvent('logout'), 0);
      
      // Limpeza de dados locais
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('userPreferences');
      sessionStorage.clear();
      
      return { error: null };
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      const authError = error instanceof Error ? error : new Error('Erro ao fazer logout');
      setState((prev) => ({ ...prev, error: authError }));
      return { error: authError };
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Função para solicitar redefinição de senha
  const resetPassword = async (email: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${APP_URLS.RESET_PASSWORD}`,
      });

      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      const authError = error instanceof Error ? error : new Error('Erro ao solicitar redefinição de senha');
      setState((prev) => ({ ...prev, error: authError }));
      return { error: authError };
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Função para atualizar a senha
  const updatePassword = async (newPassword: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      const authError = error instanceof Error ? error : new Error('Erro ao atualizar senha');
      setState((prev) => ({ ...prev, error: authError }));
      return { error: authError };
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Função para atualizar o perfil do usuário
  const updateProfile = async (data: Record<string, string | number | boolean | null>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.updateUser({
        data,
      });

      if (error) throw error;
      
      // Atualiza o estado local com os novos dados do usuário
      setState((prev) => ({
        ...prev,
        user: { ...prev.user, user_metadata: { ...prev.user?.user_metadata, ...data } } as User,
      }));
      
      return { error: null };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      const authError = error instanceof Error ? error : new Error('Erro ao atualizar perfil');
      setState((prev) => ({ ...prev, error: authError }));
      return { error: authError };
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };


  // Retorna o estado e as ações
  return {
    ...state,
    ...{
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
      updateProfile,
    },
  };
}

// Hook para verificar se o usuário está autenticado
export function useRequireAuth(redirectTo: string = APP_URLS.LOGIN) {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, loading, navigate, redirectTo]);

  return { user, loading, signOut };
}
