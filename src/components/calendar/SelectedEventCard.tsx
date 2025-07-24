import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Play, Pause, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarEvent } from '@/lib/services/calendarService';

interface SelectedEventCardProps {
  selectedEvent: CalendarEvent | null;
  onCompleteEvent: (eventId: string) => void;
  onCloseEvent: () => void;
}

const SelectedEventCard: React.FC<SelectedEventCardProps> = ({
  selectedEvent,
  onCompleteEvent,
  onCloseEvent
}) => {
  if (!selectedEvent) return null;

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
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      className="mb-6"
    >
      <Card className="shadow-lg border-0 rounded-xl">
        <CardHeader className="pb-4 relative">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-primary" />
            Evento Selecionado
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCloseEvent}
            className="absolute top-4 right-4 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getEventTypeIcon(selectedEvent.event_type, selectedEvent.status)}
                <h3 className="font-semibold text-foreground">
                  {selectedEvent.title}
                </h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedEvent.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {selectedEvent.status === 'completed' ? 'Concluído' : 'Agendado'}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>
                  {formatEventTime(selectedEvent.start_date, selectedEvent.end_date).time} 
                  ({formatEventTime(selectedEvent.start_date, selectedEvent.end_date).duration})
                </span>
              </div>
              
              {selectedEvent.subject && (
                <div className="flex items-center gap-2">
                  <span 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: selectedEvent.color }}
                  ></span>
                  <span>{selectedEvent.subject}</span>
                </div>
              )}
              
              {selectedEvent.topic && (
                <div className="text-muted-foreground">
                  <strong>Tópico:</strong> {selectedEvent.topic}
                </div>
              )}
              
              {selectedEvent.description && (
                <div className="text-muted-foreground mt-2">
                  <strong>Descrição:</strong> {selectedEvent.description}
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mt-4">
              {selectedEvent.status === 'scheduled' && (
                <Button
                  size="sm"
                  onClick={() => onCompleteEvent(selectedEvent.id)}
                  className="flex-1"
                >
                  Marcar como Concluído
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={onCloseEvent}
                className="flex-1"
              >
                Fechar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SelectedEventCard;
