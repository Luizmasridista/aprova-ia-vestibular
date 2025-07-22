import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { AuthError } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';

type AuthMode = 'login' | 'signup' | 'forgot';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  const isLogin = mode === 'login';
  const isSignUp = mode === 'signup';
  const isForgot = mode === 'forgot';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        // Cadastro de novo usuário
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) throw signUpError;
        
        setMessage('Verifique seu e-mail para confirmar o cadastro!');
        setMode('login');
        toast.success('Cadastro realizado com sucesso! Verifique seu e-mail.');
      } 
      else if (isForgot) {
        // Redefinição de senha
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;
        
        setMessage('Enviamos um e-mail com instruções para redefinir sua senha.');
        toast.success('E-mail de redefinição enviado!');
      }
      else {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Verifica se o erro é de e-mail não verificado
          if (error.message.includes('Email not confirmed')) {
            setMessage('Por favor, verifique seu e-mail para ativar sua conta.');
          }
          throw error;
        }
        
        toast.success('Login realizado com sucesso!');
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro ao autenticar';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {isSignUp 
            ? 'Criar conta' 
            : isForgot 
              ? 'Redefinir senha' 
              : 'Acesse sua conta'}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isSignUp 
            ? 'Preencha os dados para criar sua conta' 
            : isForgot
              ? 'Digite seu e-mail para receber o link de redefinição'
              : 'Digite seu e-mail e senha para entrar'}
        </p>
      </div>
      
      {message && (
        <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg">
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Seu nome completo"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            placeholder="seu@email.com"
          />
        </div>
        
        {!isForgot && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              {isLogin && (
                <button 
                  type="button" 
                  onClick={() => setMode('forgot')}
                  className="text-sm text-primary hover:underline"
                  disabled={isLoading}
                >
                  Esqueceu a senha?
                </button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={6}
              placeholder="••••••••"
            />
            {isSignUp && (
              <p className="text-xs text-muted-foreground">
                A senha deve ter pelo menos 6 caracteres
              </p>
            )}
          </div>
        )}
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="animate-pulse">Processando...</span>
          ) : isSignUp ? (
            'Criar conta'
          ) : isForgot ? (
            'Enviar link de redefinição'
          ) : (
            'Entrar'
          )}
        </Button>
        
        <div className="mt-4 text-center text-sm">
          {isSignUp ? (
            <>
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-medium text-primary hover:underline"
                disabled={isLoading}
              >
                Fazer login
              </button>
            </>
          ) : isForgot ? (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="font-medium text-primary hover:underline"
              disabled={isLoading}
            >
              Voltar para o login
            </button>
          ) : (
            <>
              Ainda não tem uma conta?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-medium text-primary hover:underline"
                disabled={isLoading}
              >
                Criar conta
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
