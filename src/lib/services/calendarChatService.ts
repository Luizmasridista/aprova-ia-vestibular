import { geminiProvider, deepSeekProvider } from './aiProviders';
import { CalendarEvent } from './calendarService';

export interface GenerateChatRequest {
  message: string;
  mode: 'APRU_1b' | 'APRU_REASONING';
  events: CalendarEvent[];
  userId: string;
  currentDate?: string; // Data de referência para cálculos relativos (hoje)
}

export interface SuggestedEvent {
  subject: string; 
  // Adicione outras propriedades necessárias para um evento sugerido
}

export interface SuggestedSchedule {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  events: Array<{
    title: string;
    subject: string;
    date: string;
    duration: number; // em minutos
    type: 'study' | 'review' | 'exam' | 'break';
    priority?: 1 | 2 | 3;
  }>;
  totalStudyHours: number;
  subjects: string[];
}

export type IntentType = 
  | 'general_chat' 
  | 'schedule_event' 
  | 'create_schedule' 
  | 'direct_create_event' 
  | 'edit_event' 
  | 'list_events'
  | 'analyze_progress'
  | 'create_event'
  | 'delete_event'
  | 'delete_all_events'
  | 'delete_week_events';

export interface DateContext {
  targetDate?: string; // Data ISO do alvo (hoje/amanhã/etc)
  dateDescription: string; // Descrição amigável (hoje/amanhã/etc)
  startDate?: string; // Início do intervalo (para semana/mês)
  endDate?: string; // Fim do intervalo (para semana/mês)
}

export interface ChatResponse {
  response: string;
  intent: IntentType;
  suggestedEvent?: SuggestedEvent;
  suggestedSchedule?: SuggestedSchedule;
  dateContext?: DateContext; // Contexto de data processado
}

class CalendarChatService {
  /**
   * Extrai o contexto de data da mensagem do usuário
   */
  private extractDateContext(message: string, currentDate: Date = new Date()): DateContext {
    const lowerMessage = message.toLowerCase();
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(tomorrow.getDate() + 1);

    // Configuração para cálculos de semana
    const currentDay = today.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay); // Domingo da semana atual
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado da semana atual
    
    // Próxima semana
    const startOfNextWeek = new Date(startOfWeek);
    startOfNextWeek.setDate(startOfWeek.getDate() + 7);
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
    
    // Mês atual
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // Próximo mês
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const startOfNextMonth = new Date(nextMonth);
    const endOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);

    // Verifica padrões de data na mensagem
    
    // Hoje
    if (/(hoje|hj|dia de hoje)/i.test(lowerMessage)) {
      return {
        targetDate: today.toISOString(),
        dateDescription: 'hoje',
        startDate: today.toISOString(),
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
      };
    } 
    
    // Amanhã
    if (/(amanhã|amanha|dia seguinte)/i.test(lowerMessage)) {
      return {
        targetDate: tomorrow.toISOString(),
        dateDescription: 'amanhã',
        startDate: tomorrow.toISOString(),
        endDate: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString()
      };
    }
    
    // Depois de amanhã
    if (/(depois de amanhã|depois de amanha|dia seguinte ao de amanhã)/i.test(lowerMessage)) {
      return {
        targetDate: dayAfterTomorrow.toISOString(),
        dateDescription: 'depois de amanhã',
        startDate: dayAfterTomorrow.toISOString(),
        endDate: new Date(dayAfterTomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString()
      };
    }
    
    // Esta semana
    if (/(semana|dias da semana|próximos dias|esta semana)/i.test(lowerMessage)) {
      return {
        dateDescription: 'esta semana',
        startDate: today.toISOString(),
        endDate: endOfWeek.toISOString()
      };
    }
    
    // Próxima semana
    if (/(próxima semana|semana que vem|semana seguinte)/i.test(lowerMessage)) {
      return {
        dateDescription: 'próxima semana',
        startDate: startOfNextWeek.toISOString(),
        endDate: endOfNextWeek.toISOString()
      };
    }
    
    // Este mês
    if (/(mês atual|este mês|mês corrente)/i.test(lowerMessage)) {
      return {
        dateDescription: 'este mês',
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString()
      };
    }
    
    // Próximo mês
    if (/(próximo mês|mês que vem|mês seguinte)/i.test(lowerMessage)) {
      return {
        dateDescription: 'próximo mês',
        startDate: startOfNextMonth.toISOString(),
        endDate: endOfNextMonth.toISOString()
      };
    }
    
    // Dias específicos da semana (segunda, terça, etc.)
    const weekdays = [
      { pattern: /(segunda|segunda-feira|segunda feira)/i, day: 1, name: 'segunda-feira' },
      { pattern: /(terça|terca|terça-feira|terca feira)/i, day: 2, name: 'terça-feira' },
      { pattern: /(quarta|quarta-feira|quarta feira)/i, day: 3, name: 'quarta-feira' },
      { pattern: /(quinta|quinta-feira|quinta feira)/i, day: 4, name: 'quinta-feira' },
      { pattern: /(sexta|sexta-feira|sexta feira)/i, day: 5, name: 'sexta-feira' },
      { pattern: /sábado/i, day: 6, name: 'sábado' },
      { pattern: /domingo/i, day: 0, name: 'domingo' }
    ];
    
    for (const { pattern, day, name } of weekdays) {
      if (pattern.test(lowerMessage)) {
        const targetDate = new Date(today);
        const daysUntilTarget = (day - currentDay + 7) % 7;
        targetDate.setDate(today.getDate() + daysUntilTarget);
        
        return {
          targetDate: targetDate.toISOString(),
          dateDescription: name,
          startDate: targetDate.toISOString(),
          endDate: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000).toISOString()
        };
      }
    }

    // Padrão não reconhecido
    return { dateDescription: '' };
  }

  /**
   * Filtra eventos por intervalo de datas
   */
  private filterEventsByDateRange(events: CalendarEvent[], startDate: string, endDate: string): CalendarEvent[] {
    // Garante que as datas estão no fuso horário local
    const normalizeDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    };
    
    const start = normalizeDate(startDate);
    const end = normalizeDate(endDate);
    
    console.log(` [filterEventsByDateRange] Filtrando eventos entre ${start.toISOString()} e ${end.toISOString()}`);
    
    return events.filter(event => {
      const eventDate = normalizeDate(event.start_date);
      const isInRange = eventDate >= start && eventDate < end;
      
      if (isInRange) {
        console.log(` [filterEventsByDateRange] Evento incluído: ${event.title} (${eventDate.toISOString()})`);
      }
      
      return isInRange;
    });
  }

  /**
   * Constrói o prompt para a IA com base no contexto
   */
  private buildPrompt(req: GenerateChatRequest, dateContext: DateContext = { dateDescription: '' }): string {
    const completed = req.events.filter(e => e.status === 'completed').length;
    const total = req.events.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const now = new Date();
    
    // Formata a lista de eventos para o prompt
    const formatEvent = (event: CalendarEvent) => {
      const eventDate = new Date(event.start_date);
      const dateStr = eventDate.toLocaleDateString('pt-BR', { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short'
      });
      const timeStr = eventDate.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
      const status = event.status === 'completed' ? '✅' : '📅';
      return `${status} ${event.title} (${dateStr} às ${timeStr})`;
    };
    
    // Limitar o número de eventos incluídos no prompt
    const maxEventsToShow = 8;
    let eventsList = '';
    if (req.events.length > 0) {
      const relevantEvents = req.events.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
      const limitedEvents = relevantEvents.slice(0, maxEventsToShow);
      eventsList = `\n📋 **Seus eventos:**\n${limitedEvents.map(formatEvent).join('\n')}`;
      if (relevantEvents.length > maxEventsToShow) {
        eventsList += `\n(+ ${relevantEvents.length - maxEventsToShow} outros eventos)`;
      }
    } else {
      eventsList = `\n📋 **Seus eventos:** Nenhum evento agendado ainda.`;
    }
    
    const modePersonality = req.mode === 'APRU_1b' 
      ? 'Você é o APRU 1b, um assistente de estudos rápido e eficiente. Seja direto, amigável e motivador.'
      : 'Você é o APRU REASONING, um assistente de estudos analítico e detalhado. Forneça análises profundas e conselhos estratégicos.';
    
    const dateContextInfo = dateContext.dateDescription 
      ? `\n🗓️ **Contexto:** ${dateContext.dateDescription}` 
      : '';
    
    return `${modePersonality}

📊 **Situação atual:**
- Hoje: ${now.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })}
- Progresso: ${completed}/${total} atividades (${completionRate}%)${dateContextInfo}${eventsList}

💬 **Mensagem:** "${req.message}"

**IMPORTANTE:**
- Responda de forma NATURAL e CONVERSACIONAL
- Use no MÁXIMO 2-3 frases curtas
- Seja específico sobre os eventos do usuário
- Use emojis com moderação (1-2 por resposta)
- Se não souber algo específico, seja honesto
- Mantenha o foco nos estudos e organização
- Evite respostas genéricas ou "coisas nada a ver"`;
  }

  async generateChatResponse(req: GenerateChatRequest): Promise<ChatResponse> {
    console.log(' [generateChatResponse] Iniciando processamento da mensagem:', req.message);
    
    // Extrai o contexto de data da mensagem
    const referenceDate = req.currentDate ? new Date(req.currentDate) : new Date();
    console.log(' [generateChatResponse] Data de referência:', referenceDate.toISOString());
    
    const dateContext = this.extractDateContext(req.message, referenceDate);
    console.log(' [generateChatResponse] Contexto de data extraído:', {
      dateDescription: dateContext.dateDescription,
      startDate: dateContext.startDate,
      endDate: dateContext.endDate,
      targetDate: dateContext.targetDate
    });
    
    // Filtra eventos com base no contexto de data
    let relevantEvents = req.events;
    if (dateContext.startDate && dateContext.endDate) {
      relevantEvents = this.filterEventsByDateRange(req.events, dateContext.startDate, dateContext.endDate);
      console.log(` [generateChatResponse] Eventos filtrados para ${dateContext.dateDescription}: ${relevantEvents.length} eventos encontrados`);
    }
    
    // Constrói o prompt para a IA
    const prompt = this.buildPrompt({
      ...req,
      events: relevantEvents
    }, dateContext);
    console.log(' [generateChatResponse] Prompt construído com sucesso');
    
    // Seleciona o provedor de IA baseado no modo
    const geminiProviderInstance = geminiProvider;
    const deepSeekProviderInstance = deepSeekProvider;
    
    // Determina a intenção baseada no contexto e na mensagem
    let intent: IntentType = 'general_chat';
    const lowerMessage = req.message.toLowerCase();
    
    console.log('🔍 [calendarChatService] Analisando intenção da mensagem:', lowerMessage);
    
    // Detecção de intenção de criação de evento - MAIS ESPECÍFICA
    if (
      // Comandos diretos de criação
      lowerMessage.includes('criar') || 
      lowerMessage.includes('agendar') || 
      lowerMessage.includes('marcar') || 
      lowerMessage.includes('adicionar') ||
      lowerMessage.includes('pode criar') ||
      lowerMessage.includes('sim, crie') ||
      lowerMessage.includes('sim, pode criar') ||
      lowerMessage.includes('sim, agende') ||
      lowerMessage.includes('pode agendar') ||
      lowerMessage.includes('vamos agendar') ||
      lowerMessage.includes('aceito agendar') ||
      lowerMessage.includes('confirmo agendamento') ||
      lowerMessage.includes('quero agendar') ||
      lowerMessage.includes('cria uma') ||
      lowerMessage.includes('crie uma') ||
      // Apenas "sim" ou "ok" muito específicos para agendamento
      (lowerMessage.match(/^(sim|ok|certo|confirmo|aceito|vamos)$/i) && req.message.length <= 10)
    ) {
      intent = 'create_event';
      console.log('✅ [calendarChatService] Detectada intenção de criar evento');
    }
    // Detecção de intenção de exclusão de TODOS os eventos - deve vir ANTES da detecção geral
    else if (
      (lowerMessage.includes('todos') || lowerMessage.includes('todas')) && 
      (lowerMessage.includes('excluir') || lowerMessage.includes('deletar') || 
       lowerMessage.includes('remover') || lowerMessage.includes('apagar') || 
       lowerMessage.includes('limpar')) && 
      (lowerMessage.includes('eventos') || lowerMessage.includes('atividades') || 
       lowerMessage.includes('agenda') || lowerMessage.includes('calendário') ||
       lowerMessage.includes('calendario'))
    ) {
      intent = 'delete_all_events';
      console.log('🗑️ [calendarChatService] Detectada intenção de excluir TODOS os eventos');
    }
    // Detecção de intenção de exclusão
    else if (
      lowerMessage.includes('excluir') || 
      lowerMessage.includes('deletar') || 
      lowerMessage.includes('remover') || 
      lowerMessage.includes('apagar') ||
      lowerMessage.includes('cancelar') ||
      lowerMessage.includes('excluia') ||
      lowerMessage.includes('remova') ||
      lowerMessage.includes('pode remover') ||
      lowerMessage.includes('exclua')
    ) {
      intent = 'delete_event';
      console.log('✅ [calendarChatService] Detectada intenção de excluir evento');
    }
    // Detecção de intenção de edição
    else if (
      lowerMessage.includes('editar') || 
      lowerMessage.includes('alterar') || 
      lowerMessage.includes('modificar') || 
      lowerMessage.includes('mudar') ||
      lowerMessage.includes('trocar') ||
      lowerMessage.includes('reagendar')
    ) {
      intent = 'edit_event';
      console.log('✅ [calendarChatService] Detectada intenção de editar evento');
    }
    // Detecção de intenção de listar eventos
    else if (
      lowerMessage.includes('quais') ||
      lowerMessage.includes('listar') ||
      lowerMessage.includes('mostrar') ||
      lowerMessage.includes('ver') ||
      lowerMessage.includes('atividades') ||
      lowerMessage.includes('eventos') ||
      lowerMessage.includes('agenda') ||
      lowerMessage.includes('calendário') ||
      lowerMessage.includes('calendario') ||
      dateContext.dateDescription
    ) {
      intent = 'list_events';
      console.log('✅ [calendarChatService] Detectada intenção de listar eventos');
    }
    
    console.log('🔍 [calendarChatService] Intenção final detectada:', intent);
    
    try {
      const content = req.mode === 'APRU_1b'
        ? await geminiProviderInstance.generate(prompt)
        : await deepSeekProviderInstance.generate(prompt);
      
      console.log(' [generateChatResponse] Resposta da IA obtida com sucesso');
      
      return { 
        response: content, 
        intent,
        dateContext
      };
    } catch (error) {
      console.error(' [generateChatResponse] Erro ao chamar o provedor de IA:', error);
      throw error;
    }
  }
}

export const calendarChatService = new CalendarChatService();
