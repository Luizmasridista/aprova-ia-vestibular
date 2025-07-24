import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { calendarService, CalendarEvent, CreateEventRequest } from '@/lib/services/calendarService';
import VisualCalendar from '@/components/ui/VisualCalendar';
import CalendarAIChat from '@/components/ui/CalendarAIChat_new';
import { SimpleCelebration } from '@/components/ui/SimpleCelebration';
import GoogleCalendarModal from '@/components/ui/GoogleCalendarModal.new';
import { StaggerContainer, StaggerSection } from '@/components/animations/StaggerContainer';
import CalendarSidebar from '@/components/calendar/CalendarSidebar';

// Importar melhorias visuais
import '@/styles/calendar-enhancements.css';

const CalendarPage = () => {
  const { user } = useAuth();
  const [todayEvents, setTodayEvents] = useState<CalendarEvent[]>([]);
  const [weekEvents, setWeekEvents] = useState<CalendarEvent[]>([]);
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showAIChat, setShowAIChat] = useState(true);
  
  // Estado para animação de celebração
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'success' | 'achievement' | 'milestone'>('success');
  const [celebrationMessage, setCelebrationMessage] = useState('Ação realizada com sucesso!');
  const [showGoogleCalendarModal, setShowGoogleCalendarModal] = useState(false);

  // Carregar eventos
  const loadEvents = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      console.log('📅 [Calendar] Carregando eventos para o usuário:', user.id);
      const events = await calendarService.getEvents(user.id);
      console.log('📅 [Calendar] Eventos carregados:', events.length);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + 7);
      
      const todayEventsList = events.filter(event => {
        const eventDate = new Date(event.start_date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === today.getTime();
      });
      
      const weekEventsList = events.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate >= today && eventDate < endOfWeek;
      });
      
      setTodayEvents(todayEventsList);
      setWeekEvents(weekEventsList);
      setAllEvents(events);
    } catch (error) {
      console.error('❌ [Calendar] Erro ao carregar eventos:', error);
      toast.error('Erro ao carregar eventos do calendário');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Efeito para carregar eventos quando o usuário muda
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Funções para controlar a animação de celebração
  const handleTriggerCelebration = (type: 'success' | 'achievement' | 'milestone' = 'success', message?: string) => {
    console.log('🎉 [Calendar] Disparando celebração:', { type, message });
    setCelebrationType(type);
    setCelebrationMessage(message || 'Ação realizada com sucesso!');
    setShowCelebration(true);
  };

  const handleOpenGoogleCalendarModal = () => {
    setShowGoogleCalendarModal(true);
  };

  const hideCelebration = () => {
    setShowCelebration(false);
  };

  const handleCompleteEvent = async (eventId: string) => {
    try {
      await calendarService.completeEvent(eventId);
      toast.success('Atividade marcada como concluída!');
      
      // Trigger celebration animation
      handleTriggerCelebration('success');
      
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
  const handleCreateEventFromAI = async (eventData: Partial<CalendarEvent>) => {
    if (!user) {
      console.error('❌ [CalendarPage] Tentativa de criar evento sem usuário autenticado');
      return;
    }
    
    try {
      console.log('📅 [CalendarPage] Criando evento via AI:', JSON.stringify(eventData, null, 2));
      
      // Verificar campos obrigatórios
      if (!eventData.start_date) {
        console.error('❌ [CalendarPage] Campo obrigatório start_date ausente:', eventData);
        toast.error('Erro: Data de início não especificada');
        return;
      }
      
      if (!eventData.end_date) {
        console.error('❌ [CalendarPage] Campo obrigatório end_date ausente:', eventData);
        toast.error('Erro: Data de término não especificada');
        return;
      }
      
      // Criar objeto de evento com todos os campos obrigatórios
      const newEvent: CreateEventRequest = {
        title: eventData.title || `Estudo de ${eventData.subject || 'Revisão Geral'}`,
        start_date: eventData.start_date,
        end_date: eventData.end_date,
        description: eventData.description || `Sessão de estudos criada pelo assistente APRU`,
        all_day: eventData.all_day || false,
        event_type: eventData.event_type || "study",
        subject: eventData.subject || "Revisão Geral",
        topic: eventData.topic || "Revisão e exercícios",
        color: eventData.color || "#339af0",
        priority: eventData.priority || 2
      };
      
      console.log('📝 [CalendarPage] Objeto final para criação:', JSON.stringify(newEvent, null, 2));
      
      // Criar evento no banco de dados
      const createdEvent = await calendarService.createEvent(user.id, newEvent);
      console.log('✅ [CalendarPage] Evento criado com sucesso:', createdEvent);
      
      // Preparar mensagem personalizada para toast e celebração
      const subject = newEvent.subject || 'Revisão Geral';
      const startDate = new Date(newEvent.start_date);
      const formattedDate = startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const formattedTime = startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      const successMessage = `${subject} agendado para ${formattedDate} às ${formattedTime}! 📅`;
      
      // Exibir toast de sucesso
      toast.success(`Atividade criada! ✅`);
      
      // Trigger celebration animation com mensagem personalizada
      handleTriggerCelebration('achievement', successMessage);
      
      // Recarregar eventos
      loadEvents();
    } catch (error) {
      console.error('❌ [CalendarPage] Erro ao criar evento via AI:', error);
      toast.error('Erro ao criar atividade. Tente novamente.');
    }
  };

  // Atualizar evento via AI
  const handleUpdateEventFromAI = async (eventId: string, updates: Partial<CalendarEvent>) => {
    if (!user) return;
    
    try {
      await calendarService.updateEvent(eventId, updates);
      toast.success('Evento atualizado!');
      handleTriggerCelebration('success');
      loadEvents();
    } catch (error) {
      console.error('❌ [CalendarPage] Erro ao atualizar evento:', error);
      toast.error('Erro ao atualizar evento. Tente novamente.');
    }
  };

  // Excluir evento via AI
  const handleDeleteEventFromAI = async (eventId: string) => {
    if (!user) return;
    
    try {
      await calendarService.deleteEvent(eventId);
      toast.success('Evento excluído!');
      handleTriggerCelebration('success');
      
      // Limpar evento selecionado se foi o que foi excluído
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null);
      }
      
      loadEvents();
    } catch (error) {
      console.error('❌ [CalendarPage] Erro ao excluir evento:', error);
      toast.error('Erro ao excluir evento. Tente novamente.');
    }
  };

  return (
    <div className="bg-background">
      {/* Cabeçalho com título e botão */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Calendário do estudante</h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button 
              variant="gradient" 
              size="lg" 
              className="gap-2"
              onClick={() => setShowAIChat(true)}
            >
              <Plus className="h-5 w-5" />
              Nova Atividade
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="calendar-container px-4">
        <StaggerContainer
          staggerDelay={0.2}
          initialDelay={0.6}
          direction="up"
          className="calendar-grid"
        >
          {/* Calendário Visual */}
          <div className="calendar-main-column">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {isLoading ? (
                <Card className="calendar-card">
                  <CardContent className="p-10">
                    <div className="flex items-center justify-center h-96">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Carregando calendário...</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <VisualCalendar
                  events={allEvents}
                  onEventClick={handleEventClick}
                  onDateClick={handleDateClick}
                  className="visual-calendar"
                />
              )}
            </motion.div>
            
            {/* AI Chat Assistant */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <CalendarAIChat 
                events={allEvents}
                onCreateEvent={handleCreateEventFromAI}
                onUpdateEvent={handleUpdateEventFromAI}
                onDeleteEvent={handleDeleteEventFromAI}
                onTriggerCelebration={handleTriggerCelebration}
                open={showAIChat}
                onOpenChange={setShowAIChat}
              />
            </motion.div>
          </div>

          {/* Sidebar com componentes separados */}
          <CalendarSidebar
            selectedEvent={selectedEvent}
            todayEvents={todayEvents}
            onCompleteEvent={handleCompleteEvent}
            onCloseSelectedEvent={() => setSelectedEvent(null)}
            onSyncGoogleCalendar={handleOpenGoogleCalendarModal}
            onConfigureReminders={() => console.log('Configure Reminders')}
            onExportSchedule={() => console.log('Export Schedule')}
          />
        </StaggerContainer>
      </div>
      
      {/* Animação de celebração - Overlay de tela inteira */}
      <SimpleCelebration
        isVisible={showCelebration}
        message={celebrationMessage}
        type={celebrationType}
        onComplete={() => setShowCelebration(false)}
        duration={3000}
      />
      
      {/* Modal do Google Calendar */}
      <GoogleCalendarModal
        isOpen={showGoogleCalendarModal}
        onClose={() => setShowGoogleCalendarModal(false)}
        events={allEvents}
      />
    </div>
  );
};

export default CalendarPage;