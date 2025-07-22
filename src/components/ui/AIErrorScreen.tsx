import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, MessageCircle, Clock } from 'lucide-react';
import { Button } from './button';

interface AIErrorScreenProps {
  isVisible: boolean;
  onRetry: () => void;
  onContactSupport: () => void;
}

const AIErrorScreen: React.FC<AIErrorScreenProps> = ({ isVisible, onRetry, onContactSupport }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="max-w-md w-full mx-4">
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-red-50 rounded-2xl p-8 shadow-2xl border border-red-100"
        >
          {/* Ícone de Erro Animado */}
          <div className="text-center mb-6">
            <motion.div
              animate={{ 
                rotate: [0, -5, 5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg mb-4"
            >
              <AlertCircle className="w-8 h-8" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Oops! Algo deu errado
            </h2>
            <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium">
              Serviços de IA Indisponíveis
            </div>
          </div>

          {/* Mensagem Principal */}
          <div className="text-center mb-6">
            <motion.h3 
              className="text-lg font-semibold text-gray-700 mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Não conseguimos gerar sua grade no momento
            </motion.h3>
            
            <div className="flex items-center gap-3 p-4 bg-white/70 rounded-xl border border-red-200 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Nossos serviços de IA estão temporariamente indisponíveis. Isso pode acontecer devido a alta demanda ou manutenção.
              </p>
            </div>
          </div>

          {/* Sugestões */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
              <span>Aguarde alguns minutos e tente novamente</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
              <span>Verifique sua conexão com a internet</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
              <span>Entre em contato conosco se o problema persistir</span>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={onRetry}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </Button>
            
            <Button
              onClick={onContactSupport}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50 font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Contatar Suporte
            </Button>
          </div>

          {/* Partículas Flutuantes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-br from-red-400 to-red-500 rounded-full opacity-20"
                animate={{
                  y: [-20, -100],
                  x: [0, Math.random() * 40 - 20],
                  opacity: [0, 0.4, 0]
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 1,
                  ease: "easeOut"
                }}
                style={{
                  left: `${25 + (i * 15)}%`,
                  bottom: '10%'
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Mensagem de Apoio */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-600 text-sm mt-4"
        >
          Estamos trabalhando para resolver isso rapidamente! 🛠️
        </motion.p>
      </div>
    </motion.div>
  );
};

export default AIErrorScreen;
