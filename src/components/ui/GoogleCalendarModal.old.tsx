import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, CheckCircle, AlertCircle, Settings, History, Zap, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarEvent } from '@/lib/services/calendarService';
import { GoogleCalendarIntegration } from '@/components/calendar/GoogleCalendarIntegration.new';
import GoogleCalendarStats from '@/components/calendar/GoogleCalendarStats';
import GoogleCalendarSettings from '@/components/calendar/GoogleCalendarSettings';
import GoogleCalendarHistory from '@/components/calendar/GoogleCalendarHistory';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Componente da Logo do Google (reutilizado)
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

// Componente de ilustração do calendário
const CalendarIllustration: React.FC = () => (
  <div className="relative w-full h-32 mb-4">
    <motion.div 
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0.4, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <div className="w-20 h-24 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg shadow-lg flex flex-col overflow-hidden">
        <div className="bg-primary text-white text-xs font-medium py-1 px-2 text-center">JUL</div>
        <div className="flex-1 flex items-center justify-center text-lg font-bold text-primary">22</div>
      </div>
    </motion.div>
    
    <motion.div 
      className="absolute left-[60%] top-[10%] w-16 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-lg shadow-md flex flex-col overflow-hidden"
      initial={{ opacity: 0.4, scale: 0.8, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: -5 }}
      transition={{ delay: 0.3, duration: 0.3 }}
    >
      <div className="bg-blue-500 text-white text-[10px] py-0.5 px-1 text-center">JUL</div>
      <div className="flex-1 flex items-center justify-center text-sm font-bold text-blue-600">23</div>
    </motion.div>
    
    <motion.div 
      className="absolute left-[20%] top-[15%] w-14 h-16 bg-gradient-to-br from-violet-500/20 to-violet-600/30 rounded-lg shadow-md flex flex-col overflow-hidden"
      initial={{ opacity: 0.4, scale: 0.8, rotate: 5 }}
      animate={{ opacity: 1, scale: 1, rotate: 5 }}
      transition={{ delay: 0.4, duration: 0.3 }}
    >
      <div className="bg-violet-500 text-white text-[8px] py-0.5 px-1 text-center">JUL</div>
      <div className="flex-1 flex items-center justify-center text-xs font-bold text-violet-600">24</div>
    </motion.div>
  </div>
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
  const [activeTab, setActiveTab] = useState<string>('connect');
  const completedEvents = events.filter(e => e.status === 'completed').length;
  
  const handleSyncComplete = (success: number, failed: number) => {
    console.log(`Sincronização concluída: ${success} sucessos, ${failed} falhas`);
    // Mudar para a aba de status após sincronização bem-sucedida
    if (success > 0) {
      setActiveTab('status');
    }
  };
  
  // Função para atualizar estatísticas quando necessário
  const handleRefreshStats = () => {
    console.log('Atualizando estatísticas do Google Calendar');
    // Recarregar dados quando houver mudanças nas configurações ou status
    setActiveTab('status'); // Opcional: mudar para a aba de status após salvar configurações
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0.2, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-xl"
        >
          <Card className="shadow-2xl border border-primary/10 bg-background/95 overflow-hidden">
            {/* Header com gradiente */}
            <div className="bg-gradient-to-r from-primary/80 to-primary p-6 text-white relative overflow-hidden">
                      <GoogleLogo className="w-4 h-4" />
                      <span>Conectar</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="status" className="rounded-md">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Status</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="rounded-md">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      <span>Configurações</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="history" className="rounded-md">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4" />
                      <span>Histórico</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="pt-6">
                <TabsContent value="connect" className="mt-0 space-y-4">
                  <div className="flex flex-col items-center text-center">
                    <CalendarIllustration />
                    <h3 className="text-lg font-semibold mb-2">Sincronize seus estudos</h3>
                    <p className="text-muted-foreground text-sm mb-6 max-w-md">
                      Conecte sua conta Google para manter seus eventos de estudo sincronizados automaticamente com seu Google Calendar.
                    </p>
                  </div>

                  {/* Componente de integração avançado */}
                  <GoogleCalendarIntegration 
                    onSyncComplete={handleSyncComplete}
                  />
                </TabsContent>

                <TabsContent value="status" className="mt-0 space-y-6">
                  {/* Estatísticas dos eventos locais */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="border border-primary/10 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Total de Eventos</p>
                            <h3 className="text-3xl font-bold text-primary">{events.length}</h3>
                          </div>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            Local
                          </Badge>
                        </div>
                        <div className="mt-2 h-1.5 w-full bg-primary/20 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-primary" 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-green-500/10 bg-gradient-to-br from-green-500/5 to-green-500/10 overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Concluídos</p>
                            <h3 className="text-3xl font-bold text-green-600">{completedEvents}</h3>
                          </div>
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                            {Math.round((completedEvents / (events.length || 1)) * 100)}%
                          </Badge>
                        </div>
                        <div className="mt-2 h-1.5 w-full bg-green-500/20 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-green-500" 
                            initial={{ width: 0 }}
                            animate={{ width: `${(completedEvents / (events.length || 1)) * 100}%` }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Componente de estatísticas do Google Calendar */}
                  <GoogleCalendarStats onRefresh={() => console.log('Estatísticas atualizadas')} />

                  {/* Informações adicionais com design melhorado */}
                  <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <span>Informações importantes</span>
                    </h4>
                    <div className="grid gap-2">
                      <div className="flex gap-2 items-start">
                        <div className="min-w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary mt-0.5">1</div>
                        <p className="text-xs text-muted-foreground">Os eventos serão criados no seu calendário principal com as mesmas informações</p>
                      </div>
                      <div className="flex gap-2 items-start">
                        <div className="min-w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary mt-0.5">2</div>
                        <p className="text-xs text-muted-foreground">Eventos já existentes não serão duplicados, apenas atualizados se necessário</p>
                      </div>
                      <div className="flex gap-2 items-start">
                        <div className="min-w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary mt-0.5">3</div>
                        <p className="text-xs text-muted-foreground">As cores das matérias serão mantidas no Google Calendar para fácil identificação</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-0">
                  <GoogleCalendarSettings 
                    onSettingsChange={handleRefreshStats}
                  />
                </TabsContent>
                
                <TabsContent value="history" className="mt-0">
                  <div className="p-6">
                    <GoogleCalendarHistory 
                      limit={15}
                      onRefresh={handleRefreshStats}
                    />
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GoogleCalendarModal;
