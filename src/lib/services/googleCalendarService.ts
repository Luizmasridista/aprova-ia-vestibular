/**
 * Serviço para integração com Google Calendar
 * Permite sincronização de eventos entre APROVA.AE e Google Calendar
 * Atualizado para usar Google Identity Services (GIS)
 */

import type { CalendarEvent } from './calendarService';

// Interface para erros da API do Google
interface GoogleApiError {
  status?: number;
  result?: {
    error?: {
      code: number;
      message: string;
    };
  };
}

// Type guard para verificar se é um erro da API do Google
function isGoogleApiError(error: unknown): error is GoogleApiError {
  return typeof error === 'object' && error !== null && 
    ('status' in error || ('result' in error && typeof (error as GoogleApiError).result === 'object'));
}

// Interface para eventos simplificados usados na sincronização
export interface SimplifiedEvent {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  subject?: string;
  topic?: string;
  color?: string;
}

export interface GoogleCalendarConfig {
  clientId: string;
  apiKey: string;
  discoveryDoc: string;
  scopes: string;
}

// Interfaces para tipos do Google API
interface GoogleAuth {
  getAccessToken(): { access_token: string } | null;
}

interface GoogleGapi {
  load(api: string, callback: () => void): void;
  client: {
    init(config: { apiKey?: string; discoveryDocs: string[] }): Promise<void>;
    setToken(token: { access_token: string }): void;
    calendar: {
      events: {
        insert(params: { calendarId: string; resource: GoogleCalendarEvent }): Promise<{ result: GoogleCalendarEvent }>;
        list(params: { 
          calendarId: string; 
          timeMin?: string; 
          timeMax?: string;
          singleEvents?: boolean;
          orderBy?: string;
          maxResults?: number;
        }): Promise<{ result: { items: GoogleCalendarEvent[] } }>;
        patch(params: { calendarId: string; eventId: string; resource: Partial<GoogleCalendarEvent> }): Promise<{ result: GoogleCalendarEvent }>;
        delete(params: { calendarId: string; eventId: string }): Promise<void>;
      };
      calendarList: {
        list(params: { maxResults?: number }): Promise<{ result: { items: { id: string; summary: string }[] } }>;
      };
    };
  };
  auth2: {
    getAuthInstance(): GoogleAuth;
  };
}

interface GoogleTokenClient {
  callback: ((response: { access_token: string; error?: string }) => void) | null;
  requestAccessToken(): void;
}

interface GoogleIdentityServices {
  accounts: {
    oauth2: {
      initTokenClient(config: {
        client_id: string;
        scope: string;
        callback: (response: { access_token: string; error?: string }) => void;
      }): GoogleTokenClient;
      revoke(token: string, callback: () => void): void;
    };
  };
}

// Declaração global para o Google API
declare global {
  interface Window {
    gapi: GoogleGapi;
    google: GoogleIdentityServices;
  }
}

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  colorId?: string;
}

// Configuração OAuth
export const googleAuthConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '487233347456-uvfdhq6tugm1kv5s0a30krg5nvbon2hd.apps.googleusercontent.com',
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
  scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.readonly',
  redirect_uri: window.location.origin + '/auth/callback',
};

class GoogleCalendarService {
  private gapi: GoogleGapi | null = null;
  private tokenClient: GoogleTokenClient | null = null;
  private isInitialized = false;
  private isSignedIn = false;
  private accessToken: string | null = null;
  private readonly STORAGE_KEY = 'google_calendar_auth';
  private readonly TOKEN_EXPIRY_KEY = 'google_calendar_token_expiry';

  private config: GoogleCalendarConfig = {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '487233347456-uvfdhq6tugm1kv5s0a30krg5nvbon2hd.apps.googleusercontent.com',
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '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',
    discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
    scopes: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.readonly'
  };

  /**
   * Salva o token de acesso no localStorage com expiração
   */
  private saveTokenToStorage(token: string, expiresIn: number = 3600): void {
    try {
      const expiryTime = Date.now() + (expiresIn * 1000);
      localStorage.setItem(this.STORAGE_KEY, token);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
      console.log('💾 [GoogleCalendar] Token salvo no localStorage');
    } catch (error) {
      console.error('❌ [GoogleCalendar] Erro ao salvar token:', error);
    }
  }

  /**
   * Carrega o token de acesso do localStorage se ainda válido
   */
  private loadTokenFromStorage(): string | null {
    try {
      const token = localStorage.getItem(this.STORAGE_KEY);
      const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      
      if (!token || !expiryTime) {
        return null;
      }
      
      const now = Date.now();
      const expiry = parseInt(expiryTime, 10);
      
      if (now >= expiry) {
        console.log('⏰ [GoogleCalendar] Token expirado, removendo do storage');
        this.clearTokenFromStorage();
        return null;
      }
      
      console.log('✅ [GoogleCalendar] Token válido carregado do localStorage');
      return token;
    } catch (error) {
      console.error('❌ [GoogleCalendar] Erro ao carregar token:', error);
      return null;
    }
  }

  /**
   * Remove o token do localStorage
   */
  private clearTokenFromStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      console.log('🗑️ [GoogleCalendar] Token removido do localStorage');
    } catch (error) {
      console.error('❌ [GoogleCalendar] Erro ao remover token:', error);
    }
  }

  /**
   * Inicializa a API do Google Calendar com Google Identity Services (GIS)
   */
  async initialize(): Promise<boolean> {
    try {
      console.log('🔄 [GoogleCalendar] Iniciando inicialização...');
      console.log('🔑 [GoogleCalendar] Client ID:', this.config.clientId);
      
      // Verificar se Client ID está configurado
      if (!this.config.clientId || this.config.clientId === 'undefined') {
        console.error('❌ [GoogleCalendar] Client ID não configurado!');
        console.error('💡 [GoogleCalendar] Configure VITE_GOOGLE_CLIENT_ID no arquivo .env');
        return false;
      }
      
      // Carregar as APIs do Google se não estiverem carregadas
      console.log('📦 [GoogleCalendar] Carregando APIs do Google...');
      await Promise.all([
        this.loadGoogleAPI(),
        this.loadGoogleIdentityServices()
      ]);
      console.log('✅ [GoogleCalendar] APIs carregadas com sucesso');

      this.gapi = window.gapi;

      // Inicializar cliente GAPI
      console.log('🔧 [GoogleCalendar] Inicializando cliente GAPI...');
      await new Promise<void>((resolve, reject) => {
        this.gapi.load('client', async () => {
          try {
            await this.gapi.client.init({
              discoveryDocs: [this.config.discoveryDoc],
            });
            console.log('✅ [GoogleCalendar] Cliente GAPI inicializado');
            resolve();
          } catch (error) {
            console.error('❌ [GoogleCalendar] Erro ao inicializar GAPI client:', error);
            reject(error);
          }
        });
      });

      // Verificar se o Google Identity Services está disponível
      if (!window.google?.accounts?.oauth2) {
        throw new Error('Google Identity Services não carregado');
      }

      // Configurar Token Client para Google Identity Services
      console.log('🔐 [GoogleCalendar] Configurando Token Client...');
      console.log('🔑 [GoogleCalendar] Escopos solicitados:', this.config.scopes);
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: this.config.clientId,
        scope: this.config.scopes,
        callback: (response: { access_token: string; error?: string }) => {
          // Callback será definido dinamicamente no signIn()
          this.isSignedIn = true;
          this.gapi.client.setToken({ access_token: this.accessToken });
          console.log('✅ [GoogleCalendar] Usuário autenticado com sucesso');
        },
      });
      console.log('✅ [GoogleCalendar] Token Client inicializado');

      // Tentar carregar token salvo do localStorage
      const savedToken = this.loadTokenFromStorage();
      if (savedToken) {
        console.log('🔄 [GoogleCalendar] Restaurando sessão salva...');
        this.accessToken = savedToken;
        this.isSignedIn = true;
        this.gapi.client.setToken({ access_token: savedToken });
        console.log('✅ [GoogleCalendar] Sessão restaurada com sucesso!');
      }

      this.isInitialized = true;
      console.log('✅ [GoogleCalendar] Inicialização completa!');
      return true;
    } catch (error) {
      console.error('❌ [GoogleCalendar] Erro ao inicializar API:', error);
      console.error('❌ [GoogleCalendar] Stack trace:', error instanceof Error ? error.stack : 'N/A');
      return false;
    }
  }

  /**
   * Carrega a API do Google dinamicamente
   */
  private loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Falha ao carregar Google API'));
      document.head.appendChild(script);
    });
  }

  /**
   * Carrega o Google Identity Services dinamicamente
   */
  private loadGoogleIdentityServices(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Falha ao carregar Google Identity Services'));
      document.head.appendChild(script);
    });
  }

  /**
   * Autentica o usuário com Google usando Google Identity Services
   */
  async signIn(): Promise<boolean> {
    try {
      console.log('🔄 [GoogleCalendar] Iniciando processo de autenticação...');
      
      // Garantir que o serviço está inicializado
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        throw new Error('Não foi possível inicializar o serviço Google Calendar');
      }

      if (!this.tokenClient) {
        throw new Error('Token client não inicializado');
      }

      console.log('🔐 [GoogleCalendar] Solicitando token de acesso...');
      
      // Solicitar token de acesso
      return new Promise((resolve) => {
        this.tokenClient.callback = (response: { access_token: string; error?: string; expires_in?: number }) => {
          console.log('📝 [GoogleCalendar] Resposta da autenticação:', {
            hasToken: !!response.access_token,
            hasError: !!response.error,
            expiresIn: response.expires_in
          });
          
          if (response.error) {
            console.error('❌ [GoogleCalendar] Erro na autenticação:', response.error);
            resolve(false);
            return;
          }
          
          if (!response.access_token) {
            console.error('❌ [GoogleCalendar] Token de acesso não recebido');
            resolve(false);
            return;
          }
          
          this.accessToken = response.access_token;
          this.isSignedIn = true;
          
          // Salvar token no localStorage para persistência
          const expiresIn = response.expires_in || 3600; // Default 1 hora
          this.saveTokenToStorage(this.accessToken, expiresIn);
          
          // Configurar token no cliente GAPI
          console.log('🔧 [GoogleCalendar] Configurando token no cliente GAPI...');
          this.gapi.client.setToken({ access_token: this.accessToken });
          
          console.log('✅ [GoogleCalendar] Usuário autenticado com sucesso');
          console.log(`🔑 [GoogleCalendar] Token configurado (${this.accessToken.substring(0, 20)}...)`);
          
          // Verificar permissões após autenticação
          this.verifyPermissions();
          
          resolve(true);
        };
        
        this.tokenClient.requestAccessToken();
      });
    } catch (error) {
      console.error('❌ [GoogleCalendar] Erro na autenticação:', error);
      return false;
    }
  }

  /**
   * Desautentica o usuário
   */
  async signOut(): Promise<void> {
    try {
      if (this.accessToken) {
        // Revogar o token de acesso
        window.google?.accounts.oauth2.revoke(this.accessToken, () => {
          console.log('✅ [GoogleCalendar] Token revogado');
        });
        
        this.accessToken = null;
        this.isSignedIn = false;
        
        // Limpar tokens do localStorage
        this.clearTokenFromStorage();
        
        // Limpar token do gapi client
        if (this.gapi?.client) {
          this.gapi.client.setToken(null);
        }
        
        console.log('✅ [GoogleCalendar] Usuário desautenticado');
      }
    } catch (error) {
      console.error('❌ [GoogleCalendar] Erro ao desautenticar:', error);
    }
  }

  /**
   * Cria um evento no Google Calendar
   */
  async createEvent(event: GoogleCalendarEvent): Promise<string | null> {
    try {
      console.log('🔄 [GoogleCalendar] Iniciando criação de evento...');
      
      // Verificar autenticação antes de tentar criar evento
      if (!this.isAuthenticated()) {
        console.log('🔄 [GoogleCalendar] Usuário não autenticado, tentando reautenticar...');
        const reauth = await this.ensureAuthenticated();
        if (!reauth) {
          throw new Error('Não foi possível autenticar o usuário');
        }
      }

      // Garantir que o token está configurado no cliente
      if (this.accessToken && this.gapi?.client) {
        console.log('🔧 [GoogleCalendar] Reconfigurando token no cliente...');
        this.gapi.client.setToken({ access_token: this.accessToken });
      } else {
        console.error('❌ [GoogleCalendar] Token ou cliente GAPI não disponível');
        throw new Error('Token ou cliente GAPI não disponível');
      }

      // Verificar se a API do Calendar está disponível
      if (!this.gapi.client.calendar) {
        console.error('❌ [GoogleCalendar] API do Calendar não inicializada');
        throw new Error('API do Calendar não inicializada');
      }

      console.log('📝 [GoogleCalendar] Criando evento:', {
        summary: event.summary,
        start: event.start.dateTime,
        end: event.end.dateTime,
        description: event.description
      });

      const response = await this.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });

      console.log('✅ [GoogleCalendar] Evento criado com sucesso:', response.result.id);
      return response.result.id || null;
    } catch (error: unknown) {
      console.error('❌ [GoogleCalendar] Erro ao criar evento:', error);
      
      // Verificar se é um erro da API do Google
      if (isGoogleApiError(error)) {
        // Tratamento específico para erro 403 (Forbidden)
        if (error.status === 403) {
          console.error('🚫 [GoogleCalendar] Erro 403 - Permissões insuficientes ou token inválido');
          console.error('📝 [GoogleCalendar] DIAGNÓSTICO DETALHADO:');
          console.error('   • Client ID usado:', this.config.clientId);
          console.error('   • Escopos solicitados:', this.config.scopes);
          console.error('   • Domínio atual:', window.location.origin);
          console.error('   • Verifique no Google Console se:');
          console.error('     1. O Client ID está correto');
          console.error('     2. Este domínio está nas "Origens JavaScript autorizadas"');
          console.error('     3. A API Google Calendar está habilitada');
          console.error('     4. Os escopos de OAuth estão configurados corretamente');
          console.error('🔑 [GoogleCalendar] Tentando reautenticar...');
          
          // Tentar reautenticar e tentar novamente
          try {
            const reauth = await this.ensureAuthenticated();
            if (reauth && this.gapi?.client) {
              this.gapi.client.setToken({ access_token: this.accessToken });
              console.log('🔄 [GoogleCalendar] Tentando criar evento novamente após reautenticação...');
              
              const retryResponse = await this.gapi.client.calendar.events.insert({
                calendarId: 'primary',
                resource: event
              });
              
              console.log('✅ [GoogleCalendar] Evento criado após reautenticação:', retryResponse.result.id);
              return retryResponse.result.id || null;
            }
          } catch (retryError) {
            console.error('❌ [GoogleCalendar] Falha na tentativa de reautenticação:', retryError);
          }
        }
        
        // Log detalhado do erro para debug
        if (error.result?.error) {
          console.error('📝 [GoogleCalendar] Detalhes do erro:', {
            code: error.result.error.code,
            message: error.result.error.message,
            status: error.status
          });
        }
      } else {
        // Erro genérico
        console.error('❌ [GoogleCalendar] Erro desconhecido:', error);
      }
      
      return null;
    }
  }

  /**
   * Lista eventos do Google Calendar
   */
  async listEvents(timeMin?: string, timeMax?: string): Promise<GoogleCalendarEvent[]> {
    try {
      if (!this.isSignedIn) {
        throw new Error('Usuário não autenticado');
      }

      const response = await this.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax,

        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.result.items || [];
    } catch (error) {
      console.error('❌ [GoogleCalendar] Erro ao listar eventos:', error);
      return [];
    }
  }

  /**
   * Atualiza um evento no Google Calendar
   */
  async updateEvent(eventId: string, event: Partial<GoogleCalendarEvent>): Promise<boolean> {
    try {
      if (!this.isSignedIn) {
        throw new Error('Usuário não autenticado');
      }

      await this.gapi.client.calendar.events.patch({
        calendarId: 'primary',
        eventId: eventId,
        resource: event
      });

      console.log('✅ [GoogleCalendar] Evento atualizado:', eventId);
      return true;
    } catch (error) {
      console.error('❌ [GoogleCalendar] Erro ao atualizar evento:', error);
      return false;
    }
  }

  /**
   * Exclui um evento do Google Calendar
   */
  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      if (!this.isSignedIn) {
        throw new Error('Usuário não autenticado');
      }

      await this.gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
      });

      console.log('✅ [GoogleCalendar] Evento excluído:', eventId);
      return true;
    } catch (error) {
      console.error('❌ [GoogleCalendar] Erro ao excluir evento:', error);
      return false;
    }
  }

  /**
   * Verifica se o usuário está autenticado e se o token é válido
   */
  isAuthenticated(): boolean {
    const hasToken = !!this.accessToken;
    const isSignedIn = this.isSignedIn;
    
    console.log(`🔐 [GoogleCalendar] Verificação de autenticação:`);
    console.log(`   - Token presente: ${hasToken}`);
    console.log(`   - Status signedIn: ${isSignedIn}`);
    
    if (hasToken) {
      console.log(`   - Token (primeiros 20 chars): ${this.accessToken?.substring(0, 20)}...`);
    }
    
    return hasToken && isSignedIn;
  }

  /**
   * Garante que o serviço está inicializado
   */
  async ensureInitialized(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    console.log('🔄 [GoogleCalendar] Serviço não inicializado, inicializando...');
    try {
      const success = await this.initialize();
      if (success) {
        console.log('✅ [GoogleCalendar] Serviço inicializado com sucesso');
        return true;
      } else {
        console.error('❌ [GoogleCalendar] Falha na inicialização do serviço');
        return false;
      }
    } catch (error) {
      console.error('❌ [GoogleCalendar] Erro durante inicialização:', error);
      return false;
    }
  }

  /**
   * Reautentica o usuário se necessário
   */
  async ensureAuthenticated(): Promise<boolean> {
    // Primeiro garantir que o serviço está inicializado
    const initialized = await this.ensureInitialized();
    if (!initialized) {
      console.error('❌ [GoogleCalendar] Não foi possível inicializar o serviço');
      return false;
    }

    if (this.isAuthenticated()) {
      console.log('✅ [GoogleCalendar] Usuário já autenticado');
      return true;
    }

    console.log('🔄 [GoogleCalendar] Usuário não autenticado, tentando reautenticar...');
    try {
      const success = await this.signIn();
      if (success) {
        console.log('✅ [GoogleCalendar] Reautenticação bem-sucedida');
        return true;
      } else {
        console.error('❌ [GoogleCalendar] Falha na reautenticação');
        return false;
      }
    } catch (error) {
      console.error('❌ [GoogleCalendar] Erro durante reautenticação:', error);
      return false;
    }
  }

  /**
   * Verifica as permissões do usuário após autenticação
   */
  private async verifyPermissions(): Promise<void> {
    try {
      console.log('🔍 [GoogleCalendar] Verificando permissões...');
      
      // Tentar listar calendários para verificar permissões
      const response = await this.gapi.client.calendar.calendarList.list({
        maxResults: 1
      });
      
      if (response.result.items && response.result.items.length > 0) {
        console.log('✅ [GoogleCalendar] Permissões verificadas - acesso aos calendários OK');
        console.log('📅 [GoogleCalendar] Calendário primário:', response.result.items[0].summary);
      } else {
        console.warn('⚠️ [GoogleCalendar] Nenhum calendário encontrado');
      }
    } catch (error) {
      console.error('❌ [GoogleCalendar] Erro ao verificar permissões:', error);
      
      if (isGoogleApiError(error)) {
        if (error.status === 403) {
          console.error('🚫 [GoogleCalendar] DIAGNÓSTICO - Erro 403:');
          console.error('   1. Verifique se o Client ID está correto');
          console.error('   2. Verifique se o domínio está autorizado no Google Console');
          console.error('   3. Verifique se a API do Google Calendar está habilitada');
          console.error('   4. Verifique se os escopos estão corretos');
          console.error('   5. Tente revogar e reautorizar a aplicação');
        } else if (error.status === 401) {
          console.error('🔐 [GoogleCalendar] DIAGNÓSTICO - Erro 401: Token inválido ou expirado');
        }
      }
    }
  }

  /**
   * Sincroniza eventos do APROVA.AE com Google Calendar
   * Usa sincronização direta para maior confiabilidade
   */
  async syncEvents(localEvents: SimplifiedEvent[]): Promise<{ success: number; failed: number }> {
    console.log(`🔄 [GoogleCalendar] Iniciando sincronização direta de ${localEvents.length} eventos`);
    
    // Garantir que o usuário está autenticado
    const isAuthenticated = await this.ensureAuthenticated();
    if (!isAuthenticated) {
      console.error('❌ [GoogleCalendar] Não foi possível autenticar o usuário');
      throw new Error('Não foi possível autenticar com Google Calendar');
    }

    // Verificar se a API está inicializada
    if (!this.gapi || !this.gapi.client || !this.gapi.client.calendar) {
      console.error('❌ [GoogleCalendar] API do Google Calendar não inicializada');
      throw new Error('API do Google Calendar não inicializada');
    }

    // Configurar o token no cliente GAPI
    if (this.accessToken) {
      console.log('🔑 [GoogleCalendar] Configurando token no cliente GAPI...');
      this.gapi.client.setToken({ access_token: this.accessToken });
    }

    return await this.syncEventsDirect(localEvents);
  }

  /**
   * Sincronização direta com Google Calendar
   */
  private async syncEventsDirect(localEvents: SimplifiedEvent[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    console.log(`🔄 [GoogleCalendar] Iniciando sincronização direta de ${localEvents.length} eventos`);
    console.log(`🔑 [GoogleCalendar] Token de acesso disponível:`, !!this.accessToken);
    console.log(`🔐 [GoogleCalendar] Status de autenticação:`, this.isSignedIn);

    for (let i = 0; i < localEvents.length; i++) {
      const localEvent = localEvents[i];
      
      try {
        console.log(`📅 [GoogleCalendar] Processando evento ${i + 1}/${localEvents.length}: "${localEvent.title}"`);
        
        // Validar dados do evento
        if (!localEvent.title || !localEvent.start_date || !localEvent.end_date) {
          throw new Error(`Dados do evento inválidos: ${JSON.stringify({ title: localEvent.title, start_date: localEvent.start_date, end_date: localEvent.end_date })}`);
        }

        const googleEvent: GoogleCalendarEvent = {
          summary: localEvent.title,
          description: `${localEvent.description || 'Sem descrição'}\n\nMatéria: ${localEvent.subject || 'Não especificada'}\nTópico: ${localEvent.topic || 'Não especificado'}\n\nCriado pelo APROVA.AE`,
          start: {
            dateTime: localEvent.start_date,
            timeZone: 'America/Sao_Paulo'
          },
          end: {
            dateTime: localEvent.end_date,
            timeZone: 'America/Sao_Paulo'
          },
          colorId: this.getGoogleColorId(localEvent.color)
        };

        console.log(`📝 [GoogleCalendar] Dados do evento Google:`, {
          summary: googleEvent.summary,
          start: googleEvent.start.dateTime,
          end: googleEvent.end.dateTime,
          colorId: googleEvent.colorId
        });

        const eventId = await this.createEvent(googleEvent);
        if (eventId) {
          console.log(`✅ [GoogleCalendar] Evento criado com sucesso: ${eventId}`);
          success++;
        } else {
          console.error(`❌ [GoogleCalendar] Falha ao criar evento: ${localEvent.title}`);
          errors.push(`Falha ao criar evento: ${localEvent.title}`);
          failed++;
        }

        // Delay entre criações para evitar rate limiting
        if (i < localEvents.length - 1) {
          console.log(`⏳ [GoogleCalendar] Aguardando 200ms antes do próximo evento...`);
          await new Promise(resolve => setTimeout(resolve, 200));
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ [GoogleCalendar] Erro ao sincronizar evento "${localEvent.title}":`, errorMessage);
        errors.push(`${localEvent.title}: ${errorMessage}`);
        failed++;
      }
    }

    console.log(`🎯 [GoogleCalendar] Sincronização direta concluída:`);
    console.log(`   ✅ Sucessos: ${success}`);
    console.log(`   ❌ Falhas: ${failed}`);
    
    if (errors.length > 0) {
      console.log(`📋 [GoogleCalendar] Detalhes dos erros:`);
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }

    return { success, failed };
  }

  /**
   * Testa a conectividade com o Google Calendar
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🗺️ [GoogleCalendar] Testando conectividade...');
      
      // Garantir autenticação
      const authenticated = await this.ensureAuthenticated();
      if (!authenticated) {
        return {
          success: false,
          message: 'Não foi possível autenticar com Google Calendar'
        };
      }

      // Tentar listar calendários para testar permissões
      const response = await this.gapi.client.calendar.events.list({
        calendarId: 'primary',
        maxResults: 1,
        singleEvents: true,
        orderBy: 'startTime'
      });

      console.log('✅ [GoogleCalendar] Teste de conectividade bem-sucedido');
      return {
        success: true,
        message: 'Conexão com Google Calendar estabelecida com sucesso'
      };
    } catch (error) {
      console.error('❌ [GoogleCalendar] Falha no teste de conectividade:', error);
      
      if (isGoogleApiError(error)) {
        if (error.status === 403) {
          return {
            success: false,
            message: 'Permissões insuficientes. Verifique se o aplicativo tem acesso ao Google Calendar.'
          };
        } else if (error.status === 401) {
          return {
            success: false,
            message: 'Token de autenticação inválido. Tente fazer login novamente.'
          };
        }
      }
      
      return {
        success: false,
        message: 'Erro de conectividade com Google Calendar. Verifique sua conexão com a internet.'
      };
    }
  }

  /**
   * Converte cor do APROVA.AE para ID de cor do Google Calendar
   */
  private getGoogleColorId(hexColor: string): string {
    // Mapeamento básico de cores hex para IDs do Google Calendar
    const colorMap: { [key: string]: string } = {
      '#3b82f6': '1', // Azul
      '#10b981': '2', // Verde
      '#f59e0b': '5', // Amarelo
      '#ef4444': '4', // Vermelho
      '#8b5cf6': '3', // Roxo
      '#f97316': '6', // Laranja
      '#06b6d4': '7', // Ciano
      '#84cc16': '2', // Verde lima
    };

    return colorMap[hexColor] || '1'; // Default azul
  }
}

// Instância singleton
export const googleCalendarService = new GoogleCalendarService();

// Métodos públicos para facilitar o uso
export const testGoogleCalendarConnection = () => googleCalendarService.testConnection();
export const initializeGoogleCalendar = () => googleCalendarService.initialize();
export const signInToGoogleCalendar = () => googleCalendarService.signIn();
export const signOutFromGoogleCalendar = () => googleCalendarService.signOut();


