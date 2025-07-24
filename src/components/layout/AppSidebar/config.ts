import { 
  Home, 
  Brain, 
  Calendar, 
  FileText, 
  BookOpen, 
  Plus, 
  Clock, 
  Award, 
  Activity,
  Zap 
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { 
    title: "Dashboard", 
    url: "/dashboard", 
    icon: Home,
    description: "Visão geral do seu progresso",
    priority: 1
  },
  { 
    title: "Grade de Estudos", 
    url: "/study-plan", 
    icon: Brain,
    description: "Planos personalizados com IA",
    priority: 1
  },
  { 
    title: "Calendário", 
    url: "/calendario", 
    icon: Calendar,
    description: "Organize suas atividades",
    priority: 1
  },
  { 
    title: "Simulados", 
    url: "/simulados", 
    icon: FileText,
    description: "Simulados de vestibular",
    priority: 2
  },
  { 
    title: "Exercícios", 
    url: "/exercicios", 
    icon: Zap,
    description: "Questões geradas por IA",
    priority: 2
  },
] as const;

export const QUICK_ACTIONS = [
  {
    title: "Nova Grade",
    icon: Plus,
    url: "/study-plan",
    color: "bg-blue-500 hover:bg-blue-600",
    description: "Criar plano de estudos"
  },
  {
    title: "Agendar",
    icon: Clock,
    url: "/calendario",
    color: "bg-green-500 hover:bg-green-600",
    description: "Agendar atividade"
  },
  {
    title: "Simulado",
    icon: Award,
    url: "/simulados",
    color: "bg-purple-500 hover:bg-purple-600",
    description: "Fazer simulado"
  },
  {
    title: "Exercícios",
    icon: Zap,
    url: "/exercicios",
    color: "bg-orange-500 hover:bg-orange-600",
    description: "Questões com IA"
  }
] as const;
