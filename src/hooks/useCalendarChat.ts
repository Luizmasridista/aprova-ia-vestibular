import { useState, useEffect, useRef, useCallback } from 'react';

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
  const getInitialMessage = useCallback((mode: 'APRU_1b' | 'APRU_REASONING') => {
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Bom dia' : currentHour < 18 ? 'Boa tarde' : 'Boa noite';
    
    if (mode === 'APRU_1b') {
      return `${greeting}! 😊 Sou o APRU 1b. Como posso ajudar com seus estudos hoje?`;
    } else {
      return `${greeting}! 🧠 Sou o APRU REASONING. Pronto para uma análise detalhada dos seus estudos?`;
    }
  }, []);

  // Refs para controlar inicialização e evitar loops
  const isInitialized = useRef(false);
  const lastSelectedMode = useRef(selectedMode);
  
  // Inicializar mensagens apenas uma vez
  useEffect(() => {
    if (messages.length === 0 && !isInitialized.current) {
      isInitialized.current = true;
      setMessages([{
        id: `init-${Math.random().toString(36).slice(2, 8)}`,
        type: 'ai',
        content: getInitialMessage(selectedMode),
        timestamp: new Date(),
        mode: selectedMode
      }]);
    }
  }, [messages.length, selectedMode, getInitialMessage]);

  // Atualizar mensagem inicial quando modo mudar (apenas se for a mensagem inicial)
  useEffect(() => {
    // Usar ref para acessar messages sem causar re-render
    const currentMessages = messages;
    if (selectedMode !== lastSelectedMode.current && 
        currentMessages.length === 1 && 
        currentMessages[0].type === 'ai' && 
        currentMessages[0].id.startsWith('init-')) {
      lastSelectedMode.current = selectedMode;
      setMessages([{
        id: `init-${Math.random().toString(36).slice(2, 8)}`,
        type: 'ai',
        content: getInitialMessage(selectedMode),
        timestamp: new Date(),
        mode: selectedMode
      }]);
    }
  }, [messages, selectedMode, getInitialMessage]); // Incluindo messages mas com lógica segura

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
