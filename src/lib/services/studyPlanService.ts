import { supabase } from '@/integrations/supabase/client';
import { aiService } from './aiService';
import { calendarService } from './calendarService';
import { monthlyGoalsService } from './monthlyGoalsService';

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
  answers: Record<string, unknown> & {
    targetCourse?: string;
    targetInstitution?: string;
    targetCourse_data?: Record<string, unknown>;
    subjects?: string[];
    mainGoal?: string;
    targetDate?: string;
    hoursPerDay?: number;
  };
  userId?: string;
}

// Interfaces for weekly schedule
export interface WeeklyScheduleSubject {
  name: string;
  time: string;
  duration?: number;
  topic?: string;
  type?: 'study' | 'review' | 'exercise' | 'simulated';
  priority?: 'low' | 'medium' | 'high';
}

export interface WeeklyScheduleItem {
  day: string;
  subjects: WeeklyScheduleSubject[];
}

// Interface for the AI service response
type AIResponse = {
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
    priority: 'low' | 'medium' | 'high';
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
};

// Interface for our internal representation
export interface InternalStudyPlan {
  weekly_schedule: Array<{
    day: string;
    subjects: Array<{
      subject: string;
      time: string;
      duration: number;
      topic: string;
      type: 'study' | 'review' | 'exercise' | 'simulated';
      priority: 'low' | 'medium' | 'high';
    }>;
  }>;
  daily_goals: Array<{
    day: string;
    date: string;
    goals: string[];
    total_goals: number;
    completed_goals: number;
    priority: 'low' | 'medium' | 'high';
  }>;
  revision_suggestions: Array<{
    subject: string;
    topic: string;
    priority: 'low' | 'medium' | 'high';
    suggested_date: string;
    type: 'study_method' | 'time_management' | 'content_focus';
    description: string;
  }>;
  exam_suggestions: {
    exam_type: string;
    date: string;
    subjects: string[];
    preparation_tips: string[];
    difficulty?: string;
    estimated_preparation_level?: string;
  }[];
}

// Interfaces for daily goals
export interface DailyGoal {
  day: string;
  date: string;
  goals: Array<{
    subject: string;
    description: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
  }>;
  total_goals: number;
  completed_goals: number;
}

// Interfaces for revision suggestions
export interface RevisionSuggestion {
  subject: string;
  topic: string;
  priority: 'low' | 'medium' | 'high';
  suggested_date: string;
  resources?: string[];
}

// Interfaces for exam suggestions
export interface ExamSuggestion {
  type: 'simulated' | 'revision_test' | 'essay';
  subject?: string;
  topics: string[];
  suggested_date: string;
  duration: number; // in minutes
  description: string;
}

export interface StudyPlanResponse {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  mode: 'APRU_1b' | 'APRU_REASONING';
  target_course?: string;
  target_institution?: string;
  target_date?: string;
  weekly_schedule: WeeklyScheduleItem[];
  daily_goals: DailyGoal[];
  revision_suggestions?: RevisionSuggestion[];
  exam_suggestions?: ExamSuggestion[];
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

  // Gerar plano apenas com IA (sem salvar no banco)
  async generatePlanWithAI(request: StudyPlanRequest): Promise<{
    aiResponse: AIResponse;
    planData: {
      targetCourse: string;
      courseData: Record<string, unknown>;
      targetInstitution: string;
      subjects: string[];
      mainGoal: string;
      startDate: Date;
      targetDate: Date;
    };
  }> {
    try {
      console.log('🤖 [StudyPlanService] Gerando plano apenas com IA...', {
        mode: request.mode,
        userId: request.userId,
        subjects: request.answers.subjects,
        hoursPerDay: request.answers.hoursPerDay
      });

      // Usar IA para gerar o plano personalizado
      const aiResponse = await aiService.generateStudyPlan(request);
      
      console.log('✅ [StudyPlanService] IA gerou o plano com sucesso:', {
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
      
      return {
        aiResponse,
        planData: {
          targetCourse,
          courseData,
          targetInstitution,
          subjects,
          mainGoal,
          startDate,
          targetDate
        }
      };
    } catch (error) {
      console.error('❌ [StudyPlanService] Erro ao gerar plano com IA:', error);
      throw error;
    }
  },

  // Salvar plano no banco e integrar com calendário
  async savePlanToDatabase(
    request: StudyPlanRequest, 
    aiResponse: AIResponse,
    planData: {
      targetCourse: string;
      targetInstitution: string;
      courseData: Record<string, unknown>;
      subjects: string[];
      mainGoal: string;
      startDate: Date;
      targetDate: Date;
    }
  ): Promise<StudyPlanResponse> {
    try {
      console.log('💾 [StudyPlanService] Salvando plano no banco de dados...');
      
      const { data, error } = await supabase
        .from('study_plans')
        .insert([
          {
            user_id: request.userId || 'anonymous',
            name: `${planData.targetCourse} - ${planData.targetInstitution}`,
            description: `Plano personalizado para ${planData.targetCourse}${planData.courseData.category ? ` (${planData.courseData.category})` : ''} na ${planData.targetInstitution}. Foco em: ${planData.subjects.join(', ')}. Objetivo: ${planData.mainGoal}`,
            mode: request.mode,
            target_course: planData.targetCourse,
            target_institution: planData.targetInstitution,
            target_date: planData.targetDate.toISOString().split('T')[0],
            weekly_schedule: aiResponse.weeklySchedule,
            daily_goals: aiResponse.dailyGoals,
            revision_suggestions: aiResponse.recommendations,
            exam_suggestions: [{
              exam_type: 'Vestibular',
              date: planData.targetDate.toISOString().split('T')[0],
              subjects: aiResponse.summary.subjects,
              preparation_tips: [
                `Nível de dificuldade: ${aiResponse.summary.difficulty}`,
                `Nível estimado de preparação: ${aiResponse.summary.estimatedPreparationLevel}`,
                `Total de horas de estudo: ${aiResponse.summary.totalStudyHours}h`,
                `Dias até a prova: ${aiResponse.summary.daysUntilTarget}`
              ],
              difficulty: aiResponse.summary.difficulty,
              estimated_preparation_level: aiResponse.summary.estimatedPreparationLevel
            }],
            start_date: planData.startDate.toISOString().split('T')[0],
            end_date: planData.targetDate.toISOString().split('T')[0],
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
          return {
            ...data,
            mode: data.mode as "APRU_1b" | "APRU_REASONING",
            daily_goals: data.daily_goals as any,
            weekly_schedule: data.weekly_schedule as any,
            revision_suggestions: data.revision_suggestions as any,
            exam_suggestions: data.exam_suggestions as any
          } as StudyPlanResponse;
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
      
        return {
          ...data,
          mode: data.mode as "APRU_1b" | "APRU_REASONING",
          daily_goals: data.daily_goals as any,
          weekly_schedule: data.weekly_schedule as any,
          revision_suggestions: data.revision_suggestions as any,
          exam_suggestions: data.exam_suggestions as any
        } as StudyPlanResponse;
    } catch (error) {
      console.error('❌ [StudyPlanService] Erro ao salvar plano:', error);
      throw error;
    }
  },

  // Gerar um novo plano de estudos usando IA (método legado - mantido para compatibilidade)
  async generatePlan(request: StudyPlanRequest & { 
    answers: Record<string, unknown> & {
      targetCourse?: string;
      targetInstitution?: string;
      targetCourse_data?: Record<string, unknown>;
      subjects?: string[];
      mainGoal?: string;
      targetDate?: string;
      hoursPerDay?: number;
    };
  }): Promise<StudyPlanResponse> {
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
      
      const formattedPlan = [] as WeeklyScheduleItem[];
      
      const data = {
        id: 'temp-id',
        user_id: request.userId,
        name: `Plano de Estudos - ${targetCourse}`,
        description: `Plano de estudos para ${targetCourse} na ${targetInstitution}`,
        mode: request.mode,
        target_course: targetCourse,
        target_institution: targetInstitution,
        target_date: targetDate.toISOString().split('T')[0],
        weekly_schedule: formattedPlan,
        daily_goals: aiResponse.dailyGoals,
        revision_suggestions: aiResponse.recommendations,
        exam_suggestions: [{
          exam_type: 'Vestibular',
          date: targetDate.toISOString().split('T')[0],
          subjects: aiResponse.summary.subjects,
          preparation_tips: [
            `Nível de dificuldade: ${aiResponse.summary.difficulty}`,
            `Nível estimado de preparação: ${aiResponse.summary.estimatedPreparationLevel}`,
            `Total de horas de estudo: ${aiResponse.summary.totalStudyHours}h`,
            `Dias até a prova: ${aiResponse.summary.daysUntilTarget}`
          ],
          difficulty: aiResponse.summary.difficulty,
          estimated_preparation_level: aiResponse.summary.estimatedPreparationLevel
        }],
        start_date: startDate.toISOString().split('T')[0],
        end_date: targetDate.toISOString().split('T')[0],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: savedData, error } = await supabase
        .from('study_plans')
        .insert([data as any])
        .select('*')
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
          return {
            ...savedData,
            mode: savedData.mode as "APRU_1b" | "APRU_REASONING",
            daily_goals: savedData.daily_goals as any,
            weekly_schedule: savedData.weekly_schedule as any,
            revision_suggestions: savedData.revision_suggestions as any,
            exam_suggestions: savedData.exam_suggestions as any
          } as StudyPlanResponse;
        }
        
        console.log('📅 [StudyPlanService] Integrando plano com o calendário...');
        
        await calendarService.createEventsFromStudyPlan({
          study_plan_id: savedData.id,
          user_id: savedData.user_id,
          weekly_schedule: aiResponse.weeklySchedule,
          start_date: savedData.start_date,
          end_date: savedData.end_date
        });
        
        console.log('✅ [StudyPlanService] Plano integrado com o calendário com sucesso!');
      } catch (calendarError) {
        console.error('⚠️ [StudyPlanService] Erro ao integrar com calendário (não crítico):', calendarError);
        // Não falhar o processo principal se a integração com calendário falhar
      }
      
      return {
        ...savedData,
        mode: savedData.mode as "APRU_1b" | "APRU_REASONING",
        daily_goals: savedData.daily_goals as any,
        weekly_schedule: savedData.weekly_schedule as any,
        revision_suggestions: savedData.revision_suggestions as any,
        exam_suggestions: savedData.exam_suggestions as any
      } as StudyPlanResponse;
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
      return (data || []).map(plan => ({
        ...plan,
        mode: plan.mode as "APRU_1b" | "APRU_REASONING",
        daily_goals: plan.daily_goals as any,
        weekly_schedule: plan.weekly_schedule as any,
        revision_suggestions: plan.revision_suggestions as any,
        exam_suggestions: plan.exam_suggestions as any
      })) as StudyPlanResponse[];
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
          daily_goals: updates.daily_goals ? JSON.parse(JSON.stringify(updates.daily_goals)) : undefined,
          weekly_schedule: updates.weekly_schedule ? JSON.parse(JSON.stringify(updates.weekly_schedule)) : undefined,
          revision_suggestions: updates.revision_suggestions ? JSON.parse(JSON.stringify(updates.revision_suggestions)) : undefined,
          exam_suggestions: updates.exam_suggestions ? JSON.parse(JSON.stringify(updates.exam_suggestions)) : undefined,
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', planId)
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        mode: data.mode as "APRU_1b" | "APRU_REASONING",
        daily_goals: data.daily_goals as any,
        weekly_schedule: data.weekly_schedule as any,
        revision_suggestions: data.revision_suggestions as any,
        exam_suggestions: data.exam_suggestions as any
      } as StudyPlanResponse;
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

async function generateStudyPlanWithAI(
  userId: string,
  answers: Record<string, string | object>,
  mode: 'APRU_1b' | 'APRU_REASONING'
): Promise<StudyPlanResponse> {
  try {
    console.log('Generating study plan with AI for user:', userId);
    console.log('Mode:', mode);
    console.log('Answers:', answers);
    
    // Extract data from answers, ensuring string type
    const description = typeof answers.description === 'string' ? answers.description : '';
    const targetCourse = typeof answers.targetCourse === 'string' ? answers.targetCourse : '';
    const targetInstitution = typeof answers.targetInstitution === 'string' ? answers.targetInstitution : '';
    const targetDate = typeof answers.targetDate === 'string' ? answers.targetDate : '';
    
    // Placeholder for formatted plan, ensuring it matches WeeklyScheduleItem[]
    const formattedPlan: WeeklyScheduleItem[] = [];
    
    // Return a dummy response for now, matching StudyPlanResponse interface
    return {
      id: 'temp-id',
      name: 'AI Generated Study Plan',
      description: description,
      mode: mode,
      target_course: targetCourse,
      target_institution: targetInstitution,
      target_date: targetDate,
      weekly_schedule: formattedPlan,
      daily_goals: [],
      revision_suggestions: [],
      exam_suggestions: [],
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (err) {
    console.error('Error generating study plan with AI:', err);
    throw err;
  }
}

async function saveStudyPlan(
  userId: string,
  plan: StudyPlanResponse
): Promise<StudyPlanResponse> {
  try {
    const { data, error } = await supabase
      .from('study_plans')
      .insert([{
        ...plan,
        daily_goals: JSON.parse(JSON.stringify(plan.daily_goals)),
        weekly_schedule: JSON.parse(JSON.stringify(plan.weekly_schedule)),
        revision_suggestions: plan.revision_suggestions ? JSON.parse(JSON.stringify(plan.revision_suggestions)) : undefined,
        exam_suggestions: plan.exam_suggestions ? JSON.parse(JSON.stringify(plan.exam_suggestions)) : undefined
      } as any])
      .select('*')
      .single();

    if (error) {
      console.error('Error saving study plan:', error);
      throw error;
    }

    return {
      ...data,
      mode: data.mode as "APRU_1b" | "APRU_REASONING",
      daily_goals: data.daily_goals as any,
      weekly_schedule: data.weekly_schedule as any,
      revision_suggestions: data.revision_suggestions as any,
      exam_suggestions: data.exam_suggestions as any
    } as StudyPlanResponse;
  } catch (err) {
    console.error('Error in saveStudyPlan:', err);
    throw err;
  }
}

async function getUserPlans(userId: string): Promise<StudyPlanResponse[]> {
  try {
    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user plans:', error);
      throw error;
    }

    return (data || []).map(plan => ({
      ...plan,
      mode: plan.mode as "APRU_1b" | "APRU_REASONING",
      daily_goals: plan.daily_goals as any,
      weekly_schedule: plan.weekly_schedule as any,
      revision_suggestions: plan.revision_suggestions as any,
      exam_suggestions: plan.exam_suggestions as any
    })) as StudyPlanResponse[];
  } catch (err) {
    console.error('Error in getUserPlans:', err);
    return [];
  }
}

async function updatePlan(planId: string, updates: Partial<StudyPlanResponse>): Promise<StudyPlanResponse> {
  try {
    const { data, error } = await supabase
      .from('study_plans')
      .update({
        ...updates,
        daily_goals: updates.daily_goals ? JSON.parse(JSON.stringify(updates.daily_goals)) : undefined,
        weekly_schedule: updates.weekly_schedule ? JSON.parse(JSON.stringify(updates.weekly_schedule)) : undefined,
        revision_suggestions: updates.revision_suggestions ? JSON.parse(JSON.stringify(updates.revision_suggestions)) : undefined,
        exam_suggestions: updates.exam_suggestions ? JSON.parse(JSON.stringify(updates.exam_suggestions)) : undefined
      } as any)
      .eq('id', planId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating plan:', error);
      throw error;
    }

    return {
      ...data,
      mode: data.mode as "APRU_1b" | "APRU_REASONING",
      daily_goals: data.daily_goals as any,
      weekly_schedule: data.weekly_schedule as any,
      revision_suggestions: data.revision_suggestions as any,
      exam_suggestions: data.exam_suggestions as any
    } as StudyPlanResponse;
  } catch (err) {
    console.error('Error in updatePlan:', err);
    throw err;
  }
}
