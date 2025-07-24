import React from 'react';
import { motion } from 'framer-motion';

interface ActivityChartData {
  day: string;
  value: number;
  label?: string;
}

interface ActivityChartProps {
  data: ActivityChartData[];
  maxHeight?: number;
  color?: string;
  title?: string;
}

export const ActivityChart: React.FC<ActivityChartProps> = ({
  data,
  maxHeight = 100,
  color = '#3b82f6',
  title
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      )}
      
      <div className="flex items-end justify-between gap-2" style={{ height: maxHeight + 40 }}>
        {data.map((item, index) => {
          const height = maxValue > 0 ? (item.value / maxValue) * maxHeight : 0;
          
          return (
            <div key={item.day} className="flex flex-col items-center flex-1">
              {/* Bar */}
              <div 
                className="w-full bg-gray-200 rounded-t-md mb-2 relative overflow-hidden"
                style={{ height: maxHeight }}
              >
                <motion.div
                  className="absolute bottom-0 w-full rounded-t-md"
                  style={{ backgroundColor: color }}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}px` }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                />
                
                {/* Value label */}
                {item.value > 0 && (
                  <motion.div
                    className="absolute top-1 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: 0.8 + index * 0.1 
                    }}
                  >
                    <span className="text-xs font-semibold text-white bg-black/20 px-1 rounded">
                      {item.value}
                    </span>
                  </motion.div>
                )}
              </div>
              
              {/* Day label */}
              <motion.span 
                className="text-xs font-medium text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1 + index * 0.05 }}
              >
                {item.day}
              </motion.span>
              
              {/* Optional label */}
              {item.label && (
                <motion.span 
                  className="text-xs text-muted-foreground mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 1.2 + index * 0.05 }}
                >
                  {item.label}
                </motion.span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
