import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles, Star, Zap } from 'lucide-react';

interface CelebrationAnimationProps {
  isVisible: boolean;
  message: string;
  onComplete?: () => void;
  duration?: number;
}

const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({
  isVisible,
  message,
  onComplete,
  duration = 3000
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onComplete]);

  // Gerar confetes aleatórios
  const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
    color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)],
    delay: Math.random() * 0.5
  }));

  const sparklePositions = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: 20 + (i % 4) * 20,
    y: 20 + Math.floor(i / 4) * 20,
    delay: i * 0.1
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/20 backdrop-blur-sm"
        >
          {/* Confetes */}
          {showConfetti && confettiPieces.map((confetti) => (
            <motion.div
              key={confetti.id}
              initial={{
                x: '50vw',
                y: '50vh',
                scale: 0,
                rotate: 0,
                opacity: 0
              }}
              animate={{
                x: `${confetti.x}vw`,
                y: `${confetti.y}vh`,
                scale: confetti.scale,
                rotate: confetti.rotation,
                opacity: 1
              }}
              exit={{
                opacity: 0,
                y: '100vh',
                transition: { duration: 0.5 }
              }}
              transition={{
                duration: 0.8,
                delay: confetti.delay,
                ease: "easeOut"
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: confetti.color }}
            />
          ))}

          {/* Sparkles de fundo */}
          {sparklePositions.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1,
                opacity: 1,
                rotate: 360
              }}
              transition={{
                duration: 2,
                delay: sparkle.delay,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="absolute text-yellow-400"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`
              }}
            >
              <Sparkles size={16} />
            </motion.div>
          ))}

          {/* Card principal de celebração */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ 
              scale: 1,
              rotate: 0
            }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              duration: 0.6
            }}
            className="relative bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 
                       border-2 border-green-200 dark:border-green-700 rounded-2xl p-8 shadow-2xl max-w-md mx-4"
          >
            {/* Ícone de sucesso animado */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
              className="flex justify-center mb-4"
            >
              <div className="relative">
                <motion.div
                  animate={{ 
                    scale: 1.1,
                    rotate: 360
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="text-green-500 dark:text-green-400"
                >
                  <CheckCircle size={64} />
                </motion.div>
                
                {/* Estrelas orbitando */}
                {[0, 120, 240].map((angle, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      rotate: [angle, angle + 360]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <motion.div
                      className="text-yellow-400 absolute"
                      style={{
                        transform: `translateY(-40px)`
                      }}
                      animate={{
                        scale: 1.2
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.2
                      }}
                    >
                      <Star size={16} />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Texto de celebração */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <motion.h2
                animate={{ 
                  scale: 1.05
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2"
              >
                🎉 Sucesso!
              </motion.h2>
              
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {message}
              </p>
            </motion.div>

            {/* Efeito de brilho */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 1.5,
                delay: 0.5,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                         transform -skew-x-12 pointer-events-none"
            />

            {/* Ícone do APRU no canto */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-2 shadow-lg"
            >
              <Zap size={20} />
            </motion.div>
          </motion.div>

          {/* Ondas de energia */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ 
                scale: 4,
                opacity: 0
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeOut"
              }}
              className="absolute inset-0 border-2 border-green-400 rounded-full pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationAnimation;
