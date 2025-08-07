import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BookOpen, Target, TrendingUp } from 'lucide-react';
import { DashboardStats } from '@/hooks/useDashboardData';

interface SubjectPerformanceChartProps {
  stats: DashboardStats;
  isLoading: boolean;
}

export const SubjectPerformanceChart: React.FC<SubjectPerformanceChartProps> = ({ 
  stats, 
  isLoading 
}) => {
  // Preparar dados para o gráfico
  const chartData = stats.subjectProgress
    .filter(subject => subject.total > 0)
    .map((subject, index) => ({
      name: subject.subject,
      value: subject.total,
      percentage: Math.round(subject.percentage),
      completed: subject.completed,
      correct: subject.correct || 0,
      wrong: subject.wrong || 0,
      accuracy: subject.total > 0 ? Math.round(((subject.correct || subject.completed) / subject.total) * 100) : 0,
      color: COLORS[index % COLORS.length]
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6); // Top 6 matérias

  const COLORS = [
    'hsl(220, 100%, 60%)', // Blue
    'hsl(160, 100%, 45%)', // Emerald  
    'hsl(45, 100%, 60%)',  // Amber
    'hsl(280, 100%, 60%)', // Purple
    'hsl(10, 100%, 60%)',  // Red
    'hsl(200, 100%, 60%)', // Sky
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200"
        >
          <h4 className="font-semibold text-gray-900 mb-2">{data.name}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de atividades:</span>
              <span className="font-medium text-gray-900">{data.value}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Concluídas:</span>
              <span className="font-medium text-emerald-600">{data.completed}</span>
            </div>
            {data.correct > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Acertos:</span>
                <span className="font-medium text-green-600">{data.correct}</span>
              </div>
            )}
            {data.wrong > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Erros:</span>
                <span className="font-medium text-red-600">{data.wrong}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1 border-t">
              <span className="text-gray-600">Taxa de acerto:</span>
              <span className={`font-bold ${data.accuracy >= 70 ? 'text-green-600' : data.accuracy >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                {data.accuracy}%
              </span>
            </div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {payload?.map((entry: any, index: number) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-2 text-sm"
        >
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-700 truncate">{entry.value}</span>
        </motion.div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Performance por Matéria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Performance por Matéria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma atividade por matéria
            </h3>
            <p className="text-gray-500 mb-6">
              Complete algumas atividades para ver sua performance por matéria
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all text-sm cursor-pointer"
            >
              <Target className="h-4 w-4" />
              <span>Começar Estudos</span>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-500" />
          Performance por Matéria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Legenda customizada */}
        <CustomLegend payload={chartData.map(item => ({ value: item.name, color: item.color }))} />

        {/* Estatísticas resumidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {chartData.reduce((acc, curr) => acc + curr.value, 0)}
            </div>
            <div className="text-xs text-gray-500">Total de Atividades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {chartData.reduce((acc, curr) => acc + curr.completed, 0)}
            </div>
            <div className="text-xs text-gray-500">Concluídas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">
              {chartData.length > 0 
                ? Math.round(chartData.reduce((acc, curr) => acc + curr.accuracy, 0) / chartData.length)
                : 0}%
            </div>
            <div className="text-xs text-gray-500">Média de Acerto</div>
          </div>
        </motion.div>

        {/* Top performer */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 text-sm">
                  Matéria Destaque: {chartData[0].name}
                </h4>
                <p className="text-xs text-blue-700">
                  {chartData[0].value} atividades com {chartData[0].accuracy}% de aproveitamento
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};