import { StatsCard } from "./StatsCard";
import { FeatureCard } from "./FeatureCard";
import { 
  Brain, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Clock, 
  Target, 
  BarChart3,
  BookOpen,
  Zap,
  Trophy,
  Users,
  Sparkles
} from "lucide-react";
import heroImage from "@/assets/hero-education.jpg";

export function Dashboard() {
  const stats = [
    {
      title: "Horas Estudadas",
      value: "0h",
      description: "Esta semana",
      icon: Clock,
      trend: { value: "+0%", isPositive: true }
    },
    {
      title: "Simulados Realizados",
      value: "0",
      description: "Este mês", 
      icon: FileText,
      trend: { value: "+0", isPositive: true }
    },
    {
      title: "Taxa de Acerto",
      value: "0%",
      description: "Média geral",
      icon: Target,
      trend: { value: "+0%", isPositive: true }
    },
    {
      title: "Evolução",
      value: "+0%",
      description: "Último simulado",
      icon: TrendingUp,
      trend: { value: "Iniciante", isPositive: true }
    }
  ];

  const features = [
    {
      title: "Grade de Estudos IA",
      description: "Cronograma personalizado gerado por inteligência artificial, adaptado ao seu perfil e metas de aprovação.",
      icon: Brain,
      href: "/estudos",
      gradient: "bg-gradient-primary",
      comingSoon: true
    },
    {
      title: "Calendário Integrado",
      description: "Sincronize sua rotina de estudos com lembretes inteligentes e acompanhe seu progresso diário.",
      icon: Calendar,
      href: "/calendario",
      gradient: "bg-gradient-accent"
    },
    {
      title: "Simulados",
      description: "Realize simulados completos ou por disciplina com relatórios detalhados de desempenho.",
      icon: BarChart3,
      href: "/simulados",
      gradient: "bg-gradient-primary"
    },
    {
      title: "Banco de Questões",
      description: "Acesse milhares de questões organizadas por matéria, dificuldade e tema para treinar.",
      icon: BookOpen,
      href: "/questoes",
      gradient: "bg-gradient-accent"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-black/20" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center text-white space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Powered by AI</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Seu Vestibular
              <span className="block bg-gradient-to-r from-primary-glow to-accent-glow bg-clip-text text-transparent">
                dos Sonhos
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Sistema inteligente de preparação para vestibular com IA. 
              Grade personalizada, simulados e acompanhamento completo do seu progresso.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <div className="flex items-center space-x-2 text-white/80">
                <Trophy className="h-5 w-5" />
                <span>Aprovação Garantida</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Zap className="h-5 w-5" />
                <span>IA Personalizada</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Users className="h-5 w-5" />
                <span>+ 10.000 questões</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <StatsCard {...stat} />
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-foreground">
            Funcionalidades Principais
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ferramentas poderosas para acelerar sua aprovação no vestibular
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-card py-20 border-t border-border">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h3 className="text-3xl font-bold text-foreground">
            Pronto para começar sua jornada?
          </h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transforme sua preparação com inteligência artificial e conquiste a aprovação dos seus sonhos.
          </p>
        </div>
      </section>
    </div>
  );
}