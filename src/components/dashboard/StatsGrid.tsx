
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BookOpen, 
  CheckCircle, 
  Target, 
  Flame,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { DashboardStats } from '@/hooks/useDashboardData';

interface StatsGridProps {
  stats: DashboardStats;
  isLoading: boolean;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, isLoading }) => {
  const completionRate = stats.totalEvents > 0 
    ? Math.round((stats.completedEvents / stats.totalEvents) * 100) 
    : 0;

  const statsData = [
    {
      title: 'Atividades Hoje',
      value: stats.todayEvents,
      icon: Calendar,
      color: 'bg-blue-50 text-blue-700',
      iconBg: 'bg-blue-500',
      trend: '+2 desde ontem'
    },
    {
      title: 'Taxa de Conclusão',
      value: `${completionRate}%`,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-700',
      iconBg: 'bg-green-500',
      trend: completionRate > 80 ? 'Excelente!' : 'Continue assim!'
    },
    {
      title: 'Sequência Atual',
      value: stats.currentStreak,
      icon: Flame,
      color: 'bg-orange-50 text-orange-700',
      iconBg: 'bg-orange-500',
      trend: `Recorde: ${stats.longestStreak} dias`
    },
    {
      title: 'Exercícios Corretos',
      value: stats.correctExercises,
      icon: Target,
      color: 'bg-purple-50 text-purple-700',
      iconBg: 'bg-purple-500',
      trend: `${Math.round(stats.exerciseAccuracy)}% de acerto`
    },
    {
      title: 'Planos Ativos',
      value: stats.activeStudyPlans,
      icon: BookOpen,
      color: 'bg-indigo-50 text-indigo-700',
      iconBg: 'bg-indigo-500',
      trend: `${stats.totalStudyPlans} total`
    },
    {
      title: 'Meta Mensal',
      value: `${Math.round((stats.monthlyGoals.eventsCompleted.current / stats.monthlyGoals.eventsCompleted.target) * 100)}%`,
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-700',
      iconBg: 'bg-emerald-500',
      trend: `${stats.monthlyGoals.eventsCompleted.current}/${stats.monthlyGoals.eventsCompleted.target}`
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {stat.title}
                </div>
                <div className="text-xs text-gray-500">
                  {stat.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
