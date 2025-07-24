import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles, Zap, Brain } from 'lucide-react';

interface SimpleCelebrationProps {
  isVisible: boolean;
  message: string;
  type?: 'success' | 'achievement' | 'milestone';
  onComplete?: () => void;
  duration?: number;
}

export const SimpleCelebration: React.FC<SimpleCelebrationProps> = ({
  isVisible,
  message,
  type = 'success',
  onComplete,
  duration = 2000 // Reduzido para ser mais rápido
}) => {
  useEffect(() => {
    if (isVisible && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onComplete]);

  const config = {
    success: {
      gradient: 'from-green-400 to-emerald-500',
      bgGradient: 'bg-green-50',
      icon: <CheckCircle className="w-12 h-12" strokeWidth={2} />,
      color: 'text-green-600'
    },
    achievement: {
      gradient: 'from-blue-400 to-blue-500',
      bgGradient: 'bg-blue-50',
      icon: <Zap className="w-12 h-12" strokeWidth={2} />,
      color: 'text-blue-600'
    },
    milestone: {
      gradient: 'from-purple-400 to-purple-500',
      bgGradient: 'bg-purple-50',
      icon: <Brain className="w-12 h-12" strokeWidth={2} />,
      color: 'text-purple-600'
    }
  };

  const currentConfig = config[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm"
        >
          {/* Partículas flutuantes minimalistas */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 bg-gradient-to-r ${currentConfig.gradient} rounded-full`}
                initial={{ 
                  opacity: 0,
                  scale: 0,
                  x: '50vw',
                  y: '50vh'
                }}
                animate={{ 
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0],
                  x: `${50 + (Math.random() - 0.5) * 60}vw`,
                  y: `${50 + (Math.random() - 0.5) * 60}vh`
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Card principal minimalista */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 25,
              duration: 0.4
            }}
            className={`${currentConfig.bgGradient} rounded-2xl p-6 shadow-lg border border-gray-100 max-w-sm mx-4 text-center relative overflow-hidden`}
          >
            {/* Brilho sutil de fundo */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${currentConfig.gradient} opacity-5`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ delay: 0.1, duration: 0.8 }}
            />

            {/* Ícone principal */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 200,
                damping: 20,
                delay: 0.1
              }}
              className={`flex justify-center mb-4 ${currentConfig.color}`}
            >
              {currentConfig.icon}
            </motion.div>

            {/* Texto */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Ação realizada!
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {message}
              </p>
            </motion.div>

            {/* Sparkles decorativos */}
            <motion.div
              className="absolute top-2 right-2"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 180 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>
            
            <motion.div
              className="absolute bottom-2 left-2"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: -90 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
