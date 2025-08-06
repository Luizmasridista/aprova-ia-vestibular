import { supabase } from '@/integrations/supabase/client';

export interface CalendarEvent {
  id: string;
  user_id: string;
  study_plan_id?: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  all_day: boolean;
  event_type: 'study' | 'exam' | 'review' | 'break';
  subject?: string;
  topic?: string;
  is_recurring: boolean;
  recurrence_pattern?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    days_of_week?: number[];
    end_date?: string;
  };
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  completed_at?: string;
  color: string;
  priority: 1 | 2 | 3;
  reminder_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  all_day?: boolean;
  event_type: 'study' | 'exam' | 'review' | 'break';
  subject?: string;
  topic?: string;
  is_recurring?: boolean;
  recurrence_pattern?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    days_of_week?: number[];
    end_date?: string;
  };
  color?: string;
  priority?: 1 | 2 | 3;
  reminder_minutes?: number;
  study_plan_id?: string;
}

export interface StudyPlanToCalendarRequest {
  study_plan_id: string;
  user_id: string;
  weekly_schedule: Array<{
    day: string;
    subjects: Array<{
      name: string;
      time: string;
      duration?: number;
      topic?: string;
    }>;
  }>;
  start_date: string;
  end_date: string;
}

export const calendarService = {
  // Verificar se a tabela calendar_events existe
  async checkTableExists(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('❌ [CalendarService] Tabela calendar_events não existe ou erro de acesso:', error);
        return false;
      }
      
      console.log('✅ [CalendarService] Tabela calendar_events existe e é acessível');
      return true;
    } catch (error) {
      console.error('❌ [CalendarService] Erro ao verificar tabela:', error);
      return false;
    }
  },
  // Buscar eventos do usuário em um período
  async getEvents(userId: string, startDate?: string, endDate?: string): Promise<CalendarEvent[]> {
    try {
      console.log('📅 [CalendarService] Buscando eventos do usuário:', { userId, startDate, endDate });
      
      let query = supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: true });

      if (startDate) {
        query = query.gte('start_date', startDate);
      }
      
      if (endDate) {
        query = query.lte('start_date', endDate);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ [CalendarService] Erro ao buscar eventos:', error);
        throw error;
      }

      console.log('✅ [CalendarService] Eventos encontrados:', data?.length || 0);
      return (data || []).map(event => ({
        ...event,
        completed: !!event.completed_at,
        event_type: (event.event_type as any) || 'study',
        recurrence_pattern: event.recurrence_pattern ? (event.recurrence_pattern as any) : undefined
      })) as unknown as CalendarEvent[];
    } catch (error) {
      console.error('❌ [CalendarService] Erro ao buscar eventos:', error);
      throw new Error('Não foi possível buscar os eventos do calendário');
    }
  },

  // Criar um novo evento
  async createEvent(userId: string, eventData: CreateEventRequest): Promise<CalendarEvent> {
    try {
      console.log('📝 [CalendarService] Criando novo evento:', { userId, title: eventData.title });
      
      // Validar dados obrigatórios
      if (!eventData.title || !eventData.start_date || !eventData.end_date) {
        throw new Error('Campos obrigatórios faltando: title, start_date, end_date');
      }

      // Preparar dados para inserção, garantindo valores padrão
      const insertData = {
        user_id: userId,
        title: eventData.title,
        description: eventData.description || null,
        start_date: eventData.start_date,
        end_date: eventData.end_date,
        all_day: eventData.all_day || false,
        event_type: eventData.event_type || 'study',
        subject: eventData.subject || null,
        topic: eventData.topic || null,
        is_recurring: eventData.is_recurring || false,
        recurrence_pattern: eventData.recurrence_pattern || null,
        status: 'scheduled',
        color: eventData.color || '#2563eb',
        priority: eventData.priority || 2,
        reminder_minutes: eventData.reminder_minutes || 15,
        study_plan_id: eventData.study_plan_id || null
      };

      console.log('📝 [CalendarService] Dados para inserção:', insertData);
      
      const { data, error } = await supabase
        .from('calendar_events')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('❌ [CalendarService] Erro ao criar evento:', error);
        console.error('❌ [CalendarService] Dados que causaram erro:', insertData);
        throw error;
      }

      console.log('✅ [CalendarService] Evento criado com sucesso:', data.id);
      
      // Se for recorrente, apenas logar (eventos recorrentes são criados individualmente)
      if (eventData.is_recurring && eventData.recurrence_pattern) {
        console.log('📅 [CalendarService] Evento recorrente criado. Padrão:', eventData.recurrence_pattern);
      }

      return {
        ...data,
        completed: !!data.completed_at,
        event_type: (data.event_type as any) || 'study',
        recurrence_pattern: data.recurrence_pattern ? (data.recurrence_pattern as any) : undefined
      } as unknown as CalendarEvent;
    } catch (error) {
      console.error('❌ [CalendarService] Erro ao criar evento:', error);
      throw new Error('Não foi possível criar o evento');
    }
  },

  // Atualizar um evento
  async updateEvent(eventId: string, updates: Partial<CreateEventRequest>): Promise<CalendarEvent> {
    try {
      console.log('📝 [CalendarService] Atualizando evento:', eventId);
      
      const { data, error } = await supabase
        .from('calendar_events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        console.error('❌ [CalendarService] Erro ao atualizar evento:', error);
        throw error;
      }

      console.log('✅ [CalendarService] Evento atualizado com sucesso');
      return {
        ...data,
        completed: !!data.completed_at,
        event_type: (data.event_type as any) || 'study',
        recurrence_pattern: data.recurrence_pattern ? (data.recurrence_pattern as any) : undefined
      } as unknown as CalendarEvent;
    } catch (error) {
      console.error('❌ [CalendarService] Erro ao atualizar evento:', error);
      throw new Error('Não foi possível atualizar o evento');
    }
  },

  // Deletar um evento
  async deleteEvent(eventId: string): Promise<void> {
    try {
      console.log('🗑️ [CalendarService] Deletando evento:', eventId);
      
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('❌ [CalendarService] Erro ao deletar evento:', error);
        throw error;
      }

      console.log('✅ [CalendarService] Evento deletado com sucesso');
    } catch (error) {
      console.error('❌ [CalendarService] Erro ao deletar evento:', error);
      throw new Error('Não foi possível deletar o evento');
    }
  },

  // Marcar evento como concluído
  async completeEvent(eventId: string): Promise<CalendarEvent> {
    try {
      console.log('✅ [CalendarService] Marcando evento como concluído:', eventId);
      
      const { data, error } = await supabase
        .from('calendar_events')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        console.error('❌ [CalendarService] Erro ao completar evento:', error);
        throw error;
      }

      console.log('✅ [CalendarService] Evento marcado como concluído');
      return {
        ...data,
        completed: !!data.completed_at,
        event_type: (data.event_type as any) || 'study',
        recurrence_pattern: data.recurrence_pattern ? (data.recurrence_pattern as any) : undefined
      } as unknown as CalendarEvent;
    } catch (error) {
      console.error('❌ [CalendarService] Erro ao completar evento:', error);
      throw new Error('Não foi possível marcar o evento como concluído');
    }
  },



  // Converter plano de estudos em eventos do calendário
  async createEventsFromStudyPlan(request: StudyPlanToCalendarRequest): Promise<CalendarEvent[]> {
    try {
      console.log('📚 [CalendarService] Convertendo plano de estudos em eventos:', {
        studyPlanId: request.study_plan_id,
        userId: request.user_id,
        scheduleItems: request.weekly_schedule?.length || 0
      });

      // Verificar se a tabela existe primeiro
      const tableExists = await this.checkTableExists();
      if (!tableExists) {
        console.warn('⚠️ [CalendarService] Tabela calendar_events não existe. Retornando array vazio.');
        return [];
      }

      // Validar dados de entrada
      if (!request.study_plan_id || !request.user_id || !request.weekly_schedule) {
        throw new Error('Dados obrigatórios faltando: study_plan_id, user_id, weekly_schedule');
      }

      if (!request.start_date || !request.end_date) {
        throw new Error('Datas obrigatórias faltando: start_date, end_date');
      }

      const events: CalendarEvent[] = [];
      const startDate = new Date(request.start_date);
      const endDate = new Date(request.end_date);
      
      // Validar datas
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Datas inválidas fornecidas');
      }
      
      // Mapear dias da semana
      const dayMap: { [key: string]: number } = {
        'domingo': 0, 'segunda-feira': 1, 'segunda': 1,
        'terça-feira': 2, 'terça': 2, 'quarta-feira': 3, 'quarta': 3,
        'quinta-feira': 4, 'quinta': 4, 'sexta-feira': 5, 'sexta': 5,
        'sábado': 6
      };

      // Cores por matéria
      const subjectColors: { [key: string]: string } = {
        'matemática': '#3b82f6', 'português': '#10b981', 'física': '#f59e0b',
        'química': '#ef4444', 'biologia': '#22c55e', 'história': '#8b5cf6',
        'geografia': '#06b6d4', 'filosofia': '#84cc16', 'sociologia': '#f97316',
        'inglês': '#ec4899', 'literatura': '#6366f1', 'redação': '#14b8a6'
      };

      // Processar cada dia da semana
      for (const daySchedule of request.weekly_schedule) {
        if (!daySchedule.day || !daySchedule.subjects) {
          console.warn('⚠️ [CalendarService] Dia ou matérias inválidas:', daySchedule);
          continue;
        }

        const dayOfWeek = dayMap[daySchedule.day.toLowerCase()];
        if (dayOfWeek === undefined) {
          console.warn('⚠️ [CalendarService] Dia da semana não reconhecido:', daySchedule.day);
          continue;
        }

        // Processar cada matéria do dia
        for (const subject of daySchedule.subjects) {
          try {
            if (!subject.name || !subject.time) {
              console.warn('⚠️ [CalendarService] Matéria ou horário inválidos:', subject);
              continue;
            }

            const timeParts = subject.time.split(':');
            if (timeParts.length !== 2) {
              console.warn('⚠️ [CalendarService] Formato de horário inválido:', subject.time);
              continue;
            }

            const [hours, minutes] = timeParts.map(Number);
            if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
              console.warn('⚠️ [CalendarService] Horário inválido:', subject.time);
              continue;
            }

            const duration = subject.duration || 120; // 2 horas por padrão
            
            // Criar evento recorrente semanal
            const eventData: CreateEventRequest = {
              title: `${subject.name}${subject.topic ? ` - ${subject.topic}` : ''}`,
              description: `Estudo de ${subject.name} conforme plano de estudos gerado por IA`,
              start_date: '', // Será definido abaixo
              end_date: '', // Será definido abaixo
              event_type: 'study',
              subject: subject.name,
              topic: subject.topic || undefined,
              color: subjectColors[subject.name.toLowerCase()] || '#6366f1',
              priority: 2,
              reminder_minutes: 15,
              study_plan_id: request.study_plan_id,
              is_recurring: true,
              recurrence_pattern: {
                type: 'weekly',
                interval: 1,
                days_of_week: [dayOfWeek],
                end_date: request.end_date
              }
            };

            // Encontrar a primeira ocorrência do dia da semana
            const currentDate = new Date(startDate);
            while (currentDate.getDay() !== dayOfWeek) {
              currentDate.setDate(currentDate.getDate() + 1);
            }

            // Definir horários
            const eventStart = new Date(currentDate);
            eventStart.setHours(hours, minutes, 0, 0);
            
            const eventEnd = new Date(eventStart);
            eventEnd.setMinutes(eventEnd.getMinutes() + duration);

            eventData.start_date = eventStart.toISOString();
            eventData.end_date = eventEnd.toISOString();

            console.log('📝 [CalendarService] Criando evento:', {
              title: eventData.title,
              day: daySchedule.day,
              time: subject.time,
              start: eventData.start_date,
              end: eventData.end_date
            });

            // Criar o evento
            const createdEvent = await this.createEvent(request.user_id, eventData);
            events.push(createdEvent);
          } catch (subjectError) {
            console.error('❌ [CalendarService] Erro ao criar evento para matéria:', subject.name, subjectError);
            // Continuar com as outras matérias mesmo se uma falhar
          }
        }
      }

      console.log('✅ [CalendarService] Eventos criados do plano de estudos:', events.length);
      return events;
    } catch (error) {
      console.error('❌ [CalendarService] Erro ao criar eventos do plano:', error);
      throw new Error('Não foi possível criar eventos do plano de estudos');
    }
  },

  // Buscar eventos de hoje
  async getTodayEvents(userId: string): Promise<CalendarEvent[]> {
    const today = new Date();
    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
    
    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);
    
    console.log('📅 [CalendarService] Buscando eventos de hoje:', {
      userId,
      startOfDay: startOfDay.toISOString(),
      endOfDay: endOfDay.toISOString()
    });
    
    return this.getEvents(userId, startOfDay.toISOString(), endOfDay.toISOString());
  },

  // Buscar eventos da semana
  async getWeekEvents(userId: string): Promise<CalendarEvent[]> {
    const today = new Date();
    const startOfWeek = new Date(today);
    const endOfWeek = new Date(today);
    
    // Calcular início da semana (domingo)
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Calcular fim da semana (sábado)
    endOfWeek.setDate(today.getDate() - today.getDay() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    console.log('📅 [CalendarService] Buscando eventos da semana:', {
      userId,
      startOfWeek: startOfWeek.toISOString(),
      endOfWeek: endOfWeek.toISOString()
    });
    
    return this.getEvents(userId, startOfWeek.toISOString(), endOfWeek.toISOString());
  }
};

export default calendarService;
