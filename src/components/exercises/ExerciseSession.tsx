import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, ArrowLeft, Brain, Zap, Target, TrendingUp, Sparkles, Award, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Exercise } from '@/pages/Exercicios';

interface ExerciseSessionProps {
  exercise: Exercise;
  onAnswerSubmit: (answer: string, timeSpent: number) => void;
  onBack: () => void;
}

export const ExerciseSession: React.FC<ExerciseSessionProps> = ({
  exercise,
  onAnswerSubmit,
  onBack
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === exercise.correct_answer;
    setIsCorrect(correct);
    setIsSubmitted(true);
    setShowResult(true);

    // Submeter resposta
    onAnswerSubmit(selectedAnswer, timeSpent);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-lg">{formatTime(timeSpent)}</span>
          </div>
          
          <Badge className={getDifficultyColor(exercise.difficulty)}>
            {getDifficultyLabel(exercise.difficulty)}
          </Badge>
        </div>
      </div>

      {/* Exercise Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{getSubjectIcon(exercise.subject)}</span>
            <span>{getSubjectLabel(exercise.subject)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question */}
          <div className="p-6 bg-muted/30 rounded-lg">
            <p className="text-lg leading-relaxed whitespace-pre-wrap">
              {exercise.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {exercise.options.map((option, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedAnswer === option
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                } ${isSubmitted ? 'cursor-not-allowed' : ''}`}
                onClick={() => !isSubmitted && setSelectedAnswer(option)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === option
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === option && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          {!isSubmitted && (
            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                size="lg"
                className="w-full max-w-md"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Confirmar Resposta
              </Button>
            </div>
          )}

          {/* Result */}
          {showResult && (
            <Alert className={isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <div className="flex-1">
                  <div className="font-semibold">
                    {isCorrect ? '🎉 Parabéns! Resposta correta!' : '😔 Resposta incorreta'}
                  </div>
                  {!isCorrect && (
                    <div className="text-sm mt-1">
                      A resposta correta era: <strong>{exercise.correct_answer}</strong>
                    </div>
                  )}
                </div>
              </div>
            </Alert>
          )}

          {/* Explanation */}
          {showResult && exercise.explanation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-4 w-4 text-yellow-500" />
                  Explicação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed whitespace-pre-wrap">
                  {exercise.explanation}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          {showResult && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(timeSpent)}
                </div>
                <div className="text-sm text-muted-foreground">Tempo gasto</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {isCorrect ? '✓' : '✗'}
                </div>
                <div className="text-sm text-muted-foreground">Resultado</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {getDifficultyLabel(exercise.difficulty)}
                </div>
                <div className="text-sm text-muted-foreground">Dificuldade</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {getSubjectIcon(exercise.subject)}
                </div>
                <div className="text-sm text-muted-foreground">Matéria</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showResult && (
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Redirecionando para o gerador em alguns segundos...
          </p>
          <Button onClick={onBack} variant="outline">
            <Brain className="h-4 w-4 mr-2" />
            Gerar Novo Exercício
          </Button>
        </div>
      )}
      </div>
    </div>
  );
};
