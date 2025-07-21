import { Brain, Sparkles, Calendar, Clock, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EstudosPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Powered by AI</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Grade de Estudos
              <span className="block bg-gradient-to-r from-primary-glow to-accent-glow bg-clip-text text-transparent">
                Inteligente
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Sistema de IA que cria cronogramas personalizados baseados no seu perfil, 
              dificuldades e metas de aprovação.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Coming Soon Banner */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-strong border-2 border-accent/20 bg-gradient-card">
            <CardContent className="p-12 text-center space-y-8">
              <div className="mx-auto w-20 h-20 bg-gradient-accent rounded-full flex items-center justify-center">
                <Brain className="h-10 w-10 text-white" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">
                  Em Desenvolvimento
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Estamos desenvolvendo uma funcionalidade revolucionária que usará inteligência artificial 
                  para criar grades de estudos totalmente personalizadas para o seu perfil.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <div className="p-6 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Personalização Total</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    IA analisará seus pontos fortes e fracos para criar um plano de estudos único
                  </p>
                </div>
                
                <div className="p-6 rounded-lg bg-accent/5 border border-accent/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold text-foreground">Integração Automática</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sincronização direta com seu calendário e lembretes inteligentes
                  </p>
                </div>
                
                <div className="p-6 rounded-lg bg-success/5 border border-success/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="h-5 w-5 text-success" />
                    <h3 className="font-semibold text-foreground">Adaptação Dinâmica</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Grade que se ajusta automaticamente baseada no seu progresso
                  </p>
                </div>
                
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">Método Científico</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Baseado em técnicas comprovadas de aprendizado e memorização
                  </p>
                </div>
              </div>

              <div className="pt-8">
                <Button variant="gradient" size="lg" disabled className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Funcionalidade em Breve
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Enquanto isso, explore nossas outras funcionalidades disponíveis
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EstudosPage;