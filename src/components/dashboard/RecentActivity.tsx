import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecentActivityProps {
  recentActivity: {
    id: string;
    type: 'study_plan' | 'event_completed' | 'streak_milestone';
    title: string;
    description: string;
    timestamp: string;
    icon: string;
  }[];
  isLoading?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ 
  recentActivity, 
  isLoading 
}) => {
  const getActivityColor = (type: string) => {
    const colors = {
      'study_plan': {
        bg: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        text: 'text-purple-700',
        dot: 'bg-purple-500'
      },
      'event_completed': {
        bg: 'from-emerald-50 to-emerald-100',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        dot: 'bg-emerald-500'
      },
      'streak_milestone': {
        bg: 'from-orange-50 to-orange-100',
        border: 'border-orange-200',
        text: 'text-orange-700',
        dot: 'bg-orange-500'
      }
    };
    return colors[type as keyof typeof colors] || colors.event_completed;
  };

  const formatTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: ptBR
      });
    } catch {
      return 'há pouco tempo';
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 bg-white/50 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (recentActivity.length === 0) {
    return (
      <Card className="border-0 bg-white/50 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium mb-2">Nenhuma atividade recente</p>
            <p className="text-sm text-gray-400 mb-4">
              Comece criando um plano de estudos ou completando atividades
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Começar Agora</span>
            </motion.button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/50 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-600" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => {
            const colors = getActivityColor(activity.type);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-start space-x-3">
                  {/* Ícone da atividade */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                    className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${colors.bg} border ${colors.border} flex items-center justify-center`}
                  >
                    <span className="text-sm">{activity.icon}</span>
                  </motion.div>

                  {/* Conteúdo da atividade */}
                  <div className="flex-1 min-w-0">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                    >
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Indicador de status */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.1 + 0.4 }}
                    className={`w-2 h-2 rounded-full ${colors.dot} flex-shrink-0 mt-2`}
                  />
                </div>

                {/* Linha conectora (exceto para o último item) */}
                {index < recentActivity.length - 1 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                    className="absolute left-4 top-8 w-px bg-gray-200 h-4"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Ver mais atividades */}
        {recentActivity.length >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6 text-center"
          >
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
              Ver todas as atividades
            </button>
          </motion.div>
        )}

        {/* Insights de atividade */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-6 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
        >
          <div className="flex items-start space-x-2">
            <Activity className="h-4 w-4 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-green-900 text-sm mb-1">
                Padrão de Atividade
              </h4>
              <p className="text-xs text-green-700">
                {(() => {
                  const completedEvents = recentActivity.filter(a => a.type === 'event_completed').length;
                  const studyPlans = recentActivity.filter(a => a.type === 'study_plan').length;
                  
                  if (completedEvents >= 3) {
                    return '🔥 Você está muito ativo! Continue mantendo essa consistência.';
                  } else if (studyPlans >= 2) {
                    return '📚 Ótimo planejamento! Agora foque em executar as atividades.';
                  } else if (completedEvents >= 1) {
                    return '💪 Bom progresso! Que tal criar mais atividades?';
                  } else {
                    return '🚀 Hora de acelerar! Crie um plano e comece a estudar.';
                  }
                })()}
              </p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};
