import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, XCircle, RefreshCw, Clock, BarChart3 } from 'lucide-react';
import { googleCalendarBackendService } from '../../lib/services/googleCalendarBackendService';
import { GoogleCalendarEventMapping } from '../../lib/services/googleCalendarBackendService';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Skeleton } from '../ui/skeleton';

interface GoogleCalendarStatsProps {
  onRefresh?: () => void;
}

const GoogleCalendarStats: React.FC<GoogleCalendarStatsProps> = ({ onRefresh }) => {
  const [mappings, setMappings] = useState<GoogleCalendarEventMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<{
    status: 'pending' | 'syncing' | 'success' | 'error';
    last_sync_at?: string;
    error?: string;
  }>({ status: 'pending' });

  // Estatísticas calculadas
  const totalEvents = mappings.length;
  const syncedEvents = mappings.filter(m => m.sync_status === 'synced').length;
  const pendingEvents = mappings.filter(m => m.sync_status === 'pending').length;
  const errorEvents = mappings.filter(m => m.sync_status === 'error').length;
  const syncRate = totalEvents > 0 ? (syncedEvents / totalEvents) * 100 : 0;

  // Agrupar eventos por status
  const eventsByStatus = mappings.reduce((acc, mapping) => {
    const status = mapping.calendar_events?.status || 'unknown';
    if (!acc[status]) acc[status] = 0;
    acc[status]++;
    return acc;
  }, {} as Record<string, number>);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carregar mapeamentos
      const mappingsData = await googleCalendarBackendService.getEventMappings();
      setMappings(mappingsData);
      
      // Carregar status de sincronização
      const status = await googleCalendarBackendService.getSyncStatus();
      setSyncStatus(status);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
      setError('Não foi possível carregar as estatísticas de sincronização.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    await loadData();
    if (onRefresh) onRefresh();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50 dark:bg-red-900/20">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <XCircle className="h-5 w-5" />
          <h3 className="font-medium">Erro ao carregar estatísticas</h3>
        </div>
        <p className="mt-2 text-sm text-red-600/80 dark:text-red-400/80">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4 border-red-200 text-red-600 hover:bg-red-50"
          onClick={handleRefresh}
        >
          Tentar novamente
        </Button>
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
        className="space-y-6"
      >
        {/* Status da última sincronização */}
        <Card className="p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-lg flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Status da Sincronização
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              className="h-8 px-2"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Atualizar
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-2">
            {syncStatus.status === 'success' && (
              <Badge
                variant="default"
                className="bg-green-500 text-white hover:bg-green-600"
              >
                <CheckCircle className="h-3 w-3" /> Sincronizado
              </Badge>
            )}
            {syncStatus.status === 'syncing' && (
              <Badge
                variant="outline"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-50"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                  <RefreshCw className="h-3 w-3" />
                </motion.div>
                Sincronizando...
              </Badge>
            )}
            {syncStatus.status === 'error' && (
              <Badge
                variant="destructive"
                className="gap-1"
              >
                <XCircle className="h-3 w-3" /> Erro
              </Badge>
            )}
            {syncStatus.status === 'pending' && (
              <Badge
                variant="outline"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-50"
              >
                <Clock className="h-3 w-3" /> Pendente
              </Badge>
            )}
            
            <span className="text-sm text-muted-foreground">
              Última sincronização: {formatDate(syncStatus.last_sync_at)}
            </span>
          </div>

          {syncStatus.error && (
            <p className="text-sm text-red-500 mt-1">
              Erro: {syncStatus.error}
            </p>
          )}
        </Card>

        {/* Estatísticas gerais */}
        <Card className="p-4 overflow-hidden">
          <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            Estatísticas de Eventos
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-semibold">{totalEvents}</div>
            </div>
            
            <div className="p-3 bg-green-500/10 rounded-lg">
              <div className="text-sm text-muted-foreground">Sincronizados</div>
              <div className="text-2xl font-semibold text-green-600 dark:text-green-400">{syncedEvents}</div>
            </div>
            
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <div className="text-sm text-muted-foreground">Pendentes</div>
              <div className="text-2xl font-semibold text-amber-600 dark:text-amber-400">{pendingEvents}</div>
            </div>
            
            <div className="p-3 bg-red-500/10 rounded-lg">
              <div className="text-sm text-muted-foreground">Com erro</div>
              <div className="text-2xl font-semibold text-red-600 dark:text-red-400">{errorEvents}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Taxa de sincronização</span>
              <span className="font-medium">{syncRate.toFixed(0)}%</span>
            </div>
            <Progress value={syncRate} className="h-2" />
          </div>
        </Card>

        {/* Lista de eventos recentes */}
        {mappings.length > 0 && (
          <Card className="p-4 overflow-hidden">
            <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-primary" />
              Eventos Recentes
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {mappings.slice(0, 5).map((mapping) => (
                <div 
                  key={mapping.id} 
                  className="flex items-center justify-between p-2 rounded-md bg-background border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{mapping.calendar_events?.title || 'Evento'}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {new Date(mapping.calendar_events?.start_date || '').toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    {mapping.sync_status === 'synced' && (
                      <Badge
                        variant="default"
                        className="bg-green-500 text-white hover:bg-green-600"
                      >
                        <CheckCircle className="h-3 w-3" /> Sincronizado
                      </Badge>
                    )}
                    {mapping.sync_status === 'pending' && (
                      <Badge
                        variant="outline"
                        className="border-yellow-500 text-yellow-500 hover:bg-yellow-50"
                      >
                        <Clock className="h-3 w-3" /> Pendente
                      </Badge>
                    )}
                    {mapping.sync_status === 'error' && (
                      <Badge
                        variant="destructive"
                        className="gap-1"
                      >
                        <XCircle className="h-3 w-3" /> Erro
                      </Badge>
                    )}
                  </div>
                </div>
              ))}

              {mappings.length > 5 && (
                <p className="text-center text-sm text-muted-foreground pt-2">
                  Mostrando 5 de {mappings.length} eventos
                </p>
              )}
            </div>
          </Card>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default GoogleCalendarStats;
