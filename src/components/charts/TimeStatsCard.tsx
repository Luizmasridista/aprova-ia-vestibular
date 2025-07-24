import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Clock, Sun, Sunset, Moon, BarChart3, Timer } from 'lucide-react';

interface TimeStatsCardProps {
  hoursToday?: number;
  preferredTime?: 'morning' | 'afternoon' | 'evening';
  weeklyHours?: number[];
  averageSession?: number;
  dailyAverage?: number;
}

const TimeStatsCard: React.FC<TimeStatsCardProps> = ({
  hoursToday = 2.5,
  preferredTime = 'afternoon',
  weeklyHours = [1.5, 2.0, 1.0, 3.5, 2.5, 2.0, 1.5],
  averageSession = 45,
  dailyAverage = 2.1
}) => {
  const maxWeeklyHours = Math.max(...weeklyHours);
  const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

  const getTimeIcon = () => {
    switch (preferredTime) {
      case 'morning':
        return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'afternoon':
        return <Sun className="h-4 w-4 text-orange-500" />;
      case 'evening':
        return <Moon className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTimeLabel = () => {
    switch (preferredTime) {
      case 'morning':
        return 'Manhã';
      case 'afternoon':
        return 'Tarde';
      case 'evening':
        return 'Noite';
      default:
        return 'Variado';
    }
  };

  const getTimeColor = () => {
    switch (preferredTime) {
      case 'morning':
        return 'from-yellow-400 to-orange-400';
      case 'afternoon':
        return 'from-orange-400 to-red-400';
      case 'evening':
        return 'from-purple-400 to-indigo-400';
      default:
        return 'from-blue-400 to-cyan-400';
    }
  };

  return (
    <Card className="border-0 bg-white/50 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-500" />
          Tempo de Estudo
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-3">
          {/* Horas hoje */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-xl font-bold text-blue-600">{hoursToday}h</span>
            </div>
            <p className="text-xs text-muted-foreground">estudadas hoje</p>
          </motion.div>

          {/* Período preferido */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
            <div className="flex items-center gap-2">
              {getTimeIcon()}
              <span className="text-xs font-medium">Período preferido</span>
            </div>
            <span className="text-xs font-semibold">{getTimeLabel()}</span>
          </div>

          {/* Mini gráfico semanal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Esta semana</span>
              <BarChart3 className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="flex items-end justify-between gap-1 h-12">
              {weeklyHours.map((hours, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center gap-1 flex-1"
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div
                    className={`w-full bg-gradient-to-t ${getTimeColor()} rounded-sm`}
                    style={{ 
                      height: `${(hours / maxWeeklyHours) * 32}px`,
                      minHeight: '4px'
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(hours / maxWeeklyHours) * 32}px` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                  <span className="text-xs text-muted-foreground">{days[index]}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-2">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-blue-50 rounded-lg p-2 text-center"
            >
              <Timer className="h-4 w-4 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-medium">{averageSession}min</p>
              <p className="text-xs text-muted-foreground">por sessão</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-green-50 rounded-lg p-2 text-center"
            >
              <BarChart3 className="h-4 w-4 text-green-600 mx-auto mb-1" />
              <p className="text-xs font-medium">{dailyAverage}h</p>
              <p className="text-xs text-muted-foreground">média diária</p>
            </motion.div>
          </div>

          {/* Progresso do dia */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="space-y-1"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Meta diária (3h)</span>
              <span className="text-xs font-medium">{Math.round((hoursToday / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <motion.div
                className={`bg-gradient-to-r ${getTimeColor()} h-1.5 rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((hoursToday / 3) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeStatsCard;
export { TimeStatsCard };
