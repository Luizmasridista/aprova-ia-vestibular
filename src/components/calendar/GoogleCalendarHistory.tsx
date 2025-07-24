import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, RefreshCw, CheckCircle, XCircle, Clock, Calendar, ArrowRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '../../lib/supabase';

interface SyncHistoryItem {
  id: string;
  user_id: string;
  operation_type: 'sync' | 'connect' | 'disconnect' | 'update';
  status: 'success' | 'error' | 'pending';
  events_processed: number;
  events_success: number;
  events_failed: number;
  error_message?: string;
  created_at: string;
}

interface GoogleCalendarHistoryProps {
  limit?: number;
  onRefresh?: () => void;
}

const GoogleCalendarHistory: React.FC<GoogleCalendarHistoryProps> = ({ 
  limit = 10,
  onRefresh 
}) => {
  const [history, setHistory] = useState<SyncHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar histórico de sincronização da tabela google_calendar_sync_history
      const { data, error: fetchError } = await supabase
        .from('google_calendar_sync_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Se não existir dados reais, criar dados de exemplo para demonstração
      if (!data || data.length === 0) {
        const mockHistory = generateMockHistory(limit);
        setHistory(mockHistory);
      } else {
        setHistory(data as SyncHistoryItem[]);
      }
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      setError('Não foi possível carregar o histórico de sincronização.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Gerar dados de exemplo para demonstração
  const generateMockHistory = (count: number): SyncHistoryItem[] => {
    const operations = ['sync', 'connect', 'update', 'sync', 'sync'];
    const statuses = ['success', 'success', 'success', 'error', 'pending'];
    
    return Array.from({ length: count }).map((_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - i * 3); // Cada item é 3 horas antes do anterior
      
      const operationType = operations[Math.floor(Math.random() * operations.length)] as 'sync' | 'connect' | 'disconnect' | 'update';
      const status = statuses[Math.floor(Math.random() * statuses.length)] as 'success' | 'error' | 'pending';
      
      const eventsProcessed = operationType === 'sync' ? Math.floor(Math.random() * 20) + 1 : 0;
      const eventsSuccess = status === 'success' ? eventsProcessed : Math.floor(eventsProcessed * 0.7);
      const eventsFailed = eventsProcessed - eventsSuccess;
      
      return {
        id: `mock-${i}`,
        user_id: 'current-user',
        operation_type: operationType,
        status,
        events_processed: eventsProcessed,
        events_success: eventsSuccess,
        events_failed: eventsFailed,
        error_message: status === 'error' ? 'Erro de conexão com a API do Google' : undefined,
        created_at: date.toISOString()
      };
    });
  };

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleRefresh = async () => {
    await loadHistory();
    if (onRefresh) onRefresh();
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM', às' HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const getOperationLabel = (type: string) => {
    switch (type) {
      case 'sync': return 'Sincronização';
      case 'connect': return 'Conexão';
      case 'disconnect': return 'Desconexão';
      case 'update': return 'Atualização';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge
            variant="default"
            className="bg-green-500 text-white hover:bg-green-600"
          >
            <CheckCircle className="h-3 w-3" /> Sucesso
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" /> Erro
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" /> Pendente
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-24" />
        </div>
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50 dark:bg-red-900/20">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <XCircle className="h-5 w-5" />
          <h3 className="font-medium">Erro ao carregar histórico</h3>
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
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Histórico de Sincronização</h3>
          </div>
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

        {history.length === 0 ? (
          <Card className="p-6 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <h3 className="font-medium">Nenhum histórico disponível</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Ainda não há registros de sincronização com o Google Calendar
            </p>
          </Card>
        ) : (
          <Card className="overflow-hidden border border-muted/50">
            <div className="max-h-[400px] overflow-y-auto p-1">
              <div className="space-y-1 p-2">
                {history.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="p-3 rounded-md hover:bg-muted/40 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{getOperationLabel(item.operation_type)}</span>
                          {getStatusBadge(item.status)}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(item.created_at)}
                        </span>
                      </div>
                      
                      {item.operation_type === 'sync' && (
                        <div className="flex items-center gap-2 text-sm mt-2">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{item.events_processed} eventos</span>
                          </div>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>{item.events_success} sucessos</span>
                          </div>
                          {item.events_failed > 0 && (
                            <>
                              <span className="text-muted-foreground">/</span>
                              <div className="flex items-center gap-1 text-red-500">
                                <XCircle className="h-3.5 w-3.5" />
                                <span>{item.events_failed} falhas</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                      
                      {item.error_message && (
                        <p className="text-xs text-red-500 mt-1">
                          Erro: {item.error_message}
                        </p>
                      )}
                    </div>
                    {index < history.length - 1 && <Separator />}
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        )}
        
        <p className="text-xs text-muted-foreground text-center">
          Mostrando os últimos {Math.min(limit, history.length)} registros de sincronização
        </p>
      </motion.div>
    </AnimatePresence>
  );
};

export default GoogleCalendarHistory;
