import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarEvent } from '@/lib/services/calendarService';
import { motion } from 'framer-motion';

interface VisualCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  className?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

const VisualCalendar: React.FC<VisualCalendarProps> = ({
  events = [],
  onEventClick,
  onDateClick,
  className = ""
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  // Nomes dos meses e dias da semana em português
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Gerar dias do calendário
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    // Último dia do mês
    const lastDay = new Date(year, month + 1, 0);
    
    // Primeiro dia da primeira semana (pode ser do mês anterior)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // Último dia da última semana (pode ser do próximo mês)
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Gerar todos os dias do calendário
    const currentDay = new Date(startDate);
    while (currentDay <= endDate) {
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.start_date);
        return (
          eventDate.getDate() === currentDay.getDate() &&
          eventDate.getMonth() === currentDay.getMonth() &&
          eventDate.getFullYear() === currentDay.getFullYear()
        );
      });

      days.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.getTime() === today.getTime(),
        events: dayEvents
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    setCalendarDays(days);
  }, [currentDate, events]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventColor = (event: CalendarEvent) => {
    if (event.color) return event.color;
    
    switch (event.event_type) {
      case 'study': return '#3b82f6';
      case 'exam': return '#f59e0b';
      case 'review': return '#10b981';
      case 'break': return '#6b7280';
      default: return '#6366f1';
    }
  };

  const getEventIcon = (event: CalendarEvent) => {
    if (event.status === 'completed') {
      return <CheckCircle className="w-3 h-3 text-green-600" />;
    }
    
    switch (event.event_type) {
      case 'study': return <Play className="w-3 h-3" />;
      case 'exam': return <Clock className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const formatEventTime = (startDate: string) => {
    const date = new Date(startDate);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-6">
        {/* Header do calendário */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="text-sm"
            >
              Hoje
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Cabeçalho dos dias da semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div
              key={day}
              className="h-10 flex items-center justify-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid do calendário */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <motion.div
              key={`${day.date.getTime()}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.01 }}
              className={`
                min-h-[100px] border border-gray-200 rounded-lg p-2 cursor-pointer
                hover:bg-gray-50 transition-colors
                ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                ${day.isToday ? 'ring-2 ring-primary bg-primary/5' : ''}
              `}
              onClick={() => onDateClick?.(day.date)}
            >
              {/* Número do dia */}
              <div className={`
                text-sm font-medium mb-1
                ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${day.isToday ? 'text-primary font-bold' : ''}
              `}>
                {day.date.getDate()}
              </div>

              {/* Eventos do dia */}
              <div className="space-y-1">
                {day.events.slice(0, 3).map((event, eventIndex) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: eventIndex * 0.1 }}
                    className={`
                      text-xs p-1 rounded text-white cursor-pointer
                      hover:opacity-80 transition-opacity
                      flex items-center gap-1
                      ${event.status === 'completed' ? 'opacity-60' : ''}
                    `}
                    style={{ backgroundColor: getEventColor(event) }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                  >
                    {getEventIcon(event)}
                    <span className="truncate flex-1">
                      {formatEventTime(event.start_date)} {event.subject}
                    </span>
                  </motion.div>
                ))}
                
                {/* Indicador de mais eventos */}
                {day.events.length > 3 && (
                  <div className="text-xs text-gray-500 px-1">
                    +{day.events.length - 3} mais
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legenda */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span>Estudo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500"></div>
            <span>Prova</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span>Revisão</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <span>Concluído</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualCalendar;
