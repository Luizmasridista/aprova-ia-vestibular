
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Plus, TrendingUp, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardStats } from '@/hooks/useDashboardData';

interface StudyOverviewProps {
  stats: DashboardStats;
  isLoading: boolean;
}

export const StudyOverview: React.FC<StudyOverviewProps> = ({ stats, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Visão Geral dos Estudos</CardTitle>
                <p className="text-sm text-gray-600">Acompanhe seu progresso e planos</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/study-plan')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Plano
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {stats.totalStudyPlans === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Nenhum plano de estudos</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Crie seu primeiro plano de estudos personalizado com IA para começar sua jornada
              </p>
              <Button
                onClick={() => navigate('/study-plan')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Plano
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalStudyPlans}</div>
                  <div className="text-sm font-medium text-blue-700">Planos Criados</div>
                </div>
                
                <div className="bg-green-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{stats.activeStudyPlans}</div>
                  <div className="text-sm font-medium text-green-700">Planos Ativos</div>
                </div>
                
                <div className="bg-orange-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{stats.completedStudyPlans}</div>
                  <div className="text-sm font-medium text-orange-700">Planos Concluídos</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">Insights da IA</h4>
                </div>
                <p className="text-purple-700 text-sm">
                  {stats.activeStudyPlans > 0 
                    ? `Você tem ${stats.activeStudyPlans} plano(s) ativo(s). Continue seguindo seu cronograma para melhores resultados!`
                    : 'Todos os seus planos foram concluídos! Que tal criar um novo desafio?'
                  }
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
