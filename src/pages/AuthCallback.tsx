import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase, checkSession, refreshSession } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { APP_URLS } from '@/lib/constants/urls';

// Função para atualizar o perfil do usuário após confirmação de email
async function updateUserProfile(user: any) {
  try {
    console.log('🔄 Atualizando perfil do usuário...');
    
    // Verifica se o usuário já tem um registro na tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('❌ Erro ao verificar usuário:', userError);
      return;
    }

    // Se não tem registro, cria um novo
    if (!userData) {
      console.log('➕ Criando novo registro para o usuário...');
      const userData = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
        password_hash: user.encrypted_password || '',
        role: 'user',
        avatar_url: user.user_metadata?.avatar_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Adicione outros campos obrigatórios do seu esquema aqui
        email_confirmed_at: user.email_confirmed_at || new Date().toISOString(),
        last_sign_in_at: new Date().toISOString()
      };
      
      const { error: createError } = await supabase
        .from('users')
        .insert(userData);

      if (createError) throw createError;
      console.log('✅ Registro de usuário criado com sucesso');
    }

    // Atualiza o email_verified se necessário
    if (user.email && !user.email_confirmed_at) {
      console.log('✅ Marcando email como verificado');
      const { error: updateError } = await supabase.auth.updateUser({
        email: user.email,
        data: { email_verified: true }
      });

      if (updateError) throw updateError;
    }
  } catch (error) {
    console.error('❌ Erro ao atualizar perfil do usuário:', error);
    // Não interrompe o fluxo em caso de erro na atualização do perfil
  }
}

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const processAuth = async () => {
      try {
        setLoading(true);
        console.log('🔄 Processando callback de autenticação...');
        
        // Verifica se há um hash fragment (usado pelo Supabase)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');
        const type = hashParams.get('type') || searchParams.get('type') || 'login';
        const error_code = hashParams.get('error_code') || searchParams.get('error_code');
        const error_description = hashParams.get('error_description') || searchParams.get('error_description');
        const returnTo = searchParams.get('returnTo') || sessionStorage.getItem('returnTo') || '/dashboard';

        // Log para depuração
        console.log('🔍 Dados da URL:', {
          hash: window.location.hash,
          search: window.location.search,
          accessToken: accessToken ? '***' : 'não encontrado',
          refreshToken: refreshToken ? '***' : 'não encontrado',
          type,
          error_code,
          returnTo
        });

        // Limpa o hash da URL para evitar problemas de navegação
        if (window.location.hash) {
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
        }

        console.log('🔍 Parâmetros de autenticação:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken,
          type,
          error_code,
          returnTo
        });

        // Verifica se há erro na URL
        if (error_code) {
          console.error('❌ Erro na autenticação:', { error_code, error_description });
          throw new Error(error_description || `Erro na autenticação (${error_code})`);
        }

        // Verifica se há tokens, tenta verificar a sessão atual
        if (!accessToken || !refreshToken) {
          console.log('ℹ️ Nenhum token encontrado na URL, verificando sessão existente...');
          
          const { session: existingSession, error: sessionError } = await checkSession();
          
          if (sessionError) {
            console.error('❌ Erro ao verificar sessão:', sessionError);
            
            // Tenta atualizar a sessão antes de desistir
            const { session: refreshedSession, error: refreshError } = await refreshSession();
            
            if (refreshError || !refreshedSession) {
              console.error('❌ Falha ao atualizar a sessão:', refreshError);
              throw new Error('Sua sessão expirou. Por favor, faça login novamente.');
            }
            
            // Se chegou aqui, a sessão foi atualizada com sucesso
            console.log('✅ Sessão atualizada com sucesso para usuário:', refreshedSession.user?.email);
            toast.success('Sessão restaurada com sucesso!');
            sessionStorage.removeItem('returnTo');
            navigate(returnTo, { replace: true });
            return;
          }
          
          if (existingSession) {
            console.log('✅ Sessão já ativa para usuário:', existingSession.user?.email);
            // Já há uma sessão ativa, redireciona para a página apropriada
            toast.success('Sessão já ativa!');
            sessionStorage.removeItem('returnTo');
            navigate(returnTo, { replace: true });
            return;
          } else {
            console.warn('⚠️ Nenhuma sessão ativa encontrada');
            throw new Error('Nenhuma sessão ativa encontrada. Por favor, faça login novamente.');
          }
        }

        console.log('🔑 Configurando sessão com tokens fornecidos...');
        
        // Configura a sessão com os tokens fornecidos
        let session;
        let sessionSetupError: Error | null = null;
        
        try {
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (sessionError) {
            sessionSetupError = sessionError;
            throw sessionError;
          }
          
          // Atribui a sessão para a variável mutável
          session = sessionData?.session;
          
          if (!session) {
            // Tenta atualizar a sessão se não estiver disponível
            const { session: refreshedSession, error: refreshError } = await refreshSession();
            
            if (refreshError || !refreshedSession) {
              sessionSetupError = refreshError || new Error('Falha ao atualizar a sessão');
              throw sessionSetupError;
            }
            
            session = refreshedSession;
          }
        } catch (error) {
          console.error('❌ Erro ao configurar a sessão:', error);
          
          // Tenta uma última vez com o refresh token
          try {
            const { session: refreshedSession, error: refreshError } = await refreshSession();
            if (refreshError || !refreshedSession) {
              sessionSetupError = refreshError || new Error('Falha ao atualizar a sessão');
              throw sessionSetupError;
            }
            session = refreshedSession;
            sessionSetupError = null; // Reset error if recovery succeeds
          } catch (refreshError) {
            console.error('❌ Falha crítica ao atualizar a sessão:', refreshError);
            sessionSetupError = refreshError as Error;
            throw new Error('Não foi possível autenticar sua sessão. Por favor, faça login novamente.');
          }
        }

        // Handle any session setup errors that occurred
        if (sessionSetupError) {
          console.error('❌ Erro ao configurar sessão:', sessionSetupError);
          
          // Verifica se o erro é relacionado a email não confirmado
          const errorMessage = sessionSetupError.message || '';
          if (errorMessage.includes('Email not confirmed')) {
            // Força a confirmação do email
            console.log('🔄 Tentando forçar confirmação de email...');
            const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
            
            if (userError) {
              console.error('❌ Erro ao obter dados do usuário:', userError);
              throw new Error('Falha ao verificar o status da confirmação de email.');
            }
            
            // Atualiza o usuário para marcar o email como confirmado
            const { error: updateError } = await supabase.auth.updateUser({
              data: { email_confirmed_at: new Date().toISOString() }
            });
            
            if (updateError) {
              console.error('❌ Erro ao atualizar status de confirmação:', updateError);
              throw new Error('Não foi possível confirmar seu email. Por favor, tente novamente.');
            }
            
            // Tenta configurar a sessão novamente
            const { data: { session: newSession }, error: retryError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (retryError || !newSession) {
              throw new Error('Não foi possível criar a sessão após a confirmação do email.');
            }
            
            // Atualiza a sessão com os novos dados
            session = newSession;
            console.log('✅ Email confirmado com sucesso!');
          } else if (sessionSetupError) {
            throw sessionSetupError;
          } else {
            throw new Error('Erro desconhecido ao configurar a sessão');
          }
        }
        
        if (!session) {
          const errorMsg = 'Não foi possível criar a sessão: nenhum dado de sessão retornado';
          console.error('❌', errorMsg);
          throw new Error(errorMsg);
        }

        console.log('✅ Sessão configurada para usuário:', session.user?.email);
        console.log('📋 Dados da sessão:', {
          isAuthenticated: !!session.user,
          email: session.user?.email,
          expiresAt: session.expires_at,
          expiresIn: session.expires_in,
          refreshToken: session.refresh_token ? '***' : 'não fornecido'
        });

        // Aguarda um pouco para garantir que a sessão foi estabelecida
        console.log('⏳ Aguardando estabilização da sessão...');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verifica novamente a sessão após a espera
        const { data: { session: verifiedSession }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('🔍 Verificação de sessão:', {
          hasSession: !!verifiedSession,
          userEmail: verifiedSession?.user?.email,
          error: sessionError
        });
        
        if (!verifiedSession) {
          // Tenta obter o usuário diretamente
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          console.log('🔍 Tentativa de obter usuário diretamente:', {
            user: user ? 'Encontrado' : 'Não encontrado',
            error: userError
          });
          
          if (userError || !user) {
            const errorMsg = 'A sessão não pôde ser verificada após a configuração';
            console.error('❌', errorMsg, { sessionError, userError });
            
            // Tenta fazer logout para limpar qualquer estado inválido
            await supabase.auth.signOut();
            
            throw new Error('Não foi possível autenticar sua sessão. Por favor, tente fazer login novamente.');
          }
          
          // Se chegou aqui, temos um usuário mas não uma sessão válida
          // Vamos tentar forçar uma nova sessão
          const { data: { session: newSession }, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError || !newSession) {
            console.error('❌ Falha ao atualizar a sessão:', refreshError);
            throw new Error('Sessão expirada. Por favor, faça login novamente.');
          }
          
          // Atualiza a sessão verificada
          Object.assign(verifiedSession, newSession);
        }

        console.log('🔄 Redirecionando com base no tipo de autenticação:', type);

        // Verifica se o usuário está autenticado antes de prosseguir
        if (!verifiedSession?.user) {
          console.error('❌ Usuário não autenticado após o processo de login');
          throw new Error('Falha ao autenticar o usuário. Por favor, tente novamente.');
        }

        // Atualiza o perfil do usuário se necessário
        try {
          await updateUserProfile(verifiedSession.user);
          console.log('✅ Perfil do usuário atualizado com sucesso');
        } catch (profileError) {
          console.warn('⚠️ Aviso ao atualizar perfil do usuário:', profileError);
          // Não interrompe o fluxo em caso de erro na atualização do perfil
        }

        // Redireciona com base no tipo de autenticação
        console.log('🔄 Redirecionando para:', returnTo);
        switch (type) {
          case 'signup':
            console.log('🎉 Novo cadastro confirmado para:', verifiedSession.user?.email);
            toast.success('Email confirmado com sucesso! Bem-vindo ao APROVA.AE!');
            // Atualiza o perfil do usuário se necessário
            await updateUserProfile(verifiedSession.user);
            navigate(returnTo, { replace: true });
            return;
            
          case 'recovery':
            console.log('🔑 Recuperação de senha para:', verifiedSession.user?.email);
            toast.success('Email verificado. Agora você pode redefinir sua senha.');
            navigate('/reset-password', { 
              replace: true,
              state: { email: verifiedSession.user?.email }
            });
            return;
            
          case 'email_change':
            console.log('✉️ Email alterado para:', verifiedSession.user?.new_email);
            toast.success('Email alterado com sucesso!');
            sessionStorage.removeItem('returnTo');
            navigate('/perfil', { replace: true });
            return;
            
          case 'magiclink':
            console.log('🔑 Login via magic link para:', verifiedSession.user?.email);
            toast.success('Login realizado com sucesso!');
            sessionStorage.removeItem('returnTo');
            navigate(returnTo, { replace: true });
            return;
            
          default:
            console.log('🔑 Login bem-sucedido para:', verifiedSession.user?.email);
            toast.success('Autenticação realizada com sucesso!');
            sessionStorage.removeItem('returnTo');
            navigate(returnTo, { replace: true });
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

  // Se estiver carregando, mostra o indicador de carregamento
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Processando autenticação...
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Por favor, aguarde enquanto processamos sua solicitação.
            </p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
          <p className="mt-4 text-center text-sm text-gray-600">
            Isso pode levar alguns instantes...
          </p>
        </div>
      </div>
    );
  }

  // Se houver erro, mostra a mensagem de erro
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Ocorreu um erro
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {error || 'Não foi possível completar a autenticação. Por favor, tente novamente.'}
            </p>
          </div>
          
          <div className="mt-6 space-y-4">
            <button
              onClick={() => navigate(APP_URLS.LOGIN)}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Voltar para o login
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="group relative flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Tentar novamente
            </button>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <p className="text-center text-sm text-gray-600">
              Ainda com problemas?{' '}
              <a
                href={`mailto:suporte@aprova.ae?subject=Problema%20com%20a%20autenticação&body=Descreva%20o%20problema%20que%20está%20encontrando:%0D%0A%0D%0ADetalhes%20técnicos:%0D%0A- Navegador: ${window.navigator.userAgent}%0D%0A- URL: ${window.location.href}%0D%0A- Hora: ${new Date().toISOString()}`}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Entre em contato com o suporte
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Estado de sucesso (não deve ser alcançado, pois redirecionamos antes)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Autenticação concluída!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Você será redirecionado em instantes...
          </p>
        </div>
        <div className="flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </div>
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
      </div>
    </div>
  );
}
