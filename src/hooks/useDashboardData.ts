import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { monthlyGoalsService } from '@/lib/services/monthlyGoalsService';
import { eq } from '@supabase/supabase-js';

interface ExerciseSessionProgress {
  completed: number;
  total: number;
  subject: string;
  sessionId: string | null;
}

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
  subject?: string;
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
  totalStudyPlans: number;
  activeStudyPlans: number;
  completedStudyPlans: number;
  totalEvents: number;
  completedEvents: number;
  todayEvents: number;
  upcomingEvents: number;
  totalExercises: number;
  correctExercises: number;
  exerciseAccuracy: number;
  todayExercises: number;
  currentExerciseSession: ExerciseSessionProgress;
  currentStreak: number;
  longestStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  subjectProgress: {
    subject: string;
    completed: number;
    total: number;
    percentage: number;
    correct?: number;
    wrong?: number;
    notAttempted?: number;
  }[];
  recentActivity: {
    id: string;
    type: 'study_plan' | 'event_completed' | 'streak_milestone' | 'exercise_completed';
    title: string;
    description: string;
    timestamp: string;
    icon: string;
  }[];
  monthlyGoals: {
    studyHours: { current: number; target: number };
    eventsCompleted: { current: number; target: number };
    streakDays: { current: number; target: number };
    reasoning?: string;
    intensity?: 'low' | 'medium' | 'high' | 'intensive';
  };
}

interface PersonalizedGoals {
  monthlyStudyHours: number;
  monthlyEvents: number;
  weeklyGoal: number;
  streakTarget: number;
  intensity: 'low' | 'medium' | 'high' | 'intensive';
  reasoning: string;
}

export interface DashboardData {
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

function calculatePersonalizedGoals(
  studyPlans: StudyPlan[], 
  events: CalendarEvent[], 
  currentStreak: number
): PersonalizedGoals {
  const now = new Date();
  
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

  const activePlans = studyPlans.filter(plan => new Date(plan.target_date) >= now).sort((a, b) => new Date(a.target_date).getTime() - new Date(b.target_date).getTime());
  const primaryPlan = activePlans[0] || studyPlans[studyPlans.length - 1];
  const targetDate = new Date(primaryPlan.target_date);
  const daysUntilTarget = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const monthsUntilTarget = Math.max(1, Math.ceil(daysUntilTarget / 30));
  
  const targetCourse = primaryPlan.target_course.toLowerCase();
  const isHighCompetition = (
    targetCourse.includes('medicina') ||
    targetCourse.includes('direito') ||
    targetCourse.includes('engenharia')
  );
  
  const totalEvents = events.length;
  const completedEvents = events.filter(e => e.completed).length;
  const completionRate = totalEvents > 0 ? completedEvents / totalEvents : 0;
  
  let intensity: PersonalizedGoals['intensity'] = 'medium';
  let intensityScore = 0;
  
  if (daysUntilTarget <= 90) intensityScore += 4;
  else if (daysUntilTarget <= 180) intensityScore += 3;
  else if (daysUntilTarget <= 365) intensityScore += 2;
  else intensityScore += 1;
  
  if (isHighCompetition) intensityScore += 3;
  else intensityScore += 1;
  
  if (completionRate >= 0.8) intensityScore += 2;
  else if (completionRate >= 0.6) intensityScore += 1.5;
  else if (completionRate >= 0.4) intensityScore += 1;
  else intensityScore += 0.5;
  
  if (currentStreak >= 14) intensityScore += 1;
  else if (currentStreak >= 7) intensityScore += 0.5;
  
  if (intensityScore >= 8) intensity = 'intensive';
  else if (intensityScore >= 6) intensity = 'high';
  else if (intensityScore >= 4) intensity = 'medium';
  else intensity = 'low';
  
  let monthlyStudyHours, monthlyEvents, weeklyGoal, streakTarget, reasoning;
  
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
  
  if (completionRate < 0.5 && intensity !== 'low') {
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

// Funções auxiliares movidas para fora do hook para melhor organização
const fetchActiveExerciseSession = async (userId: string) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('exercise_sessions')
      .select('id, subject, exercise_results(count)')
      .eq('user_id', userId)
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    const completed = data.exercise_results[0]?.count || 0;
    return {
      completed,
      total: Math.max(completed, 5),
      subject: data.subject || 'Geral',
      sessionId: data.id
    };
  } catch (error) {
    console.error('Erro ao buscar sessão ativa de exercícios:', error);
    return null;
  }
};

const calculateStreaks = (events: CalendarEvent[]) => {
  if (!events || events.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const completedDates = [...new Set(events
    .filter(e => e.completed)
    .map(e => new Date(e.start_date).toDateString()))]
    .map(dateStr => new Date(dateStr))
    .sort((a, b) => b.getTime() - a.getTime());

  if (completedDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date(new Date().toDateString());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  if (completedDates[0].getTime() === today.getTime() || completedDates[0].getTime() === yesterday.getTime()) {
    currentStreak = 1;
    for (let i = 0; i < completedDates.length - 1; i++) {
      const diff = (completedDates[i].getTime() - completedDates[i + 1].getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  for (let i = 0; i < completedDates.length - 1; i++) {
    const diff = (completedDates[i].getTime() - completedDates[i + 1].getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return { currentStreak, longestStreak };
};


  const progress: { [key: string]: { completed: number; total: number; correct: number; wrong: number } } = {};

  events.forEach(event => {
    if (event.subject) {
      if (!progress[event.subject]) {
        progress[event.subject] = { completed: 0, total: 0, correct: 0, wrong: 0 };
      }
      progress[event.subject].total++;
      if (event.completed) {
        progress[event.subject].completed++;
      }
    }
  });

  exerciseResults.forEach(result => {
    const subject = result.subject;
    if (subject) {
       if (!progress[subject]) {
        progress[subject] = { completed: 0, total: 0, correct: 0, wrong: 0 };
      }
      if (result.is_correct) {
        progress[subject].correct++;
      } else {
        progress[subject].wrong++;
      }
    }
  });

  return Object.entries(progress).map(([subject, data]) => ({
    subject,
    ...data,
    percentage: data.total > 0 ? (data.completed / data.total) * 100 : 0,
    notAttempted: data.total - data.completed,
  }));
};

const generateRecentActivity = (events: CalendarEvent[], studyPlans: StudyPlan[]) => {
  const activities: any[] = [];

  events.filter(e => e.completed).forEach(event => {
    activities.push({
      id: `evt-${event.id}`,
      type: 'event_completed',
      title: `Evento Concluído: ${event.title}`,
      description: `Você completou a tarefa de ${event.subject || 'estudos'}.`,
      timestamp: event.updated_at || event.created_at,
      icon: 'CalendarCheck'
    });
  });

  studyPlans.forEach(plan => {
    activities.push({
      id: `plan-${plan.id}`,
      type: 'study_plan',
      title: `Plano Criado: ${plan.target_course}`,
      description: `Novo plano de estudos com meta para ${new Date(plan.target_date).toLocaleDateString()}.`,
      timestamp: plan.created_at,
      icon: 'ClipboardList'
    });
  });

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);
};

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
    currentExerciseSession: {
      completed: 0,
      total: 0,
      subject: 'Geral',
      sessionId: null
    },
    currentStreak: 0,
    longestStreak: 0,
    weeklyGoal: 0,
    weeklyProgress: 0,
    subjectProgress: [],
    recentActivity: [],
    monthlyGoals: {
      studyHours: { current: 0, target: 0 },
      eventsCompleted: { current: 0, target: 0 },
      streakDays: { current: 0, target: 0 },
      reasoning: '',
      intensity: 'medium'
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const [studyPlansData, eventsData, exerciseResultsData, activeSessionData] = await Promise.all([
        supabase.from('study_plans').select('*').eq('user_id', user.id),
        supabase.from('calendar_events').select('*').eq('user_id', user.id),
        supabase.from('exercise_results').select('*').eq('user_id', user.id),
        fetchActiveExerciseSession(user.id)
      ]);

      if (studyPlansData.error) throw studyPlansData.error;
      if (eventsData.error) throw eventsData.error;
      if (exerciseResultsData.error) throw exerciseResultsData.error;

      const studyPlans = (studyPlansData.data || []) as StudyPlan[];
      const events = (eventsData.data || []) as CalendarEvent[];
      const exerciseResults = (exerciseResultsData.data || []) as ExerciseResult[];

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const totalStudyPlans = studyPlans.length;
      const activeStudyPlans = studyPlans.filter(p => new Date(p.target_date) >= now).length;
      const completedStudyPlans = totalStudyPlans - activeStudyPlans;

      const totalEvents = events.length;
      const completedEvents = events.filter(e => e.completed).length;
      const todayEvents = events.filter(e => new Date(e.start_date).toDateString() === today.toDateString()).length;
      const upcomingEvents = events.filter(e => new Date(e.start_date) > now).length;

      const totalExercises = exerciseResults.length;
      const correctExercises = exerciseResults.filter(r => r.is_correct).length;
      const exerciseAccuracy = totalExercises > 0 ? (correctExercises / totalExercises) * 100 : 0;
      const todayExercises = exerciseResults.filter(r => new Date(r.created_at).toDateString() === today.toDateString()).length;

      const { currentStreak, longestStreak } = calculateStreaks(events);

      const weeklyEvents = events.filter(e => new Date(e.start_date) >= oneWeekAgo && e.completed);
      const weeklyProgress = weeklyEvents.length;

      const subjectProgress = calculateSubjectProgress(events, exerciseResults);

      const recentActivity = generateRecentActivity(events, studyPlans);

      const personalizedGoals = calculatePersonalizedGoals(studyPlans, events, currentStreak);

      const monthlyGoals = await monthlyGoalsService.getUserMonthlyGoals(user.id, personalizedGoals);

      setStats({
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
        currentExerciseSession: activeSessionData || { completed: 0, total: 5, subject: 'Geral', sessionId: null },
        currentStreak,
        longestStreak,
        weeklyGoal: personalizedGoals.weeklyGoal,
        weeklyProgress,
        subjectProgress,
        recentActivity,
        monthlyGoals
      });

    } catch (err: any) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

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

export const updateExerciseSessionProgress = async (
    userId: string, 
    sessionId: string, 
    isCorrect: boolean
  ) => {
    try {
      const { data: session, error: sessionError } = await supabase
        .from('exercise_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();
      
      if (sessionError) throw sessionError;
      
      await supabase
        .from('exercise_results')
        .insert({
          user_id: userId,
          session_id: sessionId,
          is_correct: isCorrect,
          time_spent: 0, 
          subject: session.subject,
          difficulty: session.difficulty || 'medium'
        });

    } catch (error) {
      console.error('Erro ao atualizar progresso da sessão de exercícios:', error);
      throw error;
    }
  };
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { monthlyGoalsService } from '@/lib/services/monthlyGoalsService';




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
    currentExerciseSession: {
      completed: 0,
      total: 0,
      subject: 'Geral',
      sessionId: null
    },
    currentStreak: 0,
    longestStreak: 0,
    weeklyGoal: 0,
    weeklyProgress: 0,
    subjectProgress: [],
    recentActivity: [],
    monthlyGoals: {
      studyHours: { current: 0, target: 0 },
      eventsCompleted: { current: 0, target: 0 },
      streakDays: { current: 0, target: 0 },
      reasoning: '',
      intensity: 'medium'
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Buscas em paralelo
      const [studyPlansData, eventsData, exerciseResultsData, activeSessionData] = await Promise.all([
        supabase.from('study_plans').select('*').eq('user_id', user.id),
        supabase.from('calendar_events').select('*').eq('user_id', user.id),
        supabase.from('exercise_results').select('*').eq('user_id', user.id),
        fetchActiveExerciseSession(user.id)
      ]);

      if (studyPlansData.error) throw studyPlansData.error;
      if (eventsData.error) throw eventsData.error;
      if (exerciseResultsData.error) throw exerciseResultsData.error;

      const studyPlans = (studyPlansData.data || []) as StudyPlan[];
      const events = (eventsData.data || []) as CalendarEvent[];
      const exerciseResults = (exerciseResultsData.data || []) as ExerciseResult[];

      // Processamento de dados
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Estatísticas de Planos de Estudo
      const totalStudyPlans = studyPlans.length;
      const activeStudyPlans = studyPlans.filter(p => new Date(p.target_date) >= now).length;
      const completedStudyPlans = totalStudyPlans - activeStudyPlans;

      // Estatísticas de Eventos
      const totalEvents = events.length;
      const completedEvents = events.filter(e => e.completed).length;
      const todayEvents = events.filter(e => {
        const eventDate = new Date(e.start_date);
        return eventDate.toDateString() === today.toDateString();
      }).length;
      const upcomingEvents = events.filter(e => new Date(e.start_date) > now).length;

      // Estatísticas de Exercícios
      const totalExercises = exerciseResults.length;
      const correctExercises = exerciseResults.filter(r => r.is_correct).length;
      const exerciseAccuracy = totalExercises > 0 ? (correctExercises / totalExercises) * 100 : 0;
      const todayExercises = exerciseResults.filter(r => new Date(r.created_at).toDateString() === today.toDateString()).length;

      // Cálculo de Streak
      const { currentStreak, longestStreak } = calculateStreaks(events);

      // Progresso Semanal
      const weeklyEvents = events.filter(e => new Date(e.start_date) >= oneWeekAgo && e.completed);
      const weeklyProgress = weeklyEvents.length;

      // Progresso por Matéria
      const subjectProgress = calculateSubjectProgress(events, exerciseResults);

      // Atividade Recente
      const recentActivity = generateRecentActivity(events, studyPlans);

      // Metas Personalizadas
      const personalizedGoals = calculatePersonalizedGoals(studyPlans, events, currentStreak);

      // Metas Mensais
      const monthlyGoals = await monthlyGoalsService.getUserMonthlyGoals(user.id, personalizedGoals);

      setStats({
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
        currentExerciseSession: activeSessionData || { completed: 0, total: 5, subject: 'Geral', sessionId: null },
        currentStreak,
        longestStreak,
        weeklyGoal: personalizedGoals.weeklyGoal,
        weeklyProgress,
        subjectProgress,
        recentActivity,
        monthlyGoals
      });

    } catch (err: any) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

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


      // Calcular estatísticas básicas
      const totalStudyPlans = typedStudyPlans.length;
      const activeStudyPlans = typedStudyPlans.filter(plan => {
        const targetDate = new Date(plan.target_date);
        return targetDate >= today;
      }).length;
      const completedStudyPlans = totalStudyPlans - activeStudyPlans;

      // Calcular estatísticas de eventos
      const totalEvents = typedEvents.length;
      const completedEvents = typedEvents.filter(event => event.completed).length;
      const todayEvents = typedEvents.filter(event => {
        const eventDate = new Date(event.start_date);
        return eventDate >= today && event.completed;
      }).length;

      // Calcular estatísticas de exercícios
      const totalExercises = typedExerciseResults.length;
      const correctExercises = typedExerciseResults.filter(
        result => result.is_correct
      ).length;
      const exerciseAccuracy = totalExercises > 0 
        ? Math.round((correctExercises / totalExercises) * 100) 
        : 0;
      
      const todayExercises = typedExerciseResults.filter(result => {
        const resultDate = new Date(result.created_at);
        return resultDate >= today;
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
      
      // ... (rest of the streak calculation logic)

      // Preparar dados para o gráfico de progresso por matéria
      const subjectProgress = []; // Será preenchido com os dados reais

      // Atividade recente
      const recentActivity = []; // Será preenchido com os dados reais

      // Metas mensais
      const monthlyGoals = {
        studyHours: { current: 0, target: 0 },
        eventsCompleted: { current: 0, target: 0 },
        streakDays: { current: 0, target: 0 }
      };

      // Atualizar o estado com os dados processados
      setStats({
        totalStudyPlans,
        activeStudyPlans,
        completedStudyPlans,
        totalEvents,
        completedEvents,
        todayEvents,
        upcomingEvents: 0, // Implementar lógica se necessário
        totalExercises,
        correctExercises,
        exerciseAccuracy,
        todayExercises,
        currentExerciseSession,
        currentStreak,
        longestStreak,
        weeklyGoal: 5, // Meta semanal padrão
        weeklyProgress: 0, // Implementar lógica se necessário
        subjectProgress,
        recentActivity,
        monthlyGoals
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    stats,
    isLoading,
    error,
    refresh: fetchDashboardData as () => Promise<void>
  };
};

// Função para atualizar o progresso da sessão de exercícios
// Funções auxiliares movidas para fora do hook para melhor organização

const fetchActiveExerciseSession = async (userId: string) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('exercise_sessions')
      .select('id, subject, exercise_results(count)')
      .eq('user_id', userId)
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    const completed = data.exercise_results[0]?.count || 0;
    return {
      completed,
      total: Math.max(completed, 5),
      subject: data.subject || 'Geral',
      sessionId: data.id
    };
  } catch (error) {
    console.error('Erro ao buscar sessão ativa de exercícios:', error);
    return null;
  }
};

const calculateStreaks = (events: CalendarEvent[]) => {
  if (!events || events.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const completedDates = [...new Set(events
    .filter(e => e.completed)
    .map(e => new Date(e.start_date).toDateString()))]
    .map(dateStr => new Date(dateStr))
    .sort((a, b) => b.getTime() - a.getTime());

  if (completedDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date(new Date().toDateString());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  if (completedDates[0].getTime() === today.getTime() || completedDates[0].getTime() === yesterday.getTime()) {
    currentStreak = 1;
    for (let i = 0; i < completedDates.length - 1; i++) {
      const diff = (completedDates[i].getTime() - completedDates[i + 1].getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  for (let i = 0; i < completedDates.length - 1; i++) {
    const diff = (completedDates[i].getTime() - completedDates[i + 1].getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return { currentStreak, longestStreak };
};

const calculateSubjectProgress = (events: CalendarEvent[], exerciseResults: any[]) => {
  const progress: { [key: string]: { completed: number; total: number; correct: number; wrong: number } } = {};

  events.forEach(event => {
    if (event.subject) {
      if (!progress[event.subject]) {
        progress[event.subject] = { completed: 0, total: 0, correct: 0, wrong: 0 };
      }
      progress[event.subject].total++;
      if (event.completed) {
        progress[event.subject].completed++;
      }
    }
  });

  exerciseResults.forEach(result => {
    const subject = result.subject; // Assumindo que exercise_results tem a coluna subject
    if (subject) {
       if (!progress[subject]) {
        progress[subject] = { completed: 0, total: 0, correct: 0, wrong: 0 };
      }
      if (result.is_correct) {
        progress[subject].correct++;
      } else {
        progress[subject].wrong++;
      }
    }
  });

  return Object.entries(progress).map(([subject, data]) => ({
    subject,
    ...data,
    percentage: data.total > 0 ? (data.completed / data.total) * 100 : 0,
    notAttempted: data.total - data.completed,
  }));
};

const generateRecentActivity = (events: CalendarEvent[], studyPlans: StudyPlan[]) => {
  const activities = [];

  events.filter(e => e.completed).forEach(event => {
    activities.push({
      id: `evt-${event.id}`,
      type: 'event_completed',
      title: `Evento Concluído: ${event.title}`,
      description: `Você completou a tarefa de ${event.subject || 'estudos'}.`,
      timestamp: event.updated_at || event.created_at,
      icon: 'CalendarCheck'
    });
  });

  studyPlans.forEach(plan => {
    activities.push({
      id: `plan-${plan.id}`,
      type: 'study_plan',
      title: `Plano Criado: ${plan.target_course}`,
      description: `Novo plano de estudos com meta para ${new Date(plan.target_date).toLocaleDateString()}.`,
      timestamp: plan.created_at,
      icon: 'ClipboardList'
    });
  });

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);
};

export const updateExerciseSessionProgress = async (
    userId: string, 
    sessionId: string, 
    isCorrect: boolean
  ) => {
    try {
      // Primeiro, verifica se a sessão existe
      const { data: session, error: sessionError } = await supabase
        .from('exercise_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();
      
      if (sessionError) throw sessionError;
      
      // Atualiza o status da sessão para 'in_progress'
      const { data: updatedSession, error: updateError } = await supabase
        .from('exercise_sessions')
        .upsert({
          id: sessionId,
          user_id: userId,
          subject: session.subject,
          difficulty: session.difficulty,
          created_at: session.created_at || new Date().toISOString()
        })
        .select('*')
        .single();
      
      if (updateError) throw updateError;
      
      // Cria um novo resultado de exercício
      const { data: result, error: resultError } = await supabase
        .from('exercise_results')
        .insert({
          user_id: userId,
          session_id: sessionId,
          is_correct: isCorrect,
          time_spent: 0, // Pode ser ajustado conforme necessário
          subject: session.subject,
          difficulty: session.difficulty || 'medium'
        })
        .select('*')
        .single();
      
      if (resultError) throw resultError;
      
      // Atualiza o progresso da sessão
      const { data: updatedSessionProgress, error: progressError } = await supabase
        .from('exercise_sessions')
        .update({
          progress: updatedSession.progress + 1
        })
        .eq('id', sessionId)
        .eq('user_id', userId)
        .select('*')
        .single();
      
            // Não há mais a coluna 'progress', a lógica foi simplificada para apenas inserir o resultado.
      // A contagem de progresso é feita dinamicamente no fetch.
    } catch (error) {
      console.error('Erro ao atualizar progresso da sessão de exercícios:', error);
      throw error;
    }
  };
