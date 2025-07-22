import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface UserStats {
  overallProgress: number;
  monthlyGoalCurrent: number;
  monthlyGoalTarget: number;
  todayActivities: number;
  totalStudyPlans: number;
  completedEvents: number;
  loading: boolean;
}

export function useUserStats(): UserStats {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    overallProgress: 0,
    monthlyGoalCurrent: 0,
    monthlyGoalTarget: 20,
    todayActivities: 0,
    totalStudyPlans: 0,
    completedEvents: 0,
    loading: true,
  });

  useEffect(() => {
    if (!user) {
      setStats(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchUserStats = async () => {
      try {
        // Buscar planos de estudo
        const { data: studyPlans, error: studyPlansError } = await supabase
          .from('study_plans')
          .select('id')
          .eq('user_id', user.id);

        if (studyPlansError) throw studyPlansError;

        // Buscar eventos do calendário
        const { data: calendarEvents, error: eventsError } = await supabase
          .from('calendar_events')
          .select('id, status, start_date')
          .eq('user_id', user.id);

        if (eventsError) throw eventsError;

        // Calcular estatísticas
        const totalEvents = calendarEvents?.length || 0;
        const completedEvents = calendarEvents?.filter(event => event.status === 'completed').length || 0;
        const overallProgress = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0;

        // Eventos de hoje
        const today = new Date().toISOString().split('T')[0];
        const todayEvents = calendarEvents?.filter(event => 
          event.start_date?.startsWith(today)
        ).length || 0;

        // Meta mensal (eventos concluídos este mês)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyCompleted = calendarEvents?.filter(event => {
          if (event.status !== 'completed' || !event.start_date) return false;
          const eventDate = new Date(event.start_date);
          return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
        }).length || 0;

        setStats({
          overallProgress,
          monthlyGoalCurrent: monthlyCompleted,
          monthlyGoalTarget: 20,
          todayActivities: todayEvents,
          totalStudyPlans: studyPlans?.length || 0,
          completedEvents,
          loading: false,
        });

      } catch (error) {
        console.error('Erro ao buscar estatísticas do usuário:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchUserStats();
  }, [user]);

  return stats;
}
