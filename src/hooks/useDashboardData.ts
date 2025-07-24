import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { monthlyGoalsService } from '@/lib/services/monthlyGoalsService';

// Tipos para os dados do Supabase
interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  subject?: string;
  start_date: string;
  end_date: string;
  completed: boolean;
  created_at: string;
  updated_at?: string;
}

interface StudyPlan {
  id: string;
  user_id: string;
  target_course: string;
  target_date: string;
  created_at: string;
}

interface ExerciseResult {
  id: string;
  user_id: string;
  exercise_id: string;
  is_correct: boolean;
  time_spent: number;
  created_at: string;
}

interface ExerciseSession {
  id: string;
  user_id: string;
  subject: string;
  difficulty: string;
  created_at: string;
  exercise_results?: ExerciseResult[];
}

export interface DashboardStats {
  // Estatísticas gerais
  totalStudyPlans: number;
  activeStudyPlans: number;
  completedStudyPlans: number;
  
  // Eventos do calendário
  totalEvents: number;
  completedEvents: number;
  todayEvents: number;
  upcomingEvents: number;
  
  // Exercícios realizados
  totalExercises: number;
  correctExercises: number;
  exerciseAccuracy: number;
  todayExercises: number;
  
  // Sequência de estudos
  currentStreak: number;
  longestStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  
  // Progresso por matéria
  subjectProgress: {
    subject: string;
    completed: number;
    total: number;
    percentage: number;
  }[];
  
  // Atividade recente
  recentActivity: {
    id: string;
    type: 'study_plan' | 'event_completed' | 'streak_milestone' | 'exercise_completed';
    title: string;
    description: string;
    timestamp: string;
    icon: string;
  }[];
  
  // Metas e objetivos
  monthlyGoals: {
    studyHours: { current: number; target: number };
    eventsCompleted: { current: number; target: number };
    streakDays: { current: number; target: number };
    reasoning?: string;
    intensity?: 'low' | 'medium' | 'high' | 'intensive';
  };
}

// Interface para metas personalizadas
interface PersonalizedGoals {
  monthlyStudyHours: number;
  monthlyEvents: number;
  weeklyGoal: number;
  streakTarget: number;
  intensity: 'low' | 'medium' | 'high' | 'intensive';
  reasoning: string;
}

// Função para calcular metas personalizadas baseadas nos planos de estudo
function calculatePersonalizedGoals(
  studyPlans: StudyPlan[], 
  events: CalendarEvent[], 
  currentStreak: number
): PersonalizedGoals {
  const now = new Date();
  
  // Valores padrão para usuários sem planos
  if (studyPlans.length === 0) {
    return {
      monthlyStudyHours: 30,
      monthlyEvents: 15,
      weeklyGoal: 5,
      streakTarget: 5,
      intensity: 'medium',
      reasoning: 'Metas padrão para começar os estudos'
    };
  }

  // Encontrar o plano mais próximo (ativo)
  const activePlans = studyPlans.filter(plan => {
    const targetDate = new Date(plan.target_date);
    return targetDate >= now;
  }).sort((a, b) => new Date(a.target_date).getTime() - new Date(b.target_date).getTime());

  const primaryPlan = activePlans[0] || studyPlans[studyPlans.length - 1];
  const targetDate = new Date(primaryPlan.target_date);
  const daysUntilTarget = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const monthsUntilTarget = Math.max(1, Math.ceil(daysUntilTarget / 30));
  
  // Analisar curso pretendido para determinar competitividade
  const targetCourse = primaryPlan.target_course.toLowerCase();
  const isHighCompetition = (
    targetCourse.includes('medicina') ||
    targetCourse.includes('direito') ||
    targetCourse.includes('engenharia') ||
    targetCourse.includes('usp') ||
    targetCourse.includes('unicamp') ||
    targetCourse.includes('ufmg') ||
    targetCourse.includes('federal')
  );
  
  // Calcular histórico de performance
  const totalEvents = events.length;
  const completedEvents = events.filter(e => e.completed).length;
  const completionRate = totalEvents > 0 ? completedEvents / totalEvents : 0;
  
  // Determinar intensidade baseada em múltiplos fatores
  let intensity: PersonalizedGoals['intensity'] = 'medium';
  let intensityScore = 0;
  
  // Fator tempo (40% do peso)
  if (daysUntilTarget <= 90) intensityScore += 4; // 3 meses ou menos
  else if (daysUntilTarget <= 180) intensityScore += 3; // 6 meses ou menos
  else if (daysUntilTarget <= 365) intensityScore += 2; // 1 ano ou menos
  else intensityScore += 1; // mais de 1 ano
  
  // Fator competitividade (30% do peso)
  if (isHighCompetition) intensityScore += 3;
  else intensityScore += 1;
  
  // Fator performance atual (20% do peso)
  if (completionRate >= 0.8) intensityScore += 2; // Alta performance
  else if (completionRate >= 0.6) intensityScore += 1.5; // Boa performance
  else if (completionRate >= 0.4) intensityScore += 1; // Performance média
  else intensityScore += 0.5; // Baixa performance
  
  // Fator streak atual (10% do peso)
  if (currentStreak >= 14) intensityScore += 1; // 2+ semanas
  else if (currentStreak >= 7) intensityScore += 0.5; // 1 semana
  
  // Determinar intensidade final
  if (intensityScore >= 8) intensity = 'intensive';
  else if (intensityScore >= 6) intensity = 'high';
  else if (intensityScore >= 4) intensity = 'medium';
  else intensity = 'low';
  
  // Calcular metas baseadas na intensidade
  let monthlyStudyHours: number;
  let monthlyEvents: number;
  let weeklyGoal: number;
  let streakTarget: number;
  let reasoning: string;
  
  switch (intensity) {
    case 'intensive':
      monthlyStudyHours = Math.min(80, 60 + (12 - monthsUntilTarget) * 2);
      monthlyEvents = Math.min(40, 30 + (12 - monthsUntilTarget));
      weeklyGoal = 6;
      streakTarget = 14;
      reasoning = `Ritmo intensivo para ${primaryPlan.target_course} - ${Math.round(daysUntilTarget/30)} meses restantes`;
      break;
      
    case 'high':
      monthlyStudyHours = Math.min(60, 45 + (12 - monthsUntilTarget));
      monthlyEvents = Math.min(30, 25 + Math.floor((12 - monthsUntilTarget) * 0.5));
      weeklyGoal = 5;
      streakTarget = 10;
      reasoning = `Ritmo acelerado para ${primaryPlan.target_course} - foco na consistência`;
      break;
      
    case 'medium':
      monthlyStudyHours = 40;
      monthlyEvents = 20;
      weeklyGoal = 4;
      streakTarget = 7;
      reasoning = `Ritmo equilibrado para ${primaryPlan.target_course} - construindo hábitos`;
      break;
      
    case 'low':
      monthlyStudyHours = 25;
      monthlyEvents = 12;
      weeklyGoal = 3;
      streakTarget = 5;
      reasoning = `Ritmo inicial para ${primaryPlan.target_course} - estabelecendo rotina`;
      break;
  }
  
  // Ajustar baseado na performance atual
  if (completionRate < 0.5 && intensity !== 'low') {
    // Reduzir metas se performance está baixa
    monthlyStudyHours = Math.floor(monthlyStudyHours * 0.8);
    monthlyEvents = Math.floor(monthlyEvents * 0.8);
    weeklyGoal = Math.max(2, weeklyGoal - 1);
    reasoning += ' - Metas ajustadas para melhorar consistência';
  }
  
  return {
    monthlyStudyHours,
    monthlyEvents,
    weeklyGoal,
    streakTarget,
    intensity,
    reasoning
  };
}

export interface DashboardData {
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useDashboardData = (): DashboardData => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudyPlans: 0,
    activeStudyPlans: 0,
    completedStudyPlans: 0,
    totalEvents: 0,
    completedEvents: 0,
    todayEvents: 0,
    upcomingEvents: 0,
    totalExercises: 0,
    correctExercises: 0,
    exerciseAccuracy: 0,
    todayExercises: 0,
    currentStreak: 0,
    longestStreak: 0,
    weeklyGoal: 7,
    weeklyProgress: 0,
    subjectProgress: [],
    recentActivity: [],
    monthlyGoals: {
      studyHours: { current: 0, target: 40 },
      eventsCompleted: { current: 0, target: 20 },
      streakDays: { current: 0, target: 7 }
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) {
      console.log('🚫 [Dashboard] Usuário não logado');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('📊 [Dashboard] Buscando dados do usuário:', user.id);
      
      // Buscar planos de estudo
      const { data: studyPlans, error: plansError } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', user.id);

      if (plansError) {
        console.error('Erro ao buscar planos de estudo:', plansError);
        throw plansError;
      }

      // Buscar eventos do calendário
      const { data: events, error: eventsError } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id);

      if (eventsError) {
        console.error('Erro ao buscar eventos:', eventsError);
        throw eventsError;
      }

      // Buscar exercícios realizados
      const { data: exerciseResults, error: exercisesError } = await supabase
        .from('exercise_results')
        .select(`
          *,
          exercise_sessions!inner(
            id,
            subject,
            difficulty,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (exercisesError) {
        console.error('Erro ao buscar exercícios:', exercisesError);
        // Não falhar se exercícios não existirem, apenas continuar
      }

      // Definir data atual para uso nos cálculos
      const now = new Date();
      
      // Buscar metas mensais do usuário
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const { data: monthlyGoalsData, error: goalsError } = await supabase
        .from('monthly_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .single();

      if (goalsError && goalsError.code !== 'PGRST116') {
        console.error('Erro ao buscar metas mensais:', goalsError);
      }

      // Garantir que os dados são arrays tipados
      const typedStudyPlans = (studyPlans || []) as StudyPlan[];
      const typedEvents = (events || []) as CalendarEvent[];
      const typedExerciseResults = (exerciseResults || []) as (ExerciseResult & { exercise_sessions: ExerciseSession })[];

      // Calcular estatísticas
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Estatísticas de planos de estudo
      const totalStudyPlans = typedStudyPlans.length;
      const activeStudyPlans = typedStudyPlans.filter(plan => {
        const targetDate = new Date(plan.target_date);
        return targetDate >= now;
      }).length;
      const completedStudyPlans = totalStudyPlans - activeStudyPlans;

      // Estatísticas de eventos
      const totalEvents = typedEvents.length;
      const completedEvents = typedEvents.filter(event => event.completed).length;
      const todayEvents = typedEvents.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate >= today && eventDate < tomorrow;
      }).length;
      const upcomingEvents = typedEvents.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate >= tomorrow && !event.completed;
      }).length;

      // Estatísticas de exercícios
      const totalExercises = typedExerciseResults.length;
      const correctExercises = typedExerciseResults.filter(result => result.is_correct).length;
      const exerciseAccuracy = totalExercises > 0 ? Math.round((correctExercises / totalExercises) * 100) : 0;
      const todayExercises = typedExerciseResults.filter(result => {
        const resultDate = new Date(result.created_at);
        return resultDate >= today && resultDate < tomorrow;
      }).length;

      // Calcular sequência de estudos
      const completedEventsByDate = typedEvents.filter(event => event.completed)
        .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
      
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      // Calcular sequência atual
      const eventDates = [...new Set(completedEventsByDate.map(event => 
        new Date(event.start_date).toDateString()
      ))];
      
      for (let i = 0; i < eventDates.length; i++) {
        const eventDate = new Date(eventDates[i]);
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);
        
        if (eventDate.toDateString() === expectedDate.toDateString()) {
          currentStreak++;
        } else {
          break;
        }
      }
      
      // Calcular sequência mais longa
      for (let i = 0; i < eventDates.length; i++) {
        tempStreak = 1;
        for (let j = i + 1; j < eventDates.length; j++) {
          const currentDate = new Date(eventDates[j]);
          const previousDate = new Date(eventDates[j - 1]);
          const dayDiff = (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
          
          if (dayDiff === 1) {
            tempStreak++;
          } else {
            break;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      }

      // Progresso semanal
      const weeklyEvents = typedEvents.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate >= startOfWeek && eventDate < tomorrow && event.completed;
      }).length;

      // Progresso por matéria (incluindo eventos e exercícios)
      const subjectStats = typedEvents.reduce((acc, event) => {
        const subject = event.subject || 'Outros';
        if (!acc[subject]) {
          acc[subject] = { completed: 0, total: 0 };
        }
        acc[subject].total++;
        if (event.completed) {
          acc[subject].completed++;
        }
        return acc;
      }, {} as Record<string, { completed: number; total: number }>);

      // Adicionar exercícios às estatísticas por matéria
      typedExerciseResults.forEach(result => {
        const subject = result.exercise_sessions.subject || 'Outros';
        if (!subjectStats[subject]) {
          subjectStats[subject] = { completed: 0, total: 0 };
        }
        subjectStats[subject].total++;
        if (result.is_correct) {
          subjectStats[subject].completed++;
        }
      });

      const subjectProgress = Object.entries(subjectStats).map(([subject, stats]: [string, { completed: number; total: number }]) => ({
        subject,
        completed: stats.completed,
        total: stats.total,
        percentage: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
      })).sort((a, b) => b.percentage - a.percentage);

      // Atividade recente (incluindo exercícios)
      const recentActivity = [
        ...typedStudyPlans.slice(0, 2).map(plan => ({
          id: plan.id,
          type: 'study_plan' as const,
          title: 'Novo Plano Criado',
          description: `Plano para ${plan.target_course}`,
          timestamp: plan.created_at,
          icon: '📚'
        })),
        ...completedEventsByDate.slice(0, 2).map(event => ({
          id: event.id,
          type: 'event_completed' as const,
          title: 'Atividade Concluída',
          description: event.title,
          timestamp: event.updated_at || event.start_date,
          icon: '✅'
        })),
        ...typedExerciseResults.slice(0, 2).map(result => ({
          id: result.id,
          type: 'exercise_completed' as const,
          title: result.is_correct ? 'Exercício Correto! 🎯' : 'Exercício Respondido',
          description: `${result.exercise_sessions.subject} - ${result.exercise_sessions.difficulty}`,
          timestamp: result.created_at,
          icon: result.is_correct ? '🎯' : '📝'
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

      // Metas mensais personalizadas baseadas nos planos de estudo
      const monthlyCompletedEvents = typedEvents.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate >= startOfMonth && event.completed;
      }).length;

      const monthlyExercises = typedExerciseResults.filter(result => {
        const resultDate = new Date(result.created_at);
        return resultDate >= startOfMonth;
      }).length;

      // Calcular horas de estudo (eventos + exercícios)
      const monthlyStudyHours = (monthlyCompletedEvents * 2) + (monthlyExercises * 0.5); // 2h por evento, 30min por exercício

      // Usar metas mensais do banco ou calcular personalizadas como fallback
      let monthlyGoalsConfig;
      if (monthlyGoalsData) {
        console.log('🎯 [Dashboard] Usando metas mensais do banco de dados');
        monthlyGoalsConfig = {
          studyHours: { current: monthlyStudyHours, target: monthlyGoalsData.study_hours_target },
          eventsCompleted: { current: monthlyCompletedEvents + monthlyExercises, target: monthlyGoalsData.events_target },
          streakDays: { current: currentStreak, target: monthlyGoalsData.streak_target },
          reasoning: monthlyGoalsData.reasoning,
          intensity: monthlyGoalsData.intensity
        };
      } else {
        console.log('🎯 [Dashboard] Calculando metas personalizadas (fallback)');
        const personalizedGoals = calculatePersonalizedGoals(typedStudyPlans, typedEvents, currentStreak);
        monthlyGoalsConfig = {
          studyHours: { current: monthlyStudyHours, target: personalizedGoals.monthlyStudyHours },
          eventsCompleted: { current: monthlyCompletedEvents + monthlyExercises, target: personalizedGoals.monthlyEvents },
          streakDays: { current: currentStreak, target: personalizedGoals.streakTarget },
          reasoning: personalizedGoals.reasoning,
          intensity: personalizedGoals.intensity
        };
      }

      const finalStats = {
        totalStudyPlans,
        activeStudyPlans,
        completedStudyPlans,
        totalEvents,
        completedEvents,
        todayEvents,
        upcomingEvents,
        totalExercises,
        correctExercises,
        exerciseAccuracy,
        todayExercises,
        currentStreak,
        longestStreak,
        weeklyGoal: 10, // Valor padrão ou lógica para calcular meta semanal
        weeklyProgress: weeklyEvents,
        subjectProgress,
        recentActivity,
        monthlyGoals: monthlyGoalsConfig
      };
      
      console.log('📊 [Dashboard] Estatísticas calculadas:', finalStats);
      
      // Atualizar progresso das metas mensais no banco de dados
      try {
        await monthlyGoalsService.updateMonthlyProgress(user.id, {
          studyHours: monthlyStudyHours,
          eventsCompleted: monthlyCompletedEvents + monthlyExercises,
          currentStreak: currentStreak
        });
        console.log('🎯 [Dashboard] Progresso das metas atualizado');
      } catch (error) {
        console.warn('⚠️ [Dashboard] Erro ao atualizar progresso das metas:', error);
        // Não falhar se não conseguir atualizar as metas
      }
      
      setStats(finalStats);
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    isLoading,
    error,
    refresh: fetchDashboardData
  };
};