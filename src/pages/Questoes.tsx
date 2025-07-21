import { BookOpen, Search, Filter, Star, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/common/Header";

const QuestoesPage = () => {
  const subjects = [
    { name: "Matemática", count: 2847, color: "bg-primary/10 text-primary" },
    { name: "Português", count: 1923, color: "bg-accent/10 text-accent" },
    { name: "Física", count: 1654, color: "bg-success/10 text-success" },
    { name: "Química", count: 1432, color: "bg-destructive/10 text-destructive" },
    { name: "Biologia", count: 1287, color: "bg-muted text-muted-foreground" },
    { name: "História", count: 1156, color: "bg-primary/10 text-primary" },
    { name: "Geografia", count: 1089, color: "bg-accent/10 text-accent" },
    { name: "Filosofia", count: 743, color: "bg-success/10 text-success" },
  ];

  const recentQuestions = [
    {
      id: 1,
      subject: "Matemática",
      topic: "Álgebra Linear",
      difficulty: "Alto",
      year: "ENEM 2023",
      status: "correct",
      question: "Uma função f(x) = ax² + bx + c tem discriminante Δ = 16. Se f(0) = 3 e f(1) = 6, qual o valor de a?",
    },
    {
      id: 2,
      subject: "Português",
      topic: "Interpretação de Texto",
      difficulty: "Médio", 
      year: "FUVEST 2023",
      status: "incorrect",
      question: "Com base no texto apresentado, pode-se inferir que o autor defende a tese de que...",
    },
    {
      id: 3,
      subject: "Física",
      topic: "Mecânica",
      difficulty: "Alto",
      year: "UNICAMP 2023",
      status: "correct",
      question: "Um bloco de massa m desliza sobre um plano inclinado sem atrito. Calcule a aceleração do bloco.",
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Alto": return "bg-destructive/10 text-destructive";
      case "Médio": return "bg-accent/10 text-accent";
      case "Baixo": return "bg-success/10 text-success";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    return status === "correct" ? 
      <CheckCircle className="h-4 w-4 text-success" /> : 
      <XCircle className="h-4 w-4 text-destructive" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Header */}
      <div className="bg-gradient-primary text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Banco de Questões</h1>
            <p className="text-white/80 text-lg">Mais de 12.000 questões organizadas por matéria e dificuldade</p>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar questões por tema, palavra-chave..."
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <Button variant="accent" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Subjects */}
          <div className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Matérias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {subjects.map((subject, index) => (
                  <button
                    key={index}
                    className="w-full p-3 rounded-lg text-left hover:bg-accent/5 transition-colors border border-transparent hover:border-accent/20"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{subject.name}</span>
                      <Badge className={subject.color}>
                        {subject.count.toLocaleString()}
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-primary">247</div>
                  <div className="text-sm text-muted-foreground">Questões Resolvidas</div>
                </div>
                
                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-success">78%</div>
                  <div className="text-sm text-muted-foreground">Taxa de Acerto</div>
                </div>

                <div className="text-center space-y-1">
                  <div className="text-2xl font-bold text-accent">15</div>
                  <div className="text-sm text-muted-foreground">Questões Favoritas</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Questions List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Questões Recentes</h2>
              <Button variant="gradient">Nova Sessão de Questões</Button>
            </div>

            <div className="space-y-4">
              {recentQuestions.map((question) => (
                <Card key={question.id} className="shadow-medium hover:shadow-strong transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{question.subject}</Badge>
                        <Badge variant="outline">{question.topic}</Badge>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                        <Badge variant="outline">{question.year}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(question.status)}
                        <Button variant="ghost" size="icon">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-foreground leading-relaxed">
                        {question.question}
                      </p>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Ver Resolução</Button>
                        <Button variant="outline" size="sm">Questões Similares</Button>
                        <Button variant="outline" size="sm">Adicionar aos Favoritos</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center pt-6">
              <Button variant="outline" size="lg">Carregar Mais Questões</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestoesPage;