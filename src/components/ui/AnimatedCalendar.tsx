import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedCalendarProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showEvents?: boolean;
}

const AnimatedCalendar: React.FC<AnimatedCalendarProps> = ({ 
  className = '', 
  size = 'medium',
  showEvents = true 
}) => {
  const [currentDay, setCurrentDay] = useState(15);
  const [showEvent, setShowEvent] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animação cíclica melhorada
  useEffect(() => {
    if (!showEvents) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setShowEvent(true);
      
      setTimeout(() => {
        setCurrentDay(prev => prev === 15 ? 22 : 15);
      }, 800);
      
      setTimeout(() => {
        setShowEvent(false);
        setIsAnimating(false);
      }, 2000);
    }, 4000);

    return () => clearInterval(interval);
  }, [showEvents]);

  const generateCalendarDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push({
        day: i,
        hasEvent: i === currentDay,
        isToday: i === 15 || i === 22,
        isPast: i < 15
      });
    }
    return days.slice(0, 21); // Mostrar 3 semanas
  };

  const days = generateCalendarDays();
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  // Configurações responsivas baseadas no tamanho
  const sizeConfig = {
    small: {
      container: 'min-w-[200px] max-w-[280px]',
      header: 'px-2 py-2',
      title: 'text-xs',
      subtitle: 'text-[10px]',
      icon: 'w-4 h-4',
      iconContainer: 'w-5 h-5',
      padding: 'p-2',
      dayHeader: 'text-[10px] py-0.5',
      dayCell: 'h-5 text-[10px]',
      eventCard: 'mt-2 p-2',
      eventTitle: 'text-[10px]',
      eventTime: 'text-[8px]',
      indicator: 'w-4 h-4 -top-1 -right-1',
      indicatorDot: 'w-1.5 h-1.5'
    },
    medium: {
      container: 'min-w-[280px] max-w-[360px]',
      header: 'px-3 py-2.5',
      title: 'text-sm',
      subtitle: 'text-xs',
      icon: 'w-4 h-4',
      iconContainer: 'w-6 h-6',
      padding: 'p-3',
      dayHeader: 'text-xs py-1',
      dayCell: 'h-6 text-xs',
      eventCard: 'mt-3 p-2.5',
      eventTitle: 'text-xs',
      eventTime: 'text-[10px]',
      indicator: 'w-5 h-5 -top-1.5 -right-1.5',
      indicatorDot: 'w-2 h-2'
    },
    large: {
      container: 'min-w-[360px] max-w-[480px]',
      header: 'px-4 py-3',
      title: 'text-base',
      subtitle: 'text-sm',
      icon: 'w-5 h-5',
      iconContainer: 'w-8 h-8',
      padding: 'p-4',
      dayHeader: 'text-sm py-1',
      dayCell: 'h-8 text-sm',
      eventCard: 'mt-4 p-3',
      eventTitle: 'text-sm',
      eventTime: 'text-xs',
      indicator: 'w-6 h-6 -top-2 -right-2',
      indicatorDot: 'w-2 h-2'
    }
  };
  
  const config = sizeConfig[size];

  return (
    <motion.div 
      className={`relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 w-full h-full ${config.container} ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header moderno do calendário */}
      <div className={`bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white ${config.header}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className={`${config.title} font-bold truncate`}>Janeiro 2025</h3>
            <p className={`${config.subtitle} opacity-90 truncate`}>Planejamento Inteligente</p>
          </div>
          <motion.div
            animate={{ rotate: isAnimating ? 360 : 0 }}
            transition={{ duration: 1 }}
            className={`${config.iconContainer} bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0 ml-2`}
          >
            <svg className={config.icon} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </motion.div>
        </div>
      </div>
      
      {/* Grid do calendário responsivo */}
      <div className={config.padding}>
        {/* Cabeçalho dos dias da semana */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
          {weekDays.map((dayName, index) => (
            <div key={index} className={`text-center ${config.dayHeader} font-medium text-gray-500`}>
              {size === 'small' ? dayName.slice(0, 1) : dayName.slice(0, 3)}
            </div>
          ))}
        </div>
        
        {/* Dias do calendário */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {days.map((dayInfo, index) => (
            <motion.div
              key={`${dayInfo.day}-${index}`}
              className={`
                relative text-center ${config.dayCell} w-full flex items-center justify-center rounded-md sm:rounded-lg transition-all duration-300
                ${
                  dayInfo.hasEvent 
                    ? 'bg-gradient-to-br from-emerald-400 to-cyan-500 text-white font-bold shadow-lg' 
                    : dayInfo.isToday
                    ? 'bg-gray-100 text-gray-800 font-medium hover:bg-gray-200'
                    : dayInfo.isPast
                    ? 'text-gray-400'
                    : 'text-gray-700 hover:bg-gray-50'
                }
              `}
              animate={{
                scale: dayInfo.hasEvent ? [1, 1.1, 1] : 1,
                rotateY: dayInfo.hasEvent ? [0, 10, 0] : 0
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              whileHover={{ scale: 1.05 }}
            >
              {dayInfo.day}
              
              {/* Indicador de evento melhorado */}
              <AnimatePresence>
                {dayInfo.hasEvent && showEvents && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0, rotate: 180 }}
                    className={`absolute ${config.indicator} bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white shadow-md`}
                  >
                    <div className={`${config.indicatorDot} bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        {/* Evento sendo criado - Design melhorado */}
        <AnimatePresence>
          {showEvent && showEvents && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`${config.eventCard} bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-lg shadow-sm`}
            >
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className={`${config.indicatorDot} bg-emerald-500 rounded-full animate-pulse flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className={`${config.eventTitle} font-medium text-emerald-800 truncate`}>📚 Estudo de Matemática</div>
                  <div className={`${config.eventTime} text-emerald-600 mt-0.5 truncate`}>14:00 - 16:00 • Álgebra Linear</div>
                </div>
                {size !== 'small' && (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-emerald-500 flex-shrink-0"
                  >
                    ✨
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Indicador de IA ativa - Design melhorado */}
      <motion.div
        animate={{ 
          opacity: [0.7, 1, 0.7],
          scale: [0.9, 1.1, 0.9],
          boxShadow: [
            '0 0 0 0 rgba(16, 185, 129, 0.4)',
            '0 0 0 8px rgba(16, 185, 129, 0)',
            '0 0 0 0 rgba(16, 185, 129, 0.4)'
          ]
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`absolute ${config.indicator} bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-full border-2 sm:border-3 border-white shadow-lg flex items-center justify-center`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className={`${config.indicatorDot} bg-white rounded-full`}
        />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedCalendar;