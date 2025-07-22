interface StudyPlanRequest {
  mode: 'APRU_1b' | 'APRU_REASONING';
  answers: Record<string, any>;
  userId?: string;
}

interface AIResponse {
  weeklySchedule: Array<{
    day: string;
    subjects: Array<{
      name: string;
      time: string;
      duration: number;
      topic: string;
    }>;
  }>;
  dailyGoals: Array<{
    goal: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    type: 'study_method' | 'time_management' | 'content_focus';
  }>;
  summary: {
    totalStudyHours: number;
    daysUntilTarget: number;
    subjects: string[];
    difficulty: string;
    estimatedPreparationLevel: string;
  };
}

class AIService {
  private deepseekApiKey: string;
  private deepseekApiUrl: string;
  private geminiApiKey: string;
  private geminiApiUrl: string;

  constructor() {
    this.deepseekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
    this.deepseekApiUrl = import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.geminiApiUrl = import.meta.env.VITE_GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta';
  }

  private createPrompt(request: StudyPlanRequest): string {
    const { mode, answers } = request;
    const targetCourse = answers.targetCourse || 'Não especificado';
    const courseData = answers.targetCourse_data || {};
    const targetInstitution = answers.targetInstitution || 'Não especificado';
    const institutionData = answers.targetInstitution_data || {};
    const hoursPerDay = answers.hoursPerDay || 4;
    const subjects = Array.isArray(answers.subjects) ? answers.subjects : [];
    const studyPeriod = answers.studyPeriod || 'Flexível';
    const studyDays = Array.isArray(answers.studyDays) ? answers.studyDays : ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    const mainGoal = answers.mainGoal || 'Passar no vestibular';
    const difficulty = answers.difficulty || 'Intermediário';
    const targetDate = answers.targetDate ? new Date(answers.targetDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    const today = new Date();
    const daysUntilTarget = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    return `
Você é um especialista em educação e planejamento de estudos para vestibulares brasileiros. 
Crie um plano de estudos personalizado baseado nas seguintes informações:

**Configurações do Estudante:**
- Modo: ${mode}
- Curso desejado: ${targetCourse}${courseData.category ? ` (${courseData.category})` : ''}
- Área do curso: ${courseData.category || 'Não especificado'}
- Descrição do curso: ${courseData.description || 'Não especificado'}
- Instituição alvo: ${targetInstitution}${institutionData.state ? ` (${institutionData.state})` : ''}
- Tipo de instituição: ${institutionData.type || 'Não especificado'}
- Horas de estudo por dia: ${hoursPerDay}
- Período preferido: ${studyPeriod}
- Dias disponíveis: ${studyDays.join(', ')}
- Matérias com dificuldade: ${subjects.join(', ')}
- Nível atual: ${difficulty}
- Objetivo principal: ${mainGoal}
- Dias até a prova: ${daysUntilTarget}
- Data da prova: ${targetDate.toLocaleDateString('pt-BR')}

**Instruções específicas para o modo ${mode}:**
${mode === 'APRU_1b' 
  ? '- Foque em revisão rápida e resolução de exercícios\n- Priorize questões de vestibulares anteriores\n- 70% prática, 30% teoria'
  : '- Análise detalhada de cada matéria\n- Mapas mentais e resumos\n- Estudo aprofundado de conceitos\n- 50% teoria, 50% prática'
}

**Responda APENAS com um JSON válido no seguinte formato:**
{
  "weeklySchedule": [
    {
      "day": "Segunda-feira",
      "subjects": [
        {
          "name": "Matemática",
          "time": "08:00",
          "duration": 120,
          "topic": "Funções Quadráticas"
        }
      ]
    }
  ],
  "dailyGoals": [
    {
      "goal": "Resolver 20 questões de matemática",
      "completed": false,
      "priority": "high"
    }
  ],
  "recommendations": [
    {
      "title": "Técnica Pomodoro",
      "description": "Use intervalos de 25 minutos com pausas de 5 minutos",
      "type": "time_management"
    }
  ],
  "summary": {
    "totalStudyHours": ${hoursPerDay * daysUntilTarget},
    "daysUntilTarget": ${daysUntilTarget},
    "subjects": ${JSON.stringify(subjects)},
    "difficulty": "${difficulty}",
    "estimatedPreparationLevel": "Bem preparado"
  }
}

Importante: Crie um cronograma realista e específico para vestibulares brasileiros, considerando as matérias selecionadas e o tempo disponível.
`;
  }

  async generateWithDeepSeek(request: StudyPlanRequest): Promise<AIResponse> {
    console.log('🤖 [AI Service] Iniciando geração com DeepSeek...', {
      mode: request.mode,
      subjects: request.answers.subjects,
      hoursPerDay: request.answers.hoursPerDay
    });

    if (!this.deepseekApiKey || this.deepseekApiKey === 'your_deepseek_api_key_here') {
      console.error('❌ [AI Service] DeepSeek API key não configurada');
      throw new Error('DeepSeek API não configurada. Entre em contato com o suporte.');
    }

    try {
      const prompt = this.createPrompt(request);
      
      console.log('📤 [AI Service] Enviando prompt para DeepSeek...');
      
      const response = await fetch(`${this.deepseekApiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.deepseekApiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [AI Service] Erro na resposta do DeepSeek:', response.status, response.statusText);
        console.error('❌ [AI Service] Detalhes do erro:', errorText);
        throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📥 [AI Service] Resposta recebida do DeepSeek');
      
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('Resposta inválida do DeepSeek');
      }

      // Extrair JSON da resposta
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('⚠️ [AI Service] JSON não encontrado na resposta do DeepSeek');
        console.log('📝 [AI Service] Conteúdo recebido:', content);
        throw new Error('JSON não encontrado na resposta do DeepSeek');
      }

      const aiResponse = JSON.parse(jsonMatch[0]);
      console.log('✅ [AI Service] Plano gerado com sucesso pelo DeepSeek');
      
      return aiResponse;
    } catch (error) {
      console.error('❌ [AI Service] Erro ao usar DeepSeek:', error);
      throw error;
    }
  }

  async generateWithGemini(request: StudyPlanRequest): Promise<AIResponse> {
    console.log('🤖 [AI Service] Iniciando geração com Gemini...', {
      mode: request.mode,
      subjects: request.answers.subjects,
      hoursPerDay: request.answers.hoursPerDay
    });

    if (!this.geminiApiKey || this.geminiApiKey === 'your_gemini_api_key_here') {
      console.error('❌ [AI Service] Gemini API key não configurada');
      throw new Error('Gemini API não configurada. Entre em contato com o suporte.');
    }

    try {
      const prompt = this.createPrompt(request);
      
      console.log('📤 [AI Service] Enviando prompt para Gemini...');
      
      const response = await fetch(`${this.geminiApiUrl}/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`, {
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
            temperature: 0.7,
            maxOutputTokens: 2000,
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [AI Service] Erro na resposta do Gemini:', response.status, response.statusText);
        console.error('❌ [AI Service] Detalhes do erro:', errorText);
        
        // Verificar se é um erro de rate limit
        if (response.status === 429 || errorText.includes('rate limit') || errorText.includes('resource_exhausted')) {
          console.warn('⏰ [AI Service] Rate limit do Gemini atingido - usando DeepSeek como alternativa');
          throw new Error(`Gemini rate limit: ${response.status} - ${errorText}`);
        }
        
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📥 [AI Service] Resposta recebida do Gemini');
      
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error('Resposta inválida do Gemini - conteúdo vazio');
      }

      // Extrair JSON da resposta
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('⚠️ [AI Service] JSON não encontrado na resposta do Gemini, tentando parsing direto...');
        console.log('📝 [AI Service] Conteúdo recebido:', content);
        throw new Error('JSON não encontrado na resposta do Gemini');
      }

      const aiResponse = JSON.parse(jsonMatch[0]);
      console.log('✅ [AI Service] Plano gerado com sucesso pelo Gemini');
      
      return aiResponse;
    } catch (error) {
      console.error('❌ [AI Service] Erro ao usar Gemini:', error);
      
      // Se for rate limit, usar DeepSeek imediatamente
      if (error.message.includes('rate limit') || error.message.includes('resource_exhausted')) {
        console.log('🔄 [AI Service] Rate limit do Gemini detectado - usando DeepSeek como alternativa...');
      } else {
        console.log('🔄 [AI Service] Gemini falhou, tentando com DeepSeek como fallback...');
      }
      
      try {
        return await this.generateWithDeepSeek(request);
      } catch (deepseekError) {
        console.error('❌ [AI Service] DeepSeek também falhou:', deepseekError);
        console.error('❌ [AI Service] Ambas as IAs falharam - não é possível gerar plano');
        throw new Error('Serviços de IA indisponíveis. Tente novamente em alguns minutos ou entre em contato com o suporte.');
      }
    }
  }

  async generateStudyPlan(request: StudyPlanRequest): Promise<AIResponse> {
    console.log('🚀 [AI Service] Iniciando geração de plano de estudos...', {
      mode: request.mode,
      userId: request.userId,
      timestamp: new Date().toISOString()
    });

    // Escolher IA baseada no modo:
    // APRU 1b = Gemini (rápido e eficiente)
    // APRU REASONING = DeepSeek (análise profunda)
    try {
      if (request.mode === 'APRU_1b') {
        console.log('🎯 [AI Service] Modo APRU 1b detectado - usando Gemini...');
        return await this.generateWithGemini(request);
      } else {
        console.log('🧠 [AI Service] Modo APRU REASONING detectado - usando DeepSeek...');
        return await this.generateWithDeepSeek(request);
      }
    } catch (error) {
      console.error('❌ [AI Service] Falha completa na geração de IA:', error);
      throw error; // Propagar o erro para o componente lidar com ele
    }
  }
}

export const aiService = new AIService();
export type { StudyPlanRequest, AIResponse };
