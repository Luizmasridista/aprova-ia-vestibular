import React from 'react';
import { CalendarEvent } from '@/lib/services/calendarService';
import { StaggerContainer } from '@/components/animations/StaggerContainer';
import SelectedEventCard from './SelectedEventCard';
import TodayAgendaCard from './TodayAgendaCard';
import CalendarSettingsCard from './CalendarSettingsCard';

interface CalendarSidebarProps {
  selectedEvent: CalendarEvent | null;
  todayEvents: CalendarEvent[];
  onCompleteEvent: (eventId: string) => void;
  onCloseSelectedEvent: () => void;
  onSyncGoogleCalendar?: () => void;
  onConfigureReminders?: () => void;
  onExportSchedule?: () => void;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  selectedEvent,
  todayEvents,
  onCompleteEvent,
  onCloseSelectedEvent,
  onSyncGoogleCalendar,
  onConfigureReminders,
  onExportSchedule
}) => {
  return (
    <div className="calendar-sidebar-container">
      <StaggerContainer
        staggerDelay={0.15}
        initialDelay={1.2}
        direction="right"
        className="h-full flex flex-col gap-6"
      >
        {/* Evento Selecionado - Container próprio */}
        <div className="selected-event-container flex-shrink-0">
          <SelectedEventCard
            selectedEvent={selectedEvent}
            onCompleteEvent={onCompleteEvent}
            onCloseEvent={onCloseSelectedEvent}
          />
        </div>

        {/* Agenda de Hoje - Container com scroll próprio */}
        <div className="today-agenda-container flex-1 min-h-0">
          <TodayAgendaCard
            todayEvents={todayEvents}
            onCompleteEvent={onCompleteEvent}
          />
        </div>

        {/* Configurações - Container próprio */}
        <div className="settings-container flex-shrink-0">
          <CalendarSettingsCard
            onSyncGoogleCalendar={onSyncGoogleCalendar}
            onConfigureReminders={onConfigureReminders}
            onExportSchedule={onExportSchedule}
          />
        </div>
      </StaggerContainer>
    </div>
  );
};

export default CalendarSidebar;
