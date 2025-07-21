import { Calendar, CalendarDays, Clock, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/common/Header";

const CalendarPage = () => {
  const mockEvents = [
    { time: "09:00", title: "Matemática - Álgebra Linear", duration: "2h", type: "study" },
    { time: "11:00", title: "Português - Literatura", duration: "1h30", type: "study" },
    { time: "14:00", title: "Simulado ENEM", duration: "4h", type: "exam" },
    { time: "19:00", title: "Revisão Física", duration: "1h", type: "review" },
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case "study": return "border-l-primary";
      case "exam": return "border-l-accent";
      case "review": return "border-l-success";
      default: return "border-l-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Header */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Calendário Integrado</h1>
              <p className="text-white/80 text-lg">Organize sua rotina de estudos</p>
            </div>
            <Button variant="gradient" size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Nova Atividade
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Widget */}
          <div className="lg:col-span-2">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Janeiro 2024
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="text-center font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <button
                      key={day}
                      className={`p-3 rounded-md text-center hover:bg-accent transition-colors ${
                        day === 15 ? 'bg-primary text-primary-foreground' : ''
                      } ${[5, 12, 18, 25].includes(day) ? 'bg-accent/30 text-accent-foreground' : ''}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Schedule */}
          <div className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Agenda de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 bg-gradient-card ${getEventColor(event.type)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-foreground">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.duration}</p>
                      </div>
                      <span className="text-sm font-medium text-primary">{event.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Sync com Google Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Configurar Lembretes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Exportar Cronograma
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;