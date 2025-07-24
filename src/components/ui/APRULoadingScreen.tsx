import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Brain, Sparkles, Clock, BookOpen, Target, Zap } from 'lucide-react';

interface APRULoadingScreenProps {
  mode: 'APRU_1b' | 'APRU_REASONING';
  isVisible: boolean;
}

const APRULoadingScreen: React.FC<APRULoadingScreenProps> = ({ mode, isVisible }) => {
  const [currentTip, setCurrentTip] = useState(0);
  const [dots, setDots] = useState('');

  // Mensagens motivacionais e dicas
  const tips = [
    {
      icon: <Coffee className="w-5 h-5" />,
      text: "Que tal pegar um café? ☕ Estou analisando suas preferências..."
    },
    {
      icon: <Brain className="w-5 h-5" />,
      text: "Processando suas matérias favoritas com inteligência artificial..."
    },
    {
      icon: <Target className="w-5 h-5" />,
      text: "Criando metas personalizadas para seu sucesso no vestibular..."
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      text: "Organizando um cronograma perfeito para seus estudos..."
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      text: "Quase pronto! Adicionando os toques finais na sua grade..."
    },
    {
      icon: <Clock className="w-5 h-5" />,
      text: "Calculando o tempo ideal para cada matéria... 📚"
    },
    {
      icon: <Target className="w-5 h-5" />,
      text: "Ajustando as metas para seu ritmo de aprendizado... 🎯"
    },
    {
      icon: <Coffee className="w-5 h-5" />,
      text: "Respirar fundo! Estou criando algo especial para você... 🌟"
    }
  ];

  // Animação dos pontos de loading
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Rotação das dicas
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible, tips.length]);

  const modeConfig = {
    APRU_1b: {
      title: "APRU 1b",
      subtitle: "Configuração Rápida",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      icon: <Zap className="w-8 h-8" />
    },
    APRU_REASONING: {
      title: "APRU REASONING",
      subtitle: "Análise Profunda",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      icon: <Brain className="w-8 h-8" />
    }
  };

  const config = modeConfig[mode];

  // Criar portal para renderizar fora do contexto atual
  const loadingContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 9999,
        margin: 0,
        padding: 0
      }}
    >
          <div className="max-w-md w-full mx-4">
            {/* Card Principal */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${config.bgColor} rounded-2xl p-8 shadow-2xl border border-gray-100`}
            >
              {/* Avatar do APRU */}
              <div className="text-center mb-6">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${config.color} text-white shadow-lg mb-4`}
                >
                  {config.icon}
                </motion.div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  Tutor APRU
                </h2>
                <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${config.color} text-white text-sm font-medium`}>
                  {config.title}
                </div>
              </div>

              {/* Status de Loading */}
              <div className="text-center mb-6">
                <motion.h3 
                  className="text-lg font-semibold text-gray-700 mb-2"
                  key={currentTip}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Gerando sua grade personalizada{dots}
                </motion.h3>
                
                {/* Barra de Progresso Animada */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${config.color} rounded-full`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ 
                      duration: 8,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                </div>
              </div>

              {/* Dicas Rotativas */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTip}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-3 p-4 bg-white/70 rounded-xl border border-gray-200"
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${config.color} text-white flex items-center justify-center`}>
                    {tips[currentTip].icon}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {tips[currentTip].text}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Partículas Flutuantes */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-2 h-2 bg-gradient-to-br ${config.color} rounded-full opacity-30`}
                    animate={{
                      y: [-20, -100],
                      x: [0, Math.random() * 40 - 20],
                      opacity: [0, 0.6, 0]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeOut"
                    }}
                    style={{
                      left: `${20 + (i * 12)}%`,
                      bottom: '10%'
                    }}
                  />
                ))}
              </div>

              {/* Tempo Estimado */}
              <div className="text-center mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    Tempo estimado: 30-60 segundos
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Mensagem Extra */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center text-gray-600 text-sm mt-4"
            >
              Relaxe! Estou criando algo especial para você 🎯
            </motion.p>
          </div>
    </motion.div>
  );

  return createPortal(
    <AnimatePresence>
      {isVisible && loadingContent}
    </AnimatePresence>,
    document.body
  );
};

export default APRULoadingScreen;
