import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, CheckCircle, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarEvent } from '@/lib/services/calendarService';
import { StaggerContainer } from '@/components/animations/StaggerContainer';

interface TodayAgendaCardProps {
  todayEvents: CalendarEvent[];
  onCompleteEvent: (eventId: string) => void;
}

const TodayAgendaCard: React.FC<TodayAgendaCardProps> = ({
  todayEvents,
  onCompleteEvent
}) => {
  const getEventTypeIcon = (type: string, status: string) => {
    if (status === 'completed') {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    
    switch (type) {
      case 'study': return <Play className="w-4 h-4 text-blue-600" />;
      case 'exam': return <Clock className="w-4 h-4 text-orange-600" />;
      case 'review': return <Pause className="w-4 h-4 text-green-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatEventTime = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // em minutos
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    let durationText = '';
    if (hours > 0) durationText += `${hours}h`;
    if (minutes > 0) durationText += `${minutes}m`;
    
    return {
      time: start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      duration: durationText || '0m'
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="h-full flex flex-col"
    >
      <Card className="shadow-lg border-0 rounded-xl h-full flex flex-col">
        <CardHeader className="pb-4 flex-shrink-0">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="h-5 w-5 text-primary" />
            Agenda de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 pt-0">
          <div className="h-full overflow-y-auto pr-2 -mr-2 space-y-4">
          {todayEvents.length > 0 ? (
            <StaggerContainer
              staggerDelay={0.1}
              initialDelay={0.3}
              direction="up"
              className="space-y-3"
            >
              {todayEvents.map((event, index) => {
                const { time, duration } = formatEventTime(event.start_date, event.end_date);
                
                return (
                  <motion.div
                    key={event.id}
                    className={`p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] hover:shadow-md cursor-pointer ${
                      event.status === 'completed' 
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                        : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: index * 0.1 + 0.3,
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300
                    }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {getEventTypeIcon(event.event_type, event.status)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground truncate">
                              {event.title}
                            </h4>
                            {event.status === 'completed' && (
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {duration} • {event.subject}
                          </p>
                          {event.topic && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {event.topic}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-sm font-medium text-primary">{time}</span>
                        {event.status === 'scheduled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onCompleteEvent(event.id)}
                            className="text-xs"
                          >
                            Concluir
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </StaggerContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma atividade agendada para hoje</p>
              <p className="text-sm mt-2">Gere uma grade de estudos para ver suas atividades aqui!</p>
            </div>
          )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TodayAgendaCard;
