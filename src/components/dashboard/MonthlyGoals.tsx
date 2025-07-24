import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Clock, CheckCircle, Flame, TrendingUp, Award } from 'lucide-react';

interface MonthlyGoalsProps {
  monthlyGoals: {
    studyHours: { current: number; target: number };
    eventsCompleted: { current: number; target: number };
    streakDays: { current: number; target: number };
    reasoning?: string;
    intensity?: 'low' | 'medium' | 'high' | 'intensive';
  };
  isLoading?: boolean;
}

export const MonthlyGoals: React.FC<MonthlyGoalsProps> = ({ 
  monthlyGoals, 
  isLoading 
}) => {
  const goals = [
    {
      title: 'Horas de Estudo',
      icon: Clock,
      current: monthlyGoals.studyHours.current,
      target: monthlyGoals.studyHours.target,
      unit: 'h',
      color: {
        bg: 'from-blue-50 to-blue-100',
        bar: 'from-blue-400 to-blue-600',
        text: 'text-blue-700',
        icon: 'text-blue-600'
      }
    },
    {
      title: 'Atividades Concluídas',
      icon: CheckCircle,
      current: monthlyGoals.eventsCompleted.current,
      target: monthlyGoals.eventsCompleted.target,
      unit: '',
      color: {
        bg: 'from-emerald-50 to-emerald-100',
        bar: 'from-emerald-400 to-emerald-600',
        text: 'text-emerald-700',
        icon: 'text-emerald-600'
      }
    },
    {
      title: 'Sequência de Dias',
      icon: Flame,
      current: monthlyGoals.streakDays.current,
      target: monthlyGoals.streakDays.target,
      unit: 'dias',
      color: {
        bg: 'from-orange-50 to-orange-100',
        bar: 'from-orange-400 to-orange-600',
        text: 'text-orange-700',
        icon: 'text-orange-600'
      }
    }
  ];

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getMotivationMessage = () => {
    const totalProgress = goals.reduce((sum, goal) => 
      sum + getProgressPercentage(goal.current, goal.target), 0
    ) / goals.length;

    if (totalProgress >= 90) {
      return { message: '🏆 Incrível! Você está quase batendo todas as metas!', color: 'text-yellow-600' };
    } else if (totalProgress >= 70) {
      return { message: '🔥 Excelente progresso! Continue assim!', color: 'text-green-600' };
    } else if (totalProgress >= 50) {
      return { message: '💪 Bom ritmo! Acelere um pouco mais!', color: 'text-blue-600' };
    } else if (totalProgress >= 30) {
      return { message: '📈 Você está no caminho certo!', color: 'text-purple-600' };
    } else {
      return { message: '🚀 Vamos acelerar! Suas metas te esperam!', color: 'text-orange-600' };
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 bg-white/50 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Metas do Mês
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const motivation = getMotivationMessage();

  return (
    <Card className="border-0 bg-white/50 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          Metas do Mês
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.map((goal, index) => {
          const percentage = getProgressPercentage(goal.current, goal.target);
          const isCompleted = percentage >= 100;
          
          return (
            <motion.div
              key={goal.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-3"
            >
              {/* Header da meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${goal.color.bg}`}>
                    <goal.icon className={`h-4 w-4 ${goal.color.icon}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">
                      {goal.title}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {goal.current}{goal.unit} de {goal.target}{goal.unit}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${goal.color.text} flex items-center space-x-1`}>
                    <span>{Math.round(percentage)}%</span>
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                      >
                        <Award className="h-4 w-4 text-yellow-500" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className={`bg-gradient-to-r ${goal.color.bar} h-3 rounded-full relative overflow-hidden`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.2, delay: index * 0.1 + 0.3 }}
                  >
                    {/* Efeito de brilho animado */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ 
                        duration: 2, 
                        delay: index * 0.1 + 1,
                        repeat: Infinity,
                        repeatDelay: 4
                      }}
                    />
                  </motion.div>
                </div>
                
                {/* Marcadores de progresso */}
                <div className="absolute top-0 left-0 w-full h-3 flex items-center">
                  {[25, 50, 75].map((mark) => (
                    <div
                      key={mark}
                      className="absolute w-px h-3 bg-white/60"
                      style={{ left: `${mark}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Status da meta */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  Faltam {Math.max(0, goal.target - goal.current)}{goal.unit}
                </span>
                <span className={`font-medium ${goal.color.text}`}>
                  {isCompleted ? '✅ Concluída!' : 
                   percentage >= 75 ? '🔥 Quase lá!' :
                   percentage >= 50 ? '💪 No caminho!' :
                   percentage >= 25 ? '📈 Progredindo' : '🚀 Vamos começar!'}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Resumo geral e motivação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200"
        >
          <div className="flex items-start space-x-3">
            <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-purple-900 text-sm mb-2">
                Progresso Geral do Mês
              </h4>
              
              {/* Barra de progresso geral */}
              <div className="w-full bg-purple-200 rounded-full h-2 mb-3">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${goals.reduce((sum, goal) => 
                      sum + getProgressPercentage(goal.current, goal.target), 0
                    ) / goals.length}%` 
                  }}
                  transition={{ duration: 1.5, delay: 1 }}
                />
              </div>
              
              <p className={`text-sm font-medium ${motivation.color}`}>
                {motivation.message}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Raciocínio das metas personalizadas */}
        {monthlyGoals.reasoning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {(() => {
                  const intensityConfig = {
                    low: { icon: '🌱', color: 'text-emerald-600', bg: 'bg-emerald-100' },
                    medium: { icon: '📈', color: 'text-blue-600', bg: 'bg-blue-100' },
                    high: { icon: '🚀', color: 'text-orange-600', bg: 'bg-orange-100' },
                    intensive: { icon: '⚡', color: 'text-red-600', bg: 'bg-red-100' }
                  };
                  const config = intensityConfig[monthlyGoals.intensity || 'medium'];
                  return (
                    <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center`}>
                      <span className="text-lg">{config.icon}</span>
                    </div>
                  );
                })()}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    Metas Personalizadas pelo APRU
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    monthlyGoals.intensity === 'intensive' ? 'bg-red-100 text-red-700' :
                    monthlyGoals.intensity === 'high' ? 'bg-orange-100 text-orange-700' :
                    monthlyGoals.intensity === 'medium' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {monthlyGoals.intensity === 'intensive' ? 'Intensivo' :
                     monthlyGoals.intensity === 'high' ? 'Alto' :
                     monthlyGoals.intensity === 'medium' ? 'Equilibrado' : 'Inicial'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {monthlyGoals.reasoning}
                </p>
                <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Target className="h-3 w-3" />
                    <span>Baseado no seu plano de estudos</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Ajustado pela sua performance</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dicas para melhorar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="text-center"
        >
          <p className="text-xs text-gray-500 mb-2">
            💡 Dica: {monthlyGoals.intensity === 'intensive' ? 'Mantenha o foco total - você está na reta final!' :
                     monthlyGoals.intensity === 'high' ? 'Consistência é a chave para o sucesso!' :
                     monthlyGoals.intensity === 'medium' ? 'Construa hábitos sólidos de estudo!' :
                     'Comece devagar e vá aumentando gradualmente!'}
          </p>
          <button className="text-xs text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors">
            Ver estratégias para acelerar
          </button>
        </motion.div>
      </CardContent>
    </Card>
  );
};
