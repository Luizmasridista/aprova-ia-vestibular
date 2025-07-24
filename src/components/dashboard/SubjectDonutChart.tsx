import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, TrendingUp } from 'lucide-react';
import { DonutChart } from '@/components/charts/DonutChart';

interface SubjectDonutChartProps {
  subjectProgress: {
    subject: string;
    completed: number;
    total: number;
    percentage: number;
  }[];
  isLoading?: boolean;
}

export const SubjectDonutChart: React.FC<SubjectDonutChartProps> = ({ 
  subjectProgress, 
  isLoading 
}) => {
  const getSubjectColor = (subject: string, index: number) => {
    const colors = [
      '#3b82f6', // blue
      '#10b981', // emerald
      '#8b5cf6', // purple
      '#f59e0b', // amber
      '#ef4444', // red
      '#06b6d4', // cyan
      '#84cc16', // lime
      '#f97316', // orange
      '#ec4899', // pink
      '#6366f1'  // indigo
    ];
    return colors[index % colors.length];
  };

  const getSubjectIcon = (subject: string) => {
    const icons: Record<string, string> = {
      'Matemática': '🔢',
      'Português': '📝',
      'Física': '⚛️',
      'Química': '🧪',
      'Biologia': '🧬',
      'História': '📚',
      'Geografia': '🌍',
      'Inglês': '🇺🇸',
      'Literatura': '📖',
      'Filosofia': '🤔',
      'Sociologia': '👥',
      'Redação': '✍️'
    };
    return icons[subject] || '📚';
  };

  // Preparar dados para o gráfico (top 6 matérias)
  const chartData = subjectProgress.slice(0, 6).map((subject, index) => ({
    label: subject.subject,
    value: subject.completed,
    color: getSubjectColor(subject.subject, index),
    count: subject.completed
  }));

  const totalActivities = subjectProgress.reduce((sum, subject) => sum + subject.completed, 0);
  const topSubject = subjectProgress[0];

  if (isLoading) {
    return (
      <Card className="border-0 bg-white/50 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            Matérias Mais Estudadas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-pulse">
            <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (subjectProgress.length === 0 || totalActivities === 0) {
    return (
      <Card className="border-0 bg-white/50 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            Matérias Mais Estudadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium mb-2">Nenhuma atividade concluída</p>
            <p className="text-sm text-gray-400">
              Complete algumas atividades para ver sua distribuição por matéria
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/50 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-600" />
          Matérias Mais Estudadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {/* Gráfico de Donut */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <DonutChart
              data={chartData}
              size={200}
              strokeWidth={24}
              showLabels={false}
              centerContent={
                <div className="text-center">
                  <div className="text-2xl mb-1">
                    {getSubjectIcon(topSubject?.subject || '')}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalActivities}
                  </div>
                  <div className="text-xs text-gray-500">
                    atividades
                  </div>
                </div>
              }
            />
          </motion.div>

          {/* Lista de matérias */}
          <div className="w-full mt-6 space-y-3">
            {chartData.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.6 }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {getSubjectIcon(item.label)}
                    </span>
                    <span className="font-medium text-gray-900 text-sm">
                      {item.label}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 text-sm">
                    {Math.round((item.value / totalActivities) * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.count} atividades
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Insights */}
          {topSubject && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="w-full mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200"
            >
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-4 w-4 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-purple-900 text-sm mb-1">
                    Matéria Favorita
                  </h4>
                  <p className="text-xs text-purple-700">
                    {(() => {
                      const percentage = Math.round((topSubject.completed / totalActivities) * 100);
                      if (percentage >= 40) {
                        return `🎯 ${topSubject.subject} representa ${percentage}% dos seus estudos! Você tem foco!`;
                      } else if (percentage >= 25) {
                        return `📚 ${topSubject.subject} é sua matéria principal (${percentage}%). Continue assim!`;
                      } else {
                        return `⚖️ Seus estudos estão bem distribuídos entre as matérias. Ótimo equilíbrio!`;
                      }
                    })()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
