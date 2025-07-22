import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { APP_URLS } from '@/config/urls';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = APP_URLS.LOGIN 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Redireciona para a página de login, incluindo a localização atual para redirecionamento posterior
      navigate(redirectTo, { 
        state: { from: location },
        replace: true 
      });
    } else if (!loading && user && requiredRole) {
      // Verifica se o usuário tem a role necessária
      // Aqui você pode implementar sua lógica de verificação de permissão
      // Por exemplo: user.role === requiredRole
      const hasRequiredRole = true; // Implemente a lógica de verificação de role
      
      if (!hasRequiredRole) {
        // Usuário não tem permissão, redireciona para uma página de acesso negado
        navigate(APP_URLS.HOME, { replace: true });
      }
    }
  }, [user, loading, navigate, requiredRole, redirectTo, location]);

  // Mostra um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-lg font-medium text-gray-700">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se o usuário estiver autenticado (e tiver a role necessária, se especificada), renderiza os filhos
  if (user) {
    return <>{children}</>;
  }

  // Caso contrário, não renderiza nada (o redirecionamento será tratado pelo useEffect)
  return null;
}
