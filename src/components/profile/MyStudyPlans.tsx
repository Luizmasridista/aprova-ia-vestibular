import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  GraduationCap, 
  Building2, 
  Trash2, 
  Copy, 
  Eye, 
  AlertTriangle,
  BookOpen,
  Target,
  Timer,
  Brain
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { userStudyPlansService, StudyPlanSummary } from '@/lib/services/userStudyPlansService';

interface MyStudyPlansProps {
  className?: string;
}

const MyStudyPlans: React.FC<MyStudyPlansProps> = ({ className = "" }) => {
  const { user } = useAuth();
  const [studyPlans, setStudyPlans] = useState<StudyPlanSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  const [duplicatingPlanId, setDuplicatingPlanId] = useState<string | null>(null);

  // Carregar grades do usuário
  useEffect(() => {
    if (user?.id) {
      loadStudyPlans();
    }
  }, [user?.id]);

  const loadStudyPlans = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const plans = await userStudyPlansService.getUserStudyPlans(user.id);
      setStudyPlans(plans);
    } catch (error) {
      console.error('Erro ao carregar grades:', error);
      toast.error('Erro ao carregar suas grades de estudos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!user?.id) return;

    // Confirmação antes de excluir
    if (!confirm('Tem certeza que deseja excluir esta grade de estudos? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      setDeletingPlanId(planId);
      await userStudyPlansService.deleteStudyPlan(planId, user.id);
      
      // Remover da lista local
      setStudyPlans(prev => prev.filter(plan => plan.id !== planId));
      
      toast.success('Grade de estudos excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir grade:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir grade de estudos');
    } finally {
      setDeletingPlanId(null);
    }
  };

  const handleDuplicatePlan = async (planId: string) => {
    if (!user?.id) return;

    try {
      setDuplicatingPlanId(planId);
      const newPlanId = await userStudyPlansService.duplicateStudyPlan(planId, user.id);
      
      // Recarregar lista para incluir a nova grade
      await loadStudyPlans();
      
      toast.success('Grade de estudos duplicada com sucesso!');
    } catch (error) {
      console.error('Erro ao duplicar grade:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao duplicar grade de estudos');
    } finally {
      setDuplicatingPlanId(null);
    }
  };

  const getModeIcon = (mode: 'APRU_1b' | 'APRU_REASONING') => {
    return mode === 'APRU_1b' ? (
      <Clock className="w-4 h-4" />
    ) : (
      <Brain className="w-4 h-4" />
    );
  };

  const getModeColor = (mode: 'APRU_1b' | 'APRU_REASONING') => {
    return mode === 'APRU_1b' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  const getTargetDateStatus = (targetDate: string) => {
    const daysUntil = userStudyPlansService.getDaysUntilTarget(targetDate);
    
    if (daysUntil === null) return { color: 'bg-gray-100 text-gray-800', text: 'Data indefinida' };
    
    if (daysUntil < 0) return { color: 'bg-red-100 text-red-800', text: 'Expirado' };
    if (daysUntil === 0) return { color: 'bg-orange-100 text-orange-800', text: 'Hoje!' };
    if (daysUntil <= 7) return { color: 'bg-yellow-100 text-yellow-800', text: `${daysUntil} dias` };
    if (daysUntil <= 30) return { color: 'bg-blue-100 text-blue-800', text: `${daysUntil} dias` };
    
    return { color: 'bg-green-100 text-green-800', text: `${daysUntil} dias` };
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Minhas Agendas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Carregando suas grades...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (studyPlans.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Minhas Agendas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma grade encontrada
            </h3>
            <p className="text-gray-500 mb-4">
              Você ainda não criou nenhuma grade de estudos.
            </p>
            <Button onClick={() => window.location.href = '/study-plan'}>
              Criar Primeira Grade
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Minhas Agendas
          <Badge variant="secondary">{studyPlans.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AnimatePresence>
            {studyPlans.map((plan) => {
              const targetStatus = getTargetDateStatus(plan.target_date);
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Header com modo e data de criação */}
                      <div className="flex items-center gap-2">
                        <Badge className={getModeColor(plan.mode)}>
                          {getModeIcon(plan.mode)}
                          <span className="ml-1">{plan.mode}</span>
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Criado em {userStudyPlansService.formatDate(plan.created_at)}
                        </span>
                      </div>

                      {/* Informações principais */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{plan.target_course}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          <span>{plan.target_institution}</span>
                        </div>
                      </div>

                      {/* Data alvo e estatísticas */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            {userStudyPlansService.formatDate(plan.target_date)}
                          </span>
                          <Badge className={targetStatus.color}>
                            {targetStatus.text}
                          </Badge>
                        </div>
                      </div>

                      {/* Estatísticas da grade */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {plan.weeklyScheduleCount} cronogramas
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {plan.dailyGoalsCount} metas
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {plan.recommendationsCount} recomendações
                        </span>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicatePlan(plan.id)}
                        disabled={duplicatingPlanId === plan.id}
                        className="gap-1"
                      >
                        {duplicatingPlanId === plan.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        Duplicar
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePlan(plan.id)}
                        disabled={deletingPlanId === plan.id}
                        className="gap-1"
                      >
                        {deletingPlanId === plan.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        Excluir
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Botão para criar nova grade */}
        <div className="pt-4 border-t">
          <Button 
            onClick={() => window.location.href = '/study-plan'}
            className="w-full"
            variant="outline"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Criar Nova Grade de Estudos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyStudyPlans;
