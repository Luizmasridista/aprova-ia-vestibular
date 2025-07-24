import { useState, useEffect, useCallback } from 'react';
import { googleCalendarService } from '@/lib/services/googleCalendarService';
import { CalendarEvent } from '@/lib/services/calendarService';
import { toast } from 'sonner';

export interface GoogleCalendarState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useGoogleCalendar = () => {
  const [state, setState] = useState<GoogleCalendarState>({
    isInitialized: false,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  // Inicializar o serviço do Google Calendar
  const initialize = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await googleCalendarService.initialize();
      
      setState(prev => ({
        ...prev,
        isInitialized: success,
        isAuthenticated: success ? googleCalendarService.isAuthenticated() : false,
        isLoading: false
      }));

      if (!success) {
        throw new Error('Falha ao inicializar Google Calendar API');
      }

      console.log('✅ [useGoogleCalendar] Serviço inicializado');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      console.error('❌ [useGoogleCalendar] Erro na inicialização:', error);
    }
  }, []);

  // Autenticar com Google
  const signIn = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await googleCalendarService.signIn();
      
      setState(prev => ({
        ...prev,
        isAuthenticated: success,
        isLoading: false
      }));

      if (success) {
        toast.success('Conectado ao Google Calendar! 🎉');
      } else {
        throw new Error('Falha na autenticação');
      }

      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na autenticação';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      toast.error('Erro ao conectar com Google Calendar');
      return false;
    }
  }, []);

  // Desautenticar
  const signOut = useCallback(async () => {
    try {
      await googleCalendarService.signOut();
      setState(prev => ({
        ...prev,
        isAuthenticated: false
      }));
      toast.success('Desconectado do Google Calendar');
    } catch (error) {
      console.error('❌ [useGoogleCalendar] Erro ao desconectar:', error);
      toast.error('Erro ao desconectar');
    }
  }, []);

  // Sincronizar eventos
  const syncEvents = useCallback(async (events: CalendarEvent[]) => {
    if (!state.isAuthenticated) {
      toast.error('Faça login no Google Calendar primeiro');
      return { success: 0, failed: 0 };
    }

    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const result = await googleCalendarService.syncEvents(events);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (result.success > 0) {
        toast.success(`${result.success} eventos sincronizados com sucesso! 🎉`);
      }
      
      if (result.failed > 0) {
        toast.warning(`${result.failed} eventos falharam na sincronização`);
      }

      return result;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      console.error('❌ [useGoogleCalendar] Erro na sincronização:', error);
      toast.error('Erro ao sincronizar eventos');
      return { success: 0, failed: 0 };
    }
  }, [state.isAuthenticated]);

  // Verificar se precisa de configuração
  const needsConfiguration = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    
    return !clientId || !apiKey;
  }, []);

  // Inicializar automaticamente quando o hook for montado
  useEffect(() => {
    if (!needsConfiguration() && !state.isInitialized && !state.isLoading) {
      initialize();
    }
  }, [initialize, needsConfiguration, state.isInitialized, state.isLoading]);

  return {
    // Estado
    ...state,
    needsConfiguration: needsConfiguration(),
    
    // Ações
    initialize,
    signIn,
    signOut,
    syncEvents
  };
};
