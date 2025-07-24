import React, { useState } from 'react';
import { Brain, Zap, AlertTriangle, BookOpen, Cpu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ExerciseGeneratorProps {
  onGenerate: (subject: string, difficulty: 'easy' | 'medium' | 'hard', mode: 'APRU_1b' | 'APRU_REASONING') => void;
  isLoading: boolean;
  hasUnlimitedAccess: boolean;
  remainingRequests: number;
}

const SUBJECTS = [
  { value: 'matematica', label: 'Matemática', icon: '📐' },
  { value: 'portugues', label: 'Português', icon: '📚' },
  { value: 'fisica', label: 'Física', icon: '⚛️' },
  { value: 'quimica', label: 'Química', icon: '🧪' },
  { value: 'biologia', label: 'Biologia', icon: '🧬' },
  { value: 'historia', label: 'História', icon: '🏛️' },
  { value: 'geografia', label: 'Geografia', icon: '🌍' },
  { value: 'filosofia', label: 'Filosofia', icon: '🤔' },
  { value: 'sociologia', label: 'Sociologia', icon: '👥' },
  { value: 'literatura', label: 'Literatura', icon: '📖' },
  { value: 'ingles', label: 'Inglês', icon: '🇺🇸' },
  { value: 'espanhol', label: 'Espanhol', icon: '🇪🇸' }
];

const DIFFICULTIES = [
  { 
    value: 'easy', 
    label: 'Fácil', 
    description: 'Questões básicas e conceituais',
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  { 
    value: 'medium', 
    label: 'Médio', 
    description: 'Questões de aplicação e análise',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  { 
    value: 'hard', 
    label: 'Difícil', 
    description: 'Questões complexas e interdisciplinares',
    color: 'bg-red-100 text-red-800 border-red-200'
  }
];

const APRU_MODES = [
  {
    value: 'APRU_1b',
    label: 'APRU 1b',
    description: 'Geração rápida e eficiente',
    icon: Zap,
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    value: 'APRU_REASONING',
    label: 'APRU REASONING',
    description: 'Análise profunda e detalhada',
    icon: Brain,
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  }
];

export const ExerciseGenerator: React.FC<ExerciseGeneratorProps> = ({
  onGenerate,
  isLoading,
  hasUnlimitedAccess,
  remainingRequests
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [selectedMode, setSelectedMode] = useState<'APRU_1b' | 'APRU_REASONING'>('APRU_1b');

  const handleGenerate = () => {
    if (!selectedSubject) return;
    onGenerate(selectedSubject, selectedDifficulty, selectedMode);
  };

  const canGenerate = hasUnlimitedAccess || remainingRequests > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Limite de uso */}
        {!hasUnlimitedAccess && (
          <Alert className={remainingRequests <= 3 ? "border-orange-200 bg-orange-50" : ""}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {remainingRequests > 0 ? (
                <>Você tem <strong>{remainingRequests}</strong> exercícios restantes hoje.</>
              ) : (
                <>Limite diário atingido. Volte amanhã para mais exercícios!</>
              )}
            </AlertDescription>
          </Alert>
        )}

        {hasUnlimitedAccess && (
          <Alert className="border-blue-200 bg-blue-50">
            <Zap className="h-4 w-4" />
            <AlertDescription>
              <strong>Acesso Ilimitado</strong> - Você pode gerar quantos exercícios quiser!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seleção de Modo APRU */}
          <Card className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span>Modo APRU</span>
                  <p className="text-sm font-normal text-slate-600 dark:text-slate-400">Escolha o estilo de geração</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {APRU_MODES.map((mode) => {
                const IconComponent = mode.icon;
                return (
                  <div
                    key={mode.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedMode === mode.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedMode(mode.value as 'APRU_1b' | 'APRU_REASONING')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <div>
                          <div className="font-medium text-sm">{mode.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {mode.description}
                          </div>
                        </div>
                      </div>
                      <Badge className={mode.color}>
                        {mode.value === 'APRU_1b' ? '⚡' : '🧠'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Seleção de Matéria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Escolha a Matéria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma matéria" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject.value} value={subject.value}>
                      <div className="flex items-center gap-2">
                        <span>{subject.icon}</span>
                        <span>{subject.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedSubject && (
                <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {SUBJECTS.find(s => s.value === selectedSubject)?.icon}
                    </span>
                    <span className="font-medium">
                      {SUBJECTS.find(s => s.value === selectedSubject)?.label}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seleção de Dificuldade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Nível de Dificuldade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {DIFFICULTIES.map((difficulty) => (
                <div
                  key={difficulty.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedDifficulty === difficulty.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDifficulty(difficulty.value as 'easy' | 'medium' | 'hard')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{difficulty.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {difficulty.description}
                      </div>
                    </div>
                    <Badge className={difficulty.color}>
                      {difficulty.label}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Informações sobre o exercício */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200/50 text-slate-800 dark:text-slate-200 px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Exercícios Personalizados com IA
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-100 bg-clip-text text-transparent mb-4">
                  Gere Seu Exercício Personalizado
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                  Escolha a matéria, dificuldade e modo APRU para gerar questões únicas 
                  baseadas nos principais vestibulares brasileiros com inteligência artificial avançada.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline">✅ Questões originais</Badge>
                <Badge variant="outline">🎯 Padrão vestibular</Badge>
                <Badge variant="outline">
                  {selectedMode === 'APRU_1b' ? '⚡ Geração rápida' : '🧠 Análise profunda'}
                </Badge>
                <Badge variant="outline">📝 Explicação detalhada</Badge>
                <Badge variant="outline">⏱️ Tempo cronometrado</Badge>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!selectedSubject || !canGenerate || isLoading}
                size="lg"
                className="w-full max-w-md"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Gerando com {selectedMode === 'APRU_1b' ? 'APRU 1b' : 'APRU REASONING'}...
                  </>
                ) : (
                  <>
                    {selectedMode === 'APRU_1b' ? (
                      <Zap className="h-5 w-5 mr-2" />
                    ) : (
                      <Brain className="h-5 w-5 mr-2" />
                    )}
                    Gerar com {selectedMode === 'APRU_1b' ? 'APRU 1b' : 'APRU REASONING'}
                  </>
                )}
              </Button>

              {!canGenerate && (
                <p className="text-sm text-muted-foreground">
                  Limite diário atingido. Volte amanhã para mais exercícios!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
