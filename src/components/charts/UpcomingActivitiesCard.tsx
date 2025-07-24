import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Calendar, BookOpen, PenTool, FileText, Clock, AlertCircle, CheckCircle, Timer } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  subject: string;
  time: string;
  duration: number;
  priority: 'high' | 'medium' | 'low';
  type: 'study' | 'exercise' | 'exam' | 'review';
}

interface UpcomingActivitiesCardProps {
  activities?: Activity[];
}

const UpcomingActivitiesCard: React.FC<UpcomingActivitiesCardProps> = ({
  activities = []
}) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'study':
        return <BookOpen className="h-3 w-3" />;
      case 'exercise':
        return <PenTool className="h-3 w-3" />;
      case 'exam':
        return <FileText className="h-3 w-3" />;
      case 'review':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Calendar className="h-3 w-3" />;
    }
  };

  const getPriorityColor = (priority: Activity['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: Activity['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      case 'medium':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-500" />;
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h${mins}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const sortedActivities = activities
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, 4);

  const totalDuration = sortedActivities.reduce((sum, activity) => sum + activity.duration, 0);
  const highPriorityCount = sortedActivities.filter(a => a.priority === 'high').length;

  const getMotivationMessage = () => {
    if (sortedActivities.length === 0) {
      return "🎯 Nenhuma atividade agendada para hoje!";
    } else if (highPriorityCount >= 2) {
      return "🔥 Dia intenso! Foque nas prioridades!";
    } else if (totalDuration >= 300) {
      return "⚡ Dia produtivo pela frente!";
    } else {
      return "📚 Bom ritmo de estudos hoje!";
    }
  };

  return (
    <Card className="border-0 bg-white/50 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-500" />
          Próximas Atividades
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-3">
          {/* Resumo rápido */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-blue-50 rounded-lg p-2">
              <Calendar className="h-4 w-4 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-medium">{sortedActivities.length}</p>
              <p className="text-xs text-muted-foreground">atividades</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-2">
              <Timer className="h-4 w-4 text-purple-600 mx-auto mb-1" />
              <p className="text-xs font-medium">{formatDuration(totalDuration)}</p>
              <p className="text-xs text-muted-foreground">total</p>
            </div>
          </div>

          {/* Lista de atividades */}
          <div className="space-y-2">
            {sortedActivities.length > 0 ? (
              sortedActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    {getActivityIcon(activity.type)}
                    {getPriorityIcon(activity.priority)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{activity.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activity.time}</span>
                      <span>•</span>
                      <span>{formatDuration(activity.duration)}</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                    {activity.priority === 'high' ? 'Alta' : 
                     activity.priority === 'medium' ? 'Média' : 'Baixa'}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-4">
                <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Nenhuma atividade agendada</p>
              </div>
            )}
          </div>

          {/* Estatísticas por prioridade */}
          {sortedActivities.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Por prioridade</span>
              </div>
              <div className="flex gap-1">
                <div className="flex-1 bg-red-200 rounded-full h-1.5">
                  <motion.div
                    className="bg-red-500 h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(sortedActivities.filter(a => a.priority === 'high').length / sortedActivities.length) * 100}%` 
                    }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                </div>
                <div className="flex-1 bg-yellow-200 rounded-full h-1.5">
                  <motion.div
                    className="bg-yellow-500 h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(sortedActivities.filter(a => a.priority === 'medium').length / sortedActivities.length) * 100}%` 
                    }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  />
                </div>
                <div className="flex-1 bg-green-200 rounded-full h-1.5">
                  <motion.div
                    className="bg-green-500 h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(sortedActivities.filter(a => a.priority === 'low').length / sortedActivities.length) * 100}%` 
                    }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mensagem motivacional */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 text-center"
          >
            <p className="text-xs font-medium text-blue-700">
              {getMotivationMessage()}
            </p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingActivitiesCard;
export { UpcomingActivitiesCard };
