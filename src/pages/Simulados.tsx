import { BarChart3, Clock, Play, TrendingUp, Award, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SimuladosPage = () => {
  const simulados = [
    {
      title: "ENEM - Prova Completa",
      description: "Simulado completo com 180 questões das 4 áreas do conhecimento",
      duration: "5h 30min",
      questions: 180,
      difficulty: "Alto",
      status: "Disponível",
    },
    {
      title: "Matemática - FUVEST",
      description: "Questões específicas de matemática do vestibular da USP",
      duration: "2h 30min", 
      questions: 45,
      difficulty: "Alto",
      status: "Disponível",
    },
    {
      title: "Português - UNICAMP",
      description: "Foco em interpretação de texto e gramática",
      duration: "2h",
      questions: 30,
      difficulty: "Médio",
      status: "Disponível",
    },
    {
      title: "Ciências da Natureza",
      description: "Física, Química e Biologia - Questões ENEM",
      duration: "1h 30min",
      questions: 45,
      difficulty: "Médio",
      status: "Em breve",
    }
  ];

  const recentResults = [
    { exam: "ENEM 2023", score: "750", date: "15/01/2024", performance: 85 },
    { exam: "Matemática FUVEST", score: "42/50", date: "10/01/2024", performance: 84 },
    { exam: "Português UNICAMP", score: "28/30", date: "05/01/2024", performance: 93 },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Alto": return "bg-destructive/10 text-destructive";
      case "Médio": return "bg-accent/10 text-accent";
      case "Baixo": return "bg-success/10 text-success";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Disponível" ? "bg-success/10 text-success" : "bg-muted/10 text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-accent text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Simulados</h1>
            <p className="text-white/80 text-lg">Pratique e acompanhe seu desempenho</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Exams */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">Simulados Disponíveis</h2>
              <div className="space-y-4">
                {simulados.map((simulado, index) => (
                  <Card key={index} className="shadow-medium hover:shadow-strong transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{simulado.title}</h3>
                          <p className="text-muted-foreground mb-4">{simulado.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline" className="gap-1">
                              <Clock className="h-3 w-3" />
                              {simulado.duration}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              <FileText className="h-3 w-3" />
                              {simulado.questions} questões
                            </Badge>
                            <Badge className={getDifficultyColor(simulado.difficulty)}>
                              {simulado.difficulty}
                            </Badge>
                            <Badge className={getStatusColor(simulado.status)}>
                              {simulado.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="gradient" 
                          className="gap-2"
                          disabled={simulado.status !== "Disponível"}
                        >
                          <Play className="h-4 w-4" />
                          {simulado.status === "Disponível" ? "Iniciar Simulado" : "Em breve"}
                        </Button>
                        <Button variant="outline">Ver Detalhes</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Overview */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Desempenho
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">87%</div>
                  <div className="text-sm text-muted-foreground">Média Geral</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Matemática</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '92%' }} />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Português</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Ciências</span>
                    <span className="font-medium">83%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '83%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Results */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Resultados Recentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentResults.map((result, index) => (
                  <div key={index} className="p-3 rounded-lg bg-gradient-card border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{result.exam}</span>
                      <span className="text-xs text-muted-foreground">{result.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">{result.score}</span>
                      <div className="flex items-center gap-1 text-success text-xs">
                        <TrendingUp className="h-3 w-3" />
                        {result.performance}%
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimuladosPage;