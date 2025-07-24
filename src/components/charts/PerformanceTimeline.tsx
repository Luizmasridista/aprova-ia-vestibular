import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface PerformanceItem {
  id: string;
  title: string;
  time: string;
  status: 'success' | 'pending' | 'failed';
  score?: number;
  improvement?: number; // positive for improvement, negative for decline
}

interface PerformanceTimelineProps {
  items: PerformanceItem[];
}

export const PerformanceTimeline: React.FC<PerformanceTimelineProps> = ({ items }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return { icon: CheckCircle, color: '#10b981' };
      case 'pending':
        return { icon: Clock, color: '#f59e0b' };
      case 'failed':
        return { icon: XCircle, color: '#ef4444' };
      default:
        return { icon: Clock, color: '#6b7280' };
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const { icon: StatusIcon, color } = getStatusIcon(item.status);
        const isLast = index === items.length - 1;
        
        return (
          <motion.div
            key={item.id}
            className="relative flex items-start gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-4 top-8 w-px h-6 bg-gray-200" />
            )}
            
            {/* Status icon */}
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10"
              style={{ backgroundColor: `${color}20` }}
            >
              <StatusIcon 
                className="h-4 w-4" 
                style={{ color }}
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.time}
                  </p>
                </div>
                
                {/* Score and improvement */}
                <div className="text-right ml-2">
                  {item.score !== undefined && (
                    <div className="text-sm font-semibold text-foreground">
                      {item.score}%
                    </div>
                  )}
                  {item.improvement !== undefined && (
                    <motion.div 
                      className={`flex items-center gap-1 text-xs ${
                        item.improvement > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    >
                      {item.improvement > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>{Math.abs(item.improvement)}%</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
      
      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-8">
          <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Nenhuma atividade recente
          </p>
        </div>
      )}
    </div>
  );
};
