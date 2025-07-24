import React, { useState, useEffect, useCallback } from 'react';
import { Brain, BookOpen, Target, Clock, CheckCircle, XCircle, RotateCcw, Sparkles, Infinity, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { exerciseService } from '../services/exerciseService';
import { ExerciseGenerator } from '../components/exercises/ExerciseGenerator';
import { ExerciseSession } from '../components/exercises/ExerciseSession';
import { ExerciseHistory } from '../components/exercises/ExerciseHistory';

export interface Exercise {
  id: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  created_at: string;
}

export interface ExerciseResult {
  exercise_id: string;
  user_answer: string;
  is_correct: boolean;
  time_spent: number;
}

const ExerciciosPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<'generator' | 'session' | 'history'>('generator');
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [exerciseHistory, setExerciseHistory] = useState<Array<{
    id: string;
    subject: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    created_at: string;
    exercise_results?: Array<{
      user_answer: string;
      is_correct: boolean;
      time_spent: number;
      created_at: string;
    }>;
  }>>([]);
  const [userStats, setUserStats] = useState({
    totalRequests: 0,
    remainingRequests: 10,
    totalAnswered: 0,
    correctAnswers: 0,
    accuracy: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Verificar se usuário tem limite ilimitado
  const hasUnlimitedAccess = user?.email === 'luizeduardocdn@gmail.com';

  const loadUserStats = useCallback(async () => {
    if (!user) return;
    try {
      const stats = await exerciseService.getUserStats(user.id);
      setUserStats(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }, [user]);

  const loadExerciseHistory = useCallback(async () => {
    if (!user) return;
    try {
      const history = await exerciseService.getExerciseHistory(user.id);
      setExerciseHistory(history);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserStats();
      loadExerciseHistory();
    }
  }, [user, loadUserStats, loadExerciseHistory]);

  const handleGenerateExercise = async (subject: string, difficulty: 'easy' | 'medium' | 'hard', mode: 'APRU_1b' | 'APRU_REASONING') => {
    if (!hasUnlimitedAccess && userStats.remainingRequests <= 0) {
      toast({
        title: "Limite atingido",
        description: "Você atingiu o limite de 10 exercícios. Tente novamente amanhã!",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const exercise = await exerciseService.generateExercise(user!.id, subject, difficulty, mode);
      setCurrentExercise(exercise);
      setCurrentView('session');
      await loadUserStats(); // Atualizar stats após gerar exercício
    } catch (error) {
      console.error('Erro ao gerar exercício:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o exercício. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = async (answer: string, timeSpent: number) => {
    if (!currentExercise) return;

    try {
      const result = await exerciseService.submitAnswer(
        user!.id,
        currentExercise.id,
        answer,
        timeSpent
      );

      // Mostrar resultado
      const isCorrect = result.is_correct;
      toast({
        title: isCorrect ? "Correto! 🎉" : "Incorreto 😔",
        description: isCorrect 
          ? "Parabéns! Você acertou a questão."
          : `A resposta correta era: ${currentExercise.correct_answer}`,
        variant: isCorrect ? "default" : "destructive"
      });

      // Atualizar stats e histórico
      await loadUserStats();
      await loadExerciseHistory();

      // Voltar para o gerador após 3 segundos
      setTimeout(() => {
        setCurrentView('generator');
        setCurrentExercise(null);
      }, 3000);

    } catch (error) {
      console.error('Erro ao submeter resposta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua resposta. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const renderHeader = () => (
    <div className="text-center space-y-6 mb-8">
      <div>
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          Exercícios Interativos
        </h1>
        <p className="text-muted-foreground text-lg">
          Pratique com questões geradas por IA baseadas nos principais vestibulares
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {hasUnlimitedAccess ? '∞' : userStats.remainingRequests}
            </div>
            <div className="text-sm text-muted-foreground">
              {hasUnlimitedAccess ? 'Ilimitado' : 'Restantes'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{userStats.totalAnswered}</div>
            <div className="text-sm text-muted-foreground">Respondidas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">{userStats.correctAnswers}</div>
            <div className="text-sm text-muted-foreground">Corretas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">{userStats.accuracy}%</div>
            <div className="text-sm text-muted-foreground">Precisão</div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-2">
        <Button
          variant={currentView === 'generator' ? 'default' : 'outline'}
          onClick={() => setCurrentView('generator')}
        >
          <Target className="h-4 w-4 mr-2" />
          Gerar Exercício
        </Button>
        <Button
          variant={currentView === 'history' ? 'default' : 'outline'}
          onClick={() => setCurrentView('history')}
        >
          <Clock className="h-4 w-4 mr-2" />
          Histórico
        </Button>
      </div>
    </div>
  );

  if (currentView === 'generator') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="container mx-auto p-6 space-y-8">
          {/* Header Moderno */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200/50 text-slate-800 dark:text-slate-200 px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Exercícios Interativos com IA
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-100 bg-clip-text text-transparent mb-4">
                Exercícios Interativos
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Pratique com questões personalizadas geradas por IA baseadas nos principais vestibulares brasileiros
              </p>
            </div>
          </div>

          {/* Estatísticas Modernas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl w-fit mx-auto mb-4 shadow-lg">
                  <Infinity className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  {hasUnlimitedAccess ? '∞' : userStats.remainingRequests}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {hasUnlimitedAccess ? 'Acesso Ilimitado' : 'Exercícios Restantes'}
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl w-fit mx-auto mb-4 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                  {userStats.totalAnswered}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Questões Respondidas</div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl w-fit mx-auto mb-4 shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {userStats.correctAnswers}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Respostas Corretas</div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" />
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl w-fit mx-auto mb-4 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                  {userStats.totalAnswered > 0 ? Math.round((userStats.correctAnswers / userStats.totalAnswered) * 100) : 0}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Taxa de Precisão</div>
              </CardContent>
            </Card>
          </div>

          {/* Botões de Ação Modernos */}
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button 
              onClick={() => setCurrentView('generator')}
              size="lg"
              className="relative px-12 py-4 text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white border-0 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl" />
              <Brain className="h-6 w-6 mr-3" />
              <span>Gerar Novo Exercício</span>
              <Sparkles className="h-5 w-5 ml-3 animate-pulse" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('history')}
              size="lg"
              className="px-12 py-4 text-lg font-bold border-2 border-slate-300 hover:border-slate-400 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Clock className="h-6 w-6 mr-3" />
              <span>Ver Histórico</span>
            </Button>
          </div>

          <ExerciseGenerator
            onGenerate={handleGenerateExercise}
            isLoading={isLoading}
            hasUnlimitedAccess={hasUnlimitedAccess}
            remainingRequests={userStats.remainingRequests}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'session') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <ExerciseSession
            exercise={currentExercise}
            onAnswerSubmit={handleAnswerSubmit}
            onBack={() => {
              setCurrentView('generator');
              setCurrentExercise(null);
            }}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'history') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <ExerciseHistory
            history={exerciseHistory}
            onBack={() => setCurrentView('generator')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {renderHeader()}

        {currentView === 'generator' && (
          <ExerciseGenerator
            onGenerate={handleGenerateExercise}
            isLoading={isLoading}
            hasUnlimitedAccess={hasUnlimitedAccess}
            remainingRequests={userStats.remainingRequests}
          />
        )}

        {currentView === 'session' && currentExercise && (
          <ExerciseSession
            exercise={currentExercise}
            onAnswerSubmit={handleAnswerSubmit}
            onBack={() => {
              setCurrentView('generator');
              setCurrentExercise(null);
            }}
          />
        )}

        {currentView === 'history' && (
          <ExerciseHistory
            history={exerciseHistory}
            onBack={() => setCurrentView('generator')}
          />
        )}
      </div>
    </div>
  );
};

export default ExerciciosPage;
