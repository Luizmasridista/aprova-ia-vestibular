import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Flame, Trophy, Target, TrendingUp } from 'lucide-react';

interface StudyStreakCardProps {
  currentStreak?: number;
  longestStreak?: number;
  weeklyGoal?: number;
  weeklyProgress?: number;
}

const StudyStreakCard: React.FC<StudyStreakCardProps> = ({
  currentStreak = 5,
  longestStreak = 12,
  weeklyGoal = 7,
  weeklyProgress = 5
}) => {
  const streakPercentage = Math.min((currentStreak / longestStreak) * 100, 100);
  const weeklyPercentage = (weeklyProgress / weeklyGoal) * 100;

  const getMotivationMessage = () => {
    if (currentStreak >= longestStreak) {
      return "🔥 Novo recorde! Continue assim!";
    } else if (currentStreak >= 7) {
      return "⚡ Sequência incrível! Você está no fogo!";
    } else if (currentStreak >= 3) {
      return "💪 Boa sequência! Continue firme!";
    } else {
      return "🚀 Vamos começar uma nova sequência!";
    }
  };

  return (
    <Card className="border-0 bg-white/50 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500" />
          Sequência de Estudos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-3">
          {/* Sequência atual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <motion.div
                animate={{ 
                  scale: currentStreak > 0 ? [1, 1.1, 1] : 1,
                  rotate: currentStreak > 0 ? [0, 5, -5, 0] : 0
                }}
                transition={{ 
                  duration: 2,
                  repeat: currentStreak > 0 ? Infinity : 0,
                  repeatDelay: 3
                }}
              >
                <Flame className="h-6 w-6 text-orange-500" />
              </motion.div>
              <span className="text-2xl font-bold text-orange-600">{currentStreak}</span>
            </div>
            <p className="text-xs text-muted-foreground">dias consecutivos</p>
          </motion.div>

          {/* Barra de progresso da sequência */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Progresso</span>
              <span className="text-xs font-medium">{currentStreak}/{longestStreak}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${streakPercentage}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-orange-50 rounded-lg p-2">
              <Trophy className="h-4 w-4 text-orange-600 mx-auto mb-1" />
              <p className="text-xs font-medium">{longestStreak}</p>
              <p className="text-xs text-muted-foreground">recorde</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-2">
              <Target className="h-4 w-4 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-medium">{weeklyProgress}/{weeklyGoal}</p>
              <p className="text-xs text-muted-foreground">esta semana</p>
            </div>
          </div>

          {/* Meta semanal */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Meta Semanal</span>
              <span className="text-xs font-medium">{Math.round(weeklyPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <motion.div
                className="bg-blue-500 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${weeklyPercentage}%` }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </div>
          </div>

          {/* Mensagem motivacional */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-2 text-center"
          >
            <p className="text-xs font-medium text-orange-700">
              {getMotivationMessage()}
            </p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyStreakCard;
export { StudyStreakCard };
