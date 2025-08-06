import { supabase } from '@/integrations/supabase/client';

export interface UserStudyPlan {
  id: string;
  user_id: string;
  mode: 'APRU_1b' | 'APRU_REASONING';
  target_course: string;
  target_institution: string;
  target_date: string;
  weekly_schedule: any;
  daily_goals: any;
  revision_suggestions: any;
  created_at: string;
  updated_at: string;
}

export interface StudyPlanSummary {
  id: string;
  mode: 'APRU_1b' | 'APRU_REASONING';
  target_course: string;
  target_institution: string;
  target_date: string;
  created_at: string;
  weeklyScheduleCount: number;
  dailyGoalsCount: number;
  recommendationsCount: number;
}

class UserStudyPlansService {
  /**
   * Buscar todas as grades de estudos do usuário
   */
  async getUserStudyPlans(userId: string): Promise<StudyPlanSummary[]> {
    try {
      console.log('🔍 [UserStudyPlansService] Buscando grades do usuário:', userId);

      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [UserStudyPlansService] Erro ao buscar grades:', error);
        throw new Error(`Erro ao buscar grades de estudos: ${error.message}`);
      }

      console.log('✅ [UserStudyPlansService] Grades encontradas:', data?.length || 0);

      // Transformar dados para o formato de resumo
      const summaries: StudyPlanSummary[] = (data || []).map(plan => ({
        id: plan.id,
        mode: plan.mode,
        target_course: plan.target_course || 'Curso não informado',
        target_institution: plan.target_institution || 'Instituição não informada',
        target_date: plan.target_date || '',
        created_at: plan.created_at,
        weeklyScheduleCount: Array.isArray(plan.weekly_schedule) ? plan.weekly_schedule.length : 0,
        dailyGoalsCount: Array.isArray(plan.daily_goals) ? plan.daily_goals.length : 0,
        recommendationsCount: Array.isArray(plan.revision_suggestions) ? plan.revision_suggestions.length : 0,
      }));

      return summaries;
    } catch (error) {
      console.error('❌ [UserStudyPlansService] Erro inesperado:', error);
      throw error;
    }
  }

  /**
   * Buscar uma grade específica por ID
   */
  async getStudyPlanById(planId: string, userId: string): Promise<UserStudyPlan | null> {
    try {
      console.log('🔍 [UserStudyPlansService] Buscando grade específica:', { planId, userId });

      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .eq('id', planId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('⚠️ [UserStudyPlansService] Grade não encontrada');
          return null;
        }
        console.error('❌ [UserStudyPlansService] Erro ao buscar grade:', error);
        throw new Error(`Erro ao buscar grade de estudos: ${error.message}`);
      }

      console.log('✅ [UserStudyPlansService] Grade encontrada:', data.id);
      return data;
    } catch (error) {
      console.error('❌ [UserStudyPlansService] Erro inesperado:', error);
      throw error;
    }
  }

  /**
   * Excluir uma grade de estudos
   */
  async deleteStudyPlan(planId: string, userId: string): Promise<boolean> {
    try {
      console.log('🗑️ [UserStudyPlansService] Excluindo grade:', { planId, userId });

      // Verificar se a grade pertence ao usuário antes de excluir
      const existingPlan = await this.getStudyPlanById(planId, userId);
      if (!existingPlan) {
        throw new Error('Grade de estudos não encontrada ou você não tem permissão para excluí-la');
      }

      const { error } = await supabase
        .from('study_plans')
        .delete()
        .eq('id', planId)
        .eq('user_id', userId);

      if (error) {
        console.error('❌ [UserStudyPlansService] Erro ao excluir grade:', error);
        throw new Error(`Erro ao excluir grade de estudos: ${error.message}`);
      }

      console.log('✅ [UserStudyPlansService] Grade excluída com sucesso:', planId);
      return true;
    } catch (error) {
      console.error('❌ [UserStudyPlansService] Erro inesperado:', error);
      throw error;
    }
  }

  /**
   * Duplicar uma grade de estudos
   */
  async duplicateStudyPlan(planId: string, userId: string): Promise<string> {
    try {
      console.log('📋 [UserStudyPlansService] Duplicando grade:', { planId, userId });

      const originalPlan = await this.getStudyPlanById(planId, userId);
      if (!originalPlan) {
        throw new Error('Grade de estudos não encontrada');
      }

      // Criar nova grade baseada na original
      const { data, error } = await supabase
        .from('study_plans')
        .insert({
          user_id: userId,
          mode: originalPlan.mode,
          target_course: originalPlan.target_course,
          target_institution: originalPlan.target_institution,
          target_date: originalPlan.target_date,
          weekly_schedule: originalPlan.weekly_schedule,
          daily_goals: originalPlan.daily_goals,
          revision_suggestions: originalPlan.revision_suggestions,
        })
        .select('id')
        .single();

      if (error) {
        console.error('❌ [UserStudyPlansService] Erro ao duplicar grade:', error);
        throw new Error(`Erro ao duplicar grade de estudos: ${error.message}`);
      }

      console.log('✅ [UserStudyPlansService] Grade duplicada com sucesso:', data.id);
      return data.id;
    } catch (error) {
      console.error('❌ [UserStudyPlansService] Erro inesperado:', error);
      throw error;
    }
  }

  /**
   * Formatar data para exibição
   */
  formatDate(dateString: string): string {
    if (!dateString) return 'Data não definida';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Data inválida';
    }
  }

  /**
   * Calcular dias restantes até a data alvo
   */
  getDaysUntilTarget(targetDate: string): number | null {
    if (!targetDate) return null;
    
    try {
      const target = new Date(targetDate);
      const today = new Date();
      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  }
}

export const userStudyPlansService = new UserStudyPlansService();
