import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, GraduationCap, Check, BookOpen } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { courses, searchCourses, Course, getCoursesByCategory } from '@/lib/data/courses';

interface CourseSearchProps {
  value: string;
  onChange: (value: string, course?: Course) => void;
  placeholder?: string;
  className?: string;
}

const CourseSearch: React.FC<CourseSearchProps> = ({
  value,
  onChange,
  placeholder = "Digite o nome do curso...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [inputValue, setInputValue] = useState(value);
  const [showCategories, setShowCategories] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Atualizar valor interno quando prop value mudar
  useEffect(() => {
    setInputValue(value);
    
    // Verificar se o valor corresponde a um curso conhecido
    const matchedCourse = courses.find(
      course => course.name.toLowerCase() === value.toLowerCase()
    );
    setSelectedCourse(matchedCourse || null);
  }, [value]);

  // Buscar cursos quando o input mudar
  useEffect(() => {
    if (inputValue.length >= 2) {
      const results = searchCourses(inputValue);
      setSearchResults(results);
      setIsOpen(results.length > 0);
      setShowCategories(false);
    } else if (inputValue.length === 0) {
      // Mostrar categorias quando input estiver vazio
      setSearchResults([]);
      setShowCategories(true);
      setIsOpen(true);
    } else {
      setSearchResults([]);
      setIsOpen(false);
      setShowCategories(false);
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
        setShowCategories(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedCourse(null);
    onChange(newValue);
  };

  const handleSelectCourse = (course: Course) => {
    setInputValue(course.name);
    setSelectedCourse(course);
    setIsOpen(false);
    setShowCategories(false);
    onChange(course.name, course);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    if (inputValue.length >= 2 && searchResults.length > 0) {
      setIsOpen(true);
    } else if (inputValue.length === 0) {
      setShowCategories(true);
      setIsOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setShowCategories(false);
      inputRef.current?.blur();
    }
  };

  const coursesByCategory = getCoursesByCategory();
  const popularCourses = [
    courses.find(c => c.id === 'medicina'),
    courses.find(c => c.id === 'direito'),
    courses.find(c => c.id === 'engenharia-civil'),
    courses.find(c => c.id === 'administracao'),
    courses.find(c => c.id === 'ciencia-computacao'),
    courses.find(c => c.id === 'psicologia')
  ].filter(Boolean) as Course[];

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
        {selectedCourse && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Check className="text-green-500 w-4 h-4" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (showCategories || searchResults.length > 0) && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
          >
            <div className="p-2">
              {/* Resultados da busca */}
              {searchResults.length > 0 && (
                <>
                  <div className="text-xs text-gray-500 mb-2 px-2">
                    {searchResults.length} curso{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                  </div>
                  
                  {searchResults.map((course) => (
                    <motion.button
                      key={course.id}
                      onClick={() => handleSelectCourse(course)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 border border-transparent hover:border-gray-200"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Ícone do Curso */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">{course.icon}</span>
                          </div>
                        </div>

                        {/* Informações do Curso */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900 truncate">
                              {course.name}
                            </h4>
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {course.category}
                            </span>
                          </div>
                          {course.description && (
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {course.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </>
              )}

              {/* Categorias e cursos populares */}
              {showCategories && (
                <>
                  <div className="text-xs text-gray-500 mb-3 px-2 flex items-center">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    Cursos Populares
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {popularCourses.map((course) => (
                      <motion.button
                        key={course.id}
                        onClick={() => handleSelectCourse(course)}
                        className="p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 border border-transparent hover:border-gray-200 text-left"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{course.icon}</span>
                          <span className="text-sm font-medium text-gray-700 truncate">
                            {course.name}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <div className="text-xs text-gray-500 mb-2 px-2 flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Todas as Categorias
                    </div>
                    
                    {Object.entries(coursesByCategory).slice(0, 4).map(([category, categoryCourses]) => (
                      <div key={category} className="mb-3">
                        <div className="text-xs font-medium text-gray-600 mb-1 px-2">
                          {category}
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                          {categoryCourses.slice(0, 3).map((course) => (
                            <motion.button
                              key={course.id}
                              onClick={() => handleSelectCourse(course)}
                              className="p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150 text-left"
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-sm">{course.icon}</span>
                                <span className="text-sm text-gray-700 truncate">
                                  {course.name}
                                </span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Rodapé com dica */}
            <div className="border-t border-gray-100 p-2">
              <p className="text-xs text-gray-500 text-center">
                💡 Não encontrou seu curso? Digite o nome completo mesmo assim.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseSearch;
