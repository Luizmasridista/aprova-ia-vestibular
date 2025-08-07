
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useDashboardData } from '@/hooks/useDashboardData';
import { WelcomeHeader } from './WelcomeHeader';
import { StatsGrid } from './StatsGrid';
import { StudyOverview } from './StudyOverview';
import { PerformanceSection } from './PerformanceSection';
import { QuickActions } from './QuickActions';
import { RecentActivity } from './RecentActivity';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { stats, isLoading, error, refresh } = useDashboardData();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <div className="text-red-600 mb-4">
                <AlertTriangle className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-red-900 mb-3">
                Erro ao carregar dashboard
              </h3>
              <p className="text-red-700 mb-6">{error}</p>
              <Button 
                onClick={refresh}
                className="bg-red-600 hover:bg-red-700"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
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
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <WelcomeHeader />
          
          <StatsGrid stats={stats} isLoading={isLoading} />
          
          <StudyOverview stats={stats} isLoading={isLoading} />
          
          <PerformanceSection stats={stats} isLoading={isLoading} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <QuickActions />
            </div>
            <div>
              <RecentActivity 
                recentActivity={stats.recentActivity} 
                isLoading={isLoading} 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
