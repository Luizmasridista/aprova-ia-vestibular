import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, MapPin, Check } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { universities, searchUniversities, University } from '@/lib/data/universities';
import UniversityLogo from './UniversityLogo';

interface UniversitySearchProps {
  value: string;
  onChange: (value: string, university?: University) => void;
  placeholder?: string;
  className?: string;
}

const UniversitySearch: React.FC<UniversitySearchProps> = ({
  value,
  onChange,
  placeholder = "Digite o nome da universidade...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Atualizar valor interno quando prop value mudar
  useEffect(() => {
    setInputValue(value);
    
    // Verificar se o valor corresponde a uma universidade conhecida
    const matchedUniversity = universities.find(
      uni => uni.name.toLowerCase() === value.toLowerCase() || 
             uni.shortName.toLowerCase() === value.toLowerCase()
    );
    setSelectedUniversity(matchedUniversity || null);
  }, [value]);

  // Buscar universidades quando o input mudar
  useEffect(() => {
    if (inputValue.length >= 2) {
      const results = searchUniversities(inputValue);
      setSearchResults(results);
      setIsOpen(results.length > 0);
    } else {
      setSearchResults([]);
      setIsOpen(false);
    }
  }, [inputValue]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedUniversity(null);
    onChange(newValue);
  };

  const handleSelectUniversity = (university: University) => {
    setInputValue(university.name);
    setSelectedUniversity(university);
    setIsOpen(false);
    onChange(university.name, university);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setIsOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-4"
        />
        {selectedUniversity && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Check className="text-green-500 w-4 h-4" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && searchResults.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
          >
            <div className="p-2">
              <div className="text-xs text-gray-500 mb-2 px-2">
                {searchResults.length} universidade{searchResults.length !== 1 ? 's' : ''} encontrada{searchResults.length !== 1 ? 's' : ''}
              </div>
              
              {searchResults.map((university) => (
                <motion.button
                  key={university.id}
                  onClick={() => handleSelectUniversity(university)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 border border-transparent hover:border-gray-200"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center space-x-3">
                    {/* Logo da Universidade */}
                    <div className="flex-shrink-0">
                      <UniversityLogo university={university} size="md" />
                    </div>

                    {/* Informações da Universidade */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 truncate">
                          {university.shortName}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          university.type === 'publica' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {university.type === 'publica' ? 'Pública' : 'Privada'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {university.name}
                      </p>
                      <div className="flex items-center mt-1">
                        <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{university.state}</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Rodapé com dica */}
            <div className="border-t border-gray-100 p-2">
              <p className="text-xs text-gray-500 text-center">
                💡 Não encontrou sua universidade? Digite o nome completo mesmo assim.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UniversitySearch;
