import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellRing, BellOff, X, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionable?: boolean;
  action?: string;
}

interface GoogleCalendarNotificationsProps {
  onAction?: (notificationId: string, action: string) => void;
}

const GoogleCalendarNotifications: React.FC<GoogleCalendarNotificationsProps> = ({ onAction }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // Aqui você faria uma chamada para a API para buscar as notificações
      // Por enquanto, vamos usar dados de exemplo
      const mockNotifications = generateMockNotifications();
      setNotifications(mockNotifications);
      
      // Verificar se as notificações estão habilitadas nas preferências do usuário
      const userPrefs = localStorage.getItem('googleCalendarNotifications');
      if (userPrefs) {
        setNotificationsEnabled(JSON.parse(userPrefs));
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockNotifications = (): Notification[] => {
    const now = new Date();
    
    return [
      {
        id: '1',
        type: 'warning',
        title: 'Sincronização incompleta',
        message: '3 eventos não puderam ser sincronizados devido a problemas de conexão. Tente novamente mais tarde.',
        date: new Date(now.getTime() - 30 * 60000).toISOString(), // 30 minutos atrás
        read: false,
        actionable: true,
        action: 'retry'
      },
      {
        id: '2',
        type: 'success',
        title: 'Sincronização concluída',
        message: '12 eventos foram sincronizados com sucesso com o Google Calendar.',
        date: new Date(now.getTime() - 2 * 3600000).toISOString(), // 2 horas atrás
        read: true
      },
      {
        id: '3',
        type: 'info',
        title: 'Permissões atualizadas',
        message: 'As permissões do Google Calendar foram atualizadas. Você pode precisar reconectar sua conta.',
        date: new Date(now.getTime() - 24 * 3600000).toISOString(), // 1 dia atrás
        read: false,
        actionable: true,
        action: 'reconnect'
      },
      {
        id: '4',
        type: 'error',
        title: 'Falha na autenticação',
        message: 'Não foi possível autenticar com o Google Calendar. Verifique suas credenciais.',
        date: new Date(now.getTime() - 2 * 24 * 3600000).toISOString(), // 2 dias atrás
        read: true
      },
      {
        id: '5',
        type: 'info',
        title: 'Novo calendário disponível',
        message: 'Um novo calendário foi detectado na sua conta Google. Deseja incluí-lo na sincronização?',
        date: new Date(now.getTime() - 3 * 24 * 3600000).toISOString(), // 3 dias atrás
        read: false,
        actionable: true,
        action: 'add_calendar'
      }
    ];
  };

  const handleToggleNotifications = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    localStorage.setItem('googleCalendarNotifications', JSON.stringify(enabled));
    
    if (enabled) {
      toast.success('Notificações do Google Calendar ativadas');
    } else {
      toast.info('Notificações do Google Calendar desativadas');
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast.success('Todas as notificações foram marcadas como lidas');
  };

  const handleAction = (notification: Notification) => {
    if (notification.actionable && notification.action && onAction) {
      onAction(notification.id, notification.action);
      handleMarkAsRead(notification.id);
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'retry': return 'Tentar novamente';
      case 'reconnect': return 'Reconectar';
      case 'add_calendar': return 'Adicionar calendário';
      default: return 'Executar';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.round(diffMs / 60000);
      const diffHours = Math.round(diffMs / 3600000);
      const diffDays = Math.round(diffMs / (3600000 * 24));
      
      if (diffMins < 60) {
        return `${diffMins} min atrás`;
      } else if (diffHours < 24) {
        return `${diffHours} h atrás`;
      } else {
        return `${diffDays} dias atrás`;
      }
    } catch (e) {
      return 'Data desconhecida';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayNotifications = showAll 
    ? notifications 
    : notifications.filter(n => !n.read);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary animate-pulse" />
            <h3 className="font-medium">Notificações</h3>
          </div>
          <div className="h-6 w-6 bg-muted/60 animate-pulse rounded-full" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3">
              <div className="h-8 w-8 bg-muted/60 animate-pulse rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 bg-muted/60 animate-pulse rounded" />
                <div className="h-3 w-full bg-muted/60 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden">
          <div className="p-4 bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {notificationsEnabled ? (
                  <BellRing className="h-5 w-5 text-primary" />
                ) : (
                  <BellOff className="h-5 w-5 text-muted-foreground" />
                )}
                <h3 className="font-medium">Notificações</h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-xs"
                    onClick={handleMarkAllAsRead}
                  >
                    Marcar todas como lidas
                  </Button>
                )}
                <div className="flex items-center gap-2">
                  <Switch
                    id="notifications-toggle"
                    checked={notificationsEnabled}
                    onCheckedChange={handleToggleNotifications}
                  />
                </div>
              </div>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <h3 className="font-medium">Nenhuma notificação</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Você não tem notificações do Google Calendar
              </p>
            </div>
          ) : (
            <>
              <div className="max-h-[300px] overflow-y-auto">
                <div className="p-1">
                  {displayNotifications.length === 0 ? (
                    <div className="p-6 text-center">
                      <CheckCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <h3 className="font-medium">Tudo em dia!</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Você não tem notificações não lidas
                      </p>
                    </div>
                  ) : (
                    displayNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div 
                          className={`p-3 hover:bg-muted/30 transition-colors relative ${
                            !notification.read ? 'bg-muted/10' : ''
                          }`}
                        >
                          {!notification.read && (
                            <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary" />
                          )}
                          <div className="flex gap-3">
                            <div className="mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">{notification.title}</h4>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(notification.date)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              {notification.actionable && (
                                <div className="mt-2 flex justify-between items-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => handleAction(notification)}
                                  >
                                    {getActionLabel(notification.action || '')}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                  >
                                    <X className="h-3.5 w-3.5" />
                                    <span className="sr-only">Fechar</span>
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {index < displayNotifications.length - 1 && <Separator />}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
              
              {notifications.length > 0 && (
                <div className="p-2 bg-muted/10 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? 'Mostrar apenas não lidas' : 'Mostrar todas as notificações'}
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default GoogleCalendarNotifications;
