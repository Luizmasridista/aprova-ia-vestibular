import React, { useState, useEffect } from 'react';
import { Calendar, CalendarDays, Clock, Plus, Settings, CheckCircle, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { calendarService, CalendarEvent } from '@/lib/services/calendarService';
import VisualCalendar from '@/components/ui/VisualCalendar';
import CalendarAIChat from '@/components/ui/CalendarAIChat_new';

const CalendarPage = () => {
  const { user } = useAuth();
  const [todayEvents, setTodayEvents] = useState<CalendarEvent[]>([]);
  const [weekEvents, setWeekEvents] = useState<CalendarEvent[]>([]);
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Carregar eventos ao montar o componente
  useEffect(() => {
    if (user?.id) {
      loadEvents();
    }
  }, [user?.id]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      console.log('📅 [CalendarPage] Carregando eventos do usuário:', user?.id);
      
      const [todayEventsData, weekEventsData, allEventsData] = await Promise.all([
        calendarService.getTodayEvents(user!.id),
        calendarService.getWeekEvents(user!.id),
        calendarService.getEvents(user!.id) // Buscar todos os eventos
      ]);
      
      setTodayEvents(todayEventsData);
      setWeekEvents(weekEventsData);
      setAllEvents(allEventsData);
      
      console.log('✅ [CalendarPage] Eventos carregados:', {
        hoje: todayEventsData.length,
        semana: weekEventsData.length,
        total: allEventsData.length
      });
    } catch (error) {
      console.error('❌ [CalendarPage] Erro ao carregar eventos:', error);
      toast.error('Erro ao carregar eventos do calendário');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteEvent = async (eventId: string) => {
    try {
      await calendarService.completeEvent(eventId);
      toast.success('Atividade marcada como concluída!');
      
      // Limpar evento selecionado se foi o que foi concluído
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null);
      }
      
      // Recarregar eventos
      loadEvents();
    } catch (error) {
      console.error('Erro ao completar evento:', error);
      toast.error('Erro ao marcar atividade como concluída');
    }
  };

  const getEventColor = (event: CalendarEvent) => {
    if (event.color) {
      return `border-l-4`;
    }
    
    switch (event.event_type) {
      case "study": return "border-l-primary";
      case "exam": return "border-l-accent";
      case "review": return "border-l-success";
      case "break": return "border-l-muted";
      default: return "border-l-muted";
    }
  };

  const getEventTypeIcon = (type: string, status: string) => {
    if (status === 'completed') {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    
    switch (type) {
      case 'study': return <Play className="w-4 h-4 text-blue-600" />;
      case 'exam': return <Clock className="w-4 h-4 text-orange-600" />;
      case 'review': return <Pause className="w-4 h-4 text-green-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatEventTime = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // em minutos
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    let durationText = '';
    if (hours > 0) durationText += `${hours}h`;
    if (minutes > 0) durationText += `${minutes}m`;
    
    return {
      time: start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      duration: durationText || '0m'
    };
  };

  // Handlers para o calendário visual
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    console.log('📅 [CalendarPage] Evento selecionado:', event.title);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    console.log('📅 [CalendarPage] Data selecionada:', date.toLocaleDateString('pt-BR'));
  };

  // Criar evento via AI
  const handleCreateEventFromAI = async (eventData: any) => {
    try {
      console.log('🤖 [CalendarPage] Criando evento via AI:', eventData);
      
      // Aqui você pode processar os dados do AI e criar um evento real
      // Por enquanto, vou simular a criação de um evento
      const newEventData = {
        title: eventData.title || 'Nova Atividade de Estudo',
        description: eventData.description || 'Atividade criada pelo assistente APRU',
        start_date: eventData.start_date || new Date().toISOString(),
        end_date: eventData.end_date || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        event_type: 'study' as const,
        subject: eventData.subject || 'Geral',
        topic: eventData.topic,
        color: eventData.color || '#3b82f6',
        priority: eventData.priority || 2,
        reminder_minutes: 15
      };

      await calendarService.createEvent(user!.id, newEventData);
      toast.success('Atividade criada! ✅');
      
      // Recarregar eventos
      loadEvents();
    } catch (error) {
      console.error('❌ [CalendarPage] Erro ao criar evento via AI:', error);
      toast.error('Erro ao criar atividade. Tente novamente.');
    }
  };

  // Atualizar evento via AI
  const handleUpdateEventFromAI = async (eventId: string, updates: any) => {
    if (!user) return;
    
    try {
      await calendarService.updateEvent(eventId, updates);
      toast.success('Evento atualizado! ✨');
      
      // Recarregar eventos
      loadEvents();
    } catch (error) {
      console.error('❌ [CalendarPage] Erro ao atualizar evento via AI:', error);
      toast.error('Erro ao atualizar evento. Tente novamente.');
    }
  };

  // Excluir evento via AI
  const handleDeleteEventFromAI = async (eventId: string) => {
    if (!user) return;
    
    try {
      await calendarService.deleteEvent(eventId);
      toast.success('Evento excluído! 🗑️');
      
      // Recarregar eventos
      loadEvents();
      
      // Limpar seleção se o evento excluído estava selecionado
      if (selectedEvent && selectedEvent.id === eventId) {
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error('❌ [CalendarPage] Erro ao excluir evento via AI:', error);
      toast.error('Erro ao excluir evento. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Calendário Integrado</h1>
              <p className="text-white/80 text-lg">Organize sua rotina de estudos</p>
            </div>
            <Button variant="gradient" size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Nova Atividade
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendário Visual */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Carregando calendário...</p>
                    </div>
                  </div>
                ) : (
                  <VisualCalendar
                    events={allEvents}
                    onEventClick={handleEventClick}
                    onDateClick={handleDateClick}
                  />
                )}
              </CardContent>
            </Card>
            
            {/* AI Chat Assistant */}
            <div className="mt-6">
              <CalendarAIChat 
                events={allEvents}
                onCreateEvent={handleCreateEventFromAI}
                onUpdateEvent={handleUpdateEventFromAI}
                onDeleteEvent={handleDeleteEventFromAI}
              />
            </div>
          </div>

          {/* Sidebar - Evento Selecionado ou Agenda de Hoje */}
          <div className="space-y-6">
            {/* Evento Selecionado */}
            {selectedEvent && (
              <Card className="shadow-medium border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Evento Selecionado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getEventTypeIcon(selectedEvent.event_type, selectedEvent.status)}
                        <h3 className="font-semibold text-foreground">
                          {selectedEvent.title}
                        </h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedEvent.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedEvent.status === 'completed' ? 'Concluído' : 'Agendado'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {formatEventTime(selectedEvent.start_date, selectedEvent.end_date).time} 
                          ({formatEventTime(selectedEvent.start_date, selectedEvent.end_date).duration})
                        </span>
                      </div>
                      
                      {selectedEvent.subject && (
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedEvent.color }}></span>
                          <span>{selectedEvent.subject}</span>
                        </div>
                      )}
                      
                      {selectedEvent.topic && (
                        <div className="text-muted-foreground">
                          <strong>Tópico:</strong> {selectedEvent.topic}
                        </div>
                      )}
                      
                      {selectedEvent.description && (
                        <div className="text-muted-foreground mt-2">
                          <strong>Descrição:</strong> {selectedEvent.description}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      {selectedEvent.status === 'scheduled' && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteEvent(selectedEvent.id)}
                          className="flex-1"
                        >
                          Marcar como Concluído
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedEvent(null)}
                        className="flex-1"
                      >
                        Fechar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Agenda de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : todayEvents.length > 0 ? (
                  todayEvents.map((event) => {
                    const { time, duration } = formatEventTime(event.start_date, event.end_date);
                    return (
                      <div
                        key={event.id}
                        className={`p-3 rounded-lg border-l-4 bg-gradient-card ${getEventColor(event)}`}
                        style={{
                          borderLeftColor: event.color
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getEventTypeIcon(event.event_type, event.status)}
                              <p className={`font-medium text-foreground ${
                                event.status === 'completed' ? 'line-through text-gray-500' : ''
                              }`}>
                                {event.title}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {duration} • {event.subject}
                            </p>
                            {event.topic && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {event.topic}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-sm font-medium text-primary">{time}</span>
                            {event.status === 'scheduled' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCompleteEvent(event.id)}
                                className="text-xs"
                              >
                                Concluir
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma atividade agendada para hoje</p>
                    <p className="text-sm mt-2">Gere uma grade de estudos para ver suas atividades aqui!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Sync com Google Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Configurar Lembretes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Exportar Cronograma
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;