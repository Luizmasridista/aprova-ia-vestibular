import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Activity } from 'lucide-react';

interface WeeklyActivityChartProps {
  weeklyProgress: {
    day: string;
    hours: number;
    activities: number;
  }[];
}

export const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({
  weeklyProgress
}) => {
  const maxHours = Math.max(...weeklyProgress.map(d => d.hours), 1);
  const maxActivities = Math.max(...weeklyProgress.map(d => d.activities), 1);

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Atividade Semanal</h3>
        <div className="flex items-center space-x-2 text-blue-600">
          <Calendar className="h-5 w-5" />
          <span className="text-sm font-medium">Esta Semana</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Gráfico de Horas */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Horas de Estudo</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weeklyProgress.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.hours / maxHours) * 100}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-end justify-center pb-1">
                    <span className="text-xs font-medium text-white">
                      {day.hours > 0 ? `${day.hours.toFixed(1)}h` : ''}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-600">{day.day}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gráfico de Atividades */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Atividades Concluídas</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weeklyProgress.map((day, index) => (
              <motion.div
                key={`activities-${day.day}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="relative w-full h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.activities / maxActivities) * 100}%` }}
                    transition={{ delay: index * 0.1 + 0.8, duration: 0.8, ease: "easeOut" }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-end justify-center pb-1">
                    <span className="text-xs font-medium text-white">
                      {day.activities > 0 ? day.activities : ''}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-600">{day.day}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumo da Semana */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                Total da Semana
              </div>
              <div className="text-xs text-gray-600">
                {weeklyProgress.reduce((sum, day) => sum + day.hours, 0).toFixed(1)}h estudadas
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">
              {weeklyProgress.reduce((sum, day) => sum + day.activities, 0)}
            </div>
            <div className="text-xs text-gray-600">atividades</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
