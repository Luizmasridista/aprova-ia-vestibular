import { supabase } from '@/lib/supabase';
import { aiService } from '../lib/services/aiService';

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
  id: string;
  exercise_id: string;
  user_id: string;
  user_answer: string;
  is_correct: boolean;
  time_spent: number;
  created_at: string;
}

export interface UserStats {
  totalRequests: number;
  remainingRequests: number;
  totalAnswered: number;
  correctAnswers: number;
  accuracy: number;
}

class ExerciseService {
  private readonly DAILY_LIMIT = 10;
  private readonly UNLIMITED_USER = 'luizeduardocdn@gmail.com';

  /**
   * Gera um novo exercício usando IA
   */
  async generateExercise(
    userId: string, 
    subject: string, 
    difficulty: 'easy' | 'medium' | 'hard',
    mode: 'APRU_1b' | 'APRU_REASONING' = 'APRU_1b'
  ): Promise<Exercise> {
    try {
      // Verificar limite de uso
      const canGenerate = await this.checkUsageLimit(userId);
      if (!canGenerate) {
        throw new Error('Limite diário de exercícios atingido');
      }

      // Gerar exercício com IA
      const exerciseData = await this.generateExerciseWithAI(subject, difficulty, mode);

      // Salvar no banco de dados
      const { data: exercise, error } = await supabase
        .from('exercise_sessions')
        .insert({
          user_id: userId,
          subject,
          difficulty,
          question: exerciseData.question,
          options: exerciseData.options,
          correct_answer: exerciseData.correct_answer,
          explanation: exerciseData.explanation,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar exercício:', error);
        throw new Error('Erro ao salvar exercício no banco de dados');
      }

      // Atualizar contador de uso
      await this.updateUsageLimit(userId);

      return {
        id: exercise.id,
        subject: exercise.subject,
        difficulty: exercise.difficulty,
        question: exercise.question,
        options: exercise.options,
        correct_answer: exercise.correct_answer,
        explanation: exercise.explanation,
        created_at: exercise.created_at
      };

    } catch (error) {
      console.error('Erro ao gerar exercício:', error);
      throw error;
    }
  }

  /**
   * Submete resposta do usuário
   */
  async submitAnswer(userId: string, exerciseId: string, userAnswer: string, timeSpent: number): Promise<ExerciseResult> {
    try {
      // Buscar exercício para verificar resposta correta
      const { data: exercise, error: exerciseError } = await supabase
        .from('exercise_sessions')
        .select('correct_answer')
        .eq('id', exerciseId)
        .single();

      if (exerciseError || !exercise) {
        throw new Error('Exercício não encontrado');
      }

      const isCorrect = userAnswer === exercise.correct_answer;

      // Salvar resultado
      const { data: result, error } = await supabase
        .from('exercise_results')
        .insert({
          exercise_id: exerciseId,
          user_id: userId,
          user_answer: userAnswer,
          is_correct: isCorrect,
          time_spent: timeSpent
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar resultado:', error);
        throw new Error('Erro ao salvar resultado');
      }

      // Atualizar status do exercício
      await supabase
        .from('exercise_sessions')
        .update({ status: 'completed' })
        .eq('id', exerciseId);

      return {
        id: result.id,
        exercise_id: result.exercise_id,
        user_id: result.user_id,
        user_answer: result.user_answer,
        is_correct: result.is_correct,
        time_spent: result.time_spent,
        created_at: result.created_at
      };

    } catch (error) {
      console.error('Erro ao submeter resposta:', error);
      throw error;
    }
  }

  /**
   * Busca estatísticas do usuário
   */
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Buscar dados de uso
      const { data: usageData } = await supabase
        .from('exercise_usage_limits')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Buscar estatísticas de resultados
      const { data: results } = await supabase
        .from('exercise_results')
        .select('is_correct')
        .eq('user_id', userId);

      const totalAnswered = results?.length || 0;
      const correctAnswers = results?.filter(r => r.is_correct).length || 0;
      const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

      const totalRequests = usageData?.total_requests || 0;
      const remainingRequests = Math.max(0, this.DAILY_LIMIT - (usageData?.daily_requests || 0));

      return {
        totalRequests,
        remainingRequests,
        totalAnswered,
        correctAnswers,
        accuracy
      };

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        totalRequests: 0,
        remainingRequests: this.DAILY_LIMIT,
        totalAnswered: 0,
        correctAnswers: 0,
        accuracy: 0
      };
    }
  }

  /**
   * Busca histórico de exercícios do usuário
   */
  async getExerciseHistory(userId: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('exercise_sessions')
        .select(`
          *,
          exercise_results (
            user_answer,
            is_correct,
            time_spent,
            created_at
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erro ao buscar histórico:', error);
        return [];
      }

      return data || [];

    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      return [];
    }
  }

  /**
   * Verifica se usuário pode gerar novo exercício
   */
  private async checkUsageLimit(userId: string): Promise<boolean> {
    try {
      // Verificar se é usuário com acesso ilimitado
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user?.email === this.UNLIMITED_USER) {
        return true;
      }

      // Buscar dados de uso do dia atual
      const today = new Date().toISOString().split('T')[0];
      
      const { data: usageData } = await supabase
        .from('exercise_usage_limits')
        .select('daily_requests, last_request_date')
        .eq('user_id', userId)
        .single();

      if (!usageData) {
        // Primeiro uso do usuário
        return true;
      }

      // Se é um novo dia, resetar contador
      if (usageData.last_request_date !== today) {
        return true;
      }

      // Verificar se ainda tem requisições disponíveis
      return (usageData.daily_requests || 0) < this.DAILY_LIMIT;

    } catch (error) {
      console.error('Erro ao verificar limite:', error);
      return false;
    }
  }

  /**
   * Atualiza contador de uso
   */
  private async updateUsageLimit(userId: string): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Buscar registro existente
      const { data: existingData } = await supabase
        .from('exercise_usage_limits')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!existingData) {
        // Criar novo registro
        await supabase
          .from('exercise_usage_limits')
          .insert({
            user_id: userId,
            daily_requests: 1,
            total_requests: 1,
            last_request_date: today
          });
      } else {
        // Atualizar registro existente
        const isNewDay = existingData.last_request_date !== today;
        const dailyRequests = isNewDay ? 1 : (existingData.daily_requests || 0) + 1;
        const totalRequests = (existingData.total_requests || 0) + 1;

        await supabase
          .from('exercise_usage_limits')
          .update({
            daily_requests: dailyRequests,
            total_requests: totalRequests,
            last_request_date: today
          })
          .eq('user_id', userId);
      }

    } catch (error) {
      console.error('Erro ao atualizar limite:', error);
    }
  }

  /**
   * Gera exercício usando IA
   */
  private async generateExerciseWithAI(subject: string, difficulty: 'easy' | 'medium' | 'hard', mode: 'APRU_1b' | 'APRU_REASONING'): Promise<{
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
  }> {
    try {
      const prompt = this.buildExercisePrompt(subject, difficulty, mode);
      const aiContent = await aiService.generateContent(prompt);
        
      // Tentar extrair JSON da resposta
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Resposta da IA não contém JSON válido');
      }

      const exerciseData = JSON.parse(jsonMatch[0]);

      // Validar estrutura
      if (!exerciseData.question || !exerciseData.options || !exerciseData.correct_answer || !exerciseData.explanation) {
        throw new Error('Estrutura de resposta inválida');
      }

      if (exerciseData.options.length !== 5) {
        throw new Error('Número incorreto de opções');
      }

      return exerciseData;

    } catch (error) {
      console.error('Erro ao gerar exercício com IA:', error);
      
      // Fallback com exercício padrão
      return this.getFallbackExercise(subject, difficulty);
    }
  }

  private buildExercisePrompt(subject: string, difficulty: 'easy' | 'medium' | 'hard', mode: 'APRU_1b' | 'APRU_REASONING'): string {
    const difficultyMap = {
      easy: 'fácil (nível fundamental)',
      medium: 'médio (nível intermediário)', 
      hard: 'difícil (nível avançado)'
    };

    const modeInstructions = {
      APRU_1b: `
MODO: APRU 1b - Geração Rápida e Eficiente
- Foque na clareza e objetividade
- Questão direta e bem estruturada
- Explicação concisa mas completa
- Otimize para rapidez na geração`,
      APRU_REASONING: `
MODO: APRU REASONING - Análise Profunda e Detalhada
- Desenvolva raciocínio complexo e interdisciplinar
- Questão que exija análise crítica e síntese
- Explicação detalhada com múltiplas perspectivas
- Conecte conceitos e promova pensamento crítico`
    };

    return `
Você é um especialista em educação e vestibulares brasileiros. Crie uma questão de múltipla escolha sobre ${subject} com nível de dificuldade ${difficultyMap[difficulty]}.

A questão deve seguir rigorosamente o padrão dos principais vestibulares brasileiros (UFRGS, USP, UNICAMP, ENEM, etc.).
${modeInstructions[mode]}

Formato da resposta (JSON):
{
  "question": "Enunciado da questão",
  "options": ["A) Opção 1", "B) Opção 2", "C) Opção 3", "D) Opção 4", "E) Opção 5"],
  "correct_answer": "A) Opção 1",
  "explanation": "Explicação didática da resposta"
}

Requisitos:
- Questão clara e bem formulada
- 5 alternativas (A, B, C, D, E)
- Apenas uma resposta correta
- Explicação didática da resposta
- Nível adequado ao vestibular
- Conteúdo factualmente correto
`;
  }

  /**
   * Exercício de fallback em caso de erro na IA
   */
  private getFallbackExercise(subject: string, difficulty: string) {
    return {
      question: `Questão de ${subject} (nível ${difficulty}) - Esta é uma questão de exemplo gerada automaticamente.`,
      options: [
        "A) Primeira opção",
        "B) Segunda opção",
        "C) Terceira opção (correta)",
        "D) Quarta opção",
        "E) Quinta opção"
      ],
      correct_answer: "C) Terceira opção (correta)",
      explanation: "Esta é uma questão de exemplo. A resposta correta é a opção C por ser marcada como tal no sistema de fallback."
    };
  }
}

export const exerciseService = new ExerciseService();
