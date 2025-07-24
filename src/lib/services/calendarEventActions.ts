import { CalendarEvent, CreateEventRequest } from './calendarService';
import { getSubjectColor, analyzeProgress } from '@/lib/utils/calendarChatUtils';

// Interface para itens do cronograma
interface ScheduleItem {
  title: string;
  description?: string;
  start_date: string;  // Formato ISO 8601: 'YYYY-MM-DD'
  end_date: string;    // Formato ISO 8601: 'YYYY-MM-DD'
  startTime: string;   // Hora de início no formato 'HH:MM:SS'
  endTime: string;     // Hora de término no formato 'HH:MM:SS'
  event_type: 'study' | 'exam' | 'review' | 'break';
  subject?: string;
  topic?: string;
  color?: string;
  priority?: 1 | 2 | 3;
  reminder_minutes?: number;
}

/**
 * Interface para os callbacks de ações de eventos do calendário
 */
export interface EventActionCallbacks {
  /** Callback chamado quando um novo evento é criado */
  onCreateEvent: (eventData: CreateEventRequest) => Promise<void>;
  
  /** Callback opcional chamado quando um evento é atualizado */
  onUpdateEvent?: (eventId: string, updates: Partial<CalendarEvent>) => Promise<void>;
  
  /** Callback opcional chamado quando um evento é excluído */
  onDeleteEvent?: (eventId: string) => Promise<void>;
  
  /** Callback chamado para exibir mensagens de celebração */
  onCelebration: (message: string) => void;
}

/**
 * Classe responsável por gerenciar ações relacionadas a eventos do calendário
 */
export class CalendarEventActions {
  private callbacks: EventActionCallbacks;

  /**
   * Cria uma nova instância do gerenciador de ações do calendário
   * @param callbacks Objeto com funções de callback para ações de eventos
   */
  constructor(callbacks: EventActionCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Cria um novo evento agendado automaticamente
   * @param events Lista de eventos existentes para análise
   * @param subject Matéria do evento (opcional)
   * @param targetDate Data alvo para o evento (opcional)
   * @returns Promessa que resolve para true se o evento foi criado com sucesso
   */
  async createScheduledEvent(events: CalendarEvent[], subject?: string, targetDate?: Date): Promise<boolean> {
    console.log('📅 [CalendarEventActions] createScheduledEvent chamado:', {
      subject,
      targetDate: targetDate?.toLocaleDateString('pt-BR'),
      hasCreateCallback: !!this.callbacks.onCreateEvent
    });
    
    // Verificar se o callback de criação existe
    if (!this.callbacks.onCreateEvent) {
      console.error('❌ [CalendarEventActions] Callback onCreateEvent não disponível!');
      return false;
    }
    
    const progress = analyzeProgress(events);
    const targetSubject = subject || progress.leastStudiedSubject || 'Revisão Geral';
    
    // Usar data específica ou calcular horário padrão
    let startTime: Date;
    let endTime: Date;
    
    if (targetDate) {
      // Usar data específica com horário padrão (14h-16h)
      startTime = new Date(targetDate);
      startTime.setHours(14, 0, 0, 0);
      endTime = new Date(targetDate);
      endTime.setHours(16, 0, 0, 0);
    } else {
      // Calcular horário para hoje à tarde (14h-16h)
      const today = new Date();
      startTime = new Date(today);
      startTime.setHours(14, 0, 0, 0);
      endTime = new Date(today);
      endTime.setHours(16, 0, 0, 0);
      
      // Se já passou das 14h, agendar para amanhã
      if (new Date().getHours() >= 14) {
        startTime.setDate(startTime.getDate() + 1);
        endTime.setDate(endTime.getDate() + 1);
      }
    }
    
    // Criar objeto de evento com todos os campos obrigatórios
    const eventData: CreateEventRequest = {
      title: `Revisão de ${targetSubject}`,
      description: `Sessão de estudos criada pelo assistente APRU para reforçar conhecimentos em ${targetSubject}`,
      start_date: startTime.toISOString(),
      end_date: endTime.toISOString(),
      subject: targetSubject,
      topic: 'Revisão e exercícios',
      color: getSubjectColor(targetSubject),
      priority: 2,
      event_type: 'study',
      all_day: false
    };
    
    try {
      // Log detalhado do objeto de evento
      console.log('📝 [CalendarEventActions] Criando evento:', JSON.stringify(eventData, null, 2));
      
      // Verificar campos obrigatórios antes de chamar o callback
      if (!eventData.title || !eventData.start_date || !eventData.end_date || !eventData.event_type) {
        console.error('❌ [CalendarEventActions] Dados de evento incompletos:', JSON.stringify(eventData, null, 2));
        return false;
      }
      
      // Chamar o callback para criar o evento
      await this.callbacks.onCreateEvent(eventData);
      
      // Disparar animação de celebração
      const timeDescription = targetDate 
        ? `${targetDate.getDate()}/${targetDate.getMonth() + 1}`
        : (new Date().getHours() >= 14 ? 'amanhã' : 'hoje');
      
      console.log('🎉 [CalendarEventActions] Evento criado com sucesso, disparando celebração');
      this.callbacks.onCelebration(`🎉 ${targetSubject} agendado para ${timeDescription} às 14h!`);
      
      return true;
    } catch (error) {
      console.error('❌ [CalendarEventActions] Erro ao criar evento:', error);
      console.error('Detalhes do erro:', error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  // Criar múltiplos eventos a partir de cronograma
  async createScheduleEvents(schedule: ScheduleItem[]): Promise<{ successCount: number; failCount: number; total: number }> {
    let successCount = 0;
    let failCount = 0;
    
    console.log('📅 [CalendarEventActions] Criando cronograma com', schedule.length, 'atividades...');
    
    // Verificar se o callback de criação existe
    if (!this.callbacks.onCreateEvent) {
      console.error('❌ [CalendarEventActions] Callback onCreateEvent não disponível para createScheduleEvents!');
      return { successCount: 0, failCount: schedule.length, total: schedule.length };
    }
    
    for (const activity of schedule) {
      try {
        console.log('📝 [CalendarEventActions] Processando atividade:', activity.title);
        
        // Validar campos obrigatórios
        if (!activity.startTime || !activity.endTime) {
          console.error('❌ [CalendarEventActions] Atividade sem data/hora válida:', activity.title);
          failCount++;
          continue;
        }
        
        const eventData: CreateEventRequest = {
          title: activity.title || `Sessão de ${activity.subject || 'Estudos'}`,
          description: activity.description || `Sessão de estudos de ${activity.subject || 'Revisão Geral'}`,
          start_date: activity.startTime,
          end_date: activity.endTime,
          subject: activity.subject || 'Revisão Geral',
          topic: activity.topic || 'Estudos programados',
          color: activity.color || getSubjectColor(activity.subject || 'outros'),
          priority: activity.priority || 2,
          event_type: activity.event_type || 'study',
          all_day: false // Valor padrão fixo, já que ScheduleItem não tem propriedade all_day
        };
        
        // Log detalhado do objeto de evento
        console.log('📝 [CalendarEventActions] Criando evento do cronograma:', JSON.stringify(eventData, null, 2));
        
        // Chamar o callback para criar o evento
        await this.callbacks.onCreateEvent(eventData);
        successCount++;
        console.log('✅ [CalendarEventActions] Evento criado com sucesso:', activity.title);
        
        // Pequeno delay entre criações para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error: unknown) {
        console.error('❌ [CalendarEventActions] Erro ao criar evento:', activity.title);
        console.error('Detalhes do erro:', error instanceof Error ? error.message : String(error));
        failCount++;
      }
    }
    
    // Disparar animação de celebração para cronograma
    if (successCount > 0) {
      const message = successCount === schedule.length
        ? `🎉 Cronograma completo criado! ${successCount} atividades agendadas com sucesso!`
        : `🎆 Cronograma parcialmente criado! ${successCount} de ${schedule.length} atividades agendadas.`;
      
      console.log('🎉 [CalendarEventActions] Disparando celebração para cronograma:', message);
      this.callbacks.onCelebration(message);
    } else {
      console.error('❌ [CalendarEventActions] Nenhum evento do cronograma foi criado com sucesso.');
    }
    
    return {
      successCount,
      failCount,
      total: schedule.length
    };
  }

  // Excluir evento
  async deleteEvent(eventId: string): Promise<boolean> {
    console.log('🗑️ [CalendarEventActions] deleteEvent chamado:', {
      eventId,
      hasDeleteCallback: !!this.callbacks.onDeleteEvent
    });
    
    if (!this.callbacks.onDeleteEvent) {
      console.error('❌ [CalendarEventActions] Callback onDeleteEvent não disponível');
      return false;
    }
    
    try {
      console.log('🗑️ [CalendarEventActions] Excluindo evento ID:', eventId);
      await this.callbacks.onDeleteEvent(eventId);
      console.log('✅ [CalendarEventActions] Evento excluído, disparando celebração');
      this.callbacks.onCelebration('🗑️ Evento excluído com sucesso!');
      return true;
    } catch (error) {
      console.error('❌ [CalendarEventActions] Erro ao excluir evento:', error);
      return false;
    }
  }

  // Excluir múltiplos eventos por matéria
  async deleteEventsBySubject(events: CalendarEvent[], subject: string): Promise<{ successCount: number; failCount: number; total: number }> {
    if (!this.callbacks.onDeleteEvent) {
      return { successCount: 0, failCount: 0, total: 0 };
    }
    
    const eventsToDelete = events.filter(event => 
      event.subject?.toLowerCase().includes(subject.toLowerCase()) ||
      event.title.toLowerCase().includes(subject.toLowerCase())
    );
    
    let successCount = 0;
    let failCount = 0;
    
    console.log(`🗑️ [CalendarEventActions] Excluindo ${eventsToDelete.length} eventos de ${subject}...`);
    
    for (const event of eventsToDelete) {
      try {
        await this.callbacks.onDeleteEvent(event.id);
        successCount++;
        console.log('✅ [CalendarEventActions] Evento excluído:', event.title);
        
        // Pequeno delay entre exclusões para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error: unknown) {
        console.error('❌ [CalendarEventActions] Erro ao excluir evento:', event.title, error);
        failCount++;
      }
    }
    
    // Disparar animação de celebração
    if (successCount > 0) {
      this.callbacks.onCelebration(`🗑️ ${successCount} eventos de ${subject} excluídos com sucesso!`);
    }
    
    return { successCount, failCount, total: eventsToDelete.length };
  }

  // Excluir múltiplos eventos por data específica
  async deleteEventsByDate(events: CalendarEvent[], targetDate: Date): Promise<{ successCount: number; failCount: number; total: number }> {
    console.log('🗑️ [CalendarEventActions] deleteEventsByDate chamado:', {
      targetDate: targetDate.toLocaleDateString('pt-BR'),
      totalEvents: events.length,
      hasDeleteCallback: !!this.callbacks.onDeleteEvent
    });
    
    if (!this.callbacks.onDeleteEvent) {
      console.error('❌ [CalendarEventActions] Callback onDeleteEvent não disponível');
      return { successCount: 0, failCount: 0, total: 0 };
    }
    
    // Normalizar a data alvo (apenas dia/mês/ano, ignorar hora)
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();
    
    console.log('🗓️ [CalendarEventActions] Data alvo normalizada:', {
      year: targetYear,
      month: targetMonth + 1, // +1 para exibição (janeiro = 1)
      day: targetDay,
      formatted: targetDate.toLocaleDateString('pt-BR')
    });
    
    const eventsToDelete = events.filter(event => {
      const eventDate = new Date(event.start_date);
      const eventYear = eventDate.getFullYear();
      const eventMonth = eventDate.getMonth();
      const eventDay = eventDate.getDate();
      
      const matches = eventYear === targetYear && eventMonth === targetMonth && eventDay === targetDay;
      
      console.log('🔍 [CalendarEventActions] Verificando evento:', {
        title: event.title,
        eventDate: eventDate.toLocaleDateString('pt-BR'),
        eventYear,
        eventMonth: eventMonth + 1, // +1 para exibição
        eventDay,
        targetYear,
        targetMonth: targetMonth + 1, // +1 para exibição
        targetDay,
        matches
      });
      
      return matches;
    });
    
    let successCount = 0;
    let failCount = 0;
    
    console.log(`🗑️ [CalendarEventActions] Encontrados ${eventsToDelete.length} eventos para excluir do dia ${targetDate.toLocaleDateString('pt-BR')}`);
    
    if (eventsToDelete.length === 0) {
      console.log('ℹ️ [CalendarEventActions] Nenhum evento encontrado para a data especificada');
      return { successCount: 0, failCount: 0, total: 0 };
    }
    
    for (const event of eventsToDelete) {
      try {
        console.log('🗑️ [CalendarEventActions] Excluindo evento:', event.title, 'ID:', event.id);
        await this.callbacks.onDeleteEvent(event.id);
        successCount++;
        console.log('✅ [CalendarEventActions] Evento excluído com sucesso:', event.title);
        
        // Pequeno delay entre exclusões para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error: unknown) {
        console.error('❌ [CalendarEventActions] Erro ao excluir evento:', event.title, error);
        failCount++;
      }
    }
    
    // Disparar animação de celebração
    if (successCount > 0) {
      const dateStr = targetDate.toLocaleDateString('pt-BR');
      console.log('🎉 [CalendarEventActions] Disparando celebração:', `${successCount} eventos excluídos`);
      this.callbacks.onCelebration(`🗑️ ${successCount} eventos do dia ${dateStr} excluídos com sucesso!`);
    }
    
    const result = { successCount, failCount, total: eventsToDelete.length };
    console.log('📊 [CalendarEventActions] Resultado final:', result);
    return result;
  }

  /**
   * Excluir múltiplos eventos por semana específica
   * @param events Lista de eventos para filtrar
   * @param weekType Tipo de semana: 'current' (esta semana), 'next' (próxima semana)
   * @returns Promessa que resolve para estatísticas da operação
   */
  async deleteEventsByWeek(events: CalendarEvent[], weekType: 'current' | 'next' = 'current'): Promise<{ successCount: number; failCount: number; total: number }> {
    console.log('🗑️ [CalendarEventActions] deleteEventsByWeek chamado:', {
      weekType,
      totalEvents: events.length,
      hasDeleteCallback: !!this.callbacks.onDeleteEvent
    });
    
    if (!this.callbacks.onDeleteEvent) {
      console.error('❌ [CalendarEventActions] Callback onDeleteEvent não disponível');
      return { successCount: 0, failCount: 0, total: 0 };
    }
    
    // Calcular início e fim da semana
    const today = new Date();
    const currentDay = today.getDay(); // 0 = domingo, 1 = segunda, etc.
    
    let startOfWeek: Date;
    let endOfWeek: Date;
    
    if (weekType === 'current') {
      // Esta semana (domingo a sábado)
      startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - currentDay);
      startOfWeek.setHours(0, 0, 0, 0);
      
      endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
    } else {
      // Próxima semana
      startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - currentDay + 7);
      startOfWeek.setHours(0, 0, 0, 0);
      
      endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
    }
    
    console.log('📅 [CalendarEventActions] Período da semana:', {
      weekType,
      startOfWeek: startOfWeek.toLocaleDateString('pt-BR'),
      endOfWeek: endOfWeek.toLocaleDateString('pt-BR')
    });
    
    // Filtrar eventos da semana
    const eventsToDelete = events.filter(event => {
      const eventDate = new Date(event.start_date);
      const isInWeek = eventDate >= startOfWeek && eventDate <= endOfWeek;
      
      console.log('🔍 [CalendarEventActions] Verificando evento da semana:', {
        title: event.title,
        eventDate: eventDate.toLocaleDateString('pt-BR'),
        startOfWeek: startOfWeek.toLocaleDateString('pt-BR'),
        endOfWeek: endOfWeek.toLocaleDateString('pt-BR'),
        isInWeek
      });
      
      return isInWeek;
    });
    
    let successCount = 0;
    let failCount = 0;
    
    const weekDescription = weekType === 'current' ? 'desta semana' : 'da próxima semana';
    console.log(`🗑️ [CalendarEventActions] Encontrados ${eventsToDelete.length} eventos ${weekDescription}`);
    
    if (eventsToDelete.length === 0) {
      console.log(`ℹ️ [CalendarEventActions] Nenhum evento encontrado ${weekDescription}`);
      return { successCount: 0, failCount: 0, total: 0 };
    }
    
    for (const event of eventsToDelete) {
      try {
        console.log('🗑️ [CalendarEventActions] Excluindo evento da semana:', event.title, 'ID:', event.id);
        await this.callbacks.onDeleteEvent(event.id);
        successCount++;
        console.log('✅ [CalendarEventActions] Evento da semana excluído com sucesso:', event.title);
        
        // Pequeno delay entre exclusões para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error: unknown) {
        console.error('❌ [CalendarEventActions] Erro ao excluir evento da semana:', event.title, error);
        failCount++;
      }
    }
    
    // Disparar animação de celebração
    if (successCount > 0) {
      const weekDesc = weekType === 'current' ? 'desta semana' : 'da próxima semana';
      console.log('🎉 [CalendarEventActions] Disparando celebração:', `${successCount} eventos da semana excluídos`);
      this.callbacks.onCelebration(`🗑️ ${successCount} eventos ${weekDesc} excluídos com sucesso! 📅`);
    }
    
    const result = { successCount, failCount, total: eventsToDelete.length };
    console.log('📊 [CalendarEventActions] Resultado final da exclusão por semana:', result);
    return result;
  }

  /**
   * Excluir TODOS os eventos da agenda do usuário
   * @param events Lista completa de eventos do usuário
   * @returns Promessa que resolve para estatísticas da operação
   */
  async deleteAllEvents(events: CalendarEvent[]): Promise<{ successCount: number; failCount: number; total: number }> {
    console.log('🗑️ [CalendarEventActions] deleteAllEvents chamado:', {
      totalEvents: events.length,
      hasDeleteCallback: !!this.callbacks.onDeleteEvent
    });
    
    if (!this.callbacks.onDeleteEvent) {
      console.error('❌ [CalendarEventActions] Callback onDeleteEvent não disponível');
      return { successCount: 0, failCount: 0, total: 0 };
    }
    
    if (events.length === 0) {
      console.log('ℹ️ [CalendarEventActions] Nenhum evento encontrado para excluir');
      return { successCount: 0, failCount: 0, total: 0 };
    }
    
    let successCount = 0;
    let failCount = 0;
    
    console.log(`🗑️ [CalendarEventActions] Iniciando exclusão de ${events.length} eventos...`);
    
    for (const event of events) {
      try {
        console.log('🗑️ [CalendarEventActions] Excluindo evento:', event.title, 'ID:', event.id);
        await this.callbacks.onDeleteEvent(event.id);
        successCount++;
        console.log('✅ [CalendarEventActions] Evento excluído com sucesso:', event.title);
        
        // Pequeno delay entre exclusões para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error: unknown) {
        console.error('❌ [CalendarEventActions] Erro ao excluir evento:', event.title, error);
        failCount++;
      }
    }
    
    // Disparar animação de celebração
    if (successCount > 0) {
      console.log('🎉 [CalendarEventActions] Disparando celebração:', `${successCount} eventos excluídos`);
      if (successCount === events.length) {
        this.callbacks.onCelebration(`🗑️ Todos os ${successCount} eventos foram excluídos da agenda! 🧹`);
      } else {
        this.callbacks.onCelebration(`🗑️ ${successCount} de ${events.length} eventos excluídos com sucesso! ⚠️`);
      }
    }
    
    const result = { successCount, failCount, total: events.length };
    console.log('📊 [CalendarEventActions] Resultado final da exclusão completa:', result);
    return result;
  }

  // Editar evento
  async editEvent(eventId: string, updates: Partial<Omit<CalendarEvent, 'id' | 'user_id' | 'study_plan_id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
    console.log('✏️ [CalendarEventActions] editEvent chamado:', {
      eventId,
      updates,
      hasUpdateCallback: !!this.callbacks.onUpdateEvent
    });
    
    if (!this.callbacks.onUpdateEvent) {
      console.error('❌ [CalendarEventActions] Callback onUpdateEvent não disponível');
      return false;
    }
    
    try {
      console.log('✏️ [CalendarEventActions] Editando evento ID:', eventId);
      await this.callbacks.onUpdateEvent(eventId, updates);
      console.log('✅ [CalendarEventActions] Evento editado, disparando celebração');
      this.callbacks.onCelebration('✨ Evento editado com sucesso!');
      return true;
    } catch (error) {
      console.error('❌ [CalendarEventActions] Erro ao editar evento:', error);
      return false;
    }
  }
}
