/**
 * Componente para gerenciar a integração com Google Calendar
 * Permite configurar, sincronizar e monitorar a conexão
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  AlertTriangle,
  Settings,
  Trash2,
  ExternalLink,
  CalendarCheck,
  ArrowRight,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';
import { googleCalendarService } from '@/lib/services/googleCalendarService';
import { googleCalendarBackendService } from '@/lib/services/googleCalendarBackendService';
import { testGoogleCalendarIntegration } from '@/lib/services/googleCalendarTest';
import type { GoogleCalendarIntegration as IntegrationConfig } from '@/lib/services/googleCalendarBackendService';

interface GoogleCalendarIntegrationProps {
  onSyncComplete?: (success: number, failed: number) => void;
}

export const GoogleCalendarIntegration: React.FC<GoogleCalendarIntegrationProps> = ({
  onSyncComplete
}) => {
  const [integration, setIntegration] = useState<IntegrationConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  
  // Estados para configurações adicionais
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [syncCompletedEvents, setSyncCompletedEvents] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Carregar configurações ao montar o componente
  useEffect(() => {
    loadIntegration();
  }, []);

  /**
   * Carrega as configurações de integração do usuário
   */
  const loadIntegration = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 [GoogleCalendarIntegration] Carregando configurações de integração...');
      
      // Verificar se o usuário já está autenticado com Google Calendar
      const isAuthenticated = googleCalendarService.isAuthenticated();
      
      if (isAuthenticated) {
        console.log('✅ [GoogleCalendarIntegration] Usuário já autenticado, criando integração...');
        
        // Criar integração baseada no estado de autenticação
        const mockIntegration: IntegrationConfig = {
          id: 'existing-integration-id',
          user_id: 'current-user',
          calendar_id: 'primary',
          calendar_name: 'Calendário Principal',
          is_enabled: true,
          last_sync: null,
          sync_status: 'success',
          sync_progress: 0,
          sync_direction: 'to_google',
          error_message: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setIntegration(mockIntegration);
        console.log('✅ [GoogleCalendarIntegration] Integração carregada com sucesso');
      } else {
        console.log('🔐 [GoogleCalendarIntegration] Usuário não autenticado, nenhuma integração encontrada');
        setIntegration(null);
      }
    } catch (error) {
      console.error('❌ [GoogleCalendarIntegration] Erro ao carregar integração:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao carregar configurações: ${errorMessage}`);
      setIntegration(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Conecta com Google Calendar
   */
  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      
      console.log('🔄 [GoogleCalendarIntegration] Iniciando conexão com Google Calendar...');
      
      // Inicializar e autenticar com Google Calendar API
      const initialized = await googleCalendarService.initialize();
      if (!initialized) {
        throw new Error('Falha ao inicializar Google Calendar API');
      }
      console.log('✅ [GoogleCalendarIntegration] API inicializada com sucesso');

      const authenticated = await googleCalendarService.signIn();
      if (!authenticated) {
        throw new Error('Falha na autenticação com Google');
      }
      console.log('✅ [GoogleCalendarIntegration] Autenticação realizada com sucesso');

      // Simular integração configurada (sem usar backend)
      const mockIntegration: IntegrationConfig = {
        id: 'mock-integration-id',
        user_id: 'current-user',
        calendar_id: 'primary',
        calendar_name: 'Calendário Principal',
        is_enabled: true,
        last_sync: null,
        sync_status: 'success',
        sync_progress: 0,
        sync_direction: 'to_google',
        error_message: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setIntegration(mockIntegration);
      console.log('✅ [GoogleCalendarIntegration] Integração configurada');
      
      toast.success('Google Calendar conectado com sucesso!');
    } catch (error) {
      console.error('❌ [GoogleCalendarIntegration] Erro ao conectar:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao conectar com Google Calendar: ${errorMessage}`);
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Sincroniza eventos com Google Calendar
   */
  const handleSync = async () => {
    try {
      setIsSyncing(true);
      
      console.log('🔄 [GoogleCalendarIntegration] Iniciando sincronização...');
      
      // Buscar todos os eventos do usuário do Supabase
      const { supabase } = await import('@/lib/supabase');
      const { data: events, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) {
        throw new Error(`Erro ao buscar eventos: ${error.message}`);
      }

      if (!events || events.length === 0) {
        toast.info('Nenhum evento encontrado para sincronizar');
        return;
      }

      console.log(`📅 [GoogleCalendarIntegration] Encontrados ${events.length} eventos para sincronizar`);
      
      // Usar sincronização direta
      const result = await googleCalendarService.syncEvents(events);
      
      const { success, failed } = result;
      
      if (success > 0) {
        toast.success(`Sincronização concluída: ${success} eventos sincronizados${failed > 0 ? `, ${failed} falharam` : ''}`);
        onSyncComplete?.(success, failed);
        
        // Atualizar status da integração
        if (integration) {
          setIntegration({
            ...integration,
            last_sync: new Date().toISOString(),
            sync_status: failed > 0 ? 'error' : 'success',
            error_message: failed > 0 ? `${failed} eventos falharam na sincronização` : null
          });
        }
      } else {
        toast.error('Falha na sincronização de eventos');
        if (integration) {
          setIntegration({
            ...integration,
            sync_status: 'error',
            error_message: 'Todos os eventos falharam na sincronização'
          });
        }
      }
    } catch (error) {
      console.error('❌ [GoogleCalendarIntegration] Erro na sincronização:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao sincronizar eventos: ${errorMessage}`);
      
      if (integration) {
        setIntegration({
          ...integration,
          sync_status: 'error',
          error_message: errorMessage
        });
      }
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Ativa/desativa a integração
   */
  const handleToggle = async (enabled: boolean) => {
    try {
      console.log(`🔄 [GoogleCalendarIntegration] ${enabled ? 'Ativando' : 'Desativando'} integração...`);
      
      if (!integration) {
        toast.error('Nenhuma integração configurada');
        return;
      }

      // Atualizar estado local
      const updatedIntegration: IntegrationConfig = {
        ...integration,
        is_enabled: enabled,
        updated_at: new Date().toISOString(),
        sync_status: enabled ? 'success' : 'pending',
        error_message: null
      };
      
      setIntegration(updatedIntegration);
      
      // Se desativando, fazer logout do Google Calendar
      if (!enabled && googleCalendarService.isAuthenticated()) {
        console.log('🔐 [GoogleCalendarIntegration] Fazendo logout do Google Calendar...');
        await googleCalendarService.signOut();
      }
      
      toast.success(`Integração ${enabled ? 'ativada' : 'desativada'} com sucesso!`);
      console.log(`✅ [GoogleCalendarIntegration] Integração ${enabled ? 'ativada' : 'desativada'}`);
    } catch (error) {
      console.error('❌ [GoogleCalendarIntegration] Erro ao alterar integração:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao ${enabled ? 'ativar' : 'desativar'} integração: ${errorMessage}`);
    }
  };

  /**
   * Testa a conexão com Google Calendar
   */
  const handleTest = async () => {
    try {
      setIsTesting(true);
      
      console.log('🔄 [GoogleCalendarIntegration] Testando conexão com Google Calendar...');
      
      // Testar conexão usando o serviço de teste
      const testResult = await testGoogleCalendarIntegration();
      
      if (testResult) {
        toast.success('Conexão testada com sucesso! Google Calendar está funcionando corretamente.');
        console.log('✅ [GoogleCalendarIntegration] Teste de conexão bem-sucedido');
        
        // Atualizar status da integração se existir
        if (integration) {
          setIntegration({
            ...integration,
            sync_status: 'success',
            error_message: null,
            updated_at: new Date().toISOString()
          });
        }
      } else {
        toast.error('Falha no teste de conexão. Verifique os logs do console para mais detalhes.');
        console.error('❌ [GoogleCalendarIntegration] Teste de conexão falhou');
        
        // Atualizar status da integração se existir
        if (integration) {
          setIntegration({
            ...integration,
            sync_status: 'error',
            error_message: 'Falha no teste de conexão',
            updated_at: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('❌ [GoogleCalendarIntegration] Erro ao testar conexão:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao testar conexão: ${errorMessage}`);
      
      // Atualizar status da integração se existir
      if (integration) {
        setIntegration({
          ...integration,
          sync_status: 'error',
          error_message: errorMessage,
          updated_at: new Date().toISOString()
        });
      }
    } finally {
      setIsTesting(false);
    }
  };

  /**
   * Remove a integração
   */
  const handleRemove = async () => {
    setShowConfirmRemove(true);
  };

  /**
   * Confirma e executa a remoção da integração
   */
  const confirmRemove = async () => {
    try {
      setIsRemoving(true);
      console.log('🗑️ [GoogleCalendarIntegration] Removendo integração...');
      
      // Fazer logout do Google Calendar se estiver autenticado
      if (googleCalendarService.isAuthenticated()) {
        console.log('🔐 [GoogleCalendarIntegration] Fazendo logout do Google Calendar...');
        await googleCalendarService.signOut();
      }
      
      // Simular delay para melhor UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remover estado da integração
      setIntegration(null);
      setShowConfirmRemove(false);
      
      console.log('✅ [GoogleCalendarIntegration] Integração removida com sucesso');
      toast.success('Integração removida com sucesso! Você foi desconectado do Google Calendar.');
    } catch (error) {
      console.error('❌ [GoogleCalendarIntegration] Erro ao remover integração:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro ao remover integração: ${errorMessage}`);
    } finally {
      setIsRemoving(false);
    }
  };

  /**
   * Cancela a remoção da integração
   */
  const cancelRemove = () => {
    setShowConfirmRemove(false);
  };

  /**
   * Renderiza o status da sincronização
   */
  const renderSyncStatus = () => {
    if (!integration) return null;

    const { last_sync, sync_status, sync_progress, error_message } = integration;
    
    const statusConfig = {
      pending: { icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-100', text: 'Pendente' },
      syncing: { icon: RefreshCw, color: 'text-blue-500', bgColor: 'bg-blue-100', text: 'Sincronizando' },
      success: { icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-100', text: 'Sucesso' },
      error: { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-100', text: 'Erro' },
    };

    const config = statusConfig[sync_status];
    const Icon = config.icon;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1.5 px-2 py-1 ${config.bgColor} border-0`}
          >
            <Icon className={`w-3.5 h-3.5 ${config.color}`} />
            <span className={`font-medium ${config.color}`}>{config.text}</span>
          </Badge>
          
          {sync_status === 'syncing' && (
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-1 bg-blue-500 rounded-full"
            />
          )}
        </div>
        
        {last_sync && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>
              Última sincronização: {new Date(last_sync).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        )}
        
        {error_message && (
          <div className="mt-2">
            <Badge variant="destructive" className="text-xs">
              {error_message}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  // Componente de loading com animação
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border border-muted/30">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <Calendar className="w-12 h-12 text-muted-foreground opacity-20" />
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                </motion.div>
              </div>
              <p className="text-muted-foreground">Carregando configurações...</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Confirmação de remoção */}
      <AnimatePresence>
        {showConfirmRemove && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-background/95 backdrop-blur-sm rounded-lg"
          >
            <div className="p-6 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
              <h3 className="text-lg font-medium">Remover integração?</h3>
              <p className="text-sm text-muted-foreground">
                Isso desconectará sua conta Google e interromperá a sincronização de eventos.
              </p>
              <div className="flex gap-2 justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmRemove(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmRemove}
                >
                  Remover
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteúdo principal */}
      <div className={showConfirmRemove ? "opacity-20 pointer-events-none" : ""}>
        {!integration ? (
          // Estado não conectado
          <div className="p-6 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="relative z-10"
              >
                <Calendar className="w-16 h-16 text-primary" />
              </motion.div>
            </div>
            
            <h3 className="text-xl font-medium mb-2">Conecte-se ao Google Calendar</h3>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Sincronize automaticamente seus eventos de estudo com o Google Calendar para acompanhar seu progresso em qualquer dispositivo.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={handleConnect}
                disabled={isConnecting}
                size="lg"
                className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600"
              >
                {isConnecting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Calendar className="w-4 h-4" />
                )}
                {isConnecting ? 'Conectando...' : 'Conectar com Google Calendar'}
              </Button>
            </motion.div>
            
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-lg bg-muted/30">
                <CalendarCheck className="w-6 h-6 text-primary/60 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Sincronização automática</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <Clock className="w-6 h-6 text-primary/60 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Lembretes de eventos</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <CheckCircle className="w-6 h-6 text-primary/60 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Acesso em qualquer lugar</p>
              </div>
            </div>
          </div>
        ) : (
          // Estado conectado
          <div className="space-y-6">
            {/* Cabeçalho com status */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${integration.is_enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                  <Calendar className={`w-5 h-5 ${integration.is_enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h3 className="font-medium">Google Calendar</h3>
                  <p className="text-xs text-muted-foreground">
                    {integration.calendar_id || 'Calendário principal'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-muted-foreground mr-1">
                    {integration.is_enabled ? 'Ativo' : 'Inativo'}
                  </span>
                  <Switch
                    checked={integration.is_enabled}
                    onCheckedChange={handleToggle}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Status da sincronização */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-muted/30 to-muted/10 border border-muted/20">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium mb-3">Status da Sincronização</h4>
                  {renderSyncStatus()}
                </div>
                
                <div className="flex gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleSync}
                      disabled={isSyncing || !integration.is_enabled}
                      className="gap-2"
                      variant={integration.is_enabled ? "default" : "outline"}
                    >
                      {isSyncing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleTest}
                      disabled={isTesting}
                      className="gap-2"
                      variant="outline"
                      size="default"
                    >
                      {isTesting ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Settings className="w-4 h-4" />
                      )}
                      {isTesting ? 'Testando...' : 'Testar Conexão'}
                    </Button>
                  </motion.div>
                </div>
              </div>
              
              {/* Progresso de sincronização */}
              {isSyncing && (
                <div className="mt-4">
                  <Progress value={45} className="h-1" />
                  <p className="text-xs text-muted-foreground mt-1">Sincronizando eventos...</p>
                </div>
              )}
            </div>
            
            {/* Alertas */}
            <AnimatePresence>
              {integration.sync_status === 'error' && integration.error_message && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert variant="destructive" className="border border-destructive/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Erro na sincronização: {integration.error_message}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {!integration.is_enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert variant="default" className="bg-muted/50 border-muted">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      A integração está desativada. Ative para sincronizar eventos automaticamente.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Configurações Adicionais */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Configurações Adicionais</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Notificações</span>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={(checked) => {
                      setNotificationsEnabled(checked);
                      toast.success(checked ? 'Notificações ativadas' : 'Notificações desativadas');
                    }}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Sincronizar eventos concluídos</span>
                  </div>
                  <Switch
                    checked={syncCompletedEvents}
                    onCheckedChange={(checked) => {
                      setSyncCompletedEvents(checked);
                      toast.success(checked ? 'Sincronização de concluídos ativada' : 'Sincronização de concluídos desativada');
                    }}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal de Confirmação de Remoção */}
      <AnimatePresence>
        {showConfirmRemove && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={() => setShowConfirmRemove(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background border rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Remover Integração</h3>
                  <p className="text-sm text-muted-foreground">Esta ação não pode ser desfeita</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Tem certeza que deseja remover a integração com o Google Calendar? 
                Você será desconectado e precisará configurar novamente se quiser usar no futuro.
              </p>
              
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmRemove(false)}
                  disabled={isRemoving}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmRemove}
                  disabled={isRemoving}
                  className="gap-2"
                >
                  {isRemoving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Removendo...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Remover
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
