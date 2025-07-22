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
  const generateAIResponse = async (userMessage: string, events: CalendarEvent[]): Promise<string> => {
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
      console.log('✏️ [CalendarAIChat] Processando edição:', { message: userMessage, parsed });
      
      const eventToEdit = findEventByContext(userMessage, events);
      if (eventToEdit && onUpdateEvent) {
        const updates: any = {};
        
        // Detectar mudanças de matéria
        if (parsed.subject) {
          updates.subject = parsed.subject;
          updates.title = `${parsed.subject} - ${eventToEdit.topic || 'Revisão'}`;
          updates.color = getSubjectColor(parsed.subject);
        }
        
        // Detectar mudanças de data/hora
        if (parsed.date) {
          const newStartDate = new Date(parsed.date);
          newStartDate.setHours(14, 0, 0, 0); // Default 14h
          const newEndDate = new Date(newStartDate);
          newEndDate.setHours(16, 0, 0, 0); // Default 2h de duração
          
          updates.start_date = newStartDate.toISOString();
          updates.end_date = newEndDate.toISOString();
        }
        
        await onUpdateEvent(eventToEdit.id, updates);
        return `✅ Editei o evento '${eventToEdit.title}' com sucesso! ✨`;
      } else {
        return `🔍 Não encontrei o evento que você quer editar. Pode ser mais específico?`;
      }
    }
    
    // Geração de cronogramas com IA
    if (intent === 'create_schedule') {
      console.log('📅 [CalendarAIChat] Gerando cronograma com IA:', { selectedMode, user: user.id });
      
      try {
        const response = await calendarChatService.generateChatResponse({
          message: messages[messages.length - 1].content,
          mode: selectedMode,
          events,
          userId: user.id
        });
        
        // Verificar se a resposta contém um cronograma estruturado
        if (response.response.includes("schedule") || response.response.includes('schedule')) {
          try {
            const jsonMatch = response.response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const scheduleData = JSON.parse(jsonMatch[0]);
              if (scheduleData.schedule && Array.isArray(scheduleData.schedule)) {
                const result = await eventActions.createScheduleEvents(scheduleData.schedule);
                if (result.successCount > 0) {
                  return `✅ Criei ${result.successCount} atividades no seu calendário! Você pode ver todas acima. 📚`;
                }
              }
            }
          } catch (parseError) {
            console.log('Erro ao parsear JSON do cronograma, criando cronograma simples');
          }
        }
        
        return response.response;
      } catch (error) {
        console.error('Erro ao gerar cronograma:', error);
        return '❌ Erro ao gerar cronograma. Tente novamente.';
      }
    }
    
    // Detectar se usuário quer agendar algo após sugestão da IA
    if (intent === 'schedule_event') {
      console.log('📅 [CalendarAIChat] Criando evento solicitado pelo usuário');
      
      // Verificar se a última mensagem do assistente sugeria agendamento
      const lastAssistantMessage = messages.filter(m => m.type === 'ai').pop();
      const shouldSchedule = lastAssistantMessage && 
        lastAssistantMessage.content && 
        (lastAssistantMessage.content.includes('Posso criar') || 
         lastAssistantMessage.content.includes('agendar') || 
         lastAssistantMessage.content.includes('cronograma') || 
         lastAssistantMessage.content.includes('sessão de estudos'));
        
      if (shouldSchedule) {
        // Analisar progresso para sugerir matéria
        const progress = analyzeProgress(events);
        const subjectToStudy = progress.leastStudiedSubject || 'Matemática';
        
        // Create a proper calendar event object with all required properties
        const newEvent: CalendarEvent = {
          id: crypto.randomUUID(),
          title: `Estudo de ${subjectToStudy}`,
          subject: subjectToStudy,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          description: `Sessão de estudos de ${subjectToStudy} agendada pelo APRU`,
          color: '#3b82f6',
          all_day: false,
          user_id: user.id,
          event_type: 'study',
          is_recurring: false,
          status: 'scheduled',
          priority: 2, // 1=high, 2=medium, 3=low
          reminder_minutes: 30,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        await eventActions.createScheduledEvent([newEvent]);
        addMessage({
          type: 'ai',
          content: `✅ Agendei ${subjectToStudy} para você! 📚`
        });
        return;
      }
    }
    
    // Para outras intenções, usar IA real
    try {
      const response = await calendarChatService.generateChatResponse({
        message: messages[messages.length - 1].content,
        mode: selectedMode,
        events,
        userId: user.id
      });
      
      addMessage({
        type: 'ai',
        content: typeof response === 'object' && response.response ? response.response : 'Desculpe, não consegui gerar uma resposta adequada. Pode tentar novamente?'
      });
      
      return response.response;
    } catch (error) {
      console.error('Erro ao gerar resposta da IA:', error);
      
      // Fallback baseado na intenção
      if (intent === 'analyze_progress') {
        const progress = analyzeProgress(events);
        return `📊 ${progress.completedEvents} concluídas (${progress.completionRate}%). Continue assim! 🎯`;
      } else if (intent === 'suggest_activities') {
        const progress = analyzeProgress(events);
        const subject = progress.leastStudiedSubject || 'Matemática';
        return `💡 Que tal ${subject}? Posso agendar 2h?`;
      } else {
        return '😊 Oi! Como posso ajudar?';
      }
    }
  };

  // Enviar mensagem
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Adicionar mensagem do usuário
    addMessage({ type: 'user', content: userMessage });
    setIsLoading(true);

    try {
      // Gerar resposta da IA
      const aiResponse = await generateAIResponse(userMessage, events);
      
      // Adicionar resposta da IA
      addMessage({ type: 'ai', content: aiResponse });
      
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
