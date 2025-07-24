import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  Target, 
  TrendingUp,
  Plus,
  Sparkles,
  Brain,
  Clock,
  Award
} from 'lucide-react';

// Hooks e dados
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';

// Componentes do dashboard
import { QuickStats } from './QuickStats';
import { StudyPlansOverview } from '@/components/charts/StudyPlansOverview';
import { StudyStreakCard } from '@/components/charts/StudyStreakCard';
import { SubjectProgress } from './SubjectProgress';
import { SubjectDonutChart } from './SubjectDonutChart';
import { RecentActivity } from './RecentActivity';
import { MonthlyGoals } from './MonthlyGoals';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { stats, isLoading, error, refresh } = useDashboardData();
  const navigate = useNavigate();

  // Saudação baseada no horário
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Ações rápidas
  const quickActions = [
    {
      title: 'Nova Grade de Estudos',
      description: 'Crie um plano personalizado com IA',
      icon: Brain,
      color: 'from-purple-500 to-indigo-600',
      hoverColor: 'from-purple-600 to-indigo-700',
      action: () => navigate('/plano-estudos')
    },
    {
      title: 'Ver Calendário',
      description: 'Gerencie suas atividades',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-600',
      hoverColor: 'from-blue-600 to-cyan-700',
      action: () => navigate('/calendario')
    },
    {
      title: 'Fazer Simulado',
      description: 'Teste seus conhecimentos',
      icon: Award,
      color: 'from-emerald-500 to-teal-600',
      hoverColor: 'from-emerald-600 to-teal-700',
      action: () => navigate('/simulados')
    },
    {
      title: 'Banco de Questões',
      description: 'Pratique com exercícios',
      icon: BookOpen,
      color: 'from-orange-500 to-red-600',
      hoverColor: 'from-orange-600 to-red-700',
      action: () => navigate('/exercicios')
    }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <div className="text-red-600 mb-4">
                <TrendingUp className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Erro ao carregar dashboard
              </h3>
              <p className="text-red-700 mb-4">{error}</p>
              <Button 
                onClick={refresh}
                className="bg-red-600 hover:bg-red-700"
              >
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - APROVA.AE</title>
        <meta name="description" content="Acompanhe seu progresso nos estudos e gerencie suas atividades" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header com saudação */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
              >
                <GraduationCap className="h-8 w-8 text-purple-600" />
              </motion.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {getGreeting()}, {user?.user_metadata?.full_name?.split(' ')[0] || 'Estudante'}!
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Vamos continuar sua jornada rumo à aprovação! 🎯
            </p>
          </motion.div>

          {/* Estatísticas rápidas */}
          <QuickStats stats={stats} isLoading={isLoading} />

          {/* Seção principal - Planos de Estudo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Brain className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Seus Planos de Estudo
              </h2>
            </div>
            <StudyPlansOverview 
              studyPlans={{
                total: stats.totalStudyPlans,
                active: stats.activeStudyPlans,
                completed: stats.completedStudyPlans
              }}
            />
          </motion.div>

          {/* Seção de Análise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-10"
          >
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Análise de Performance
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sequência de estudos */}
              <StudyStreakCard 
                currentStreak={stats.currentStreak}
                longestStreak={stats.longestStreak}
                weeklyGoal={stats.weeklyGoal}
                weeklyProgress={stats.weeklyProgress}
              />

              {/* Gráfico de matérias */}
              <SubjectDonutChart 
                subjectProgress={stats.subjectProgress}
                isLoading={isLoading}
              />

              {/* Atividade recente */}
              <RecentActivity 
                recentActivity={stats.recentActivity}
                isLoading={isLoading}
              />
            </div>
          </motion.div>

          {/* Seção de Progresso Detalhado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Target className="h-6 w-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Progresso e Metas
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progresso por matéria */}
              <SubjectProgress 
                subjectProgress={stats.subjectProgress}
                isLoading={isLoading}
              />

              {/* Metas mensais */}
              <MonthlyGoals 
                monthlyGoals={stats.monthlyGoals}
                isLoading={isLoading}
              />
            </div>
          </motion.div>

          {/* Seção de Ações Rápidas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-10"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                Ações Rápidas
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-200 to-transparent ml-4"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Card 
                    className="border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden relative"
                    onClick={action.action}
                  >
                    {/* Efeito de brilho no hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    
                    <CardContent className="p-6 text-center relative z-10">
                      <motion.div 
                        className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${action.color} group-hover:${action.hoverColor} flex items-center justify-center transition-all duration-300 shadow-lg group-hover:shadow-xl`}
                        whileHover={{ rotate: 5 }}
                      >
                        <action.icon className="h-7 w-7 text-white" />
                      </motion.div>
                      <h3 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-gray-800 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Dica Motivacional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center"
          >
            <Card className="border-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-emerald-500/10 backdrop-blur-sm shadow-lg">
              <CardContent className="p-8">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                  className="flex items-center justify-center space-x-3 mb-4"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  >
                    <GraduationCap className="h-6 w-6 text-purple-600" />
                  </motion.div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Dica do Dia
                  </h3>
                  <motion.div
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5, delay: 0.5 }}
                  >
                    <Sparkles className="h-6 w-6 text-yellow-500" />
                  </motion.div>
                </motion.div>
                
                <motion.p 
                  className="text-gray-700 mb-6 text-lg leading-relaxed max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.6 }}
                >
                  {(() => {
                    const tips = [
                      '📚 Estude um pouco todos os dias - a consistência é a chave do sucesso!',
                      '🎯 Defina metas claras e celebre cada conquista, por menor que seja.',
                      '⏰ Use a técnica Pomodoro: 25 minutos focado + 5 minutos de pausa.',
                      '🧠 Revise o conteúdo estudado antes de dormir para fixar melhor.',
                      '💪 Mantenha uma rotina saudável: sono, alimentação e exercícios.',
                      '📝 Faça resumos e mapas mentais para organizar o conhecimento.',
                      '🤝 Estude em grupo às vezes - explicar para outros ajuda a aprender.'
                    ];
                    return tips[Math.floor(Math.random() * tips.length)];
                  })()
                }
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
                >
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={refresh}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Atualizar Dashboard
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;