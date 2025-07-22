import { CalendarEvent } from './calendarService';

interface ChatRequest {
  message: string;
  mode: 'APRU_1b' | 'APRU_REASONING';
  events: CalendarEvent[];
  userId: string;
}

interface ChatResponse {
  response: string;
  intent: 'schedule_event' | 'analyze_progress' | 'suggest_activities' | 'general_chat' | 'create_schedule' | 'direct_create_event' | 'edit_event' | 'delete_event';
  suggestedEvent?: {
    title: string;
    description: string;
    subject: string;
    topic: string;
    duration: number; // em minutos
    priority: number;
  };
  suggestedSchedule?: Array<{
    title: string;
    description: string;
    subject: string;
    topic: string;
    startTime: string; // ISO string
    endTime: string; // ISO string
    priority: number;
    color: string;
  }>;
}

class CalendarChatService {
  private deepseekApiKey: string;
  private geminiApiKey: string;

  constructor() {
    this.deepseekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  // Analisar progresso do usuário
  private analyzeUserProgress(events: CalendarEvent[]) {
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

    const mostStudiedSubject = Object.keys(subjectStats).reduce((a, b) => 
      subjectStats[a] > subjectStats[b] ? a : b, '');
    
    const leastStudiedSubject = Object.keys(subjectStats).reduce((a, b) => 
      subjectStats[a] < subjectStats[b] ? a : b, '');

    return {
      totalEvents: events.length,
      completedEvents: completedEvents.length,
      scheduledEvents: scheduledEvents.length,
      completionRate: events.length > 0 ? Math.round((completedEvents.length / events.length) * 100) : 0,
      subjectStats,
      completedSubjects,
      mostStudiedSubject,
      leastStudiedSubject,
      recentActivity: events.slice(-5).map(e => ({
        subject: e.subject,
        status: e.status,
        date: e.start_date
      }))
    };
  }

  // Detectar intenção do usuário
  private detectIntent(message: string): 'schedule_event' | 'analyze_progress' | 'suggest_activities' | 'general_chat' | 'create_schedule' | 'direct_create_event' | 'edit_event' | 'delete_event' {
    const lowerMessage = message.toLowerCase();
    
    // Solicitações de exclusão
    if (lowerMessage.includes('excluir') || lowerMessage.includes('deletar') || lowerMessage.includes('remover') || 
        lowerMessage.includes('cancelar') || lowerMessage.includes('apagar')) {
      return 'delete_event';
    }
    
    // Solicitações de edição
    if (lowerMessage.includes('editar') || lowerMessage.includes('alterar') || lowerMessage.includes('modificar') || 
        lowerMessage.includes('mudar') || lowerMessage.includes('trocar') || lowerMessage.includes('reagendar')) {
      return 'edit_event';
    }
    
    // Solicitações diretas de criação (com matéria ou data específica)
    if ((lowerMessage.includes('cria') || lowerMessage.includes('criar') || lowerMessage.includes('agendar') || lowerMessage.includes('marcar')) &&
        (lowerMessage.includes('física') || lowerMessage.includes('fisica') || 
         lowerMessage.includes('matemática') || lowerMessage.includes('matematica') ||
         lowerMessage.includes('português') || lowerMessage.includes('portugues') ||
         lowerMessage.includes('química') || lowerMessage.includes('quimica') ||
         lowerMessage.includes('biologia') || lowerMessage.includes('história') || lowerMessage.includes('historia') ||
         lowerMessage.includes('geografia') || lowerMessage.includes('dia \\d') || lowerMessage.includes('para o dia'))) {
      return 'direct_create_event';
    }
    
    // Intenções de confirmação para agendar
    if (lowerMessage.includes('pode agendar') || 
        lowerMessage.includes('sim') || 
        lowerMessage.includes('agende') ||
        lowerMessage.includes('vamos') ||
        lowerMessage.includes('ok') ||
        lowerMessage.includes('aceito') ||
        lowerMessage.includes('confirmo')) {
      return 'schedule_event';
    }
    
    // Intenções de criar cronograma completo
    if (lowerMessage.includes('crie um cronograma') ||
        lowerMessage.includes('gere atividades') ||
        lowerMessage.includes('monte um plano') ||
        lowerMessage.includes('organize minha semana') ||
        lowerMessage.includes('cronograma de estudos') ||
        lowerMessage.includes('plano de estudos') ||
        lowerMessage.includes('atividades para') && (lowerMessage.includes('semana') || lowerMessage.includes('próximos dias'))) {
      return 'create_schedule';
    }
    
    // Intenções de análise
    if (lowerMessage.includes('progresso') || 
        lowerMessage.includes('analise') ||
        lowerMessage.includes('como estou') ||
        lowerMessage.includes('estatística')) {
      return 'analyze_progress';
    }
    
    // Intenções de sugestão
    if (lowerMessage.includes('sugira') || 
        lowerMessage.includes('recomende') ||
        lowerMessage.includes('o que estudar') ||
        lowerMessage.includes('qual matéria') ||
        lowerMessage.includes('atividade')) {
      return 'suggest_activities';
    }
    
    return 'general_chat';
  }

  // Analisar mensagem do usuário para extrair matéria e data específicas
  private parseUserMessage(message: string): { subject?: string; date?: Date; isDirectRequest: boolean } {
    const lowerMessage = message.toLowerCase();
    let subject: string | undefined;
    let date: Date | undefined;
    
    // Detectar matérias
    const subjects: { [key: string]: string } = {
      'física': 'Física',
      'fisica': 'Física',
      'matemática': 'Matemática',
      'matematica': 'Matemática',
      'português': 'Português',
      'portugues': 'Português',
      'química': 'Química',
      'quimica': 'Química',
      'biologia': 'Biologia',
      'história': 'História',
      'historia': 'História',
      'geografia': 'Geografia'
    };
    
    for (const [key, value] of Object.entries(subjects)) {
      if (lowerMessage.includes(key)) {
        subject = value;
        break;
      }
    }
    
    // Detectar datas (formato simples)
    const datePatterns = [
      /dia (\d{1,2})/, // "dia 25"
      /para o dia (\d{1,2})/, // "para o dia 25"
      /(\d{1,2})\/(\d{1,2})/, // "25/01"
      /amanhã/, // "amanhã"
      /hoje/ // "hoje"
    ];
    
    for (const pattern of datePatterns) {
      const match = lowerMessage.match(pattern);
      if (match) {
        if (match[0].includes('amanhã')) {
          date = new Date();
          date.setDate(date.getDate() + 1);
        } else if (match[0].includes('hoje')) {
          date = new Date();
        } else if (match[1]) {
          const day = parseInt(match[1]);
          const month = match[2] ? parseInt(match[2]) - 1 : new Date().getMonth();
          date = new Date();
          date.setDate(day);
          date.setMonth(month);
        }
        break;
      }
    }
    
    const isDirectRequest = !!(subject || date);
    
    return { subject, date, isDirectRequest };
  }

  // Criar prompt contextualizado
  private createChatPrompt(request: ChatRequest, progress: any, intent: string): string {
    const { message, mode, events } = request;
    
    if (intent === 'create_schedule') {
      return this.createSchedulePrompt(request, progress);
    }
    
    return `
Você é o assistente ${mode === 'APRU_1b' ? 'APRU 1b' : 'APRU REASONING'}, especialista em estudos para vestibulares.

**Contexto:**
- Eventos: ${progress.totalEvents} | Concluídos: ${progress.completedEvents} (${progress.completionRate}%)
- Foco: ${progress.leastStudiedSubject || 'Equilibrado'}

**Mensagem:** "${message}"

**Instruções:**
- Detecte o humor do usuário (motivado, desanimado, ansioso, etc.)
- Responda de forma empática ao estado emocional
- Seja ${mode === 'APRU_1b' ? 'direto e prático' : 'analítico e detalhado'}
- Use emojis sutis, evite formatação excessiva
- MÁXIMO 50 palavras
- NÃO use asteriscos (**) para negrito

${intent === 'schedule_event' ? 'Confirme que criará o evento.' : ''}
${intent === 'analyze_progress' ? 'Analise o progresso de forma concisa.' : ''}
${intent === 'suggest_activities' ? `Sugira ${progress.leastStudiedSubject || 'uma matéria'} e pergunte se pode agendar.` : ''}
${intent === 'direct_create_event' ? 'Confirme que agendou a atividade solicitada sem questionar.' : ''}
${intent === 'general_chat' ? 'Seja acolhedor e ofereça ajuda.' : ''}
`;
  }

  // Criar prompt especializado para geração de cronogramas
  private createSchedulePrompt(request: ChatRequest, progress: any): string {
    const { message, mode } = request;
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return `
Você é o assistente APRU, especialista em criar cronogramas de estudos para vestibulares brasileiros.

**Contexto do usuário:**
- Modo: ${mode}
- Total de eventos atuais: ${progress.totalEvents}
- Taxa de conclusão: ${progress.completionRate}%
- Matéria mais estudada: ${progress.mostStudiedSubject || 'Nenhuma'}
- Matéria que precisa de atenção: ${progress.leastStudiedSubject || 'Todas as matérias'}
- Data atual: ${today.toLocaleDateString('pt-BR')}

**Solicitação:** "${message}"

**IMPORTANTE: Responda APENAS com um JSON válido no seguinte formato:**

{
  "message": "Mensagem explicativa sobre o cronograma criado",
  "schedule": [
    {
      "title": "Revisão de Matemática",
      "description": "Sessão focada em funções e equações",
      "subject": "Matemática",
      "topic": "Funções e Equações",
      "startTime": "2025-01-22T14:00:00.000Z",
      "endTime": "2025-01-22T16:00:00.000Z",
      "priority": 2,
      "color": "#3b82f6"
    }
  ]
}

**Diretrizes:**
- Crie 3-5 atividades para os próximos dias
- Foque na matéria que precisa de atenção: ${progress.leastStudiedSubject || 'matérias principais'}
- Horários entre 14h-18h (ideal para estudos)
- Duração de 1-3 horas por sessão
- Varie as matérias para não cansar
- Use cores: Matemática=#3b82f6, Português=#10b981, Física=#f59e0b, Química=#ef4444, Biologia=#8b5cf6
- Priority: 1=baixa, 2=média, 3=alta

**Modo ${mode}:**
${mode === 'APRU_1b' ? 
  '- Sessões rápidas e práticas\n- Foco em exercícios\n- 1-2h por sessão' : 
  '- Sessões detalhadas\n- Teoria + prática\n- 2-3h por sessão'
}

Responda APENAS com o JSON. Não adicione texto antes ou depois.
`;
  }

  // Gerar resposta com Gemini
  private async generateWithGemini(request: ChatRequest): Promise<string> {
    const progress = this.analyzeUserProgress(request.events);
    const intent = this.detectIntent(request.message);
    const prompt = this.createChatPrompt(request, progress, intent);

    console.log('🤖 [CalendarChat] Enviando para Gemini...', { intent, mode: request.mode });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 500,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [CalendarChat] Erro no Gemini:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      throw new Error('Resposta vazia do Gemini');
    }

    console.log('✅ [CalendarChat] Resposta gerada pelo Gemini');
    return content;
  }

  // Gerar resposta com DeepSeek
  private async generateWithDeepSeek(request: ChatRequest): Promise<string> {
    const progress = this.analyzeUserProgress(request.events);
    const intent = this.detectIntent(request.message);
    const prompt = this.createChatPrompt(request, progress, intent);

    console.log('🧠 [CalendarChat] Enviando para DeepSeek...', { intent, mode: request.mode });

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.deepseekApiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [CalendarChat] Erro no DeepSeek:', response.status, errorText);
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('Resposta vazia do DeepSeek');
    }

    console.log('✅ [CalendarChat] Resposta gerada pelo DeepSeek');
    return content;
  }

  // Método principal para gerar resposta do chat
  async generateChatResponse(request: ChatRequest): Promise<ChatResponse> {
    const intent = this.detectIntent(request.message);
    const progress = this.analyzeUserProgress(request.events);

    console.log('💬 [CalendarChat] Processando mensagem...', {
      intent,
      mode: request.mode,
      eventsCount: request.events.length,
      completionRate: progress.completionRate
    });

    try {
      let response: string;

      // Escolher IA baseada no modo
      if (request.mode === 'APRU_1b') {
        response = await this.generateWithGemini(request);
      } else {
        response = await this.generateWithDeepSeek(request);
      }

      // Processar cronograma se for intenção de criar cronograma
      let suggestedEvent;
      let suggestedSchedule;
      
      if (intent === 'create_schedule') {
        try {
          // Tentar extrair JSON da resposta
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const scheduleData = JSON.parse(jsonMatch[0]);
            suggestedSchedule = scheduleData.schedule;
            response = scheduleData.message || '✅ Cronograma criado com sucesso! Vou agendar essas atividades para você.';
          }
        } catch (error) {
          console.error('❌ [CalendarChat] Erro ao processar cronograma da IA:', error);
          // Fallback para cronograma simples
          const targetSubject = progress.leastStudiedSubject || 'Revisão Geral';
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(14, 0, 0, 0);
          const endTime = new Date(tomorrow);
          endTime.setHours(16, 0, 0, 0);
          
          suggestedSchedule = [{
            title: `Revisão de ${targetSubject}`,
            description: `Sessão de estudos criada pelo assistente APRU`,
            subject: targetSubject,
            topic: 'Revisão e exercícios',
            startTime: tomorrow.toISOString(),
            endTime: endTime.toISOString(),
            priority: 2,
            color: '#3b82f6'
          }];
        }
      } else if (intent === 'direct_create_event') {
        // Criar evento com matéria e data específicas da mensagem
        const parsed = this.parseUserMessage(request.message);
        const targetSubject = parsed.subject || progress.leastStudiedSubject || 'Revisão Geral';
        
        suggestedEvent = {
          title: `Sessão de ${targetSubject}`,
          description: `Atividade de ${targetSubject} criada pelo assistente APRU`,
          subject: targetSubject,
          topic: 'Estudo direcionado',
          duration: 120, // 2 horas
          priority: 2,
          specificDate: parsed.date
        };
        
        // Resposta direta sem questionamento
        response = `✅ Agendei ${targetSubject}${parsed.date ? ` para ${parsed.date.toLocaleDateString('pt-BR')}` : ''} às 14h! 📚`;
      } else if (intent === 'suggest_activities' || intent === 'schedule_event') {
        // Criar evento sugerido se for intenção de agendamento simples
        const targetSubject = progress.leastStudiedSubject || 'Revisão Geral';
        suggestedEvent = {
          title: `Revisão de ${targetSubject}`,
          description: `Sessão de estudos criada pelo assistente APRU para reforçar conhecimentos em ${targetSubject}`,
          subject: targetSubject,
          topic: 'Revisão e exercícios',
          duration: 120, // 2 horas
          priority: 2
        };
      }

      return {
        response,
        intent,
        suggestedEvent,
        suggestedSchedule
      };

    } catch (error) {
      console.error('❌ [CalendarChat] Erro ao gerar resposta:', error);
      
      // Fallback para resposta local em caso de erro
      const fallbackResponses: Record<string, string> = {
        'schedule_event': '✅ Ok! Vou criar para você.',
        'analyze_progress': `📈 ${progress.completedEvents} concluídas (${progress.completionRate}%). Continue assim! 🎯`,
        'suggest_activities': `💡 Que tal ${progress.leastStudiedSubject || 'revisão'}? Posso agendar 2h?`,
        'general_chat': '😊 Oi! Como posso ajudar?',
        'create_schedule': '✅ Cronograma criado! Vou agendar as atividades.',
        'direct_create_event': '✅ Agendado para hoje às 14h! 📚',
        'edit_event': '✨ Evento editado com sucesso!',
        'delete_event': '🗑️ Evento excluído com sucesso!'
      };

      return {
        response: fallbackResponses[intent],
        intent,
        suggestedEvent: intent === 'suggest_activities' ? {
          title: `Revisão de ${progress.leastStudiedSubject || 'Geral'}`,
          description: 'Sessão de estudos sugerida pelo assistente APRU',
          subject: progress.leastStudiedSubject || 'Geral',
          topic: 'Revisão',
          duration: 120,
          priority: 2
        } : undefined,
        suggestedSchedule: intent === 'create_schedule' ? [{
          title: `Revisão de ${progress.leastStudiedSubject || 'Geral'}`,
          description: 'Cronograma de estudos criado pelo assistente APRU',
          subject: progress.leastStudiedSubject || 'Geral',
          topic: 'Revisão',
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
          priority: 2,
          color: '#6b7280'
        }] : undefined
      };
    }
  }
}

export const calendarChatService = new CalendarChatService();
export type { ChatRequest, ChatResponse };
