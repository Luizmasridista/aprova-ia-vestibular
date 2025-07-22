import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Loader2, Zap, Brain } from 'lucide-react';
import { Message } from '@/hooks/useCalendarChat';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  selectedMode: 'APRU_1b' | 'APRU_REASONING';
  isExpanded: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  selectedMode,
  isExpanded,
  messagesEndRef
}) => {
  const getModeIcon = (mode: 'APRU_1b' | 'APRU_REASONING') => {
    return mode === 'APRU_1b' ? <Zap className="w-4 h-4" /> : <Brain className="w-4 h-4" />;
  };

  const getModeColor = (mode: 'APRU_1b' | 'APRU_REASONING') => {
    return mode === 'APRU_1b' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  return (
    <div className={`border rounded-lg ${isExpanded ? 'h-96' : 'h-48'} overflow-y-auto p-4 space-y-3 bg-gray-50`}>
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${
              message.type === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-white border shadow-sm'
            } rounded-lg p-3`}>
              <div className="flex items-start gap-2">
                {message.type === 'user' ? (
                  <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                ) : (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${getModeColor(message.mode || selectedMode)}`}>
                    {getModeIcon(message.mode || selectedMode)}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Indicador de digitação */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start"
        >
          <div className="bg-white border rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getModeColor(selectedMode)}`}>
                {getModeIcon(selectedMode)}
              </div>
              <div className="flex items-center gap-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-600">Analisando...</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
