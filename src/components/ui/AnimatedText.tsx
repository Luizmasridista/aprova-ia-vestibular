import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import BlurText from './BlurText';

interface AnimatedTextProps {
  words: string[];
  className?: string;
  duration?: number; // duração de cada palavra em ms
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  words,
  className = '',
  duration = 2000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <div className={`inline-block ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
          transition={{
            duration: 0.5,
            ease: "easeInOut"
          }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent"
        >
          {words[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedText;
