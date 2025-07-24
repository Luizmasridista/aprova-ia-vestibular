import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { User, Loader2, Zap, Brain, Check, X, Clock } from 'lucide-react';
interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  status?: 'completed' | 'pending' | 'error';
  mode?: 'APRU_1b' | 'APRU_REASONING';
}
import { cn } from '@/lib/utils';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  selectedMode: 'APRU_1b' | 'APRU_REASONING';
  isExpanded: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

// Variantes de animação para as mensagens
const messageVariants: any = {
  hidden: (isUser: boolean) => ({
    opacity: 0,
    x: isUser ? 20 : -20,
    scale: 0.95
  }),
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
      mass: 0.5
    }
  },
  exit: (isUser: boolean) => ({
    opacity: 0,
    x: isUser ? 20 : -20,
    scale: 0.95,
    transition: {
      duration: 0.15
    }
  })
};

// Efeito de onda para mensagens consecutivas
const waveTransition = (index: number) => ({
  delay: 0.05 * index,
  type: 'spring' as const,
  stiffness: 500,
  damping: 30
});

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  selectedMode,
  isExpanded,
  messagesEndRef
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });

  // Rolar para a última mensagem quando novas mensagens forem adicionadas
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, messagesEndRef]);

  const getModeIcon = (mode: 'APRU_1b' | 'APRU_REASONING') => {
    return mode === 'APRU_1b' ? (
      <Zap className="w-3 h-3" strokeWidth={2.5} />
    ) : (
      <Brain className="w-3 h-3" strokeWidth={2} />
    );
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-3 h-3 text-green-500" />;
      case 'pending':
        return <Clock className="w-3 h-3 text-yellow-500" />;
      case 'error':
        return <X className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        'flex-1 overflow-y-auto p-4 space-y-3',
        'scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600',
        'scrollbar-track-transparent',
        'transition-all duration-300 ease-in-out',
        isExpanded ? 'max-h-[500px]' : 'max-h-[300px]'
      )}
    >
      <AnimatePresence initial={false}>
        {messages.map((message, index) => {
          const isUser = message.type === 'user';
          const isConsecutive = index > 0 && messages[index - 1].type === message.type;
          
          return (
            <motion.div
              key={message.id}
              layout
              custom={isUser}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={waveTransition(index)}
              className={cn(
                'flex',
                isUser ? 'justify-end' : 'justify-start',
                isConsecutive ? 'mt-1' : 'mt-3'
              )}
            >
              <motion.div 
                className={cn(
                  'relative max-w-[85%] rounded-2xl p-3',
                  'transition-all duration-200',
                  isUser 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-bl-none',
                  !isConsecutive && (isUser ? 'rounded-tl-xl' : 'rounded-tr-xl'),
                  isConsecutive && (isUser ? 'rounded-tl-md' : 'rounded-tr-md'),
                  isUser ? 'shadow-blue-500/20' : 'shadow-gray-200/50 dark:shadow-black/20'
                )}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.1 }
                }}
                whileTap={{
                  scale: 0.98,
                  transition: { duration: 0.1 }
                }}
              >
                {/* Indicador de status */}
                {message.status && (
                  <motion.div 
                    className="absolute -top-1.5 -right-1.5 bg-white dark:bg-gray-900 rounded-full p-0.5 shadow-sm"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                  >
                    {getStatusIcon(message.status)}
                  </motion.div>
                )}
                
                <div className="flex items-start gap-2.5">
                  {!isUser && !isConsecutive && (
                    <motion.div 
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                        'shadow-sm border border-white/20',
                        message.mode === 'APRU_1b' || (!message.mode && selectedMode === 'APRU_1b')
                          ? 'bg-blue-500 text-white'
                          : 'bg-purple-500 text-white'
                      )}
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: 1,
                        transition: { 
                          type: 'spring', 
                          stiffness: 500, 
                          damping: 30 
                        } 
                      }}
                    >
                      {getModeIcon(message.mode || selectedMode)}
                    </motion.div>
                  )}
                  
                  {!isUser && isConsecutive && (
                    <div className="w-6 flex-shrink-0" />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    {!isUser && !isConsecutive && (
                      <motion.p 
                        className={cn(
                          'text-xs font-medium mb-1',
                          message.mode === 'APRU_1b' || (!message.mode && selectedMode === 'APRU_1b')
                            ? 'text-blue-500 dark:text-blue-400'
                            : 'text-purple-500 dark:text-purple-400'
                        )}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { delay: 0.15 }
                        }}
                      >
                        {message.mode === 'APRU_1b' || (!message.mode && selectedMode === 'APRU_1b') 
                          ? 'APRU 1b' 
                          : 'APRU REASONING'}
                      </motion.p>
                    )}
                    
                    <motion.p 
                      className={cn(
                        'text-sm leading-relaxed break-words',
                        isUser ? 'text-white' : 'text-gray-800 dark:text-gray-100'
                      )}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: 0.1 }
                      }}
                    >
                      {message.content}
                    </motion.p>
                    
                    <motion.p 
                      className={cn(
                        'text-[10px] mt-1',
                        isUser 
                          ? 'text-blue-100/80 text-right' 
                          : 'text-gray-500 dark:text-gray-400'
                      )}
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: 1,
                        transition: { delay: 0.2 }
                      }}
                    >
                      {message.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Pensando...</span>
            </div>
          </div>
        </motion.div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
