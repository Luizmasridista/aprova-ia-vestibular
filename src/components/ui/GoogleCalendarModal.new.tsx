import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, CheckCircle, Settings, History, Zap, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarEvent } from '@/lib/services/calendarService';
import { GoogleCalendarIntegration } from '@/components/calendar/GoogleCalendarIntegration.new';
import GoogleCalendarStats from '@/components/calendar/GoogleCalendarStats';
import GoogleCalendarSettings from '@/components/calendar/GoogleCalendarSettings';
import GoogleCalendarHistory from '@/components/calendar/GoogleCalendarHistory';
import { Badge } from '@/components/ui/badge';

// Componente da Logo do Google
const GoogleLogo: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

interface GoogleCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
}

const GoogleCalendarModal: React.FC<GoogleCalendarModalProps> = ({
  isOpen,
  onClose,
  events
}) => {
  const [activeSection, setActiveSection] = useState<'connect' | 'stats' | 'settings' | 'history'>('connect');
  const completedEvents = events.filter(e => e.status === 'completed').length;

  const handleSyncComplete = (success: number, failed: number) => {
    console.log(`Sincronização completa: ${success} sucessos, ${failed} falhas`);
  };

  const handleRefreshStats = () => {
    console.log('Atualizando estatísticas...');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-background border rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Integração Google Calendar</h2>
                    <p className="text-sm text-muted-foreground">
                      Conecte e sincronize seus estudos automaticamente
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Layout Horizontal */}
            <div className="flex h-[calc(90vh-120px)]">
              {/* Sidebar de Navegação */}
              <div className="w-64 border-r bg-muted/30 p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveSection('connect')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === 'connect'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <GoogleLogo className="w-4 h-4" />
                    <span className="font-medium">Conectar</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('stats')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === 'stats'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span className="font-medium">Estatísticas</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('settings')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === 'settings'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span className="font-medium">Configurações</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('history')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === 'history'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <History className="w-4 h-4" />
                    <span className="font-medium">Histórico</span>
                  </button>
                </nav>

                {/* Estatísticas Rápidas na Sidebar */}
                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">Resumo</h3>
                  
                  <Card className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-lg font-bold">{events.length}</p>
                      </div>
                      <CalendarIcon className="w-4 h-4 text-primary" />
                    </div>
                  </Card>
                  
                  <Card className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Concluídos</p>
                        <p className="text-lg font-bold text-green-600">{completedEvents}</p>
                      </div>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  </Card>
                  
                  <Card className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Taxa</p>
                        <p className="text-lg font-bold text-blue-600">
                          {Math.round((completedEvents / (events.length || 1)) * 100)}%
                        </p>
                      </div>
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                  </Card>
                </div>
              </div>

              {/* Conteúdo Principal */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeSection === 'connect' && (
                    <motion.div
                      key="connect"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-6"
                    >
                      <div className="max-w-2xl">
                        <h3 className="text-lg font-semibold mb-4">Conectar ao Google Calendar</h3>
                        <GoogleCalendarIntegration onSyncComplete={handleSyncComplete} />
                        
                        {/* Informações importantes */}
                        <div className="mt-6 bg-muted/30 rounded-lg p-4">
                          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-primary" />
                            <span>Como funciona</span>
                          </h4>
                          <div className="grid gap-3">
                            <div className="flex gap-3 items-start">
                              <div className="min-w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">1</div>
                              <p className="text-sm text-muted-foreground">
                                Conecte sua conta Google para autorizar o acesso ao calendário
                              </p>
                            </div>
                            <div className="flex gap-3 items-start">
                              <div className="min-w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">2</div>
                              <p className="text-sm text-muted-foreground">
                                Seus eventos de estudo serão sincronizados automaticamente
                              </p>
                            </div>
                            <div className="flex gap-3 items-start">
                              <div className="min-w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">3</div>
                              <p className="text-sm text-muted-foreground">
                                As cores das matérias são mantidas para fácil identificação
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === 'stats' && (
                    <motion.div
                      key="stats"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-6"
                    >
                      <h3 className="text-lg font-semibold mb-4">Estatísticas de Sincronização</h3>
                      <GoogleCalendarStats onRefresh={handleRefreshStats} />
                    </motion.div>
                  )}

                  {activeSection === 'settings' && (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-6"
                    >
                      <h3 className="text-lg font-semibold mb-4">Configurações de Integração</h3>
                      <GoogleCalendarSettings onSettingsChange={handleRefreshStats} />
                    </motion.div>
                  )}

                  {activeSection === 'history' && (
                    <motion.div
                      key="history"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-6"
                    >
                      <h3 className="text-lg font-semibold mb-4">Histórico de Sincronizações</h3>
                      <GoogleCalendarHistory limit={15} onRefresh={handleRefreshStats} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GoogleCalendarModal;
