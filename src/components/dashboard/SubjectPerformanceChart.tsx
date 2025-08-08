import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Target, TrendingUp, ChevronDown, ChevronUp, CheckCircle2, XCircle, Clock, Award } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { DashboardStats } from '@/hooks/useDashboardData';

// Estilos globais para a barra de rolagem personalizada
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  
  /* Melhorias de responsividade */
  @media (max-width: 640px) {
    .subject-card {
      padding: 0.75rem !important;
    }
    
    .subject-title {
      font-size: 0.875rem !important;
    }
    
    .exercise-card {
      padding: 0.5rem !important;
    }
  }
`;

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const getDifficultyColor = () => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor()}`}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

interface SubjectPerformanceChartProps {
  stats: DashboardStats;
  isLoading: boolean;
}

interface Exercise {
  id: string;
  question: string;
  isCorrect: boolean;
  createdAt: string;
  timeSpent: number;
  difficulty: string;
}

interface SubjectProgress {
  subject: string;
  completed: number;
  total: number;
  percentage: number;
  correct?: number;
  wrong?: number;
  notAttempted?: number;
  exercises?: Exercise[];
}

interface ChartDataItem {
  name: string;
  value: number;
  percentage: number;
  completed: number;
  correct: number;
  wrong: number;
  accuracy: number;
  color: string;
  subject: string;
  exercises: Exercise[];
}

export const SubjectPerformanceChart: React.FC<SubjectPerformanceChartProps> = ({ 
  stats, 
  isLoading 
}) => {
  const [expandedSubjects, setExpandedSubjects] = useState<{[key: string]: boolean}>({});

  const toggleSubject = (subjectName: string) => {
    setExpandedSubjects(prev => {
      const newState = {
        ...prev,
        [subjectName]: !prev[subjectName]
      };
      
      // Rolar suavemente para o item expandido após a atualização do estado
      if (newState[subjectName]) {
        setTimeout(() => {
          const element = document.getElementById(`subject-${subjectName}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
      }
      
      return newState;
    });
  };

  // Preparar dados para o gráfico
  const COLORS = [
    'hsl(220, 100%, 60%)', // Blue
    'hsl(160, 100%, 45%)', // Emerald  
    'hsl(45, 100%, 60%)',  // Amber
    'hsl(280, 100%, 60%)', // Purple
    'hsl(10, 100%, 60%)',  // Red
    'hsl(200, 100%, 60%)', // Sky
  ];

  // Mapear os dados para o formato esperado pelo gráfico
  const chartData: ChartDataItem[] = stats.subjectProgress
    .map((subject, index) => ({
      name: subject.subject,
      value: subject.total,
      percentage: subject.percentage,
      completed: subject.completed,
      correct: subject.correct || 0,
      wrong: subject.wrong || 0,
      accuracy: subject.correct && subject.wrong ? 
        Math.round((subject.correct / (subject.correct + subject.wrong)) * 100) : 0,
      color: COLORS[index % COLORS.length],
      subject: subject.subject,
      exercises: subject.exercises || []
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6); // Top 6 matérias

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

  // Encontrar a matéria com melhor desempenho (apenas entre as que têm exercícios)
  const subjectsWithExercises = chartData.filter(subject => subject.correct + subject.wrong > 0);
  
  const bestSubject = subjectsWithExercises.length > 0 
    ? subjectsWithExercises.reduce((best, current) => 
        (current.accuracy > (best?.accuracy || 0) ? current : best), 
        subjectsWithExercises[0]
      )
    : null;

  // Encontrar a matéria com pior desempenho (apenas entre as que têm exercícios)
  const worstSubject = subjectsWithExercises.length > 0
    ? subjectsWithExercises.reduce((worst, current) => 
        (current.accuracy < (worst?.accuracy || 100) ? current : worst), 
        subjectsWithExercises[0]
      )
    : null;

  return (
    <>
      <Helmet>
        <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      </Helmet>
      
      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
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
          className="space-y-4"
        >
          {chartData.map((subject) => (
            <div id={`subject-${subject.name}`} key={subject.name} className="subject-card mb-4 last:mb-0 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="subject-title text-sm font-semibold text-gray-800">{subject.name}</h3>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">
                    {subject.completed}<span className="text-gray-400">/{subject.value}</span>
                  </span>
                  <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                    {subject.percentage}%
                  </span>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${subject.percentage}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className={`h-full ${subject.percentage >= 70 ? 'bg-green-500' : subject.percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ backgroundColor: subject.color }}
                />
              </div>
              <div className="space-y-2 mt-3 pl-3 border-l-2 border-gray-200">
                {/* Barra de progresso para exercícios corretos */}
                <div className="flex items-center text-xs">
                  <span className="w-16 text-gray-600 font-medium">Acertos</span>
                  <div className="flex-1 mx-2">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.accuracy}%` }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="h-full bg-green-500"
                      />
                    </div>
                  </div>
                  <span className="w-8 text-right font-semibold text-green-700">{subject.correct}</span>
                </div>

                {/* Barra de progresso para exercícios errados */}
                {subject.wrong > 0 && (
                  <div className="flex items-center text-xs">
                    <span className="w-16 text-gray-600 font-medium">Erros</span>
                    <div className="flex-1 mx-2">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${(subject.wrong / (subject.correct + subject.wrong)) * 100}%` 
                          }}
                          transition={{ duration: 0.8, delay: 0.6 }}
                          className="h-full bg-red-500"
                        />
                      </div>
                    </div>
                    <span className="w-8 text-right font-semibold text-red-700">{subject.wrong}</span>
                  </div>
                )}

                {/* Estatísticas resumidas */}
                <div className="flex justify-between items-center text-xs pt-2 mt-2 border-t border-gray-100">
                  <div className="flex items-center">
                    <span className="text-gray-500">Taxa de acerto: </span>
                    <span className={`ml-1 font-semibold ${
                      subject.accuracy >= 70 ? 'text-green-600' : 
                      subject.accuracy >= 40 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {Math.round(subject.accuracy)}%
                    </span>
                  </div>
                  <span className="text-gray-500">
                    {subject.value} exercício{subject.value !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Botão para expandir/recolher */}
                <button
                  onClick={() => toggleSubject(subject.name)}
                  className="ml-2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={expandedSubjects[subject.name] ? 'Recolher exercícios' : 'Expandir exercícios'}
                >
                  {expandedSubjects[subject.name] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {/* Lista de exercícios */}
                <AnimatePresence>
                  {expandedSubjects[subject.name] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="space-y-3 border-t border-gray-100 pt-3">
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Exercícios Recentes
                        </h4>
                        
                        {/* Verifica se existem exercícios para exibir */}
                        {subject.exercises && subject.exercises.length > 0 ? (
                          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                            {subject.exercises.map((exercise, idx) => (
                              <motion.div
                                key={`${exercise.id}-${idx}`}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03, duration: 0.2 }}
                                className={`exercise-card p-3 text-xs rounded-lg border ${
                                  exercise.isCorrect 
                                    ? 'border-green-100 bg-green-50 hover:bg-green-100' 
                                    : 'border-red-100 bg-red-50 hover:bg-red-50'
                                } transition-colors duration-200`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start">
                                      <div className={`mt-0.5 mr-2 flex-shrink-0 ${exercise.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                        {exercise.isCorrect ? (
                                          <CheckCircle2 className="h-4 w-4" />
                                        ) : (
                                          <XCircle className="h-4 w-4" />
                                        )}
                                      </div>
                                      <div>
                                        <p className={`text-sm font-medium ${
                                          exercise.isCorrect ? 'text-green-800' : 'text-red-800'
                                        }`}>
                                          {exercise.question}
                                        </p>
                                        <div className="flex flex-wrap items-center mt-1.5 gap-x-3 gap-y-1 text-xs">
                                          <span className="text-gray-500 flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {formatDate(exercise.createdAt)}
                                          </span>
                                          <span className="text-gray-500">
                                            {exercise.timeSpent}s
                                          </span>
                                          <DifficultyBadge difficulty={exercise.difficulty} />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-4 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2">
                              <BookOpen className="h-5 w-5 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500">Nenhum exercício realizado ainda</p>
                            <p className="text-xs text-gray-400 mt-1">Comece a praticar para ver seu progresso</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </motion.div>

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
    </>
  );
};

export default SubjectPerformanceChart;