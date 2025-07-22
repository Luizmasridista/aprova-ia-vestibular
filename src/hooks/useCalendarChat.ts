import { useState, useEffect, useRef } from 'react';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  mode?: 'APRU_1b' | 'APRU_REASONING';
}

export const useCalendarChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'APRU_1b' | 'APRU_REASONING'>('APRU_1b');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Inicializar com mensagem de boas-vindas baseada no modo
  const getInitialMessage = (mode: 'APRU_1b' | 'APRU_REASONING') => {
    if (mode === 'APRU_1b') {
      return 'Olá! Sou o APRU 1b 😊 Posso analisar seu progresso e criar atividades personalizadas.';
    } else {
      return 'Olá! Sou o APRU REASONING 🧠 Posso fazer análises profundas e criar planos detalhados.';
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'ai',
        content: getInitialMessage(selectedMode),
        timestamp: new Date(),
        mode: selectedMode
      }]);
    }
  }, []);

  // Atualizar mensagem inicial quando modo mudar
  useEffect(() => {
    if (messages.length === 1 && messages[0].type === 'ai') {
      setMessages([{
        id: '1',
        type: 'ai',
        content: getInitialMessage(selectedMode),
        timestamp: new Date(),
        mode: selectedMode
      }]);
    }
  }, [selectedMode]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const triggerCelebration = (message: string) => {
    setCelebrationMessage(message);
    setShowCelebration(true);
  };

  return {
    // State
    messages,
    inputValue,
    isLoading,
    selectedMode,
    isExpanded,
    showCelebration,
    celebrationMessage,
    messagesEndRef,
    inputRef,
    
    // Actions
    setInputValue,
    setIsLoading,
    setSelectedMode,
    setIsExpanded,
    setShowCelebration,
    addMessage,
    triggerCelebration,
    scrollToBottom,
    getInitialMessage
  };
};
