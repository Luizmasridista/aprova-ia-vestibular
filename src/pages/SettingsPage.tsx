import React from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Palette, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  const settingsCategories = [
    {
      title: 'Perfil',
      description: 'Gerencie suas informações pessoais',
      icon: User,
      action: () => window.location.href = '/perfil'
    },
    {
      title: 'Notificações',
      description: 'Configure suas preferências de notificação',
      icon: Bell,
      action: () => console.log('Notificações em desenvolvimento')
    },
    {
      title: 'Privacidade',
      description: 'Controle suas configurações de privacidade',
      icon: Shield,
      action: () => console.log('Privacidade em desenvolvimento')
    },
    {
      title: 'Aparência',
      description: 'Personalize a interface do aplicativo',
      icon: Palette,
      action: () => console.log('Aparência em desenvolvimento')
    },
    {
      title: 'Dados',
      description: 'Gerencie seus dados e backup',
      icon: Database,
      action: () => console.log('Dados em desenvolvimento')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
              <p className="text-gray-600">Gerencie suas preferências e configurações da conta</p>
            </div>
          </div>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <User className="w-5 h-5 text-blue-600" />
                <span>Informações da Conta</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  {user?.user_metadata?.full_name 
                    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                    : user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {user?.user_metadata?.full_name || 'Usuário'}
                  </h3>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-sm text-gray-500">
                    Membro desde {new Date(user?.created_at || '').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings Categories */}
        <div className="grid md:grid-cols-2 gap-6">
          {settingsCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 hover:border-blue-300 cursor-pointer group">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <span>{category.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-blue-50"
                      onClick={category.action}
                    >
                      {category.title === 'Perfil' ? 'Ir para Perfil' : 'Em Breve'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm">
            Precisa de ajuda? Entre em contato com nosso{' '}
            <a 
              href="mailto:suporte@aprova.ae" 
              className="text-blue-600 hover:underline"
            >
              suporte
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
