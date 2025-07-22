import { CalendarEvent } from './calendarService';
import { getSubjectColor, analyzeProgress } from '@/lib/utils/calendarChatUtils';

export interface EventActionCallbacks {
  onCreateEvent: (eventData: any) => Promise<void>;
  onUpdateEvent?: (eventId: string, updates: any) => Promise<void>;
  onDeleteEvent?: (eventId: string) => Promise<void>;
  onCelebration: (message: string) => void;
}

export class CalendarEventActions {
  private callbacks: EventActionCallbacks;

  constructor(callbacks: EventActionCallbacks) {
    this.callbacks = callbacks;
  }

  // Criar evento automaticamente
  async createScheduledEvent(events: CalendarEvent[], subject?: string, targetDate?: Date): Promise<boolean> {
    console.log('📅 [CalendarEventActions] createScheduledEvent chamado:', {
      subject,
      targetDate: targetDate?.toLocaleDateString('pt-BR'),
      hasCreateCallback: !!this.callbacks.onCreateEvent
    });
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
    
    const eventData = {
      title: `Revisão de ${targetSubject}`,
      description: `Sessão de estudos criada pelo assistente APRU para reforçar conhecimentos em ${targetSubject}`,
      start_date: startTime.toISOString(),
      end_date: endTime.toISOString(),
      subject: targetSubject,
      topic: 'Revisão e exercícios',
      color: getSubjectColor(targetSubject),
      priority: 2
    };
    
    try {
      console.log('📝 [CalendarEventActions] Criando evento:', eventData);
      await this.callbacks.onCreateEvent(eventData);
      
      // Disparar animação de celebração
      const timeDescription = targetDate 
        ? `${targetDate.getDate()}/${targetDate.getMonth() + 1}`
        : (new Date().getHours() >= 14 ? 'amanhã' : 'hoje');
      
      console.log('🎉 [CalendarEventActions] Evento criado, disparando celebração');
      this.callbacks.onCelebration(`🎉 ${targetSubject} agendado para ${timeDescription} às 14h!`);
      
      return true;
    } catch (error) {
      console.error('❌ [CalendarEventActions] Erro ao criar evento:', error);
      return false;
    }
  }

  // Criar múltiplos eventos a partir de cronograma
  async createScheduleEvents(schedule: any[]): Promise<{ successCount: number; failCount: number; total: number }> {
    let successCount = 0;
    let failCount = 0;
    
    console.log('📅 [CalendarEventActions] Criando cronograma com', schedule.length, 'atividades...');
    
    for (const activity of schedule) {
      try {
        const eventData = {
          title: activity.title,
          description: activity.description,
          start_date: activity.startTime,
          end_date: activity.endTime,
          subject: activity.subject,
          topic: activity.topic,
          color: activity.color,
          priority: activity.priority
        };
        
        await this.callbacks.onCreateEvent(eventData);
        successCount++;
        console.log('✅ [CalendarEventActions] Evento criado:', activity.title);
        
        // Pequeno delay entre criações para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error('❌ [CalendarEventActions] Erro ao criar evento:', activity.title, error);
        failCount++;
      }
    }
    
    // Disparar animação de celebração para cronograma
    if (successCount > 0) {
      this.callbacks.onCelebration(`🎆 Cronograma criado! ${successCount} atividades agendadas com sucesso!`);
    }
    
    return { successCount, failCount, total: schedule.length };
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
        
      } catch (error) {
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
    const targetDateStr = targetDate.toDateString();
    console.log('🗓️ [CalendarEventActions] Data alvo normalizada:', targetDateStr);
    
    const eventsToDelete = events.filter(event => {
      const eventDate = new Date(event.start_date);
      const eventDateStr = eventDate.toDateString();
      const matches = eventDateStr === targetDateStr;
      
      console.log('🔍 [CalendarEventActions] Verificando evento:', {
        title: event.title,
        eventDate: eventDate.toLocaleDateString('pt-BR'),
        eventDateStr,
        targetDateStr,
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
        
      } catch (error) {
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

  // Editar evento
  async editEvent(eventId: string, updates: any): Promise<boolean> {
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
