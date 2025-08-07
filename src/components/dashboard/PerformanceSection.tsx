
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Trophy, Target, Clock } from 'lucide-react';
import { DashboardStats } from '@/hooks/useDashboardData';

interface PerformanceSectionProps {
  stats: DashboardStats;
  isLoading: boolean;
}

export const PerformanceSection: React.FC<PerformanceSectionProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <TrendingUp className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Performance e Progresso</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sequência de Estudos */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-orange-500" />
              Sequência de Estudos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {stats.currentStreak}
              </div>
              <p className="text-gray-600">dias consecutivos</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <Trophy className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="font-bold text-orange-700">{stats.longestStreak}</div>
                <div className="text-xs text-orange-600">Recorde</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="font-bold text-blue-700">{stats.weeklyProgress}/{stats.weeklyGoal}</div>
                <div className="text-xs text-blue-600">Esta semana</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
              <p className="text-sm font-medium text-orange-700 text-center">
                {stats.currentStreak >= 7 
                  ? '🔥 Sequência incrível! Continue assim!'
                  : stats.currentStreak >= 3
                  ? '💪 Boa sequência! Mantenha o ritmo!'
                  : '🚀 Vamos começar uma nova sequência!'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Progresso por Matéria */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-500" />
              Progresso por Matéria
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.subjectProgress.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma atividade por matéria ainda</p>
                <p className="text-sm text-gray-400">Complete algumas atividades para ver o progresso</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.subjectProgress.slice(0, 4).map((subject, index) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{subject.subject}</span>
                      <span className="text-sm font-bold text-gray-900">
                        {Math.round(subject.percentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{subject.completed} concluídas</span>
                      <span>{subject.total} total</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
