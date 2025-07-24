import React from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Calendar, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ExerciseHistoryItem {
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
}

interface ExerciseHistoryProps {
  history: ExerciseHistoryItem[];
  onBack: () => void;
}

export const ExerciseHistory: React.FC<ExerciseHistoryProps> = ({
  history,
  onBack
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return difficulty;
    }
  };

  const getSubjectIcon = (subject: string) => {
    const icons: { [key: string]: string } = {
      matematica: '📐',
      portugues: '📚',
      fisica: '⚛️',
      quimica: '🧪',
      biologia: '🧬',
      historia: '🏛️',
      geografia: '🌍',
      filosofia: '🤔',
      sociologia: '👥',
      literatura: '📖',
      ingles: '🇺🇸',
      espanhol: '🇪🇸'
    };
    return icons[subject] || '📝';
  };

  const getSubjectLabel = (subject: string) => {
    const labels: { [key: string]: string } = {
      matematica: 'Matemática',
      portugues: 'Português',
      fisica: 'Física',
      quimica: 'Química',
      biologia: 'Biologia',
      historia: 'História',
      geografia: 'Geografia',
      filosofia: 'Filosofia',
      sociologia: 'Sociologia',
      literatura: 'Literatura',
      ingles: 'Inglês',
      espanhol: 'Espanhol'
    };
    return labels[subject] || subject;
  };

  const calculateStats = () => {
    if (history.length === 0) return { total: 0, correct: 0, accuracy: 0 };
    
    const answered = history.filter(item => item.exercise_results?.length > 0);
    const correct = answered.filter(item => 
      item.exercise_results[0]?.is_correct
    ).length;
    
    return {
      total: answered.length,
      correct,
      accuracy: answered.length > 0 ? Math.round((correct / answered.length) * 100) : 0
    };
  };

  const stats = calculateStats();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-lg font-semibold">Histórico de Exercícios</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Exercícios Respondidos</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{stats.correct}</div>
            <div className="text-sm text-muted-foreground">Respostas Corretas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">{stats.accuracy}%</div>
            <div className="text-sm text-muted-foreground">Taxa de Acerto</div>
          </CardContent>
        </Card>
      </div>

      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Exercícios Realizados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Nenhum exercício realizado</h3>
              <p className="text-muted-foreground">
                Comece gerando seu primeiro exercício!
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {history.map((item, index) => {
                  const result = item.exercise_results?.[0];
                  const isAnswered = !!result;
                  
                  return (
                    <Card key={item.id} className="border-l-4 border-l-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Subject and Difficulty */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{getSubjectIcon(item.subject)}</span>
                              <span className="font-medium">{getSubjectLabel(item.subject)}</span>
                              <Badge className={getDifficultyColor(item.difficulty)}>
                                {getDifficultyLabel(item.difficulty)}
                              </Badge>
                            </div>

                            {/* Question Preview */}
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {item.question}
                            </p>

                            {/* Date */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(item.created_at)}</span>
                            </div>
                          </div>

                          {/* Result */}
                          <div className="text-right">
                            {isAnswered ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  {result.is_correct ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  )}
                                  <span className={`text-sm font-medium ${
                                    result.is_correct ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {result.is_correct ? 'Correto' : 'Incorreto'}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatTime(result.time_spent)}</span>
                                </div>
                              </div>
                            ) : (
                              <Badge variant="outline">Não respondido</Badge>
                            )}
                          </div>
                        </div>

                        {/* Answer Details */}
                        {isAnswered && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">Sua resposta:</span> {result.user_answer}
                            </div>
                            {!result.is_correct && (
                              <div className="text-xs text-muted-foreground">
                                <span className="font-medium">Resposta correta:</span> {item.correct_answer}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
