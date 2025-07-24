import React from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, Clock, Target, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StudyPlansOverviewProps {
  studyPlans: {
    total: number;
    active: number;
    completed: number;
  };
}

export const StudyPlansOverview: React.FC<StudyPlansOverviewProps> = ({
  studyPlans
}) => {
  const navigate = useNavigate();

  const getCompletionRate = () => {
    if (studyPlans.total === 0) return 0;
    return (studyPlans.completed / studyPlans.total) * 100;
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Planos de Estudo</h3>
        <div className="flex items-center space-x-2 text-purple-600">
          <Brain className="h-5 w-5" />
          <span className="text-sm font-medium">IA Personalizada</span>
        </div>
      </div>

      {studyPlans.total === 0 ? (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium mb-2">Nenhum plano criado ainda</p>
          <p className="text-sm text-gray-400 mb-6">
            Crie seu primeiro plano de estudos personalizado com IA
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/study-plan')}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            <span>Criar Plano com IA</span>
          </motion.button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl"
            >
              <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{studyPlans.total}</div>
              <div className="text-xs text-blue-600">Total de Planos</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl"
            >
              <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-700">{studyPlans.active}</div>
              <div className="text-xs text-orange-600">Ativos</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl"
            >
              <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-700">{studyPlans.completed}</div>
              <div className="text-xs text-emerald-600">Concluídos</div>
            </motion.div>
          </div>

          {/* Barra de Progresso */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Taxa de Conclusão</span>
              <span className="text-sm font-bold text-gray-900">
                {Math.round(getCompletionRate())}%
              </span>
            </div>
            
            <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getCompletionRate()}%` }}
                transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
              />
            </div>
          </motion.div>

          {/* Insights e Recomendações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200"
          >
            <div className="flex items-start space-x-3">
              <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-purple-900 mb-1">Insights da IA</h4>
                <p className="text-sm text-purple-700">
                  {studyPlans.active === 0 && studyPlans.completed > 0
                    ? '🎯 Parabéns! Você concluiu todos os seus planos. Que tal criar um novo desafio?'
                    : studyPlans.active > 0 && studyPlans.completed === 0
                    ? '💪 Você tem planos ativos! Mantenha o foco e a consistência nos estudos.'
                    : studyPlans.active > 0 && studyPlans.completed > 0
                    ? '🚀 Excelente progresso! Continue seguindo seus planos ativos.'
                    : '✨ Crie seu primeiro plano personalizado e comece sua jornada de sucesso!'
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Ações Rápidas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex space-x-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/study-plan')}
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-indigo-700 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Plano</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/profile')}
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              <Target className="h-4 w-4" />
              <span>Ver Planos</span>
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
