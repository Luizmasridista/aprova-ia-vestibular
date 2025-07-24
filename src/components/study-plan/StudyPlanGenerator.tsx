import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Building2, 
  Calendar, 
  Timer, 
  Sun, 
  Brain, 
  BookMarked, 
  Target,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle,
  AlertCircle,

} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { studyPlanService, StudyPlanRequest, StudyPlanResponse } from '@/lib/services/studyPlanService';
import { monthlyGoalsService } from '@/lib/services/monthlyGoalsService';
import CourseSearch from '@/components/ui/CourseSearch';
import UniversitySearch from '@/components/ui/UniversitySearch';
import APRULoadingScreen from '@/components/ui/APRULoadingScreen';
import AIErrorScreen from '@/components/ui/AIErrorScreen';

// Interfaces
interface Question {
  id: string;
  text: string;
  type: 'text' | 'multiple-choice' | 'time' | 'date' | 'number' | 'multi-select' | 'course-search' | 'university-search';
  options?: string[];
  description?: string;
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

interface Mode {
  id: 'APRU_1b' | 'APRU_REASONING';
  name: string;
  description: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface StudyPlanGeneratorState {
  selectedMode: 'APRU_1b' | 'APRU_REASONING' | null;
  currentQuestionIndex: number;
  answers: Record<string, unknown>;
  isGenerating: boolean;
  showError: boolean;
  generatedPlan: StudyPlanResponse | null;
}

const StudyPlanGenerator: React.FC = () => {
  const { user } = useAuth();
  
  // Estados
  const [state, setState] = useState<StudyPlanGeneratorState>({
    selectedMode: null,
    currentQuestionIndex: 0,
    answers: {},
    isGenerating: false,
    showError: false,
    generatedPlan: null
  });

  // Configuração dos modos
  const modes: Mode[] = [
    {
      id: 'APRU_1b',
      name: 'APRU 1b',
      description: 'Configuração leve e rápida para começar. Ideal para quem quer um plano básico e eficiente.',
      color: 'from-blue-500 to-blue-600',
      icon: Zap
    },
    {
      id: 'APRU_REASONING',
      name: 'APRU REASONING',
      description: 'Análise avançada para rotinas detalhadas. Perfeito para quem busca um plano completo e personalizado.',
      color: 'from-purple-500 to-purple-600',
      icon: Brain
    }
  ];

  // Configuração das perguntas
  const questions: Question[] = [
    {
      id: 'targetCourse',
      text: 'Qual curso você deseja fazer?',
      type: 'course-search',
      description: 'Digite o nome do curso ou navegue pelas categorias',
      required: true,
      icon: GraduationCap
    },
    {
      id: 'targetInstitution',
      text: 'Em qual instituição você pretende estudar?',
      type: 'university-search',
      description: 'Digite o nome da universidade ou faculdade',
      required: true,
      icon: Building2
    },
    {
      id: 'targetDate',
      text: 'Quando é a sua prova ou data alvo?',
      type: 'date',
      description: 'Selecione a data do seu exame ou quando deseja estar preparado',
      required: true,
      icon: Calendar
    },
    {
      id: 'hoursPerDay',
      text: 'Quantas horas por dia você pode dedicar aos estudos?',
      type: 'number',
      description: 'Considere seu dia a dia e seja realista (1-12 horas)',
      required: true,
      icon: Timer
    },
    {
      id: 'studyPeriod',
      text: 'Qual período você prefere estudar?',
      type: 'multiple-choice',
      options: ['Manhã', 'Tarde', 'Noite', 'Flexível'],
      description: 'Escolha o período em que você rende melhor',
      required: true,
      icon: Sun
    },
    {
      id: 'subjects',
      text: 'Quais matérias você tem mais dificuldade?',
      type: 'multi-select',
      options: [
        'Matemática', 'Português', 'Física', 'Química', 'Biologia',
        'História', 'Geografia', 'Filosofia', 'Sociologia', 'Inglês',
        'Literatura', 'Redação', 'Atualidades'
      ],
      description: 'Selecione as matérias que precisam de mais atenção',
      required: true,
      icon: Brain
    },
    {
      id: 'studyDays',
      text: 'Quais dias da semana você pode estudar?',
      type: 'multi-select',
      options: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
      description: 'Selecione os dias disponíveis para estudo',
      required: true,
      icon: BookMarked
    },
    {
      id: 'mainGoal',
      text: 'Qual é o seu objetivo principal?',
      type: 'multiple-choice',
      options: ['Passar no vestibular', 'Melhorar notas', 'Reforçar conhecimentos', 'Preparação para ENEM'],
      description: 'Selecione o que melhor descreve seu objetivo',
      required: true,
      icon: Target
    }
  ];

  // Função para validar se a pergunta atual foi respondida
  const isCurrentQuestionAnswered = (): boolean => {
    const currentQuestion = questions[state.currentQuestionIndex];
    const answer = state.answers[currentQuestion.id];
    
    if (!currentQuestion.required) return true;
    
    if (currentQuestion.type === 'multi-select') {
      return Boolean(Array.isArray(answer) && answer.length > 0);
    }
    
    if (currentQuestion.type === 'number') {
      const num = Number(answer);
      return Boolean(answer && !isNaN(num) && num > 0 && num <= 12);
    }
    
    return Boolean(answer && String(answer).trim() !== '');
  };

  // Função para avançar para próxima pergunta
  const handleNext = () => {
    if (!isCurrentQuestionAnswered()) {
      toast.error('Por favor, responda a pergunta atual antes de continuar.');
      return;
    }

    if (state.currentQuestionIndex < questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  };

  // Função para voltar para pergunta anterior
  const handlePrevious = () => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  };

  // Função para atualizar resposta
  const updateAnswer = (questionId: string, value: unknown, extraData?: unknown) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value,
        ...(extraData && { [`${questionId}_data`]: extraData })
      }
    }));
  };

  // Função para selecionar modo
  const selectMode = (mode: 'APRU_1b' | 'APRU_REASONING') => {
    setState(prev => ({
      ...prev,
      selectedMode: mode
    }));
  };

  // Função para gerar plano de estudos
  const handleGeneratePlan = async () => {
    if (!user?.id) {
      toast.error('Você precisa estar logado para gerar um plano de estudos.');
      return;
    }

    if (!state.selectedMode) {
      toast.error('Selecione um modo antes de gerar o plano.');
      return;
    }

    if (!isCurrentQuestionAnswered()) {
      toast.error('Por favor, responda todas as perguntas antes de gerar o plano.');
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, showError: false }));

    try {
      const request: StudyPlanRequest = {
        userId: user.id,
        mode: state.selectedMode,
        answers: state.answers
      };

      console.log('🚀 [StudyPlanGenerator] Gerando plano com dados:', {
        mode: state.selectedMode,
        answers: state.answers,
        userId: user.id
      });

      const result = await studyPlanService.generatePlan(request);
      
      // Gerar metas mensais personalizadas
      try {
        console.log('🎯 [StudyPlanGenerator] Gerando metas mensais...');
        
        const monthlyGoals = await monthlyGoalsService.generateMonthlyGoals({
          userId: user.id,
          studyPlanId: result.id,
          targetCourse: String(state.answers.targetCourse || 'Curso não especificado'),
          targetDate: String(state.answers.targetDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()),
          hoursPerDay: Number(state.answers.hoursPerDay) || 4,
          mode: state.selectedMode
        });
        
        await monthlyGoalsService.saveMonthlyGoals(monthlyGoals);
        
        console.log(`✅ [StudyPlanGenerator] ${monthlyGoals.length} metas mensais criadas!`);
        toast.success(`Plano de estudos e ${monthlyGoals.length} metas mensais criados com sucesso!`);
      } catch (goalsError) {
        console.error('⚠️ [StudyPlanGenerator] Erro ao criar metas mensais:', goalsError);
        toast.success('Plano de estudos gerado com sucesso!');
        toast.warning('Metas mensais serão criadas automaticamente.');
      }
      
      setState(prev => ({
        ...prev,
        generatedPlan: result,
        isGenerating: false
      }));
      
      // Redirecionar para dashboard após 3 segundos
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);

    } catch (error) {
      console.error('❌ [StudyPlanGenerator] Erro ao gerar plano:', error);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        showError: true
      }));
      toast.error('Erro ao gerar plano de estudos. Tente novamente.');
    }
  };

  // Função para renderizar campo de pergunta
  const renderQuestionField = (question: Question) => {
    const answer = state.answers[question.id];
    const questionType = question.type as 'text' | 'multiple-choice' | 'time' | 'date' | 'number' | 'multi-select' | 'course-search' | 'university-search';

    switch (questionType) {
      case 'course-search':
        return (
          <CourseSearch
            value={String(answer || '')}
            onChange={(value, courseData) => updateAnswer(question.id, value, courseData)}
            placeholder="Digite o nome do curso..."
            className="w-full"
          />
        );

      case 'university-search':
        return (
          <UniversitySearch
            value={String(answer || '')}
            onChange={(value, universityData) => updateAnswer(question.id, value, universityData)}
            placeholder="Digite o nome da universidade..."
            className="w-full"
          />
        );

      case 'text':
        return (
          <Input
            value={String(answer || '')}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            placeholder="Digite sua resposta..."
            className="w-full"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            min="1"
            max="12"
            value={String(answer || '')}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            placeholder="Ex: 4"
            className="w-full"
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={String(answer || '')}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className="w-full"
          />
        );

      case 'multiple-choice':
        return (
          <RadioGroup
            value={String(answer || '')}
            onValueChange={(value) => updateAnswer(question.id, value)}
            className="space-y-3"
          >
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'multi-select': {
        const selectedOptions = Array.isArray(answer) ? answer : [];
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={(checked) => {
                    const newSelection = checked
                      ? [...selectedOptions, option]
                      : selectedOptions.filter(item => item !== option);
                    updateAnswer(question.id, newSelection);
                  }}
                />
                <Label htmlFor={option} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );
      }

      default:
        return null;
    }
  };

  // Renderizar tela de loading
  if (state.isGenerating) {
    return (
      <APRULoadingScreen
        mode={state.selectedMode || 'APRU_1b'}
        isVisible={true}
      />
    );
  }

  // Renderizar tela de erro
  if (state.showError) {
    return (
      <AIErrorScreen
        isVisible={true}
        onRetry={() => {
          setState(prev => ({ ...prev, showError: false }));
          handleGeneratePlan();
        }}
        onContactSupport={() => {
          window.open('mailto:suporte@aprova.ae', '_blank');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Gerador de Grade de Estudos
          </h1>
          <p className="text-gray-600 text-lg">
            Crie um plano de estudos personalizado com inteligência artificial
          </p>
        </motion.div>

        {/* Seleção de Modo */}
        {!state.selectedMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-center mb-6">Escolha seu modo de estudo</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {modes.map((mode) => {
                const IconComponent = mode.icon;
                return (
                  <motion.div
                    key={mode.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className="cursor-pointer border-2 hover:border-purple-300 transition-all duration-300 hover:shadow-lg"
                      onClick={() => selectMode(mode.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-full bg-gradient-to-r ${mode.color} text-white`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{mode.name}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{mode.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Questionário */}
        {state.selectedMode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Indicador de Modo Selecionado */}
            <div className="flex items-center justify-center mb-6">
              <Badge className={`px-4 py-2 text-lg bg-gradient-to-r ${
                state.selectedMode === 'APRU_1b' ? 'from-purple-500 to-purple-600' : 'from-purple-500 to-purple-600'
              } text-white`}>
                {modes.find(m => m.id === state.selectedMode)?.name}
              </Badge>
            </div>

            {/* Barra de Progresso */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Pergunta {state.currentQuestionIndex + 1} de {questions.length}
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round(((state.currentQuestionIndex + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((state.currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Pergunta Atual */}
            <AnimatePresence mode="wait">
              <motion.div
                key={state.currentQuestionIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border shadow-lg">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      {questions[state.currentQuestionIndex].icon && (
                        <div className="p-2 rounded-full bg-gray-100">
                          {React.createElement(questions[state.currentQuestionIndex].icon!, {
                            className: "w-5 h-5 text-gray-600"
                          })}
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-xl text-gray-800">
                          {questions[state.currentQuestionIndex].text}
                        </CardTitle>
                        {questions[state.currentQuestionIndex].description && (
                          <p className="text-gray-600 mt-1">
                            {questions[state.currentQuestionIndex].description}
                          </p>
                        )}
                      </div>
                      {questions[state.currentQuestionIndex].required && (
                        <Badge variant="destructive" className="text-xs">
                          Obrigatório
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {renderQuestionField(questions[state.currentQuestionIndex])}
                    
                    {/* Validação Visual */}
                    {questions[state.currentQuestionIndex].required && (
                      <div className="flex items-center space-x-2 text-sm">
                        {isCurrentQuestionAnswered() ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-green-600">Pergunta respondida</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                            <span className="text-amber-600">Esta pergunta é obrigatória</span>
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Botões de Navegação */}
            <div className="flex justify-between items-center pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={state.currentQuestionIndex === 0}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </Button>

              <div className="flex space-x-2">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === state.currentQuestionIndex
                        ? 'bg-purple-500 scale-125'
                        : index < state.currentQuestionIndex
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {state.currentQuestionIndex < questions.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentQuestionAnswered()}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <span>Próxima</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleGeneratePlan}
                  disabled={!isCurrentQuestionAnswered()}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-purple-500 hover:from-green-600 hover:to-purple-600"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar Grade</span>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudyPlanGenerator;