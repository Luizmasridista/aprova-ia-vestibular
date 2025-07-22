import { CalendarEvent } from '@/lib/services/calendarService';

// Analisar progresso do usuário
export const analyzeProgress = (events: CalendarEvent[]) => {
  const completedEvents = events.filter(e => e.status === 'completed');
  const scheduledEvents = events.filter(e => e.status === 'scheduled');
  const subjectStats = events.reduce((acc, event) => {
    if (event.subject) {
      acc[event.subject] = (acc[event.subject] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const completedSubjects = completedEvents.reduce((acc, event) => {
    if (event.subject) {
      acc[event.subject] = (acc[event.subject] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return {
    totalEvents: events.length,
    completedEvents: completedEvents.length,
    scheduledEvents: scheduledEvents.length,
    completionRate: events.length > 0 ? Math.round((completedEvents.length / events.length) * 100) : 0,
    subjectStats,
    completedSubjects,
    mostStudiedSubject: Object.keys(subjectStats).reduce((a, b) => subjectStats[a] > subjectStats[b] ? a : b, ''),
    leastStudiedSubject: Object.keys(subjectStats).reduce((a, b) => subjectStats[a] < subjectStats[b] ? a : b, '')
  };
};

// Extrair informações específicas da mensagem do usuário
export const parseUserMessage = (message: string) => {
  const lowerMessage = message.toLowerCase().trim();
  
  console.log(' [CalendarChatUtils] Analisando mensagem:', { original: message, lower: lowerMessage });
  
  // Detectar matérias mencionadas - versão expandida
  const subjects = {
    'física': 'Física',
    'fisica': 'Física',
    'fis': 'Física',
    'matemática': 'Matemática',
    'matematica': 'Matemática',
    'mat': 'Matemática',
    'math': 'Matemática',
    'português': 'Português',
    'portugues': 'Português',
    'port': 'Português',
    'redação': 'Português',
    'redacao': 'Português',
    'química': 'Química',
    'quimica': 'Química',
    'qui': 'Química',
    'biologia': 'Biologia',
    'bio': 'Biologia',
    'história': 'História',
    'historia': 'História',
    'hist': 'História',
    'geografia': 'Geografia',
    'geo': 'Geografia',
    'inglês': 'Inglês',
    'ingles': 'Inglês',
    'english': 'Inglês',
    'literatura': 'Literatura',
    'filosofia': 'Filosofia',
    'sociologia': 'Sociologia'
  };
  
  let detectedSubject = null;
  for (const [key, value] of Object.entries(subjects)) {
    if (lowerMessage.includes(key)) {
      detectedSubject = value;
      console.log(' [CalendarChatUtils] Matéria detectada:', { key, value });
      break;
    }
  }
  
  // Detectar referências temporais - versão muito melhorada
  let detectedDate = null;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalizar para início do dia
  
  // Palavras-chave temporais
  if (lowerMessage.includes('hoje')) {
    detectedDate = new Date(today);
    console.log(' [CalendarChatUtils] Data "hoje" detectada:', detectedDate.toLocaleDateString('pt-BR'));
  } else if (lowerMessage.includes('amanhã') || lowerMessage.includes('amanha')) {
    detectedDate = new Date(today);
    detectedDate.setDate(detectedDate.getDate() + 1);
    console.log(' [CalendarChatUtils] Data "amanhã" detectada:', detectedDate.toLocaleDateString('pt-BR'));
  } else if (lowerMessage.includes('depois de amanhã') || lowerMessage.includes('depois de amanha')) {
    detectedDate = new Date(today);
    detectedDate.setDate(detectedDate.getDate() + 2);
    console.log(' [CalendarChatUtils] Data "depois de amanhã" detectada:', detectedDate.toLocaleDateString('pt-BR'));
  } else if (lowerMessage.includes('ontem')) {
    detectedDate = new Date(today);
    detectedDate.setDate(detectedDate.getDate() - 1);
    console.log(' [CalendarChatUtils] Data "ontem" detectada:', detectedDate.toLocaleDateString('pt-BR'));
  }
  
  // Detectar números de dias - versões múltiplas
  const dayPatterns = [
    /(?:dia|do dia)\s*(\d{1,2})/,  // "dia 22", "do dia 22"
    /(?:no dia)\s*(\d{1,2})/,     // "no dia 22"
    /(?:para o dia)\s*(\d{1,2})/, // "para o dia 22"
    /(?:^|\s)(\d{1,2})(?:\s*(?:de|do)\s*(?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez))?(?:\s|$)/, // "22", "22 de janeiro"
    /(?:^|\s)(\d{1,2})(?:\s|$)/   // Número isolado
  ];
  
  for (const pattern of dayPatterns) {
    const dayMatch = lowerMessage.match(pattern);
    if (dayMatch) {
      const day = parseInt(dayMatch[1]);
      if (day >= 1 && day <= 31) {
        detectedDate = new Date(today.getFullYear(), today.getMonth(), day);
        
        // Se o dia já passou neste mês, assumir próximo mês
        if (detectedDate < today) {
          detectedDate.setMonth(detectedDate.getMonth() + 1);
        }
        
        console.log(' [CalendarChatUtils] Data numérica detectada:', {
          originalMessage: message,
          pattern: pattern.source,
          dayMatch: dayMatch[1],
          detectedDate: detectedDate.toLocaleDateString('pt-BR'),
          wasInPast: detectedDate.getMonth() !== today.getMonth()
        });
        break;
      }
    }
  }
  
  // Detectar dias da semana
  const weekDays = {
    'segunda': 1, 'segunda-feira': 1,
    'terça': 2, 'terca': 2, 'terça-feira': 2, 'terca-feira': 2,
    'quarta': 3, 'quarta-feira': 3,
    'quinta': 4, 'quinta-feira': 4,
    'sexta': 5, 'sexta-feira': 5,
    'sábado': 6, 'sabado': 6,
    'domingo': 0
  };
  
  for (const [dayName, dayNumber] of Object.entries(weekDays)) {
    if (lowerMessage.includes(dayName)) {
      const currentDay = today.getDay();
      let daysUntil = dayNumber - currentDay;
      if (daysUntil <= 0) daysUntil += 7; // Próxima ocorrência
      
      detectedDate = new Date(today);
      detectedDate.setDate(detectedDate.getDate() + daysUntil);
      console.log(' [CalendarChatUtils] Dia da semana detectado:', {
        dayName,
        dayNumber,
        daysUntil,
        detectedDate: detectedDate.toLocaleDateString('pt-BR')
      });
      break;
    }
  }
  
  // Detectar se é uma solicitação direta (com matéria ou data específica)
  const isDirectRequest = lowerMessage.includes('agendar') || 
                         lowerMessage.includes('criar') || 
                         lowerMessage.includes('marcar') ||
                         lowerMessage.includes('adicionar') ||
                         (detectedSubject && (lowerMessage.includes('para') || lowerMessage.includes('de')));
  
  // Detectar se é solicitação de listagem
  const isListRequest = lowerMessage.includes('quais') ||
                       lowerMessage.includes('que atividades') ||
                       lowerMessage.includes('que eventos') ||
                       lowerMessage.includes('o que tenho') ||
                       lowerMessage.includes('mostrar') ||
                       lowerMessage.includes('listar') ||
                       lowerMessage.includes('ver atividades') ||
                       lowerMessage.includes('ver eventos');
  
  const result = {
    subject: detectedSubject,
    date: detectedDate,
    isDirectRequest,
    isListRequest,
    originalMessage: message
  };
  
  console.log(' [CalendarChatUtils] Resultado do parsing:', result);
  return result;
};

// Detectar intenções do usuário
export const detectUserIntent = (message: string): 'schedule_event' | 'analyze_progress' | 'suggest_activities' | 'general_chat' | 'create_schedule' | 'direct_create_event' | 'edit_event' | 'delete_event' | 'list_events' => {
  const lowerMessage = message.toLowerCase().trim();
  const parsed = parseUserMessage(message);
  
  console.log(' [CalendarChatUtils] Detectando intenção:', { message, lowerMessage, parsed });
  
  // Solicitações de listagem/consulta - NOVA FUNCIONALIDADE
  if (parsed.isListRequest || 
      lowerMessage.includes('tenho hoje') ||
      lowerMessage.includes('tenho no dia') ||
      lowerMessage.includes('tenho amanhã') ||
      lowerMessage.includes('atividades de hoje') ||
      lowerMessage.includes('eventos de hoje') ||
      lowerMessage.includes('atividades do dia') ||
      lowerMessage.includes('eventos do dia') ||
      lowerMessage.includes('agenda de hoje') ||
      lowerMessage.includes('agenda do dia') ||
      (lowerMessage.includes('que') && (lowerMessage.includes('tenho') || lowerMessage.includes('tem'))) ||
      (lowerMessage.includes('mostrar') && (lowerMessage.includes('atividades') || lowerMessage.includes('eventos')))) {
    console.log(' [CalendarChatUtils] Intenção de listagem detectada');
    return 'list_events';
  }
  
  // Solicitações de exclusão - versão melhorada
  if (lowerMessage.includes('excluir') || lowerMessage.includes('deletar') || 
      lowerMessage.includes('remover') || lowerMessage.includes('cancelar') || 
      lowerMessage.includes('apagar') || lowerMessage.includes('excluía') || 
      lowerMessage.includes('remova') || lowerMessage.includes('pode remover') || 
      lowerMessage.includes('exclua') || lowerMessage.includes('tire') ||
      lowerMessage.includes('eliminar') || lowerMessage.includes('desmarcar')) {
    console.log(' [CalendarChatUtils] Intenção de exclusão detectada');
    return 'delete_event';
  }
  
  // Solicitações de edição
  if (lowerMessage.includes('editar') || lowerMessage.includes('alterar') || lowerMessage.includes('modificar') ||
      lowerMessage.includes('mudar') || lowerMessage.includes('trocar') || lowerMessage.includes('reagendar') ||
      lowerMessage.includes('mover') || lowerMessage.includes('transferir') || lowerMessage.includes('ajustar')) {
    console.log(' [CalendarChatUtils] Intenção de edição detectada');
    return 'edit_event';
  }
  
  // Solicitações diretas de criação (com matéria ou data específica)
  if (parsed.isDirectRequest && (parsed.subject || parsed.date)) {
    console.log(' [CalendarChatUtils] Intenção de criação direta detectada');
    return 'direct_create_event';
  }
  
  // Intenções de confirmação para agendar (mais específicas)
  if (lowerMessage.includes('pode agendar') || 
      lowerMessage.includes('sim, agende') ||
      lowerMessage.includes('sim, pode') ||
      lowerMessage.includes('agende') ||
      lowerMessage.includes('vamos agendar') ||
      lowerMessage.includes('ok, agende') ||
      lowerMessage.includes('aceito agendar') ||
      lowerMessage.includes('confirmo o agendamento') ||
      lowerMessage.includes('confirmar') ||
      (lowerMessage === 'sim' && message.length <= 4) || // Apenas "sim" isolado
      (lowerMessage === 'ok' && message.length <= 3)) {   // Apenas "ok" isolado
    console.log(' [CalendarChatUtils] Intenção de agendamento detectada');
    return 'schedule_event';
  }
  
  // Intenções de criar cronograma completo
  if (lowerMessage.includes('crie um cronograma') ||
      lowerMessage.includes('gere atividades') ||
      lowerMessage.includes('monte um plano') ||
      lowerMessage.includes('organize minha semana') ||
      lowerMessage.includes('cronograma de estudos') ||
      lowerMessage.includes('plano de estudos') ||
      lowerMessage.includes('criar cronograma') ||
      (lowerMessage.includes('atividades para') && (lowerMessage.includes('semana') || lowerMessage.includes('próximos dias')))) {
    console.log(' [CalendarChatUtils] Intenção de criar cronograma detectada');
    return 'create_schedule';
  }
  
  // Intenções de análise
  if (lowerMessage.includes('progresso') || 
      lowerMessage.includes('analise') ||
      lowerMessage.includes('como estou') ||
      lowerMessage.includes('meu desempenho') ||
      lowerMessage.includes('estatísticas') ||
      lowerMessage.includes('estatisticas')) {
    console.log(' [CalendarChatUtils] Intenção de análise detectada');
    return 'analyze_progress';
  }
  
  // Intenções de sugestão
  if (lowerMessage.includes('sugira') || 
      lowerMessage.includes('recomende') ||
      lowerMessage.includes('o que estudar') ||
      lowerMessage.includes('que matéria') ||
      lowerMessage.includes('que materia') ||
      lowerMessage.includes('sugestão') ||
      lowerMessage.includes('sugestao') ||
      lowerMessage.includes('dica')) {
    console.log(' [CalendarChatUtils] Intenção de sugestão detectada');
    return 'suggest_activities';
  }
  
  console.log(' [CalendarChatUtils] Intenção geral detectada');
  return 'general_chat';
};

// Encontrar evento por matéria ou data
export const findEventByContext = (message: string, events: CalendarEvent[]) => {
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

// Cores por matéria
export const getSubjectColor = (subject: string) => {
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

// Define and export Message type
export type Message = {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
};
