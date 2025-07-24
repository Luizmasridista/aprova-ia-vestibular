import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Save, RefreshCw, Clock, ArrowUpDown, Bell, Calendar, Filter } from 'lucide-react';
import { googleCalendarBackendService } from '../../lib/services/googleCalendarBackendService';
import { GoogleCalendarIntegration as IntegrationType } from '../../lib/services/googleCalendarBackendService';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

interface GoogleCalendarSettingsProps {
  onSettingsChange?: () => void;
}

const GoogleCalendarSettings: React.FC<GoogleCalendarSettingsProps> = ({ onSettingsChange }) => {
  const [integration, setIntegration] = useState<IntegrationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    autoSync: true,
    syncDirection: 'to_google' as 'to_google' | 'from_google' | 'both',
    syncFrequency: 'daily',
    notifications: true,
    colorSync: true,
    statusSync: false
  });

  useEffect(() => {
    loadIntegration();
  }, []);

  const loadIntegration = async () => {
    try {
      setLoading(true);
      console.log('🔄 [GoogleCalendarSettings] Carregando configurações...');
      
      // Tentar carregar do backend primeiro
      let data = null;
      try {
        data = await googleCalendarBackendService.getIntegration();
        console.log('✅ [GoogleCalendarSettings] Dados carregados do backend:', data);
      } catch (backendError) {
        console.warn('⚠️ [GoogleCalendarSettings] Falha no backend, tentando localStorage:', backendError);
      }
      
      // Se backend falhou, tentar localStorage
      if (!data) {
        try {
          const savedSettings = localStorage.getItem('google_calendar_settings');
          if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            setSettings(parsedSettings);
            console.log('💾 [GoogleCalendarSettings] Configurações carregadas do localStorage:', parsedSettings);
            
            // Criar integração mock para o localStorage
            const mockIntegration: IntegrationType = {
              id: 'local-integration',
              user_id: 'current-user',
              calendar_id: 'primary',
              calendar_name: 'Calendário Principal',
              is_enabled: parsedSettings.autoSync,
              last_sync: null,
              sync_status: 'success',
              sync_progress: 0,
              sync_direction: parsedSettings.syncDirection,
              error_message: null,
              created_at: new Date().toISOString(),
              updated_at: parsedSettings.lastUpdated || new Date().toISOString()
            };
            setIntegration(mockIntegration);
            return;
          }
        } catch (storageError) {
          console.error('❌ [GoogleCalendarSettings] Erro ao carregar do localStorage:', storageError);
        }
      }
      
      if (data) {
        setIntegration(data);
        // Atualizar configurações com dados do backend
        setSettings(prev => ({
          ...prev,
          autoSync: data.is_enabled,
          syncDirection: data.sync_direction,
        }));
      }
    } catch (error) {
      console.error('❌ [GoogleCalendarSettings] Erro ao carregar configurações:', error);
      // Não mostrar erro se conseguiu carregar do localStorage
      const hasLocalSettings = localStorage.getItem('google_calendar_settings');
      if (!hasLocalSettings) {
        toast.error('Não foi possível carregar as configurações');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      console.log('💾 [GoogleCalendarSettings] Salvando configurações:', settings);
      
      // Tentar salvar via backend service primeiro
      let backendSuccess = false;
      if (integration) {
        try {
          await googleCalendarBackendService.toggleIntegration(settings.autoSync);
          backendSuccess = true;
          console.log('✅ [GoogleCalendarSettings] Configurações salvas no backend');
        } catch (backendError) {
          console.warn('⚠️ [GoogleCalendarSettings] Falha no backend, usando localStorage:', backendError);
        }
      }
      
      // Salvar no localStorage como fallback ou backup
      try {
        const settingsToSave = {
          ...settings,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('google_calendar_settings', JSON.stringify(settingsToSave));
        console.log('💾 [GoogleCalendarSettings] Configurações salvas no localStorage');
      } catch (storageError) {
        console.error('❌ [GoogleCalendarSettings] Erro ao salvar no localStorage:', storageError);
      }
      
      toast.success('Configurações salvas com sucesso');
      
      if (onSettingsChange) {
        onSettingsChange();
      }
      
      // Recarregar dados atualizados apenas se backend funcionou
      if (backendSuccess) {
        await loadIntegration();
      }
    } catch (error) {
      console.error('❌ [GoogleCalendarSettings] Erro ao salvar configurações:', error);
      toast.error('Configurações salvas localmente. Algumas funcionalidades podem ser limitadas.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary animate-pulse" />
          <h3 className="font-medium">Carregando configurações...</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-5 w-32 bg-muted/60 animate-pulse rounded" />
              <div className="h-5 w-10 bg-muted/60 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!integration) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-4">
          <Settings className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="font-medium text-center">Conecte-se ao Google Calendar primeiro</h3>
          <p className="text-sm text-muted-foreground text-center mt-1">
            As configurações estarão disponíveis após a conexão
          </p>
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
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Configurações de Sincronização</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveSettings}
              disabled={saving}
              className="gap-1"
            >
              {saving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </motion.div>
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Salvar
            </Button>
          </div>

          <div className="space-y-4">
            {/* Sincronização automática */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5 text-primary" />
                  Sincronização automática
                </Label>
                <p className="text-xs text-muted-foreground">
                  Sincroniza eventos automaticamente quando houver alterações
                </p>
              </div>
              <Switch
                checked={settings.autoSync}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSync: checked }))}
              />
            </div>

            <Separator />

            {/* Direção da sincronização */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
                Direção da sincronização
              </Label>
              <Select 
                value={settings.syncDirection}
                onValueChange={(value: 'to_google' | 'from_google' | 'both') => 
                  setSettings(prev => ({ ...prev, syncDirection: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a direção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="to_google">APROVA.AE → Google Calendar</SelectItem>
                  <SelectItem value="from_google">Google Calendar → APROVA.AE</SelectItem>
                  <SelectItem value="both">Sincronização bidirecional</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Define como os eventos serão sincronizados entre as plataformas
              </p>
            </div>

            <Separator />

            {/* Frequência de sincronização */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Frequência de sincronização
              </Label>
              <Select 
                value={settings.syncFrequency}
                onValueChange={(value) => setSettings(prev => ({ ...prev, syncFrequency: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a frequência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Tempo real</SelectItem>
                  <SelectItem value="hourly">A cada hora</SelectItem>
                  <SelectItem value="daily">Diariamente</SelectItem>
                  <SelectItem value="manual">Apenas manual</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Define com que frequência a sincronização automática ocorre
              </p>
            </div>

            <Separator />

            {/* Notificações */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-1.5">
                  <Bell className="h-3.5 w-3.5 text-primary" />
                  Notificações de sincronização
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receba notificações sobre o status da sincronização
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifications: checked }))}
              />
            </div>

            <Separator />

            {/* Sincronização de cores */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-primary" />
                  Sincronizar cores das matérias
                </Label>
                <p className="text-xs text-muted-foreground">
                  Mantém as mesmas cores das matérias no Google Calendar
                </p>
              </div>
              <Switch
                checked={settings.colorSync}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, colorSync: checked }))}
              />
            </div>

            <Separator />

            {/* Sincronização de status */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Sincronizar status de conclusão
                </Label>
                <p className="text-xs text-muted-foreground">
                  Atualiza o status de conclusão dos eventos entre plataformas
                </p>
              </div>
              <Switch
                checked={settings.statusSync}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, statusSync: checked }))}
              />
            </div>
          </div>

          <div className="mt-6 bg-muted/30 p-3 rounded-md">
            <p className="text-xs text-muted-foreground">
              <strong>Nota:</strong> Algumas configurações avançadas podem exigir permissões adicionais do Google Calendar.
            </p>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default GoogleCalendarSettings;
