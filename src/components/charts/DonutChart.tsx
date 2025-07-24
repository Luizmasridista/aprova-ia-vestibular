import React from 'react';
import { motion } from 'framer-motion';

interface DonutChartData {
  label: string;
  value: number;
  color: string;
  count?: number;
}

interface DonutChartProps {
  data: DonutChartData[];
  size?: number;
  strokeWidth?: number;
  showLabels?: boolean;
  centerContent?: React.ReactNode;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 200,
  strokeWidth = 20,
  showLabels = true,
  centerContent
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calcular total para percentuais
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Preparar dados com percentuais e offsets
  let cumulativePercentage = 0;
  const chartData = data.map((item) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativePercentage * (circumference / 100);
    
    cumulativePercentage += percentage;
    
    return {
      ...item,
      percentage: Math.round(percentage),
      strokeDasharray,
      strokeDashoffset
    };
  });

  return (
    <div className="flex flex-col items-center">
      {/* SVG Chart */}
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          
          {/* Data segments */}
          {chartData.map((item, index) => (
            <motion.circle
              key={item.label}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={item.strokeDasharray}
              strokeDashoffset={item.strokeDashoffset}
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: item.strokeDasharray }}
              transition={{ 
                duration: 1.5, 
                delay: index * 0.2,
                ease: "easeInOut"
              }}
              className="drop-shadow-sm"
            />
          ))}
        </svg>
        
        {/* Center content */}
        {centerContent && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {centerContent}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {showLabels && (
        <motion.div 
          className="mt-6 space-y-2 w-full max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {chartData.map((item, index) => (
            <motion.div
              key={item.label}
              className="flex items-center justify-between text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-foreground truncate">
                  {item.label}
                </span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-foreground">
                  {item.percentage}%
                </span>
                {item.count && (
                  <div className="text-xs text-muted-foreground">
                    {item.count} atividades
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
