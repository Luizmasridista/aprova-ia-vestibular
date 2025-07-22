import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import MyStudyPlans from '@/components/profile/MyStudyPlans';

export default function ProfilePage() {
  const { user, updateProfile, updatePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const { toast } = useToast();

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
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: 'Erro ao atualizar perfil',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao atualizar seu perfil.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
        
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
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Editar Perfil
                </Button>
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
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Configurações de Conta</CardTitle>
            <CardDescription>
              Gerencie as configurações da sua conta e preferências.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Excluir Conta</h4>
                  <p className="text-sm text-muted-foreground">
                    Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.
                  </p>
                </div>
                <Button variant="destructive">
                  Excluir Conta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
