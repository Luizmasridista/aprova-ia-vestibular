import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CelebrationAnimationProps {
  isVisible: boolean;
  message: string;
  onComplete?: () => void;
  duration?: number;
  type?: 'success' | 'achievement' | 'milestone';
}

const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({
  isVisible,
  message,
  onComplete,
  duration = 3000,
  type = 'success'
}) => {
  // Efeito para fechar a animação após a duração
  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, onComplete]);

  // Cores baseadas no tipo
  const typeStyles = {
    success: {
      bg: 'bg-green-500/90',
      icon: <CheckCircle className="w-8 h-8 text-white" />,
      emoji: '🎉'
    },
    achievement: {
      bg: 'bg-blue-500/90',
      icon: <CheckCircle className="w-8 h-8 text-white" />,
      emoji: '🏆'
    },
    milestone: {
      bg: 'bg-purple-500/90',
      icon: <CheckCircle className="w-8 h-8 text-white" />,
      emoji: '✨'
    }
  };

  const currentStyle = typeStyles[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { duration: 0.3 }
            }}
            exit={{ 
              opacity: 0, 
              y: -20, 
              scale: 0.95,
              transition: { duration: 0.2 }
            }}
            className={cn(
              'rounded-xl shadow-xl p-4 flex items-center gap-3',
              'backdrop-blur-sm',
              currentStyle.bg,
              'pointer-events-auto'
            )}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              {currentStyle.icon}
            </motion.div>
            
            <div className="text-white font-medium">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentStyle.emoji}</span>
                <span>{message}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4 text-white" />
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationAnimation;
