import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const processAuth = async () => {
      try {
        setLoading(true);
        
        // Verifica se há um hash fragment (usado pelo Supabase)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');
        const type = hashParams.get('type') || searchParams.get('type');
        const error_code = hashParams.get('error_code') || searchParams.get('error_code');
        const error_description = hashParams.get('error_description') || searchParams.get('error_description');

        // Verifica se há erro na URL
        if (error_code) {
          throw new Error(error_description || 'Erro na autenticação');
        }

        // Se não há tokens, tenta verificar a sessão atual
        if (!accessToken || !refreshToken) {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            throw sessionError;
          }
          
          if (session) {
            // Já há uma sessão ativa, apenas confirma sem redirecionar
            toast.success('Sessão já ativa!');
            // Redireciona para a página anterior ou dashboard como fallback
            const returnTo = sessionStorage.getItem('returnTo') || '/dashboard';
            sessionStorage.removeItem('returnTo');
            navigate(returnTo, { replace: true });
            return;
          } else {
            throw new Error('Nenhuma sessão encontrada. Faça login novamente.');
          }
        }

        // Configura a sessão com os tokens fornecidos
        const { data: { session }, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) throw sessionError;
        
        if (!session) {
          throw new Error('Não foi possível criar a sessão');
        }

        // Aguarda um pouco para garantir que a sessão foi estabelecida
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Redireciona com base no tipo de autenticação
        switch (type) {
          case 'signup':
            toast.success('Email confirmado com sucesso! Bem-vindo ao APROVA.AE!');
            navigate('/dashboard', { replace: true });
            return;
            
          case 'recovery':
            toast.success('Email verificado. Agora você pode redefinir sua senha.');
            navigate('/reset-password', { replace: true });
            return;
            
          case 'email_change':
            toast.success('Email alterado com sucesso!');
            // Redireciona para a página anterior ou perfil
            const returnTo = sessionStorage.getItem('returnTo') || '/perfil';
            sessionStorage.removeItem('returnTo');
            navigate(returnTo, { replace: true });
            return;
            
          default:
            toast.success('Autenticação realizada com sucesso!');
            // Para outros casos, redireciona para a página anterior ou dashboard
            const defaultReturnTo = sessionStorage.getItem('returnTo') || '/dashboard';
            sessionStorage.removeItem('returnTo');
            navigate(defaultReturnTo, { replace: true });
            return;
        }
        
      } catch (err) {
        console.error('Erro no callback de autenticação:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(`Ocorreu um erro ao processar sua autenticação: ${errorMessage}`);
        toast.error('Não foi possível completar a autenticação');
        setLoading(false);
      }
    };

    processAuth();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center">
        {error ? (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900">Erro na autenticação</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Voltar para o login
              </button>
            </div>
          </>
        ) : loading ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Processando autenticação...</h2>
            <p className="mt-2 text-gray-600">Aguarde enquanto confirmamos suas informações.</p>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900">Sucesso!</h2>
            <p className="mt-2 text-gray-600">Redirecionando...</p>
          </>
        )}
      </div>
    </div>
  );
}
