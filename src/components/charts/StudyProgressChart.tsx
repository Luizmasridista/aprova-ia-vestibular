import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Target } from 'lucide-react';

interface StudyProgressChartProps {
  totalHours: number;
  completedActivities: number;
  totalActivities: number;
  streak: number;
  monthlyGoal: {
    current: number;
    target: number;
    percentage: number;
  };
}

export const StudyProgressChart: React.FC<StudyProgressChartProps> = ({
  totalHours,
  completedActivities,
  totalActivities,
  streak,
  monthlyGoal
}) => {
  const completionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Progresso de Estudos</h3>
        <div className="flex items-center space-x-2 text-emerald-600">
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm font-medium">+{streak} dias</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Horas Totais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-3">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#hoursGradient)"
                strokeWidth="2"
                strokeDasharray={`${Math.min(totalHours * 2, 100)}, 100`}
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${Math.min(totalHours * 2, 100)}, 100` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="hoursGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalHours}h</div>
          <div className="text-sm text-gray-600">Horas Estudadas</div>
        </motion.div>

        {/* Taxa de Conclusão */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-3">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#completionGradient)"
                strokeWidth="2"
                strokeDasharray={`${completionRate}, 100`}
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${completionRate}, 100` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="completionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Target className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{Math.round(completionRate)}%</div>
          <div className="text-sm text-gray-600">Taxa de Conclusão</div>
        </motion.div>

        {/* Meta Mensal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-3">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#goalGradient)"
                strokeWidth="2"
                strokeDasharray={`${monthlyGoal.percentage}, 100`}
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${monthlyGoal.percentage}, 100` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="goalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs font-bold text-purple-600">
                {monthlyGoal.current}/{monthlyGoal.target}
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{monthlyGoal.percentage}%</div>
          <div className="text-sm text-gray-600">Meta Mensal</div>
        </motion.div>
      </div>

      {/* Streak Counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="flex items-center space-x-1">
            {[...Array(Math.min(streak, 7))].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
              />
            ))}
            {streak > 7 && (
              <div className="text-sm font-medium text-orange-600 ml-2">
                +{streak - 7}
              </div>
            )}
          </div>
          <div className="text-sm font-medium text-orange-700">
            🔥 {streak} {streak === 1 ? 'dia' : 'dias'} consecutivos
          </div>
        </div>
      </motion.div>
    </div>
  );
};
