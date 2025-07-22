import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Progress } from '../ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Clock, Calendar, CheckCircle, Loader2, BookOpen, ArrowLeft, ArrowRight, Target, Check, Circle, GraduationCap, Building2, Brain, Sun, Moon, Sunrise, Users, MapPin, Timer, BookMarked, School } from 'lucide-react';
import { studyPlanService, StudyPlanConfig, StudyPlanRequest } from '../../lib/services/studyPlanService';
import { useAuth } from '@/contexts/AuthContext';
import APRULoadingScreen from '../ui/APRULoadingScreen';
import AIErrorScreen from '../ui/AIErrorScreen';
import UniversitySearch from '../ui/UniversitySearch';
import CourseSearch from '../ui/CourseSearch';
import { University } from '@/lib/data/universities';
import { Course } from '@/lib/data/courses';

interface Question {
  id: string;
  text: string;
  type: 'text' | 'multiple-choice' | 'time' | 'date' | 'number' | 'multi-select' | 'university-search' | 'course-search';
  options?: string[];
  required?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

interface StudyPlanMode {
  id: 'APRU_1b' | 'APRU_REASONING';
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const StudyPlanGenerator: React.FC = () => {
  // Hook de autenticação
  const { user } = useAuth();
  
  // Estados para gerenciar erros
  const [error, setError] = useState<string | null>(null);
  
  // Estados para gerenciar o questionário
  const [modes, setModes] = useState<StudyPlanMode[]>([]);
  const [initialQuestions, setInitialQuestions] = useState<Question[]>([]);
  const [selectedMode, setSelectedMode] = useState<'APRU_1b' | 'APRU_REASONING'>('APRU_1b');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isGenerated, setIsGenerated] = useState(false);
  const [editingPlan, setEditingPlan] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
  const [showAIError, setShowAIError] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<{
    weeklySchedule?: Array<{ day: string; subjects: Array<{ name: string; time: string }> }>;
    dailyGoals?: Array<{ goal: string; completed: boolean }>;
    recommendations?: Array<{ title: string; description: string }>;
  }>({});

  useEffect(() => {
    const fetchStudyPlanData = async () => {
      try {
        // Usando o serviço para buscar configurações do plano de estudos
        const config = await studyPlanService.getConfig();
        
        // Validação básica dos dados recebidos
        if (!Array.isArray(config.modes) || !Array.isArray(config.questions)) {
          throw new Error('Formato de dados inválido');
        }
        
        // Mapear os modos para incluir ícones
        const modesWithIcons = config.modes.map(mode => ({
          ...mode,
          id: mode.id as 'APRU_1b' | 'APRU_REASONING',
          icon: mode.id === 'APRU_1b' ? 
            <Clock className="w-5 h-5 mr-2" /> : 
            <BookOpen className="w-5 h-5 mr-2" />
        }));
        
        const typedQuestions: Question[] = config.questions.map(question => ({
          ...question,
          type: question.type as 'text' | 'multiple-choice' | 'time' | 'date' | 'number' | 'multi-select' | 'university-search'
        }));
        
        setModes(modesWithIcons);
        setInitialQuestions(typedQuestions);
        
      } catch (err) {
        console.error('Erro ao carregar configurações do plano de estudos:', err);
        
        // Dados de fallback em caso de erro na API
        const fallbackModes: StudyPlanMode[] = [
          { 
            id: 'APRU_1b', 
            name: 'APRU 1b', 
            description: 'Configuração leve e rápida para começar.',
            icon: <Clock className="w-5 h-5 mr-2" />,
            color: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          },
          { 
            id: 'APRU_REASONING', 
            name: 'APRU REASONING', 
            description: 'Análise avançada para rotinas detalhadas.',
            icon: <BookOpen className="w-5 h-5 mr-2" />,
            color: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
          },
        ];

        const fallbackQuestions: Question[] = [
          { 
            id: 'targetCourse', 
            text: 'Qual curso você deseja ingressar?', 
            type: 'text',
            description: 'Ex: Medicina, Engenharia Civil, Direito, Administração...',
            icon: <GraduationCap className="w-5 h-5" />,
            required: true
          },
          { 
            id: 'targetInstitution', 
            text: 'Em qual instituição você quer estudar?', 
            type: 'university-search',
            description: 'Digite para buscar universidades com logos e informações',
            icon: <Building2 className="w-5 h-5" />,
            required: true
          },
          { 
            id: 'targetDate', 
            text: 'Quando é a sua prova ou data alvo?', 
            type: 'date',
            description: 'Defina uma meta para se manter motivado.',
            icon: <Calendar className="w-5 h-5" />,
            required: true
          },
          { 
            id: 'hoursPerDay', 
            text: 'Quantas horas por dia você pode dedicar aos estudos?', 
            type: 'number',
            description: 'Considere seu dia a dia e seja realista.',
            icon: <Timer className="w-5 h-5" />,
            required: true
          },
          { 
            id: 'timePreference', 
            text: 'Em qual período do dia você rende mais?', 
            type: 'multiple-choice', 
            options: ['Manhã (06h - 12h)', 'Tarde (12h - 18h)', 'Noite (18h - 23h)'],
            description: 'Isso ajudará a organizar seus horários de estudo.',
            icon: <Sun className="w-5 h-5" />,
            required: true
          },
          { 
            id: 'difficultSubjects', 
            text: 'Quais são as matérias que você mais tem dificuldade?', 
            type: 'multi-select',
            options: ['Matemática', 'Português', 'História', 'Geografia', 'Biologia', 'Química', 'Física', 'Literatura', 'Inglês', 'Filosofia', 'Sociologia'],
            description: 'Selecione as principais matérias que você tem mais dificuldade.',
            icon: <Brain className="w-5 h-5" />,
            required: true
          },
          { 
            id: 'studyDays', 
            text: 'Em quais dias da semana você pode estudar?', 
            type: 'multi-select',
            options: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
            description: 'Selecione todos os dias que você pode dedicar aos estudos.',
            icon: <BookMarked className="w-5 h-5" />,
            required: true
          },
          { 
            id: 'studyGoal', 
            text: 'Qual é o seu objetivo principal?', 
            type: 'multiple-choice',
            options: ['Passar no vestibular', 'Melhorar notas na escola', 'Preparar para concurso', 'Aprender algo novo'],
            description: 'Selecione a opção que melhor se encaixa com seu objetivo atual.',
            icon: <Target className="w-5 h-5" />,
            required: true
          },
        ];
        
        setModes(fallbackModes);
        setInitialQuestions(fallbackQuestions);
        
        // Mostrar mensagem de aviso sobre o uso de dados locais
        toast.warning('Dados carregados localmente. Algumas funcionalidades podem estar limitadas.');
      }
    };

    fetchStudyPlanData();
  }, []);

  // Componente sempre renderiza o conteúdo principal

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  const handleModeSelect = (mode: 'APRU_1b' | 'APRU_REASONING') => {
    setSelectedMode(mode);
    // Não avançar automaticamente - usuário deve clicar em "Começar Questionário"
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleMultiSelect = (questionId: string, option: string) => {
    setAnswers(prev => {
      const currentAnswers = Array.isArray(prev[questionId]) ? [...prev[questionId]] : [];
      const newAnswers = currentAnswers.includes(option)
        ? currentAnswers.filter(item => item !== option)
        : [...currentAnswers, option];
      return { ...prev, [questionId]: newAnswers };
    });
  };

  const isAnswerValid = (question: Question): boolean => {
    if (!question.required) return true;
    const answer = answers[question.id];
    if (Array.isArray(answer)) return answer.length > 0;
    return answer !== undefined && answer !== '';
  };

  const handleNext = async () => {
    const currentQuestion = initialQuestions[step - 1];
    if (currentQuestion && !isAnswerValid(currentQuestion)) {
      toast.error('Por favor, responda a pergunta antes de continuar.');
      return;
    }

    if (step < initialQuestions.length) {
      setStep(step + 1);
    } else {
      setIsGeneratingWithAI(true);
      
      // Pequeno delay para garantir que a animação renderize
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        
        console.log('🚀 [StudyPlanGenerator] Usuário clicou em "Gerar Grade"');
        console.log('📋 [StudyPlanGenerator] Dados coletados:', {
          mode: selectedMode,
          answers: answers,
          userId: user?.id,
          timestamp: new Date().toISOString()
        });
        
        // Mostrar toast de início do processo
        toast.loading('🤖 Gerando sua grade...', {
          id: 'generating-plan'
        });
        
        console.log('🔄 [StudyPlanGenerator] Iniciando chamada para studyPlanService.generatePlan...');
        
        // Gerar o plano de estudos usando o serviço com IA
        const response = await studyPlanService.generatePlan({
          mode: selectedMode,
          answers: answers,
          userId: user?.id || 'anonymous'
        });
        
        console.log('✅ [StudyPlanGenerator] Resposta recebida do serviço:', {
          hasWeeklySchedule: !!response.weekly_schedule,
          hasDailyGoals: !!response.daily_goals,
          hasRecommendations: !!response.revision_suggestions,
          planId: response.id
        });
        
        // Extrair o plano gerado da resposta
        const planData = response;
        
        // Atualizar o estado com o plano gerado
        const generatedPlanData = {
          weeklySchedule: planData.weekly_schedule || [],
          dailyGoals: planData.daily_goals || [],
          recommendations: planData.revision_suggestions || []
        };
        
        console.log('📊 [StudyPlanGenerator] Dados do plano processados:', {
          weeklyScheduleItems: generatedPlanData.weeklySchedule.length,
          dailyGoalsCount: generatedPlanData.dailyGoals.length,
          recommendationsCount: generatedPlanData.recommendations.length
        });
        
        setGeneratedPlan(generatedPlanData);
        setIsGenerated(true);
        
        // Rolar para o topo da página
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Dismiss loading toast e mostrar sucesso
        toast.dismiss('generating-plan');
        toast.success('🎉 Grade criada com sucesso!');
        
        console.log('🎯 [StudyPlanGenerator] Processo de geração concluído com sucesso!');
        
      } catch (err) {
        console.error('❌ [StudyPlanGenerator] Erro ao gerar plano de estudos:', err);
        
        // Dismiss loading toast
        toast.dismiss('generating-plan');
        
        // Verificar se é erro de IA indisponível
        if (err instanceof Error && err.message.includes('Serviços de IA indisponíveis')) {
          console.log('🚨 [StudyPlanGenerator] Erro de IA detectado - mostrando tela de erro');
          setShowAIError(true);
        } else {
          // Outros erros mostram toast normal
          if (err instanceof Error) {
            console.error('❌ [StudyPlanGenerator] Detalhes do erro:', {
              message: err.message,
              stack: err.stack
            });
            toast.error(`Erro: ${err.message}`);
          } else {
            toast.error('Não foi possível gerar o plano de estudos. Tente novamente mais tarde.');
          }
        }
      } finally {
        setIsGeneratingWithAI(false);
        console.log('🏁 [StudyPlanGenerator] Processo finalizado (animação desativada)');
      }
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setStep(0);
    }
  };

  const handleRetryGeneration = () => {
    console.log('🔄 [StudyPlanGenerator] Usuário clicou em tentar novamente');
    setShowAIError(false);
    // Tentar gerar novamente
    handleNext();
  };

  const handleContactSupport = () => {
    console.log('📞 [StudyPlanGenerator] Usuário clicou em contatar suporte');
    setShowAIError(false);
    // Abrir link para suporte (pode ser WhatsApp, email, etc.)
    window.open('mailto:suporte@aprova.ae?subject=Problema%20com%20Geração%20de%20Grade%20de%20Estudos', '_blank');
    toast.info('Redirecionando para o suporte... 📞');
  };

  const handleEditPlan = () => {
    // Permitir que usuário revise e refaça a grade
    setIsGenerated(false);
    setGeneratedPlan({});
    // Manter as respostas atuais para edição
    setEditingPlan(true);
    // Voltar para a última pergunta respondida
    setStep(initialQuestions.length);
    // Rolar para o topo do formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Mostrar mensagem informativa
    toast.info('Você pode editar suas respostas abaixo');
  };

  const handleExportToCalendar = async () => {
    toast.success('✅ Integrado ao calendário!', {
      description: 'Veja suas atividades na seção Calendário.'
    });
  };

  const handleSavePlan = async () => {
    try {
      setIsSubmitting(true);
      
      // Preparar dados para salvar
      const planData = {
        mode: selectedMode,
        answers,
        generatedPlan,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Chamada à API para salvar o plano
      const response = await fetch('/api/study-plan/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData)
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar o plano de estudos');
      }

      const data = await response.json();
      
      toast.success('Sua grade de estudos foi salva com sucesso!');
      return data;
    } catch (err) {
      console.error('Erro ao salvar o plano de estudos:', err);
      toast.error('Não foi possível salvar o plano de estudos. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = step > 0 ? ((step - 1) / initialQuestions.length) * 100 : 0;

  const renderQuestion = (question: Question) => {
    const currentAnswer = answers[question.id];
    
    return (
      <div className="space-y-4">
        {question.description && (
          <p className="text-sm text-gray-600">{question.description}</p>
        )}
        
        <div className="space-y-3">
          {(() => {
            switch (question.type) {
              case 'multiple-choice':
                return question.options?.map(option => (
                  <Button
                    key={option}
                    variant={currentAnswer === option ? 'default' : 'outline'}
                    className={`w-full text-left justify-start transition-all ${currentAnswer === option ? 'scale-[0.98]' : ''}`}
                    onClick={() => handleAnswer(question.id, option)}
                  >
                    {option}
                  </Button>
                ));
              
              case 'multi-select':
                return question.options?.map(option => {
                  const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(option);
                  return (
                    <Button
                      key={option}
                      variant={isSelected ? 'default' : 'outline'}
                      className={`w-full text-left justify-start transition-all ${isSelected ? 'scale-[0.98]' : ''}`}
                      onClick={() => handleMultiSelect(question.id, option)}
                    >
                      {isSelected && <CheckCircle className="w-4 h-4 mr-2" />}
                      {option}
                    </Button>
                  );
                });
              
              case 'text':
                return (
                  <input
                    type="text"
                    value={currentAnswer || ''}
                    onChange={e => handleAnswer(question.id, e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Digite sua resposta..."
                  />
                );
              
              case 'number':
                return (
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={currentAnswer || ''}
                      onChange={e => handleAnswer(question.id, e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Ex: 2"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">horas/dia</span>
                  </div>
                );
              
              case 'date':
                const today = new Date().toISOString().split('T')[0];
                return (
                  <input
                    type="date"
                    min={today}
                    value={currentAnswer || ''}
                    onChange={e => handleAnswer(question.id, e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                );
            
              case 'university-search':
                return (
                  <UniversitySearch
                    value={currentAnswer || ''}
                    onChange={(value, university) => {
                      handleAnswer(question.id, value);
                      // Salvar dados adicionais da universidade se selecionada
                      if (university) {
                        handleAnswer(`${question.id}_data`, {
                          id: university.id,
                          shortName: university.shortName,
                          state: university.state,
                          type: university.type,
                          logo: university.logo
                        });
                      }
                    }}
                    placeholder="Digite o nome da universidade..."
                    className="w-full"
                  />
                );
            
              case 'course-search':
                return (
                  <CourseSearch
                    value={currentAnswer || ''}
                    onChange={(value, course) => {
                      handleAnswer(question.id, value);
                      // Salvar dados adicionais do curso se selecionado
                      if (course) {
                        handleAnswer(`${question.id}_data`, {
                          id: course.id,
                          category: course.category,
                          icon: course.icon,
                          description: course.description
                        });
                      }
                    }}
                    placeholder="Digite o nome do curso..."
                    className="w-full"
                  />
                );
          
              default:
                return null;
            }
          })()}
        </div>
      </div>
    );
  };

  const renderGeneratedPlan = () => {
    const formattedDate = answers['targetDate'] 
      ? new Date(answers['targetDate']).toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: 'long', 
          year: 'numeric' 
        })
      : 'uma data futura';

    const { weeklySchedule = [], dailyGoals = [], recommendations = [] } = generatedPlan;

    // Se não houver dados do plano, mostrar mensagem
    if (!weeklySchedule.length && !dailyGoals.length && !recommendations.length) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhum plano encontrado</h2>
          <p className="text-gray-600 text-center max-w-md">Isso pode levar alguns instantes.</p>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Sua grade de estudos está pronta!</h2>
          <p className="text-gray-600">Planejamento personalizado para seu objetivo até {formattedDate}</p>
        </div>

        <Card className="overflow-visible">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white">
            <CardTitle className="flex items-center gap-2">
              {selectedMode === 'APRU_1b' ? (
                <Clock className="w-5 h-5" />
              ) : (
                <BookOpen className="w-5 h-5" />
              )}
              {modes.find(m => m.id === selectedMode)?.name} - Visão Geral
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
              <div className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Cronograma Semanal
                </h3>
                {weeklySchedule.length > 0 ? (
                  <div className="space-y-4">
                    {weeklySchedule.map((daySchedule, index) => (
                      <div key={index} className="border-l-2 border-primary pl-3">
                        <h4 className="font-medium text-gray-800">{daySchedule.day}</h4>
                        <ul className="mt-2 space-y-2">
                          {daySchedule.subjects.map((subject, subIndex) => (
                            <li key={subIndex} className="flex items-center gap-2 text-sm">
                              <span className="w-16 text-gray-500">{subject.time}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                                {subject.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>Não há horários definidos para esta semana.</p>
                    <p className="text-sm mt-1">Adicione matérias ao seu cronograma.</p>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Metas Diárias
                </h3>
                {dailyGoals.length > 0 ? (
                  <ul className="space-y-3">
                    {dailyGoals.map((goal, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          goal.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {goal.completed ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Circle className="w-3 h-3" />
                          )}
                        </div>
                        <span className={`text-sm ${goal.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                          {goal.goal}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>Não há metas definidas para hoje.</p>
                    <p className="text-sm mt-1">Adicione metas para acompanhar seu progresso.</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 p-6 pt-0">
            <Button className="w-full sm:w-auto" onClick={handleSavePlan}>
              Salvar Grade
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleEditPlan}>
              Revisar Grade
            </Button>
            <Button variant="ghost" className="w-full sm:w-auto">
              <Calendar className="w-4 h-4 mr-2" />
              Exportar para Calendário
            </Button>
          </CardFooter>
        </Card>

        {selectedMode === 'APRU_REASONING' && (
          <Card>
            <CardHeader>
              <CardTitle>Recomendações de Estudo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">{rec.title}</h4>
                    <p className="text-sm text-gray-700">{rec.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>Não há recomendações disponíveis no momento.</p>
                  <p className="text-sm mt-1">Complete mais questionários para receber recomendações personalizadas.</p>
                </div>
              )}
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium mb-2">Dica de Revisão</h4>
                <p className="text-sm text-gray-700">
                  Reserve 30 minutos no final de cada semana para revisar o conteúdo estudado. 
                  Isso ajuda a consolidar o aprendizado e identificar pontos que precisam de mais atenção.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    );
  };

  const currentQuestion = step > 0 ? initialQuestions[step - 1] : null;

  return (
    <>
      {/* Loading Screen da IA */}
      <APRULoadingScreen 
        mode={selectedMode}
        isVisible={isGeneratingWithAI}
      />
      
      {/* Tela de Erro da IA */}
      <AIErrorScreen 
        isVisible={showAIError}
        onRetry={handleRetryGeneration}
        onContactSupport={handleContactSupport}
      />
      
      <div className="container mx-auto p-4 max-w-3xl">
        <motion.h1 
          className="text-2xl md:text-3xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Grade de Estudos com IA
        </motion.h1>

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="mode-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-center text-xl">Escolha o Modo de Estudo</CardTitle>
                <p className="text-sm text-center text-gray-500">
                  Selecione o tipo de plano que melhor atende às suas necessidades
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {modes.map(mode => (
                    <motion.div
                      key={mode.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={selectedMode === mode.id ? 'default' : 'outline'}
                        className={`w-full h-auto p-6 text-left flex flex-col items-start transition-all ${mode.color} ${selectedMode === mode.id ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                        onClick={() => handleModeSelect(mode.id)}
                      >
                        <div className="flex items-center mb-2">
                          {mode.icon}
                          <span className="font-bold text-lg">{mode.name}</span>
                        </div>
                        <span className="text-sm">{mode.description}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center pt-6">
                <Button 
                  onClick={() => setStep(1)}
                  className="px-8 py-3"
                  disabled={!selectedMode}
                >
                  Começar Questionário
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Não tem certeza? Escolha <span className="font-medium">APRU 1b</span> para começar rapidamente ou 
                <span className="font-medium"> APRU REASONING</span> para uma análise mais detalhada.
              </p>
            </div>
          </motion.div>
        ) : !isGenerated && step > 0 && step <= initialQuestions.length ? (
          <motion.div
            key={`question-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Pergunta {step} de {initialQuestions.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(progress)}% completo
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Card className="overflow-visible border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {currentQuestion?.icon}
                  {currentQuestion?.text}
                </CardTitle>
                {currentQuestion?.description && (
                  <p className="text-sm text-gray-500">{currentQuestion.description}</p>
                )}
              </CardHeader>
              <CardContent>
                {currentQuestion && renderQuestion(currentQuestion)}
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  className="gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
                <Button 
                  onClick={handleNext} 
                  disabled={currentQuestion && currentQuestion.required && !isAnswerValid(currentQuestion)}
                  className="gap-1"
                >
                  {step === initialQuestions.length ? 'Gerar Grade' : 'Próximo'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          renderGeneratedPlan()
        )}
      </AnimatePresence>
      </div>
    </>
  );
};

export default StudyPlanGenerator;
