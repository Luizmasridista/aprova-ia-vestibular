import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, BarChart3 } from 'lucide-react';

interface SubjectDistributionChartProps {
  subjectDistribution: {
    subject: string;
    hours: number;
    activities: number;
    color: string;
  }[];
}

export const SubjectDistributionChart: React.FC<SubjectDistributionChartProps> = ({
  subjectDistribution
}) => {
  const [viewMode, setViewMode] = useState<'hours' | 'activities'>('hours');
  
  const totalHours = subjectDistribution.reduce((sum, item) => sum + item.hours, 0);
  const totalActivities = subjectDistribution.reduce((sum, item) => sum + item.activities, 0);
  
  const sortedData = [...subjectDistribution].sort((a, b) => 
    viewMode === 'hours' ? b.hours - a.hours : b.activities - a.activities
  );

  const getPercentage = (item: typeof subjectDistribution[0]) => {
    const total = viewMode === 'hours' ? totalHours : totalActivities;
    const value = viewMode === 'hours' ? item.hours : item.activities;
    return total > 0 ? (value / total) * 100 : 0;
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Distribuição por Matéria</h3>
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('hours')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-all ${
              viewMode === 'hours'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Horas</span>
          </button>
          <button
            onClick={() => setViewMode('activities')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-all ${
              viewMode === 'activities'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Atividades</span>
          </button>
        </div>
      </div>

      {sortedData.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma atividade registrada ainda</p>
          <p className="text-sm text-gray-400 mt-1">
            Complete algumas atividades para ver a distribuição por matéria
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {sortedData.map((item, index) => {
              const percentage = getPercentage(item);
              const value = viewMode === 'hours' ? item.hours : item.activities;
              const unit = viewMode === 'hours' ? 'h' : '';

              return (
                <motion.div
                  key={`${item.subject}-${viewMode}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-gray-900">{item.subject}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {value.toFixed(1)}{unit}
                      </div>
                      <div className="text-xs text-gray-500">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 group-hover:shadow-lg"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Resumo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sortedData.length * 0.1 + 0.5 }}
            className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {sortedData.length}
                </div>
                <div className="text-sm text-indigo-700">
                  {sortedData.length === 1 ? 'Matéria' : 'Matérias'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {viewMode === 'hours' ? `${totalHours.toFixed(1)}h` : totalActivities}
                </div>
                <div className="text-sm text-purple-700">
                  Total {viewMode === 'hours' ? 'Estudado' : 'de Atividades'}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
