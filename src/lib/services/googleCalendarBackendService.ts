/**
 * Serviço para integração com o back-end do Google Calendar
 * Gerencia sincronização, mapeamentos e configurações via Edge Functions
 */

import { supabase } from '@/integrations/supabase/client';
import { securityService } from './securityService';

export interface GoogleCalendarIntegration {
  id: string;
  user_id: string;
  calendar_id: string;
  calendar_name: string;
  is_enabled: boolean;
  last_sync: string | null;
  sync_status: 'pending' | 'syncing' | 'success' | 'error';
  sync_progress: number;
  sync_direction: 'to_google' | 'from_google' | 'both';
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoogleCalendarEventMapping {
  id: string;
  local_event_id: string;
  google_event_id: string;
  google_calendar_id: string;
  user_id: string;
  last_synced_at: string;
  sync_status: 'synced' | 'pending' | 'error';
  created_at: string;
  updated_at: string;
  calendar_events?: {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    status: string;
  };
}

export interface SyncResult {
  success: number;
  failed: number;
  errors: string[];
}

class GoogleCalendarBackendService {
  private baseUrl: string;

  constructor() {
    // URL da Edge Function
    this.baseUrl = `https://glrdhaihzagnryzmmsuz.supabase.co/functions/v1/google-calendar-sync`;
  }

  /**
   * Obtém o token de autenticação do usuário atual
   */
  private async getAuthHeaders(): Promise<{ [key: string]: string }> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('Usuário não autenticado');
    }

    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Obtém as configurações de integração do usuário
   */
  async getIntegration(): Promise<GoogleCalendarIntegration | null> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}?action=integration`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.integration;
    } catch (error) {
      console.error('❌ [GoogleCalendarBackend] Erro ao obter integração:', error);
      throw error;
    }
  }

  /**
   * Configura a integração com Google Calendar
   */
  async setupIntegration(config: {
    google_calendar_id?: string;
    access_token: string;
    refresh_token: string;
    token_expires_at: string;
  }): Promise<GoogleCalendarIntegration> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'setup_integration',
          ...config,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ [GoogleCalendarBackend] Integração configurada com sucesso');
      
      // Log OAuth token write access
      setTimeout(() => securityService.logOAuthTokenAccess('google_calendar', 'write'), 0);
      
      return data.integration;
    } catch (error) {
      console.error('❌ [GoogleCalendarBackend] Erro ao configurar integração:', error);
      throw error;
    }
  }

  /**
   * Sincroniza eventos locais com Google Calendar
   */
  async syncEvents(events: any[]): Promise<{ success: boolean; results: SyncResult }> {
    try {
      const headers = await this.getAuthHeaders();
      
      console.log(`🔄 [GoogleCalendarBackend] Iniciando sincronização de ${events.length} eventos`);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'sync_events',
          events,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ [GoogleCalendarBackend] Sincronização concluída:`, data.results);
      return data;
    } catch (error) {
      console.error('❌ [GoogleCalendarBackend] Erro na sincronização:', error);
      throw error;
    }
  }

  /**
   * Obtém os mapeamentos de eventos do usuário
   */
  async getEventMappings(): Promise<GoogleCalendarEventMapping[]> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}?action=mappings`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.mappings || [];
    } catch (error) {
      console.error('❌ [GoogleCalendarBackend] Erro ao obter mapeamentos:', error);
      throw error;
    }
  }

  /**
   * Ativa/desativa a integração
   */
  async toggleIntegration(enabled: boolean): Promise<GoogleCalendarIntegration> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          action: 'toggle_integration',
          enabled,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ [GoogleCalendarBackend] Integração ${enabled ? 'ativada' : 'desativada'}`);
      return data.integration;
    } catch (error) {
      console.error('❌ [GoogleCalendarBackend] Erro ao alterar integração:', error);
      throw error;
    }
  }

  /**
   * Remove a integração completamente
   */
  async removeIntegration(): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(this.baseUrl, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({
          action: 'remove_integration',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('✅ [GoogleCalendarBackend] Integração removida com sucesso');
    } catch (error) {
      console.error('❌ [GoogleCalendarBackend] Erro ao remover integração:', error);
      throw error;
    }
  }

  /**
   * Remove o mapeamento de um evento específico
   */
  async removeEventMapping(localEventId: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(this.baseUrl, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({
          action: 'remove_mapping',
          local_event_id: localEventId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`✅ [GoogleCalendarBackend] Mapeamento removido para evento ${localEventId}`);
    } catch (error) {
      console.error('❌ [GoogleCalendarBackend] Erro ao remover mapeamento:', error);
      throw error;
    }
  }

  /**
   * Verifica o status da última sincronização
   */
  async getSyncStatus(): Promise<{
    status: 'pending' | 'syncing' | 'success' | 'error';
    last_sync_at?: string;
    error?: string;
  }> {
    try {
      const integration = await this.getIntegration();
      
      if (!integration) {
        return { status: 'pending' };
      }

      return {
        status: integration.sync_status,
        last_sync_at: integration.last_sync,
        error: integration.error_message,
      };
    } catch (error) {
      console.error('❌ [GoogleCalendarBackend] Erro ao obter status de sincronização:', error);
      return { status: 'error', error: error.message };
    }
  }

  /**
   * Força uma nova sincronização de todos os eventos do usuário
   */
  async forceSyncAllEvents(): Promise<{ success: boolean; results: SyncResult }> {
    try {
      // Buscar todos os eventos do usuário
      const { data: events, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) {
        throw error;
      }

      if (!events || events.length === 0) {
        return {
          success: true,
          results: { success: 0, failed: 0, errors: [] }
        };
      }

      return await this.syncEvents(events);
    } catch (error) {
      console.error('❌ [GoogleCalendarBackend] Erro na sincronização forçada:', error);
      throw error;
    }
  }
}

// Instância singleton
export const googleCalendarBackendService = new GoogleCalendarBackendService();
