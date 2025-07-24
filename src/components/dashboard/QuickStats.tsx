import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Trophy,
  Flame,
  Brain
} from 'lucide-react';

interface QuickStatsProps {
  stats: {
    totalEvents: number;
    completedEvents: number;
    todayEvents: number;
    upcomingEvents: number;
    totalExercises: number;
    correctExercises: number;
    exerciseAccuracy: number;
    todayExercises: number;
    currentStreak: number;
    totalStudyPlans: number;
    activeStudyPlans: number;
    monthlyGoals: {
      eventsCompleted: { current: number; target: number };
    };
  };
  isLoading?: boolean;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ stats, isLoading }) => {
  const completionRate = stats.totalEvents > 0 
    ? Math.round((stats.completedEvents / stats.totalEvents) * 100) 
    : 0;

  const monthlyProgress = stats.monthlyGoals.eventsCompleted.target > 0
    ? Math.round((stats.monthlyGoals.eventsCompleted.current / stats.monthlyGoals.eventsCompleted.target) * 100)
    : 0;

  const quickStatsData = [
    {
      title: 'Atividades Hoje',
      value: stats.todayEvents + stats.todayExercises,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-700',
      description: `${stats.todayEvents} eventos + ${stats.todayExercises} exercícios`
    },
    {
      title: 'Taxa de Conclusão',
      value: `${completionRate}%`,
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100',
      textColor: 'text-emerald-700',
      description: 'atividades concluídas'
    },
    {
      title: 'Exercícios',
      value: stats.totalExercises,
      icon: Brain,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'from-indigo-50 to-indigo-100',
      textColor: 'text-indigo-700',
      description: `${stats.exerciseAccuracy}% de acertos`
    },
    {
      title: 'Meta Mensal',
      value: `${monthlyProgress}%`,
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-700',
      description: `${stats.monthlyGoals.eventsCompleted.current}/${stats.monthlyGoals.eventsCompleted.target} atividades`
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-0 bg-white/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {quickStatsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="border-0 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
                <div className="text-right">
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    className="text-2xl font-bold text-gray-900"
                  >
                    {stat.value}
                  </motion.div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 text-sm mb-1">
                  {stat.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {stat.description}
                </p>
              </div>

              {/* Barra de progresso para metas */}
              {stat.title === 'Meta Mensal' && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <motion.div
                      className={`bg-gradient-to-r ${stat.color} h-1.5 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${monthlyProgress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.4 }}
                    />
                  </div>
                </div>
              )}

              {/* Indicador de sequência */}
              {stat.title === 'Sequência Atual' && stats.currentStreak > 0 && (
                <div className="mt-2 flex items-center space-x-1">
                  {[...Array(Math.min(stats.currentStreak, 7))].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.5 + i * 0.1 }}
                      className="w-1.5 h-1.5 bg-orange-400 rounded-full"
                    />
                  ))}
                  {stats.currentStreak > 7 && (
                    <span className="text-xs text-orange-600 font-medium">
                      +{stats.currentStreak - 7}
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
