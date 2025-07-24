import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target } from 'lucide-react';

interface PerformanceChartProps {
  recentPerformance: {
    date: string;
    score: number;
    subject: string;
  }[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  recentPerformance
}) => {
  const maxScore = 100;
  const averageScore = recentPerformance.length > 0 
    ? recentPerformance.reduce((sum, item) => sum + item.score, 0) / recentPerformance.length 
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    return 'Precisa Melhorar';
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Performance Recente</h3>
        <div className="flex items-center space-x-2 text-emerald-600">
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm font-medium">{Math.round(averageScore)}% média</span>
        </div>
      </div>

      {recentPerformance.length === 0 ? (
        <div className="text-center py-12">
          <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Nenhuma atividade avaliada</p>
          <p className="text-sm text-gray-400 mt-1">
            Complete algumas atividades para ver sua performance
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Gráfico de Barras */}
          <div className="space-y-3">
            {recentPerformance.map((item, index) => (
              <motion.div
                key={`${item.date}-${item.subject}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">{item.subject}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">{item.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">{item.score}%</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                      item.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {getScoreLabel(item.score)}
                    </span>
                  </div>
                </div>
                
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                    className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${getScoreColor(item.score)}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Estatísticas Resumidas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: recentPerformance.length * 0.1 + 0.5 }}
            className="grid grid-cols-3 gap-4"
          >
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-700">
                {Math.round(averageScore)}%
              </div>
              <div className="text-xs text-blue-600">Média Geral</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-emerald-700">
                {Math.max(...recentPerformance.map(p => p.score), 0)}%
              </div>
              <div className="text-xs text-emerald-600">Melhor Score</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <Award className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-purple-700">
                {recentPerformance.filter(p => p.score >= 80).length}
              </div>
              <div className="text-xs text-purple-600">Excelentes</div>
            </div>
          </motion.div>

          {/* Tendência */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: recentPerformance.length * 0.1 + 0.7 }}
            className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-indigo-900 mb-1">Tendência de Performance</h4>
                <p className="text-sm text-indigo-700">
                  {averageScore >= 80 
                    ? '🎉 Excelente! Continue assim!'
                    : averageScore >= 60 
                    ? '📈 Bom progresso! Pode melhorar ainda mais.'
                    : '💪 Foque nos estudos para melhorar sua performance.'
                  }
                </p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${
                  averageScore >= 80 ? 'text-emerald-600' :
                  averageScore >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {averageScore >= 80 ? '🏆' : averageScore >= 60 ? '📊' : '📈'}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
