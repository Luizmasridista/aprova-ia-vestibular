import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle, BookOpen, ArrowRight } from 'lucide-react';

interface NextActivitiesCardProps {
  upcomingActivities: {
    id: string;
    title: string;
    subject: string;
    date: string;
    time: string;
    priority: number;
  }[];
}

export const NextActivitiesCard: React.FC<NextActivitiesCardProps> = ({
  upcomingActivities
}) => {
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 3:
        return 'bg-red-100 text-red-700 border-red-200';
      case 2:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 1:
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 3:
        return 'Alta';
      case 2:
        return 'Média';
      case 1:
      default:
        return 'Baixa';
    }
  };

  const getPriorityIcon = (priority: number) => {
    switch (priority) {
      case 3:
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      case 2:
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case 1:
      default:
        return <BookOpen className="h-3 w-3 text-green-500" />;
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Próximas Atividades</h3>
        <div className="flex items-center space-x-2 text-blue-600">
          <Calendar className="h-5 w-5" />
          <span className="text-sm font-medium">{upcomingActivities.length}</span>
        </div>
      </div>

      {upcomingActivities.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Nenhuma atividade agendada</p>
          <p className="text-sm text-gray-400 mt-1">
            Que tal criar um cronograma de estudos?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Criar Cronograma
          </motion.button>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group p-4 bg-white/70 rounded-xl border border-gray-200/50 hover:border-blue-200 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getPriorityIcon(activity.priority)}
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                      {activity.title}
                    </h4>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{activity.subject}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{activity.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(activity.priority)}`}>
                    {getPriorityLabel(activity.priority)}
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Resumo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: upcomingActivities.length * 0.1 + 0.3 }}
            className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-red-600">
                  {upcomingActivities.filter(a => a.priority === 3).length}
                </div>
                <div className="text-xs text-red-700">Alta Prioridade</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-600">
                  {upcomingActivities.filter(a => a.priority === 2).length}
                </div>
                <div className="text-xs text-yellow-700">Média Prioridade</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {upcomingActivities.filter(a => a.priority === 1).length}
                </div>
                <div className="text-xs text-green-700">Baixa Prioridade</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
