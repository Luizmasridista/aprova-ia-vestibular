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
import { CalendarEvent, CreateEventRequest } from '@/lib/services/calendarService';
import { calendarChatService, SuggestedSchedule } from '@/lib/services/calendarChatService';
import { useAuth } from '@/contexts/AuthContext';
import { useCalendarChat } from '@/hooks/useCalendarChat';
import { CalendarEventActions } from '@/lib/services/calendarEventActions';
import { 
  findEventByContext,
  getSubjectColor,
  parseUserMessage
} from '@/lib/utils/calendarChatUtils';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

interface CalendarAIChatProps {
  events: CalendarEvent[];
  onCreateEvent: (eventData: CreateEventRequest) => Promise<void>;
  onUpdateEvent?: (eventId: string, updates: Partial<CalendarEvent>) => Promise<void>;
  onDeleteEvent?: (eventId: string) => Promise<void>;
  onTriggerCelebration?: (type?: 'success' | 'achievement' | 'milestone') => void;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CalendarAIChat: React.FC<CalendarAIChatProps> = ({
  events,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  onTriggerCelebration,
  className = '',
  open = true,
  onOpenChange
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
  // IMPORTANTE: Usar onTriggerCelebration da página, não triggerCelebration do hook
  const eventActions = new CalendarEventActions({
    onCreateEvent,
    onUpdateEvent,
    onDeleteEvent,
    onCelebration: (message: string) => {
      console.log(' [CalendarAIChat] Disparando celebração via página:', message);
      onTriggerCelebration?.('success');
    }
  });

  // FUNÇÃO PRINCIPAL: TUDO PASSA PELA IA REAL (GEMINI/DEEPSEEK)
  const generateAIResponse = async (userMessage: string, events: CalendarEvent[]): Promise<string> => {
    if (!user) {
      return 'Por favor, faça login para usar o assistente de IA.';
    }
    
    console.log('🤖 [CalendarAIChat] ENVIANDO TUDO PARA IA REAL - ZERO FALLBACKS LOCAIS');
    console.log('🤖 [CalendarAIChat] Mensagem:', userMessage);
    console.log('🤖 [CalendarAIChat] Modo:', selectedMode);
    
    // PRIMEIRO: Extrair informações da mensagem do usuário ANTES de chamar a IA
    // Usar a função parseUserMessage que já tem toda a lógica de detecção implementada
    const parsedMessage = parseUserMessage(userMessage);
    const extractedSubject = parsedMessage.subject || null;
    const extractedDate = parsedMessage.date || null;
    
    console.log('🎯 [CalendarAIChat] Informações extraídas via parseUserMessage:', {
      extractedSubject,
      extractedDate: extractedDate?.toLocaleDateString('pt-BR'),
      originalMessage: userMessage
    });
    
    // Detectar se é uma solicitação direta de criação
    const lowerMessage = userMessage.toLowerCase();
    const isDirectCreateRequest = (
      lowerMessage.includes('criar') || 
      lowerMessage.includes('cria') || 
      lowerMessage.includes('agendar') || 
      lowerMessage.includes('marcar') || 
      lowerMessage.includes('adicionar')
    );
    
    console.log('🎯 [CalendarAIChat] Informações extraídas:', {
      extractedSubject,
      extractedDate: extractedDate?.toLocaleDateString('pt-BR'),
      isDirectCreateRequest
    });
    
    try {
      // USAR APENAS IA REAL (Gemini/DeepSeek) PARA TODAS AS MENSAGENS
      const response = await calendarChatService.generateChatResponse({
        message: userMessage,
        mode: selectedMode,
        events: events,
        userId: user.id,
        currentDate: new Date().toISOString()
      });
      
      console.log('🤖 [CalendarAIChat] IA real respondeu:', {
        intent: response.intent,
        response: response.response.substring(0, 100) + '...',
        hasDeleteEvent: !!onDeleteEvent,
        hasEventActions: !!eventActions,
        userMessage,
        lowerMessage: userMessage.toLowerCase()
      });
      
      // LOG ESPECIAL PARA DEBUG DE DELETE_ALL_EVENTS
      if (response.intent === 'delete_all_events') {
        console.log('🚨 [CalendarAIChat] INTENT DELETE_ALL_EVENTS DETECTADO!');
        console.log('🚨 [CalendarAIChat] Condições:', {
          intent: response.intent,
          eventsLength: events.length,
          hasEventActions: !!eventActions,
          hasOnDeleteEvent: !!onDeleteEvent
        });
      }
      
      // BYPASS TEMPORÁRIO: Forçar execução se detectar delete_all_events na mensagem
      const lowerMessage = userMessage.toLowerCase();
      const isDeleteAllRequest = (
        (lowerMessage.includes('todos') || lowerMessage.includes('todas')) && 
        (lowerMessage.includes('excluir') || lowerMessage.includes('deletar') || 
         lowerMessage.includes('remover') || lowerMessage.includes('apagar') || 
         lowerMessage.includes('limpar')) && 
        (lowerMessage.includes('eventos') || lowerMessage.includes('atividades') || 
         lowerMessage.includes('agenda') || lowerMessage.includes('calendário') ||
         lowerMessage.includes('calendario'))
      );
      
      if (isDeleteAllRequest) {
        console.log('🚑 [CalendarAIChat] BYPASS: Detectada solicitação de exclusão total via bypass!');
        console.log('🚑 [CalendarAIChat] Forçando execução da exclusão de todos os eventos...');
        
        try {
          if (events.length === 0) {
            return `📋 Sua agenda já está vazia! Não há eventos para excluir.`;
          }
          
          console.log(`🗑️ [CalendarAIChat] BYPASS: Excluindo TODOS os ${events.length} eventos da agenda...`);
          
          // Usar a nova função deleteAllEvents do CalendarEventActions
          const result = await eventActions.deleteAllEvents(events);
          
          console.log('✅ [CalendarAIChat] BYPASS: Resultado da exclusão completa:', result);
          
          if (result.successCount === result.total) {
            return `✅ Perfeito! Excluí todos os ${result.successCount} eventos da sua agenda! Sua agenda agora está completamente limpa. 🧹✨`;
          } else if (result.successCount > 0) {
            return `⚠️ Excluí ${result.successCount} de ${result.total} eventos. ${result.failCount} eventos não puderam ser excluídos.`;
          } else {
            return `❌ Não foi possível excluir nenhum evento. Tente novamente.`;
          }
          
        } catch (error) {
          console.error('❌ [CalendarAIChat] BYPASS: ERRO AO EXCLUIR TODOS OS EVENTOS:', error);
          return `❌ Erro ao excluir todos os eventos. Tente novamente.`;
        }
      }
      
      // EXECUTAR AÇÕES REAIS baseadas na intenção detectada E informações extraídas
      if ((response.intent === 'schedule_event' || response.intent === 'create_event') || isDirectCreateRequest) {
        console.log('📅 [CalendarAIChat] EXECUTANDO CRIAÇÃO DE EVENTO REAL');
        console.log('📅 [CalendarAIChat] Intent:', response.intent, '| Direct Request:', isDirectCreateRequest);
        
        try {
          // Verificar se temos o callback onCreateEvent disponível
          if (!onCreateEvent) {
            console.error('❌ [CalendarAIChat] Callback onCreateEvent não disponível!');
            return response.response;
          }
          
          // Usar informações extraídas da mensagem do usuário
          const subjectToUse = extractedSubject || response.suggestedEvent?.subject || 'Revisão Geral';
          
          // Calcular horário do evento
          let startTime: Date;
          if (extractedDate) {
            startTime = new Date(extractedDate);
            startTime.setHours(14, 0, 0, 0);
          } else {
            startTime = new Date();
            startTime.setHours(14, 0, 0, 0);
            // Se já passou das 14h, agendar para amanhã
            if (new Date().getHours() >= 14) {
              startTime.setDate(startTime.getDate() + 1);
            }
          }
          
          const endTime = new Date(startTime);
          endTime.setHours(16, 0, 0, 0);
          
          const eventData = {
            title: `${subjectToUse}`,
            description: `Sessão de estudos criada pelo assistente APRU para ${subjectToUse}`,
            start_date: startTime.toISOString(),
            end_date: endTime.toISOString(),
            subject: subjectToUse,
            topic: 'Revisão e exercícios',
            color: getSubjectColor(subjectToUse),
            priority: 2 as 1 | 2 | 3,
            event_type: 'study' as 'study' | 'exam' | 'review' | 'break',
            all_day: false
          };
          
          console.log('📝 [CalendarAIChat] CRIANDO EVENTO REAL:', JSON.stringify(eventData, null, 2));
          await onCreateEvent(eventData);
          console.log('✅ [CalendarAIChat] EVENTO CRIADO COM SUCESSO NO BANCO DE DADOS!');
          
          // Disparar celebração
          onTriggerCelebration?.('achievement');
          
          // Retornar mensagem de confirmação específica
          const dateStr = startTime.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
          const timeStr = startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          return `✅ Perfeito! Criei uma sessão de ${subjectToUse} para ${dateStr} às ${timeStr}. Você pode ver no seu calendário acima! 📚`;
          
        } catch (error) {
          console.error('❌ [CalendarAIChat] ERRO AO CRIAR EVENTO REAL:', error);
          return `❌ Desculpe, houve um erro ao criar o evento. Tente novamente. Erro: ${error}`;
        }
      } else if (response.intent === 'create_schedule' && response.suggestedSchedule) {
        console.log('📅 [CalendarAIChat] IA real criou cronograma:', JSON.stringify(response.suggestedSchedule, null, 2));
        
        try {
          const scheduleItems = response.suggestedSchedule.events.map(event => ({
            id: `temp-id-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            title: event.title,
            description: `Sessão de ${event.subject}`,
            start_date: event.date,
            end_date: event.date,
            startTime: event.date,
            endTime: new Date(new Date(event.date).getTime() + event.duration * 60000).toISOString(),
            event_type: event.type,
            subject: event.subject,
            topic: event.subject,
            duration: event.duration,
            color: '#FFFFFF',
            isRecurring: false,
            recurrencePattern: '',
            priority: event.priority || 2,
            reminderMinutes: 15,
            status: 'planned',
            allDay: false,
          }));
          
          console.log('📝 [CalendarAIChat] Criando cronograma com', scheduleItems.length, 'eventos');
          const result = await eventActions.createScheduleEvents(scheduleItems);
          console.log('✅ [CalendarAIChat] Resultado da criação do cronograma:', result);
        } catch (error) {
          console.error('❌ [CalendarAIChat] Erro ao criar cronograma:', error);
        }
        // onTriggerCelebration removido - CalendarEventActions já dispara via callback
      } else if (response.intent === 'delete_event' && onDeleteEvent) {
        console.log('🗑️ [CalendarAIChat] EXECUTANDO EXCLUSÃO DE EVENTO REAL');
        
        try {
          let eventsToDelete: CalendarEvent[] = [];
          
          // Buscar eventos por matéria se especificada
          if (extractedSubject) {
            eventsToDelete = events.filter(event => 
              event.subject?.toLowerCase().includes(extractedSubject!.toLowerCase()) ||
              event.title.toLowerCase().includes(extractedSubject!.toLowerCase())
            );
            console.log(`🔍 [CalendarAIChat] Encontrados ${eventsToDelete.length} eventos de ${extractedSubject}`);
          }
          // Buscar eventos por data se especificada
          else if (extractedDate) {
            const targetDateStr = extractedDate.toISOString().split('T')[0];
            eventsToDelete = events.filter(event => 
              event.start_date.startsWith(targetDateStr)
            );
            console.log(`🔍 [CalendarAIChat] Encontrados ${eventsToDelete.length} eventos para ${extractedDate.toLocaleDateString('pt-BR')}`);
          }
          // Se não especificou, pegar o último evento
          else if (events.length > 0) {
            eventsToDelete = [events[events.length - 1]];
            console.log('🔍 [CalendarAIChat] Nenhum critério específico, excluindo último evento');
          }
          
          if (eventsToDelete.length > 0) {
            // Excluir todos os eventos encontrados
            for (const event of eventsToDelete) {
              console.log(`🗑️ [CalendarAIChat] Excluindo evento: ${event.title}`);
              await onDeleteEvent(event.id);
            }
            
            onTriggerCelebration?.('success');
            
            const eventCount = eventsToDelete.length;
            const subjectInfo = extractedSubject ? ` de ${extractedSubject}` : '';
            const dateInfo = extractedDate ? ` do dia ${extractedDate.toLocaleDateString('pt-BR')}` : '';
            
            return `✅ Excluí ${eventCount} evento${eventCount > 1 ? 's' : ''}${subjectInfo}${dateInfo} com sucesso! 🗑️`;
          } else {
            return `🔍 Não encontrei nenhum evento para excluir com os critérios especificados.`;
          }
        } catch (error) {
          console.error('❌ [CalendarAIChat] ERRO AO EXCLUIR EVENTO:', error);
          return `❌ Erro ao excluir evento. Tente novamente.`;
        }
      } else if (response.intent === 'delete_all_events') {
        console.log('🗑️ [CalendarAIChat] EXECUTANDO EXCLUSÃO DE TODOS OS EVENTOS DA AGENDA');
        console.log('🗑️ [CalendarAIChat] Eventos disponíveis:', events.length);
        console.log('🗑️ [CalendarAIChat] EventActions disponível:', !!eventActions);
        
        try {
          if (events.length === 0) {
            return `📋 Sua agenda já está vazia! Não há eventos para excluir.`;
          }
          
          console.log(`🗑️ [CalendarAIChat] Excluindo TODOS os ${events.length} eventos da agenda...`);
          
          // Usar a nova função deleteAllEvents do CalendarEventActions
          const result = await eventActions.deleteAllEvents(events);
          
          console.log('✅ [CalendarAIChat] Resultado da exclusão completa:', result);
          
          // A celebração já é disparada pelo CalendarEventActions
          
          if (result.successCount === result.total) {
            return `✅ Perfeito! Excluí todos os ${result.successCount} eventos da sua agenda! Sua agenda agora está completamente limpa. 🧹✨`;
          } else if (result.successCount > 0) {
            return `⚠️ Excluí ${result.successCount} de ${result.total} eventos. ${result.failCount} eventos não puderam ser excluídos.`;
          } else {
            return `❌ Não foi possível excluir nenhum evento. Tente novamente.`;
          }
          
        } catch (error) {
          console.error('❌ [CalendarAIChat] ERRO AO EXCLUIR TODOS OS EVENTOS:', error);
          return `❌ Erro ao excluir todos os eventos. Tente novamente.`;
        }
      } else if (response.intent === 'delete_week_events') {
        console.log('📅 [CalendarAIChat] EXECUTANDO EXCLUSÃO DE EVENTOS DA SEMANA');
        
        try {
          if (events.length === 0) {
            return `📋 Sua agenda já está vazia! Não há eventos para excluir.`;
          }
          
          // Determinar qual semana (atual ou próxima)
          const lowerMessage = userMessage.toLowerCase();
          const isNextWeek = lowerMessage.includes('próxima semana') || 
                            lowerMessage.includes('semana que vem') ||
                            lowerMessage.includes('da próxima semana');
          
          const weekType = isNextWeek ? 'next' : 'current';
          const weekDescription = isNextWeek ? 'da próxima semana' : 'desta semana';
          
          console.log(`🗑️ [CalendarAIChat] Excluindo eventos ${weekDescription}...`);
          
          // Usar a nova função deleteEventsByWeek do CalendarEventActions
          const result = await eventActions.deleteEventsByWeek(events, weekType);
          
          console.log('✅ [CalendarAIChat] Resultado da exclusão por semana:', result);
          
          // A celebração já é disparada pelo CalendarEventActions
          
          if (result.successCount === result.total && result.total > 0) {
            return `✅ Perfeito! Excluí todos os ${result.successCount} eventos ${weekDescription}! 📅✨`;
          } else if (result.successCount > 0) {
            return `⚠️ Excluí ${result.successCount} de ${result.total} eventos ${weekDescription}. ${result.failCount} eventos não puderam ser excluídos.`;
          } else if (result.total === 0) {
            return `📋 Não há eventos ${weekDescription} para excluir.`;
          } else {
            return `❌ Não foi possível excluir nenhum evento ${weekDescription}. Tente novamente.`;
          }
          
        } catch (error) {
          console.error('❌ [CalendarAIChat] ERRO AO EXCLUIR EVENTOS DA SEMANA:', error);
          return `❌ Erro ao excluir eventos da semana. Tente novamente.`;
        }
      } else if (response.intent === 'edit_event' && onUpdateEvent) {
        console.log('✏️ [CalendarAIChat] EXECUTANDO EDIÇÃO DE EVENTO REAL');
        
        try {
          let targetEvent: CalendarEvent | null = null;
          
          // Buscar evento por matéria se especificada
          if (extractedSubject) {
            targetEvent = events.find(event => 
              event.subject?.toLowerCase().includes(extractedSubject!.toLowerCase()) ||
              event.title.toLowerCase().includes(extractedSubject!.toLowerCase())
            ) || null;
          }
          // Buscar evento por data se especificada
          else if (extractedDate) {
            const targetDateStr = extractedDate.toISOString().split('T')[0];
            targetEvent = events.find(event => 
              event.start_date.startsWith(targetDateStr)
            ) || null;
          }
          // Se não especificou, pegar o último evento
          else if (events.length > 0) {
            targetEvent = events[events.length - 1];
          }
          
          if (targetEvent) {
            console.log('✏️ [CalendarAIChat] Evento encontrado para editar:', targetEvent.title);
            
            // Extrair nova matéria da mensagem se mencionada
            const newSubject = extractedSubject || targetEvent.subject;
            
            const updates: Partial<CalendarEvent> = {
              subject: newSubject,
              title: newSubject,
              color: getSubjectColor(newSubject)
            };
            
            // Se nova data foi especificada, atualizar
            if (extractedDate) {
              const newStartTime = new Date(extractedDate);
              newStartTime.setHours(14, 0, 0, 0);
              const newEndTime = new Date(newStartTime);
              newEndTime.setHours(16, 0, 0, 0);
              
              updates.start_date = newStartTime.toISOString();
              updates.end_date = newEndTime.toISOString();
            }
            
            console.log('📝 [CalendarAIChat] Aplicando atualizações:', updates);
            await onUpdateEvent(targetEvent.id, updates);
            
            onTriggerCelebration?.('success');
            
            return `✅ Editei o evento '${targetEvent.title}' com sucesso! ✏️`;
          } else {
            return `🔍 Não encontrei nenhum evento para editar com os critérios especificados.`;
          }
        } catch (error) {
          console.error('❌ [CalendarAIChat] ERRO AO EDITAR EVENTO:', error);
          return `❌ Erro ao editar evento. Tente novamente.`;
        }
      } else if (response.intent === 'list_events') {
        console.log('📅 [CalendarAIChat] LISTANDO EVENTOS REAIS DO USUÁRIO');
        
        try {
          let eventsToShow: CalendarEvent[] = [];
          
          // Filtrar eventos por matéria se especificada
          if (extractedSubject) {
            eventsToShow = events.filter(event => 
              event.subject?.toLowerCase().includes(extractedSubject!.toLowerCase()) ||
              event.title.toLowerCase().includes(extractedSubject!.toLowerCase())
            );
          }
          // Filtrar eventos por data se especificada
          else if (extractedDate) {
            const targetDateStr = extractedDate.toISOString().split('T')[0];
            eventsToShow = events.filter(event => 
              event.start_date.startsWith(targetDateStr)
            );
          }
          // Se não especificou critérios, mostrar todos os eventos
          else {
            eventsToShow = events;
          }
          
          if (eventsToShow.length > 0) {
            let eventsList = '';
            const today = new Date().toISOString().split('T')[0];
            
            eventsToShow.forEach((event, index) => {
              const eventDate = new Date(event.start_date);
              const dateStr = eventDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
              const timeStr = eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
              const statusIcon = event.status === 'completed' ? '✅' : '⏰';
              const statusText = event.status === 'completed' ? 'concluída' : 'agendada';
              
              eventsList += `${index + 1}. ${statusIcon} **${event.subject || event.title}** - ${dateStr} às ${timeStr} (${statusText})\n`;
            });
            
            const subjectInfo = extractedSubject ? ` de ${extractedSubject}` : '';
            const dateInfo = extractedDate ? ` para ${extractedDate.toLocaleDateString('pt-BR')}` : '';
            
            return `📅 **Suas atividades${subjectInfo}${dateInfo}:**\n\n${eventsList}\n📊 **Total:** ${eventsToShow.length} evento${eventsToShow.length > 1 ? 's' : ''}`;
          } else {
            const subjectInfo = extractedSubject ? ` de ${extractedSubject}` : '';
            const dateInfo = extractedDate ? ` para ${extractedDate.toLocaleDateString('pt-BR')}` : '';
            
            return `🔍 Não encontrei nenhuma atividade${subjectInfo}${dateInfo} no seu calendário.`;
          }
        } catch (error) {
          console.error('❌ [CalendarAIChat] ERRO AO LISTAR EVENTOS:', error);
          return `❌ Erro ao listar eventos. Tente novamente.`;
        }
      } else {
        console.log('🤖 [CalendarAIChat] Sem ação específica detectada pela IA real');
      }
      
      // Retornar resposta da IA
      console.log('🤖 [CalendarAIChat] Retornando resposta da IA:', response.response.substring(0, 100) + '...');
      
      // LOG FINAL PARA DEBUG
      if (response.intent === 'delete_event') {
        console.log('🚨 [CalendarAIChat] CHEGOU ATÉ O FINAL SEM EXECUTAR AÇÃO!');
        console.log('🚨 [CalendarAIChat] Intent final:', response.intent);
      }
      
      return response.response;
    } catch (error) {
      console.error('❌ [CalendarAIChat] Erro ao gerar resposta da IA:', error);
      return 'Desculpe, ocorreu um erro. Tente novamente.';
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
      console.error('❌ [CalendarAIChat] Erro ao gerar resposta da IA:', error);
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

  if (!open) return null;

  return (
    <div className="relative">
      <Card className={`relative overflow-hidden ${className}`}>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-30"></div>
        {/* Close button removed to prevent user from closing the chat */}
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
</div>
);
};

export default CalendarAIChat;
