import React from 'react';
import { motion } from 'framer-motion';

interface ProgressChartData {
  label: string;
  value: number;
  maxValue?: number;
  color: string;
}

interface ProgressChartProps {
  data: ProgressChartData[];
  title?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  title,
  orientation = 'horizontal'
}) => {
  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      )}
      
      <div className="space-y-3">
        {data.map((item, index) => {
          const maxValue = item.maxValue || Math.max(...data.map(d => d.value));
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          
          return (
            <motion.div
              key={item.label}
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
                <span className="text-sm text-muted-foreground">
                  {item.value}{item.maxValue ? `/${item.maxValue}` : ''}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.3 + index * 0.1,
                    ease: "easeOut"
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
