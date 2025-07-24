import { motion } from 'framer-motion';
import { TrendingUp, Target, CheckCircle } from 'lucide-react';
import { UserStats } from '../types';

/**
 * Componente de exibição de estatísticas do usuário
 */
interface UserStatsSectionProps {
  userStats: UserStats;
  isExpanded?: boolean;
}

export function UserStatsSection({ userStats, isExpanded = true }: UserStatsSectionProps) {
  const stats = [
    {
      title: 'Progresso Geral',
      icon: TrendingUp,
      iconColor: 'text-blue-600',
      bgGradient: 'from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30',
      borderColor: 'border-blue-200/50 dark:border-blue-800/50',
      textColor: 'text-blue-700 dark:text-blue-300',
      progressColor: 'from-blue-500 to-blue-600',
      progress: userStats.overallProgress,
      value: `${userStats.overallProgress}%`,
      label: `${userStats.completedEvents} concluídas`,
      loading: userStats.loading
    },
    {
      title: 'Meta Mensal',
      icon: Target,
      iconColor: 'text-green-600',
      bgGradient: 'from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30',
      borderColor: 'border-green-200/50 dark:border-green-800/50',
      textColor: 'text-green-700 dark:text-green-300',
      progressColor: 'from-green-500 to-green-600',
      progress: userStats.monthlyGoalTarget > 0 
        ? Math.min((userStats.monthlyGoalCurrent / userStats.monthlyGoalTarget) * 100, 100) 
        : 0,
      value: `${userStats.monthlyGoalCurrent}/${userStats.monthlyGoalTarget}`,
      label: `${userStats.monthlyGoalTarget > 0 ? Math.round((userStats.monthlyGoalCurrent / userStats.monthlyGoalTarget) * 100) : 0}%`,
      loading: userStats.loading
    },
    {
      title: 'Hoje',
      icon: CheckCircle,
      iconColor: 'text-purple-600',
      bgGradient: 'from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30',
      borderColor: 'border-purple-200/50 dark:border-purple-800/50',
      textColor: 'text-purple-900 dark:text-purple-100',
      value: userStats.todayActivities,
      loading: userStats.loading
    }
  ];

  if (!isExpanded) return null;

  return (
    <div className="px-3 py-4 space-y-3">
      {stats.map((stat, index) => (
        <StatCard 
          key={stat.title}
          stat={stat}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}

interface StatCardProps {
  stat: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    bgGradient: string;
    borderColor: string;
    textColor: string;
    progressColor?: string;
    progress?: number;
    value: string | number;
    label?: string;
    loading: boolean;
  };
  delay?: number;
}

function StatCard({ stat, delay = 0 }: StatCardProps) {
  const Icon = stat.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className={`p-3 rounded-lg bg-gradient-to-r ${stat.bgGradient} border ${stat.borderColor}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon className={`h-4 w-4 ${stat.iconColor}`} />
          <span className={`text-sm font-medium ${stat.textColor}`}>
            {stat.title}
          </span>
        </div>
        
        {!stat.loading ? (
          <span className={`text-lg font-bold ${stat.title === 'Hoje' ? 'text-purple-600' : ''}`}>
            {stat.value}
          </span>
        ) : (
          <div className="h-6 w-10 animate-pulse bg-muted rounded" />
        )}
      </div>

      {stat.progress !== undefined && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>{stat.value}</span>
            {stat.label && <span>{stat.label}</span>}
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stat.progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: delay + 0.1 }}
              className={`h-full bg-gradient-to-r ${stat.progressColor} rounded-full`}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
