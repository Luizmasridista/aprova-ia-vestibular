import React from 'react';
import { motion } from 'framer-motion';
import { Target, Calendar, Zap, Trophy } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  icon: React.ElementType;
  color: string;
  unit?: string;
}

interface GoalsCardProps {
  goals: Goal[];
}

export const GoalsCard: React.FC<GoalsCardProps> = ({ goals }) => {
  return (
    <div className="space-y-4">
      {goals.map((goal, index) => {
        const Icon = goal.icon;
        const percentage = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
        const isCompleted = goal.current >= goal.target;
        
        return (
          <motion.div
            key={goal.id}
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            {/* Icon */}
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}
              style={{ backgroundColor: `${goal.color}20` }}
            >
              <Icon 
                className="h-5 w-5" 
                style={{ color: goal.color }}
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {goal.title}
                </h4>
                <span className="text-xs text-muted-foreground">
                  {goal.current}/{goal.target}{goal.unit}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: goal.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ 
                    duration: 1, 
                    delay: 0.3 + index * 0.1,
                    ease: "easeOut"
                  }}
                />
              </div>
              
              {/* Status */}
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {percentage.toFixed(0)}% concluído
                </span>
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  >
                    <Trophy className="h-3 w-3 text-yellow-500" />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
