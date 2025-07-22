import React, { useState } from 'react';
import { 
  MessageCircle, 
  Sparkles, 
  Zap, 
  Brain, 
  Calendar, 
  CheckCircle, 
  Clock,
  Send,
  Loader2
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
import { AnimatePresence, motion } from 'framer-motion';

interface CalendarAIChatProps {
  events: CalendarEvent[];
  onCreateEvent: (eventData: any) => Promise<void>;
  onUpdateEvent?: (eventId: string, updates: any) => Promise<void>;
  onDeleteEvent?: (eventId: string) => Promise<void>;
  className?: string;
}

type ChatMessage = {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  mode?: 'APRU_1b' | 'APRU_REASONING';
};

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

  const [messagesState, setMessagesState] = useState<ChatMessage[]>([]);
  const [celebrationMessageState, setCelebrationMessageState] = useState<string | null>(null);

  // Criar instância do CalendarEventActions
  const eventActions = new CalendarEventActions({
    onCreateEvent,
    onUpdateEvent,
    onDeleteEvent,
    onCelebration: triggerCelebration
  });





  // Criar evento automaticamente
  const createScheduledEvent = async (subject?: string, targetDate?: Date) => {
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
      await onCreateEvent(eventData);
      
      // Disparar animação de celebração
      const timeDescription = targetDate 
        ? `${targetDate.getDate()}/${targetDate.getMonth() + 1}`
        : (new Date().getHours() >= 14 ? 'amanhã' : 'hoje');
      
      setCelebrationMessageState(`🎉 ${targetSubject} agendado para ${timeDescription} às 14h!`);
      setShowCelebration(true);
      
      return true;
    } catch (error) {
      console.error('❌ [CalendarAIChat] Erro ao criar evento:', error);
      return false;
    }
  };

  // Criar múltiplos eventos a partir de cronograma
  const createScheduleEvents = async (schedule: any[]) => {
    let successCount = 0;
    let failCount = 0;
    
    console.log('📅 [CalendarAIChat] Criando cronograma com', schedule.length, 'atividades...');
    
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
        
        await onCreateEvent(eventData);
        successCount++;
        console.log('✅ [CalendarAIChat] Evento criado:', activity.title);
        
        // Pequeno delay entre criações para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error('❌ [CalendarAIChat] Erro ao criar evento:', activity.title, error);
        failCount++;
      }
    }
    
    // Disparar animação de celebração para cronograma
    if (successCount > 0) {
      setCelebrationMessageState(`🎆 Cronograma criado! ${successCount} atividades agendadas com sucesso!`);
      setShowCelebration(true);
    }
    
    return { successCount, failCount, total: schedule.length };
  };

  // Encontrar evento por matéria ou data
  const findEventByContext = (message: string) => {
    const parsed = parseUserMessage(message);
    const lowerMessage = message.toLowerCase();
    
    // Buscar por matéria mencionada
    if (parsed.subject) {
      const eventsBySubject = events.filter(event => 
        event.subject?.toLowerCase().includes(parsed.subject!.toLowerCase()) ||
        event.title.toLowerCase().includes(parsed.subject!.toLowerCase())
      );
      
      // Retornar o mais recente ou próximo
      if (eventsBySubject.length > 0) {
        return eventsBySubject.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0];
      }
    }
    
    // Buscar por referências temporais
    if (lowerMessage.includes('hoje')) {
      const today = new Date().toISOString().split('T')[0];
      return events.find(event => event.start_date.startsWith(today));
    }
    
    if (lowerMessage.includes('amanhã')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      return events.find(event => event.start_date.startsWith(tomorrowStr));
    }
    
    // Buscar por "próximo" ou "último"
    if (lowerMessage.includes('próximo') || lowerMessage.includes('proximo')) {
      const futureEvents = events.filter(event => new Date(event.start_date) > new Date());
      return futureEvents.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0];
    }
    
    if (lowerMessage.includes('último') || lowerMessage.includes('ultimo')) {
      return events.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())[0];
    }
    
    return null;
  };

  // Excluir evento
  const deleteEvent = async (eventId: string) => {
    if (!onDeleteEvent) {
      return false;
    }
    
    try {
      await onDeleteEvent(eventId);
      setCelebrationMessageState('🗑️ Evento excluído com sucesso!');
      setShowCelebration(true);
      return true;
    } catch (error) {
      console.error('❌ [CalendarAIChat] Erro ao excluir evento:', error);
      return false;
    }
  };

  // Excluir múltiplos eventos por matéria
  const deleteEventsBySubject = async (subject: string) => {
    if (!onDeleteEvent) {
      return { successCount: 0, failCount: 0 };
    }
    
    const eventsToDelete = events.filter(event => 
      event.subject?.toLowerCase().includes(subject.toLowerCase()) ||
      event.title.toLowerCase().includes(subject.toLowerCase())
    );
    
    let successCount = 0;
    let failCount = 0;
    
    console.log(`🗑️ [CalendarAIChat] Excluindo ${eventsToDelete.length} eventos de ${subject}...`);
    
    for (const event of eventsToDelete) {
      try {
        await onDeleteEvent(event.id);
        successCount++;
        console.log('✅ [CalendarAIChat] Evento excluído:', event.title);
        
        // Pequeno delay entre exclusões para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error('❌ [CalendarAIChat] Erro ao excluir evento:', event.title, error);
        failCount++;
      }
    }
    
    // Disparar animação de celebração
    if (successCount > 0) {
      setCelebrationMessageState(`🗑️ ${successCount} eventos de ${subject} excluídos com sucesso!`);
      setShowCelebration(true);
    }
    
    return { successCount, failCount, total: eventsToDelete.length };
  };

  // Editar evento
  const editEvent = async (eventId: string, updates: any) => {
    if (!onUpdateEvent) {
      return false;
    }
    
    try {
      await onUpdateEvent(eventId, updates);
      setCelebrationMessageState('✨ Evento editado com sucesso!');
      setShowCelebration(true);
      return true;
    } catch (error) {
      console.error('❌ [CalendarAIChat] Erro ao editar evento:', error);
      return false;
    }
  };

  // Cores por matéria
  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'matemática': '#3b82f6',
      'português': '#10b981',
      'física': '#f59e0b',
      'química': '#ef4444',
      'biologia': '#8b5cf6',
      'história': '#f97316',
      'geografia': '#06b6d4',
      'revisão geral': '#6b7280'
    };
    return colors[subject.toLowerCase()] || '#6b7280';
  };

  // Gerar resposta da IA com ações reais usando serviço de IA
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    if (!user) {
      return 'Por favor, faça login para usar o assistente de IA.';
    }

    const intent = detectUserIntent(userMessage);
    const parsed = parseUserMessage(userMessage);
    
    // Solicitações de exclusão
    if (intent === 'delete_event') {
      const targetEvent = findEventByContext(userMessage);
      if (targetEvent) {
        const success = await deleteEvent(targetEvent.id);
        if (success) {
          return `✅ Excluí o evento "${targetEvent.title}" com sucesso! 🗑️`;
        } else {
          return `❌ Não foi possível excluir o evento. Tente novamente.`;
        }
      } else {
        return `🔍 Não encontrei nenhum evento para excluir. Seja mais específico (ex: "excluir matemática de hoje").`;
      }
    }
    
    // Solicitações de edição
    if (intent === 'edit_event') {
      const targetEvent = findEventByContext(userMessage);
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
        
        if (Object.keys(updates).length > 0) {
          const success = await editEvent(targetEvent.id, updates);
          if (success) {
            return `✨ Editei o evento "${targetEvent.title}" com sucesso!`;
          } else {
            return `❌ Não foi possível editar o evento. Tente novamente.`;
          }
        } else {
          return `🤔 Não identifiquei o que você quer alterar. Seja mais específico (ex: "mudar matemática para física").`;
        }
      } else {
        return `🔍 Não encontrei nenhum evento para editar. Seja mais específico (ex: "editar matemática de hoje").`;
      }
    }
    
    // Solicitações diretas de criação (executar imediatamente)
    if (intent === 'direct_create_event') {
      const targetSubject = parsed.subject || 'Revisão Geral';
      const targetDate = parsed.date;
      
      const success = await createScheduledEvent(targetSubject, targetDate);
      if (success) {
        let timeDescription = 'hoje às 14h';
        if (targetDate) {
          const day = targetDate.getDate();
          const month = targetDate.toLocaleDateString('pt-BR', { month: 'long' });
          timeDescription = `dia ${day} de ${month} às 14h`;
        } else if (new Date().getHours() >= 14) {
          timeDescription = 'amanhã às 14h';
        }
        return `✅ Agendei ${targetSubject} para ${timeDescription}! 📚`;
      } else {
        return `❌ Erro ao criar evento. Tente novamente.`;
      }
    }
    
    // Se for intenção de agendar, executar ação diretamente
    if (intent === 'schedule_event') {
      const success = await createScheduledEvent();
      if (success) {
        const progress = analyzeProgress(events);
        const subject = progress.leastStudiedSubject || 'Revisão Geral';
        const time = new Date().getHours() >= 14 ? 'amanhã às 14h' : 'hoje às 14h';
        return `✅ Agendei ${subject} para ${time}! 📚`;
      } else {
        return `❌ Erro ao criar evento. Tente novamente.`;
      }
    }

    try {
      // Usar serviço real de IA para outras intenções
      console.log('🤖 [CalendarAIChat] Chamando IA real...', { mode: selectedMode, intent });
      
      const chatResponse = await calendarChatService.generateChatResponse({
        message: userMessage,
        mode: selectedMode,
        events: events,
        userId: user.id
      });

      console.log('✅ [CalendarAIChat] Resposta recebida da IA real');
      
      // Se a IA gerou um cronograma, criar os eventos automaticamente
      if (chatResponse.suggestedSchedule && chatResponse.suggestedSchedule.length > 0) {
        console.log('📅 [CalendarAIChat] IA gerou cronograma, criando eventos...');
        const result = await createScheduleEvents(chatResponse.suggestedSchedule);
        
        if (result.successCount > 0) {
          return `${chatResponse.response}\n\n✅ ${result.successCount} atividades criadas! 📚`;
        } else {
          return `${chatResponse.response}\n\n❌ Erro ao criar atividades.`;
        }
      }
      
      return chatResponse.response;
      
    } catch (error) {
      console.error('❌ [CalendarAIChat] Erro ao chamar IA real:', error);
      
      // Fallback para respostas locais em caso de erro
      const progress = analyzeProgress(events);
      const fallbackResponses = {
        'analyze_progress': `📊 ${progress.completedEvents} concluídas (${progress.completionRate}%). Continue assim! 🎯`,
        'suggest_activities': `💡 Que tal ${progress.leastStudiedSubject || 'revisão'}? Posso agendar 2h?`,
        'general_chat': `😊 Oi! Como posso ajudar?`
      };

      return fallbackResponses[intent] || fallbackResponses['general_chat'];
    }
  };

  // Enviar mensagem
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
      mode: selectedMode
    };

    setMessagesState(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(inputValue.trim());
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        mode: selectedMode
      };

      setMessagesState(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erro ao gerar resposta da IA:', error);
      toast.error('Erro ao processar sua mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sugestões rápidas
  const quickSuggestions = [
    "Como estou?",
    "O que estudar?",
    "Criar cronograma",
    "Agendar atividade",
    "Editar próximo evento",
    "Excluir último evento"
  ];

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
        <div className={`border rounded-lg ${isExpanded ? 'h-96' : 'h-48'} overflow-y-auto p-4 space-y-3 bg-gray-50`}>
          <AnimatePresence>
            {messagesState.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-white border shadow-sm'
                }`}>
                  <div className="flex items-start gap-2">
                    {message.type === 'ai' && (
                      <div className="flex-shrink-0">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getModeColor(message.mode || selectedMode)}`}>
                          {getModeIcon(message.mode || selectedMode)}
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Indicador de digitação */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white border rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getModeColor(selectedMode)}`}>
                    {getModeIcon(selectedMode)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-600">Analisando...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Sugestões rápidas */}
        {messagesState.length <= 1 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-600">Sugestões rápidas:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input de mensagem */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Converse com ${selectedMode === 'APRU_1b' ? 'APRU 1b' : 'APRU REASONING'}...`}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="px-3"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

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
      message={celebrationMessageState}
      onComplete={() => setShowCelebration(false)}
      duration={3000}
    />
    </>
  );
};

export default CalendarAIChat;
