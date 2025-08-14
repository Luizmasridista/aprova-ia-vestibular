import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import MyStudyPlans from '@/components/profile/MyStudyPlans';


import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { SUPABASE_URL, supabase } from '@/integrations/supabase/client';

export default function ProfilePage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, session, signOut, updateProfile, updatePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Atualizar informações do perfil
      if (formData.fullName !== user?.user_metadata?.full_name) {
        await updateProfile({ full_name: formData.fullName });
      }

      // Atualizar senha se fornecida
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('As senhas não coincidem');
        }
        
        await updatePassword(formData.newPassword);
        
        // Limpar campos de senha após atualização
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      }

      toast({
        title: 'Perfil atualizado com sucesso!',
        description: 'Suas informações foram salvas.',
        variant: 'default'
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: 'Erro ao atualizar perfil',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao atualizar seu perfil.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteAccount = async () => {
    console.log('Iniciando exclusão de conta...');
    setIsDeleting(true);
    
    try {
      // Garantir que temos um token válido para autenticar a Edge Function
      let accessToken = session?.access_token;
      if (!accessToken) {
        const { data: sess } = await supabase.auth.getSession();
        accessToken = sess.session?.access_token;
      }

      if (!accessToken) {
        throw new Error('Sessão expirada. Faça login novamente e tente excluir sua conta.');
      }

      // Mostrar feedback visual de carregamento
      console.log('Mostrando toast de carregamento...');
      const loadingToast = toast({
        title: 'Processando...',
        description: 'Estamos excluindo sua conta e todos os seus dados.',
        duration: 0, // Não fecha automaticamente
      });
      console.log('Toast de carregamento mostrado');

      try {
        // Usar o endpoint de proxy configurado no Vite
        console.log('Enviando requisição para excluir conta...', { accessToken: !!accessToken });
        
        const response = await fetch('/functions/v1/delete-user', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        console.log('Resposta recebida:', { 
          status: response.status, 
          statusText: response.statusText,
          ok: response.ok 
        });

        let data;
        try {
          data = await response.json();
          console.log('Dados da resposta:', data);
        } catch (e) {
          console.error('Erro ao fazer parse da resposta:', e);
          throw new Error('Erro ao processar a resposta do servidor');
        }

        if (!response.ok) {
          throw new Error(data.error || 'Falha ao processar a exclusão da conta');
        }

        // Fecha o toast de carregamento
        loadingToast.dismiss();

        // Mostra mensagem de sucesso
        toast({
          title: 'Conta excluída com sucesso',
          description: 'Todos os seus dados foram removidos com sucesso.',
          duration: 5000,
        });

        // Aguarda um pouco para o usuário ver a mensagem
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Faz logout e redireciona para a página inicial
        await signOut();
        navigate('/');
      } catch (error) {
        // Fecha o toast de carregamento em caso de erro
        loadingToast.dismiss();
        throw error; // Repassa o erro para o bloco catch externo
      }
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      
      // Mensagens de erro mais amigáveis
      let errorMessage = 'Ocorreu um erro ao excluir sua conta. Por favor, tente novamente mais tarde.';
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = 'Sessão expirada. Por favor, faça login novamente.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Você não tem permissão para realizar esta ação.';
        } else if (error.message.includes('Falha ao excluir a conta')) {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: 'Erro ao excluir conta',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando informações do usuário...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfil do Usuário</h1>
          <p className="text-muted-foreground">Gerencie suas informações de perfil e configurações de conta.</p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Gerencie suas informações de perfil e preferências de conta.
                </CardDescription>
              </div>
              {!isEditing ? (
                <div className="flex items-center gap-2">
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    Editar Perfil
                  </Button>
                  <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        className="w-full sm:w-auto"
                        onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        Excluir Conta
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza que deseja excluir sua conta?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação é permanente e removerá todos os seus dados de utilização. Não poderá ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting} onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-600 text-white hover:bg-red-700 focus:bg-red-700 active:bg-red-700" 
                          onClick={async (e) => {
                            e.preventDefault();
                            await handleDeleteAccount();
                            setIsDeleteDialogOpen(false);
                          }} 
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Excluindo...
                            </>
                          ) : (
                            'Confirmar Exclusão'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ) : (
                <Button 
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form to original values
                    setFormData({
                      fullName: user.user_metadata?.full_name || '',
                      email: user.email || '',
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  }} 
                  variant="outline"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!isEditing || isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={true} // Email não pode ser alterado diretamente
                    className="bg-gray-100"
                  />
                  <p className="text-sm text-muted-foreground">
                    Entre em contato com o suporte para alterar seu e-mail.
                  </p>
                </div>
              </div>
              
              {isEditing && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium">Alterar Senha</h3>
                  <p className="text-sm text-muted-foreground">
                    Deixe em branco para manter a senha atual.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Senha Atual</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nova Senha</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirme a Nova Senha</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            {isEditing && (
              <CardFooter className="flex justify-end gap-4 border-t pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              </CardFooter>
            )}
          </form>
        </Card>
        
        {/* Seção Minhas Agendas */}
        <MyStudyPlans className="mt-6" />
        
        {/* Configurações de Conta removidas temporariamente */}
      </div>
    </div>
  );
}
