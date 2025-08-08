import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Check, X, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { DonutChart } from '@/components/charts/DonutChart';

interface SubjectPerformanceDonutProps {
  subjectProgress: Array<{
    subject: string;
    completed: number;
    total: number;
    percentage: number;
    correct?: number;
    wrong?: number;
    notAttempted?: number;
  }>;
  isLoading: boolean;
}

export const SubjectPerformanceDonut: React.FC<SubjectPerformanceDonutProps> = ({
  subjectProgress = [],
  isLoading = false,
}) => {
  // Filter out subjects without exercise data (no correct/wrong counts)
  const exerciseSubjects = subjectProgress.filter(
    subject => (subject.correct !== undefined && subject.wrong !== undefined) || 
              (subject.completed !== undefined && subject.total !== undefined)
  );

  // Calculate total correct and wrong answers for the donut chart
  const totalCorrect = exerciseSubjects.reduce((sum, subject) => sum + (subject.correct || 0), 0);
  const totalWrong = exerciseSubjects.reduce((sum, subject) => sum + (subject.wrong || 0), 0);
  const totalAnswers = totalCorrect + totalWrong;
  const totalCompleted = exerciseSubjects.reduce((sum, subject) => sum + (subject.completed || 0), 0);
  const totalPlanned = exerciseSubjects.reduce((sum, subject) => sum + (subject.total || 0), 0);

  // Prepare data for the completion donut chart
  const completionChartData = [
    {
      label: 'Concluído',
      value: totalCompleted,
      color: '#10b981', // emerald-500
      count: totalCompleted
    },
    {
      label: 'Pendente',
      value: Math.max(0, totalPlanned - totalCompleted),
      color: '#e5e7eb', // gray-200
      count: Math.max(0, totalPlanned - totalCompleted)
    }
  ];

  // Prepare data for the performance donut chart (correct vs wrong answers)
  const performanceChartData = [
    {
      label: 'Acertos',
      value: totalCorrect,
      color: '#10b981', // emerald-500
      count: totalCorrect
    },
    {
      label: 'Erros',
      value: totalWrong,
      color: '#ef4444', // red-500
      count: totalWrong
    }
  ];

  const completionRate = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;

  if (isLoading) {
    return (
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-500" />
            Performance por Matéria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Progresso</h3>
              <div className="animate-pulse h-40 w-40 rounded-full bg-gray-200"></div>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Desempenho</h3>
              <div className="animate-pulse h-40 w-40 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (exerciseSubjects.length === 0) {
    return (
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-500" />
            Performance por Matéria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum dado de desempenho disponível</p>
            <p className="text-sm text-gray-400">Complete alguns exercícios para ver seu desempenho</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-500" />
          Performance por Matéria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Progress Chart */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Progresso de Atividades</h3>
              <DonutChart 
                data={completionChartData}
                size={180}
                strokeWidth={16}
                centerContent={
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{completionRate}%</div>
                    <div className="text-xs text-gray-500">concluído</div>
                  </div>
                }
              />
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  {totalCompleted} de {totalPlanned} atividades
                </p>
              </div>
            </div>

            {/* Performance Chart */}
            {totalAnswers > 0 ? (
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Desempenho nas Respostas</h3>
                <DonutChart 
                  data={performanceChartData}
                  size={180}
                  strokeWidth={16}
                  centerContent={
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {Math.round((totalCorrect / totalAnswers) * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">de acerto</div>
                    </div>
                  }
                />
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-sm">{totalCorrect} acertos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">{totalWrong} erros</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Nenhuma resposta registrada</p>
                <p className="text-sm text-gray-400">Complete alguns exercícios para ver seu desempenho</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
