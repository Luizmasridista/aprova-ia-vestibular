import { supabase } from '../supabase';
import { aiService } from './aiService';
import { calendarService } from './calendarService';
export interface StudyPlanConfig {
  modes: Array<{
    id: string;
    name: string;
    description: string;
    color: string;
  }>;
  questions: Array<{
    id: string;
    text: string;
    type: string;
    description?: string;
    options?: string[];
    required?: boolean;
  }>;
}

export interface StudyPlanRequest {
  mode: 'APRU_1b' | 'APRU_REASONING';
  answers: Record<string, any>;
  userId?: string;
}

export interface StudyPlanResponse {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  mode: string;
  weekly_schedule: any;
  daily_goals: any;
  revision_suggestions?: any;
  exam_suggestions?: any;
  start_date: string;
  end_date: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export const studyPlanService = {
  // Buscar configuração do plano de estudos
  async getConfig(): Promise<StudyPlanConfig> {
    // Usando configuração padrão diretamente (tabela study_plan_configs não existe)
    return getDefaultConfig();
  },

  // Gerar um novo plano de estudos usando IA
  async generatePlan(request: StudyPlanRequest): Promise<StudyPlanResponse> {
    try {
      console.log('📚 [StudyPlanService] Iniciando geração de plano com IA...', {
        mode: request.mode,
        userId: request.userId,
        subjects: request.answers.subjects,
        hoursPerDay: request.answers.hoursPerDay
      });

      // Usar IA para gerar o plano personalizado
      const aiResponse = await aiService.generateStudyPlan(request);
      
      console.log('🤖 [StudyPlanService] IA gerou o plano com sucesso:', {
        weeklyScheduleItems: aiResponse.weeklySchedule.length,
        dailyGoalsCount: aiResponse.dailyGoals.length,
        recommendationsCount: aiResponse.recommendations.length
      });
      
      // Calcular datas baseado nas respostas
      const startDate = new Date();
      const targetDate = request.answers.targetDate ? new Date(request.answers.targetDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
      
      const subjects = Array.isArray(request.answers.subjects) ? request.answers.subjects : [];
      const targetCourse = request.answers.targetCourse || 'Curso não especificado';
      const courseData = request.answers.targetCourse_data || {};
      const targetInstitution = request.answers.targetInstitution || 'Instituição não especificada';
      const mainGoal = request.answers.mainGoal || 'Passar no vestibular';
      
      console.log('💾 [StudyPlanService] Salvando plano no banco de dados...');
      
      const { data, error } = await supabase
        .from('study_plans')
        .insert([
          {
            user_id: request.userId || 'anonymous',
            name: `${targetCourse} - ${targetInstitution}`,
            description: `Plano personalizado para ${targetCourse}${courseData.category ? ` (${courseData.category})` : ''} na ${targetInstitution}. Foco em: ${subjects.join(', ')}. Objetivo: ${mainGoal}`,
            mode: request.mode,
            target_course: targetCourse,
            target_institution: targetInstitution,
            target_date: targetDate.toISOString().split('T')[0],
            weekly_schedule: aiResponse.weeklySchedule,
            daily_goals: aiResponse.dailyGoals,
            revision_suggestions: aiResponse.recommendations,
            exam_suggestions: aiResponse.summary,
            start_date: startDate.toISOString().split('T')[0],
            end_date: targetDate.toISOString().split('T')[0],
            is_active: true
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ [StudyPlanService] Erro ao salvar no banco:', error);
        throw error;
      }
      
      console.log('✅ [StudyPlanService] Plano salvo com sucesso no banco de dados');
      
      // Integrar automaticamente com o calendário
      try {
        console.log('📅 [StudyPlanService] Verificando se tabela calendar_events existe...');
        
        // Verificar se a tabela existe antes de tentar criar eventos
        const tableExists = await calendarService.checkTableExists();
        
        if (!tableExists) {
          console.warn('⚠️ [StudyPlanService] Tabela calendar_events não existe. Pulando integração com calendário.');
          return data;
        }
        
        console.log('📅 [StudyPlanService] Integrando plano com o calendário...');
        
        await calendarService.createEventsFromStudyPlan({
          study_plan_id: data.id,
          user_id: data.user_id,
          weekly_schedule: aiResponse.weeklySchedule,
          start_date: data.start_date,
          end_date: data.end_date
        });
        
        console.log('✅ [StudyPlanService] Plano integrado com o calendário com sucesso!');
      } catch (calendarError) {
        console.error('⚠️ [StudyPlanService] Erro ao integrar com calendário (não crítico):', calendarError);
        // Não falhar o processo principal se a integração com calendário falhar
      }
      
      return data;
    } catch (error) {
      console.error('❌ [StudyPlanService] Erro ao gerar plano de estudos:', error);
      throw new Error('Não foi possível gerar o plano de estudos');
    }
  },

  // Buscar plano de estudos do usuário
  async getUserPlans(userId: string): Promise<StudyPlanResponse[]> {
    try {
      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar planos de estudo:', error);
      return [];
    }
  },

  // Atualizar plano de estudos
  async updatePlan(planId: string, updates: Partial<StudyPlanResponse>): Promise<StudyPlanResponse> {
    try {
      const { data, error } = await supabase
        .from('study_plans')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', planId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar plano de estudos:', error);
      throw new Error('Não foi possível atualizar o plano de estudos');
    }
  }
};

// Configuração padrão caso não haja dados no banco
function getDefaultConfig(): StudyPlanConfig {
  return {
    modes: [
      { 
        id: 'APRU_1b', 
        name: 'APRU 1b', 
        description: 'Configuração leve e rápida para começar.',
        color: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      },
      { 
        id: 'APRU_REASONING', 
        name: 'APRU REASONING', 
        description: 'Análise avançada para rotinas detalhadas.',
        color: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
      }
    ],
    questions: [
      { 
        id: 'targetCourse', 
        text: 'Qual curso você deseja fazer?', 
        type: 'course-search',
        description: 'Digite o nome do curso ou navegue pelas categorias',
        required: true
      },
      { 
        id: 'targetInstitution', 
        text: 'Em qual instituição você pretende estudar?', 
        type: 'university-search',
        description: 'Digite o nome da universidade ou faculdade',
        required: true
      },
      { 
        id: 'targetDate', 
        text: 'Quando é a sua prova ou data alvo?', 
        type: 'date',
        description: 'Selecione a data do seu exame ou quando deseja estar preparado.',
        required: true
      },
      { 
        id: 'hoursPerDay', 
        text: 'Quantas horas por dia você pode dedicar aos estudos?', 
        type: 'number',
        description: 'Considere seu dia a dia e seja realista.',
        required: true
      },
      {
        id: 'studyPeriod',
        text: 'Qual período você prefere estudar?',
        type: 'multiple-choice',
        options: ['Manhã', 'Tarde', 'Noite', 'Flexível'],
        description: 'Escolha o período em que você rende melhor.',
        required: true
      },
      {
        id: 'subjects',
        text: 'Quais matérias você tem mais dificuldade?',
        type: 'multi-select',
        options: [
          'Matemática', 'Português', 'Física', 'Química', 'Biologia',
          'História', 'Geografia', 'Filosofia', 'Sociologia', 'Inglês',
          'Literatura', 'Redação', 'Atualidades'
        ],
        description: 'Selecione as matérias que precisam de mais atenção.',
        required: true
      },
      {
        id: 'studyDays',
        text: 'Quais dias da semana você pode estudar?',
        type: 'multi-select',
        options: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
        description: 'Selecione os dias disponíveis para estudo.',
        required: true
      },
      {
        id: 'mainGoal',
        text: 'Qual é o seu objetivo principal?',
        type: 'multiple-choice',
        options: ['Passar no vestibular', 'Melhorar notas', 'Reforçar conhecimentos', 'Preparação para ENEM'],
        description: 'Selecione o que melhor descreve seu objetivo.',
        required: true
      }
    ]
  };
}
