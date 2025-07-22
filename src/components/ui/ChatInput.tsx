import React from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  selectedMode: 'APRU_1b' | 'APRU_REASONING';
  inputRef: React.RefObject<HTMLInputElement>;
  quickSuggestions?: string[];
  showSuggestions?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  onSendMessage,
  isLoading,
  selectedMode,
  inputRef,
  quickSuggestions = [
    "Como estou?",
    "O que estudar?",
    "Criar cronograma",
    "Agendar atividade",
    "Editar próximo evento",
    "Excluir último evento"
  ],
  showSuggestions = false
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSendMessage();
    }
  };

  return (
    <div className="space-y-3">
      {/* Sugestões rápidas */}
      {showSuggestions && (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">Sugestões rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputValue(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input de mensagem */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Converse com ${selectedMode === 'APRU_1b' ? 'APRU 1b' : 'APRU REASONING'}...`}
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isLoading}
        />
        <Button
          onClick={onSendMessage}
          disabled={!inputValue.trim() || isLoading}
          size="sm"
          className="px-3"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
