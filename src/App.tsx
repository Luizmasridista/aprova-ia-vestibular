import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { APP_URLS } from '@/config/urls';

// Layout
import { Layout } from "./components/layout/Layout";

// Auth Context
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
const Index = lazy(() => import('./pages/Index'));
const CalendarPage = lazy(() => import('./pages/Calendar'));
const SimuladosPage = lazy(() => import('./pages/Simulados'));
const ExerciciosPage = lazy(() => import('./pages/Exercicios'));
const NotFound = lazy(() => import('./pages/NotFound'));
const StudyPlanPage = lazy(() => import('./pages/StudyPlanPage'));
const LoginPage = lazy(() => import('./pages/Login'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPassword'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const DashboardPage = lazy(() => import("./components/dashboard/Dashboard"));

// Components
import { LoadingScreen, LoadingPage } from './components/ui/loading-screen';

// Create a client
const queryClient = new QueryClient();

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingScreen />
  </div>
);



// Componente para rotas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  console.log('🚫 ProtectedRoute check:', { 
    user: user?.email || 'No user', 
    loading, 
    currentPath: window.location.pathname 
  });
  
  if (loading) {
    console.log('⏳ ProtectedRoute: Loading...');
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  if (!user) {
    console.log('🚪 ProtectedRoute: No user, redirecting to login from:', window.location.pathname);
    // Salva a página atual para redirecionar após login
    sessionStorage.setItem('returnTo', window.location.pathname);
    return <Navigate to="/login" replace />;
  }
  
  console.log('✅ ProtectedRoute: User authenticated, rendering children');
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/simulados" element={<SimuladosPage />} />
                  <Route path="/exercicios" element={<ExerciciosPage />} />
                  <Route path="/calendario" element={<CalendarPage />} />
                  <Route path="/plano-estudos" element={<StudyPlanPage />} />
                  <Route path="/study-plan" element={<StudyPlanPage />} />
                  <Route path="/perfil" element={<ProfilePage />} />
                  <Route path="/configuracoes" element={<SettingsPage />} />
                  <Route index element={<Navigate to="/dashboard" replace />} />
                </Route>
                
                
                
                
                
                
                
                
                {/* 404 - Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
