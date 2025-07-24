import { supabase } from '../supabase';

export interface MonthlyGoal {
  id?: string;
  user_id: string;
  study_plan_id?: string;
  month: string; // YYYY-MM format
  study_hours_target: number;
  events_target: number;
  streak_target: number;
  intensity: 'low' | 'medium' | 'high' | 'intensive';
  reasoning: string;
  created_at?: string;
  updated_at?: string;
}

export interface MonthlyGoalRequest {
  userId: string;
  studyPlanId?: string;
  targetCourse: string;
  targetDate: string;
  hoursPerDay: number;
  mode: 'APRU_1b' | 'APRU_REASONING';
}

class MonthlyGoalsService {
  /**
   * Gera metas mensais personalizadas baseadas no plano de estudos
   */
  async generateMonthlyGoals(request: MonthlyGoalRequest): Promise<MonthlyGoal[]> {
    try {
      console.log('🎯 [MonthlyGoals] Gerando metas mensais para usuário:', request.userId);
      
      const now = new Date();
      const targetDate = new Date(request.targetDate);
      const monthsUntilTarget = Math.max(1, Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)));
      
      // Determinar intensidade baseada no tempo e curso
      const intensity = this.calculateIntensity(request.targetCourse, monthsUntilTarget, request.hoursPerDay);
      
      // Calcular metas baseadas na intensidade
      const goals = this.calculateGoalsByIntensity(intensity, request.hoursPerDay);
      
      // Gerar metas para os próximos meses até a data alvo
      const monthlyGoals: MonthlyGoal[] = [];
      
      for (let i = 0; i < monthsUntilTarget; i++) {
        const goalMonth = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const monthString = `${goalMonth.getFullYear()}-${String(goalMonth.getMonth() + 1).padStart(2, '0')}`;
        
        // Ajustar metas conforme proximidade da prova
        const proximityMultiplier = this.getProximityMultiplier(i, monthsUntilTarget);
        
        const monthlyGoal: MonthlyGoal = {
          user_id: request.userId,
          study_plan_id: request.studyPlanId,
          month: monthString,
          study_hours_target: Math.round(goals.studyHours * proximityMultiplier),
          events_target: Math.round(goals.events * proximityMultiplier),
          streak_target: goals.streak,
          intensity,
          reasoning: this.generateReasoning(intensity, request.targetCourse, monthsUntilTarget - i, request.mode)
        };
        
        monthlyGoals.push(monthlyGoal);
      }
      
      console.log(`✅ [MonthlyGoals] Geradas ${monthlyGoals.length} metas mensais com intensidade ${intensity}`);
      return monthlyGoals;
      
    } catch (error) {
      console.error('❌ [MonthlyGoals] Erro ao gerar metas mensais:', error);
      throw error;
    }
  }

  /**
   * Salva metas mensais no banco de dados
   */
  async saveMonthlyGoals(goals: MonthlyGoal[]): Promise<MonthlyGoal[]> {
    try {
      console.log('💾 [MonthlyGoals] Salvando metas mensais no banco...');
      
      const { data, error } = await supabase
        .from('monthly_goals')
        .insert(goals)
        .select();

      if (error) {
        console.error('❌ [MonthlyGoals] Erro ao salvar metas:', error);
        throw error;
      }

      console.log(`✅ [MonthlyGoals] ${data.length} metas salvas com sucesso`);
      return data;
      
    } catch (error) {
      console.error('❌ [MonthlyGoals] Erro ao salvar metas mensais:', error);
      throw error;
    }
  }

  /**
   * Busca metas mensais do usuário
   */
  async getUserMonthlyGoals(userId: string, month?: string): Promise<MonthlyGoal[]> {
    try {
      let query = supabase
        .from('monthly_goals')
        .select('*')
        .eq('user_id', userId);

      if (month) {
        query = query.eq('month', month);
      }

      const { data, error } = await query.order('month', { ascending: true });

      if (error) throw error;
      return data || [];
      
    } catch (error) {
      console.error('❌ [MonthlyGoals] Erro ao buscar metas:', error);
      return [];
    }
  }



  /**
   * Calcula intensidade baseada no curso, tempo e disponibilidade
   */
  private calculateIntensity(
    targetCourse: string, 
    monthsUntilTarget: number, 
    hoursPerDay: number
  ): 'low' | 'medium' | 'high' | 'intensive' {
    let intensityScore = 0;
    
    // Fator tempo (40% do peso)
    if (monthsUntilTarget <= 3) intensityScore += 4; // 3 meses ou menos
    else if (monthsUntilTarget <= 6) intensityScore += 3; // 6 meses ou menos
    else if (monthsUntilTarget <= 12) intensityScore += 2; // 1 ano ou menos
    else intensityScore += 1; // mais de 1 ano
    
    // Fator competitividade do curso (30% do peso)
    const course = targetCourse.toLowerCase();
    if (course.includes('medicina') || course.includes('direito') || 
        course.includes('engenharia') || course.includes('usp') || 
        course.includes('unicamp') || course.includes('federal')) {
      intensityScore += 3;
    } else if (course.includes('administração') || course.includes('economia') || 
               course.includes('psicologia')) {
      intensityScore += 2;
    } else {
      intensityScore += 1;
    }
    
    // Fator disponibilidade (30% do peso)
    if (hoursPerDay >= 8) intensityScore += 3;
    else if (hoursPerDay >= 6) intensityScore += 2.5;
    else if (hoursPerDay >= 4) intensityScore += 2;
    else if (hoursPerDay >= 2) intensityScore += 1.5;
    else intensityScore += 1;
    
    // Determinar intensidade final
    if (intensityScore >= 9) return 'intensive';
    if (intensityScore >= 7) return 'high';
    if (intensityScore >= 5) return 'medium';
    return 'low';
  }

  /**
   * Calcula metas baseadas na intensidade
   */
  private calculateGoalsByIntensity(intensity: string, hoursPerDay: number) {
    const baseHours = hoursPerDay * 30; // horas por mês
    
    switch (intensity) {
      case 'intensive':
        return {
          studyHours: Math.round(baseHours * 1.2),
          events: 35,
          streak: 25
        };
      case 'high':
        return {
          studyHours: Math.round(baseHours * 1.1),
          events: 28,
          streak: 20
        };
      case 'medium':
        return {
          studyHours: baseHours,
          events: 20,
          streak: 15
        };
      case 'low':
      default:
        return {
          studyHours: Math.round(baseHours * 0.8),
          events: 15,
          streak: 10
        };
    }
  }

  /**
   * Calcula multiplicador baseado na proximidade da prova
   */
  private getProximityMultiplier(monthIndex: number, totalMonths: number): number {
    const proximityRatio = (totalMonths - monthIndex) / totalMonths;
    
    // Aumenta gradualmente conforme se aproxima da prova
    if (proximityRatio <= 0.25) return 1.3; // último quartil - intensificar
    if (proximityRatio <= 0.5) return 1.2;  // terceiro quartil
    if (proximityRatio <= 0.75) return 1.1; // segundo quartil
    return 1.0; // primeiro quartil - ritmo normal
  }

  /**
   * Gera raciocínio personalizado para as metas
   */
  private generateReasoning(
    intensity: string, 
    targetCourse: string, 
    monthsRemaining: number,
    mode: string
  ): string {
    const courseType = this.getCourseType(targetCourse);
    const modeText = mode === 'APRU_1b' ? 'configuração rápida' : 'análise detalhada';
    
    const reasoningMap = {
      intensive: `Ritmo intensivo para ${courseType}. Com ${monthsRemaining} meses restantes, é crucial manter foco total e disciplina máxima. ${modeText} otimizada para resultados.`,
      high: `Ritmo acelerado para ${courseType}. ${monthsRemaining} meses exigem dedicação consistente e estratégia bem definida. ${modeText} para máxima eficiência.`,
      medium: `Ritmo equilibrado para ${courseType}. ${monthsRemaining} meses permitem construção sólida de conhecimento. ${modeText} balanceada.`,
      low: `Ritmo inicial para ${courseType}. ${monthsRemaining} meses oferecem tempo para desenvolvimento gradual. ${modeText} focada em fundamentos.`
    };
    
    return reasoningMap[intensity as keyof typeof reasoningMap] || reasoningMap.medium;
  }

  /**
   * Determina tipo do curso para personalização
   */
  private getCourseType(targetCourse: string): string {
    const course = targetCourse.toLowerCase();
    
    if (course.includes('medicina')) return 'Medicina (alta concorrência)';
    if (course.includes('direito')) return 'Direito (alta concorrência)';
    if (course.includes('engenharia')) return 'Engenharia (exatas intensivas)';
    if (course.includes('administração')) return 'Administração (gestão)';
    if (course.includes('psicologia')) return 'Psicologia (humanas)';
    
    return 'seu curso alvo';
  }

  /**
   * Atualizar progresso das metas mensais
   */
  async updateMonthlyProgress(userId: string, progressData: {
    studyHours?: number;
    eventsCompleted?: number;
    currentStreak?: number;
  }): Promise<void> {
    try {
      const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
      
      console.log('📈 [MonthlyGoalsService] Atualizando progresso das metas:', {
        userId,
        month: currentMonth,
        progressData
      });

      const updateData: Record<string, string | number> = {
        updated_at: new Date().toISOString()
      };

      if (progressData.studyHours !== undefined) {
        updateData.study_hours_current = Math.round(progressData.studyHours);
      }

      if (progressData.eventsCompleted !== undefined) {
        updateData.events_current = progressData.eventsCompleted;
      }

      if (progressData.currentStreak !== undefined) {
        updateData.streak_current = progressData.currentStreak;
      }

      const { error } = await supabase
        .from('monthly_goals')
        .update(updateData)
        .eq('user_id', userId)
        .eq('month', currentMonth);

      if (error) {
        console.error('❌ [MonthlyGoalsService] Erro ao atualizar progresso:', error);
        throw error;
      }

      console.log('✅ [MonthlyGoalsService] Progresso das metas atualizado com sucesso');
    } catch (error) {
      console.error('❌ [MonthlyGoalsService] Erro ao atualizar progresso das metas:', error);
      throw error;
    }
  }
}

export const monthlyGoalsService = new MonthlyGoalsService();
