import React from 'react';
import { 
  MessageCircle, 
  Sparkles, 
  Zap, 
  Brain, 
  Calendar, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CalendarEvent } from '@/lib/services/calendarService';
import { calendarChatService } from '@/lib/services/calendarChatService';
import { useAuth } from '@/contexts/AuthContext';
import CelebrationAnimation from './CelebrationAnimation';
import { useCalendarChat } from '@/hooks/useCalendarChat';
import { CalendarEventActions } from '@/lib/services/calendarEventActions';
import { 
  analyzeProgress, 
  parseUserMessage, 
  detectUserIntent, 
  findEventByContext, 
  getSubjectColor 
} from '@/lib/utils/calendarChatUtils';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

interface CalendarAIChatProps {
  events: CalendarEvent[];
  onCreateEvent: (eventData: any) => Promise<void>;
  onUpdateEvent?: (eventId: string, updates: any) => Promise<void>;
  onDeleteEvent?: (eventId: string) => Promise<void>;
  className?: string;
}

const CalendarAIChat: React.FC<CalendarAIChatProps> = ({
  events,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  className = ''
}) => {
  const { user } = useAuth();
  const {
    messages,
    inputValue,
    isLoading,
    selectedMode,
    isExpanded,
    showCelebration,
    celebrationMessage,
    messagesEndRef,
    inputRef,
    setInputValue,
    setIsLoading,
    setSelectedMode,
    setIsExpanded,
    setShowCelebration,
    addMessage,
    triggerCelebration
  } = useCalendarChat();

  // Criar instância do CalendarEventActions
  const eventActions = new CalendarEventActions({
    onCreateEvent,
    onUpdateEvent,
    onDeleteEvent,
    onCelebration: triggerCelebration
  });

  // Gerar resposta da IA com ações reais usando serviço de IA
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    if (!user) {
      return 'Por favor, faça login para usar o assistente de IA.';
    }

    const intent = detectUserIntent(userMessage);
    const parsed = parseUserMessage(userMessage);
    const lowerMessage = userMessage.toLowerCase();
    
    console.log('🤖 [CalendarAIChat] Processando:', { intent, parsed, message: userMessage });
    
    // NOVA FUNCIONALIDADE: Listagem de eventos
    if (intent === 'list_events') {
      console.log('📋 [CalendarAIChat] Processando listagem de eventos:', { parsed });
      
      let eventsToShow = events;
      let contextMessage = '';
      
      // Filtrar por data se especificada
      if (parsed.date) {
        const targetDateStr = parsed.date.toISOString().split('T')[0];
        eventsToShow = events.filter(event => 
          event.start_date.startsWith(targetDateStr)
        );
        contextMessage = ` para ${parsed.date.toLocaleDateString('pt-BR')}`;
      }
      // Filtrar por matéria se especificada
      else if (parsed.subject) {
        eventsToShow = events.filter(event => 
          event.subject?.toLowerCase().includes(parsed.subject!.toLowerCase()) ||
          event.title.toLowerCase().includes(parsed.subject!.toLowerCase())
        );
        contextMessage = ` de ${parsed.subject}`;
      }
      // Se mencionou "hoje" especificamente
      else if (lowerMessage.includes('hoje')) {
        const today = new Date().toISOString().split('T')[0];
        eventsToShow = events.filter(event => 
          event.start_date.startsWith(today)
        );
        contextMessage = ' para hoje';
      }
      
      if (eventsToShow.length === 0) {
        return `📅 Você não tem atividades agendadas${contextMessage}. Que tal criarmos algumas?`;
      }
      
      // Organizar eventos por data
      const eventsByDate = eventsToShow.reduce((acc, event) => {
        const date = new Date(event.start_date).toLocaleDateString('pt-BR');
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
      }, {} as Record<string, typeof eventsToShow>);
      
      let response = `📋 Suas atividades${contextMessage}:\n\n`;
      
      Object.entries(eventsByDate).forEach(([date, dayEvents]) => {
        response += `📅 **${date}**\n`;
        dayEvents.forEach(event => {
          const startTime = new Date(event.start_date).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          const status = event.status === 'completed' ? '✅' : '⏰';
          const subject = event.subject ? `[${event.subject}]` : '';
          response += `  ${status} ${startTime} - ${event.title} ${subject}\n`;
        });
        response += '\n';
      });
      
      const completedCount = eventsToShow.filter(e => e.status === 'completed').length;
      const totalCount = eventsToShow.length;
      
      response += `📊 **Resumo**: ${completedCount}/${totalCount} concluídas (${Math.round((completedCount/totalCount)*100)}%)`;
      
      return response;
    }
    
    // Solicitações de exclusão
    if (intent === 'delete_event') {
      console.log('🗑️ [CalendarAIChat] Processando exclusão:', { message: userMessage, parsed });
      
      // Detectar se é solicitação de exclusão por data específica - versão melhorada
      if ((lowerMessage.includes('atividades do dia') || lowerMessage.includes('eventos do dia') || 
           lowerMessage.includes('atividades de dia') || lowerMessage.includes('eventos de dia') ||
           lowerMessage.includes('do dia') || lowerMessage.includes('dia ')) && parsed.date) {
        
        const result = await eventActions.deleteEventsByDate(events, parsed.date);
        if (result.successCount > 0) {
          const dateStr = parsed.date.toLocaleDateString('pt-BR');
          return `✅ Excluí ${result.successCount} eventos do dia ${dateStr} com sucesso! 🗑️`;
        } else if (result.total === 0) {
          const dateStr = parsed.date.toLocaleDateString('pt-BR');
          return `🔍 Não encontrei nenhum evento no dia ${dateStr} para excluir.`;
        } else {
          return `❌ Não foi possível excluir os eventos. Tente novamente.`;
        }
      }
      
      // Detectar se é solicitação de exclusão em massa (todas as atividades de uma matéria)
      else if (lowerMessage.includes('todas') || lowerMessage.includes('todos') || 
               lowerMessage.includes('atividades de') || lowerMessage.includes('eventos de')) {
        
        // Extrair matéria da mensagem
        if (parsed.subject) {
          const result = await eventActions.deleteEventsBySubject(events, parsed.subject);
          if (result.successCount > 0) {
            return `✅ Excluí ${result.successCount} eventos de ${parsed.subject} com sucesso! 🗑️`;
          } else if (result.total === 0) {
            return `🔍 Não encontrei nenhum evento de ${parsed.subject} para excluir.`;
          } else {
            return `❌ Não foi possível excluir os eventos de ${parsed.subject}. Tente novamente.`;
          }
        }
      }
      
      // Exclusão de evento específico por contexto
      else {
        const eventToDelete = findEventByContext(userMessage, events);
        if (eventToDelete && onDeleteEvent) {
          await onDeleteEvent(eventToDelete.id);
          return `✅ Excluí o evento '${eventToDelete.title}' com sucesso! 🗑️`;
        } else {
          return `🔍 Não encontrei o evento que você quer excluir. Pode ser mais específico?`;
        }
      }
    }
    
    // Solicitações de edição
    if (intent === 'edit_event') {
      const targetEvent = findEventByContext(userMessage, events);
      if (targetEvent) {
        // Extrair mudanças da mensagem
        const updates: any = {};
        
        // Detectar nova matéria
        if (parsed.subject && parsed.subject !== targetEvent.subject) {
          updates.subject = parsed.subject;
          updates.title = `Sessão de ${parsed.subject}`;
          updates.color = getSubjectColor(parsed.subject);
        }
        
        // Detectar nova data/hora
        if (parsed.date) {
          const newStart = new Date(parsed.date);
          newStart.setHours(14, 0, 0, 0);
          const newEnd = new Date(parsed.date);
          newEnd.setHours(16, 0, 0, 0);
          updates.start_date = newStart.toISOString();
          updates.end_date = newEnd.toISOString();
        }
        
        if (Object.keys(updates).length > 0 && onUpdateEvent) {
          await onUpdateEvent(targetEvent.id, updates);
          return `✅ Editei o evento "${targetEvent.title}" com sucesso! ✨`;
        } else {
          return `🤔 Não identifiquei o que você quer alterar. Seja mais específico (ex: "mudar matemática para física").`;
        }
      } else {
        return `🔍 Não encontrei o evento que você quer editar. Pode ser mais específico?`;
      }
    }
    
    // Usar serviço de IA para outras intenções
    try {
      const response = await calendarChatService.generateChatResponse({
        message: userMessage,
        mode: selectedMode,
        events,
        userId: user.id
      });
      
      // Se a IA sugeriu um evento e o usuário confirmou agendamento
      if (intent === 'schedule_event' && response.suggestedEvent) {
        await eventActions.createScheduledEvent(events, response.suggestedEvent.subject);
        return `✅ Agendei ${response.suggestedEvent.subject} para você! 📚`;
      }
      
      // Se a IA sugeriu um cronograma completo
      if (intent === 'create_schedule' && response.suggestedSchedule) {
        const result = await eventActions.createScheduleEvents(response.suggestedSchedule);
        if (result.successCount > 0) {
          return `✅ Criei ${result.successCount} atividades no seu calendário! 📚`;
        }
      }
      
      return response.response;
    } catch (error) {
      console.error('Erro ao gerar resposta da IA:', error);
      
      // Fallbacks locais baseados na intenção
      switch (intent) {
        case 'schedule_event':
          return '✅ Ok! Vou criar para você.';
        case 'analyze_progress':
          const completedEvents = events.filter(e => e.status === 'completed').length;
          const totalEvents = events.length;
          const percentage = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0;
          return `📊 ${completedEvents} concluídas (${percentage}%). Continue assim! 🎯`;
        case 'suggest_activities':
          return '💡 Que tal Português? Posso agendar 2h?';
        default:
          return '😊 Oi! Como posso ajudar?';
      }
    }
  };

  // Enviar mensagem
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    addMessage({
      content: inputValue,
      type: 'user',
      mode: selectedMode
    });

    const userMessage = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(userMessage);
      
      addMessage({
        content: aiResponse,
        type: 'ai',
        mode: selectedMode
      });
    } catch (error) {
      console.error('Erro ao gerar resposta da IA:', error);
      toast.error('Erro ao processar sua mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getModeIcon = (mode: 'APRU_1b' | 'APRU_REASONING') => {
    return mode === 'APRU_1b' ? <Zap className="w-4 h-4" /> : <Brain className="w-4 h-4" />;
  };

  const getModeColor = (mode: 'APRU_1b' | 'APRU_REASONING') => {
    return mode === 'APRU_1b' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  return (
    <>
      <Card className={`w-full ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Assistente APRU
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </CardTitle>
            
            <div className="flex items-center gap-2">
              {/* Seletor de modo */}
              <div className="flex rounded-lg border p-1">
                <button
                  onClick={() => setSelectedMode('APRU_1b')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    selectedMode === 'APRU_1b' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Zap className="w-3 h-3 inline mr-1" />
                  APRU 1b
                </button>
                <button
                  onClick={() => setSelectedMode('APRU_REASONING')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    selectedMode === 'APRU_REASONING' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Brain className="w-3 h-3 inline mr-1" />
                  REASONING
                </button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Minimizar' : 'Expandir'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Área de mensagens */}
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            selectedMode={selectedMode}
            isExpanded={isExpanded}
            messagesEndRef={messagesEndRef}
          />

          {/* Input de mensagem */}
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            selectedMode={selectedMode}
            inputRef={inputRef}
            showSuggestions={messages.length <= 1}
          />

          {/* Estatísticas rápidas */}
          <div className="flex items-center gap-4 text-xs text-gray-600 pt-2 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {events.length} eventos
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {events.filter(e => e.status === 'completed').length} concluídos
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {events.filter(e => e.status === 'scheduled').length} agendados
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Animação de celebração */}
      <CelebrationAnimation
        isVisible={showCelebration}
        message={celebrationMessage}
        onComplete={() => setShowCelebration(false)}
        duration={3000}
      />
    </>
  );
};

export default CalendarAIChat;
