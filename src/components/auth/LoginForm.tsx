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

interface LoginFormProps {
  initialMode?: AuthMode;
}

export function LoginForm({ initialMode = 'login' }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  // Password validation states
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasSpecialChar: false,
    level: 0
  });
  
  // Function to validate password strength
  const validatePassword = (pwd: string) => {
    const hasMinLength = pwd.length >= 6;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    
    let level = 0;
    if (hasMinLength) level++;
    if (hasUpperCase) level++;
    if (hasSpecialChar) level++;
    
    setPasswordStrength({
      hasMinLength,
      hasUpperCase,
      hasSpecialChar,
      level
    });
  };
  
  const getStrengthText = () => {
    switch (passwordStrength.level) {
      case 0:
      case 1:
        return { text: 'Fraca', color: 'text-red-500' };
      case 2:
        return { text: 'Média', color: 'text-yellow-500' };
      case 3:
        return { text: 'Forte', color: 'text-green-500' };
      default:
        return { text: 'Fraca', color: 'text-red-500' };
    }
  };
  
  const getStrengthBarColor = () => {
    switch (passwordStrength.level) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };
  
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
    <div className="w-full max-w-lg space-y-6">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {isSignUp 
            ? 'Criar conta' 
            : isForgot 
              ? 'Redefinir senha' 
              : 'Acesse sua conta'}
        </h1>
        <p className="mt-3 text-sm text-gray-600">
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
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className={`grid gap-4 ${isSignUp ? 'md:grid-cols-1' : ''}`}>
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nome completo</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Seu nome completo"
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="seu@email.com"
              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            />
          </div>
        </div>
        
        {!isForgot && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</Label>
              {isLogin && (
                <button 
                  type="button" 
                  onClick={() => setMode('forgot')}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
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
              onChange={(e) => {
                setPassword(e.target.value);
                if (isSignUp) {
                  validatePassword(e.target.value);
                }
              }}
              required
              disabled={isLoading}
              minLength={6}
              placeholder="••••••••"
              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            />
            {isSignUp && (
              <div className="mt-2 space-y-2">
                {/* Password strength indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Força da senha:</span>
                      <span className={`text-xs font-medium ${getStrengthText().color}`}>
                        {getStrengthText().text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthBarColor()}`}
                        style={{ width: `${(passwordStrength.level / 3) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {/* Password requirements */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700">A senha deve conter:</p>
                  <div className="space-y-1">
                    <div className={`flex items-center text-xs ${
                      passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      <span className="mr-2">{passwordStrength.hasMinLength ? '✓' : '○'}</span>
                      Pelo menos 6 caracteres
                    </div>
                    <div className={`flex items-center text-xs ${
                      passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      <span className="mr-2">{passwordStrength.hasUpperCase ? '✓' : '○'}</span>
                      Uma letra maiúscula
                    </div>
                    <div className={`flex items-center text-xs ${
                      passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      <span className="mr-2">{passwordStrength.hasSpecialChar ? '✓' : '○'}</span>
                      Um caractere especial (!@#$%^&*)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full h-12 !bg-blue-600 hover:!bg-blue-600 !text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-105 active:scale-95" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processando...</span>
            </div>
          ) : isSignUp ? (
            'Criar conta'
          ) : isForgot ? (
            'Enviar link de redefinição'
          ) : (
            'Entrar'
          )}
        </Button>
        
        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">ou</span>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            {isSignUp ? (
              <>
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  disabled={isLoading}
                >
                  Fazer login
                </button>
              </>
            ) : isForgot ? (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
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
                  className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  disabled={isLoading}
                >
                  Criar conta
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
