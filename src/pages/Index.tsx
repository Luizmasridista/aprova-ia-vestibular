import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Target, 
  Calendar, 
  BookOpen, 
  BarChart3, 
  Zap, 
  Users, 
  Award, 
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  TrendingUp,
  Clock,
  Sparkles,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Se o usuário estiver logado, redireciona para o dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: <Brain className="h-10 w-10" />,
      title: "IA Personalizada",
      subtitle: "Dois Cérebros Artificiais",
      description: "APRU 1B e APRU Reasoning trabalham juntos para criar uma experiência única e personalizada.",
      longDescription: "Nossa IA dupla processa suas respostas em milissegundos e analisa profundamente seus padrões de aprendizado, criando um plano de estudos que evolui com você.",
      stats: "97% de precisão",
      gradient: "from-blue-500 via-cyan-500 to-blue-600",
      bgGradient: "from-blue-50 to-cyan-50",
      glowColor: "blue",
      features: [
        "Feedback instantâneo em cada questão",
        "Identificação precisa dos pontos fracos",
        "Adaptação contínua ao ritmo",
        "Análise preditiva de desempenho"
      ],
      delay: 0
    },
    {
      icon: <Target className="h-10 w-10" />,
      title: "Metodologia Científica",
      subtitle: "Baseada em Neurociência",
      description: "Técnicas validadas por Harvard e MIT aplicadas aos seus estudos.",
      longDescription: "Utilizamos descobertas revolucionárias sobre como o cérebro aprende e memoriza, com métodos testados em laboratórios das melhores universidades.",
      stats: "15+ técnicas aplicadas",
      gradient: "from-purple-500 via-pink-500 to-purple-600",
      bgGradient: "from-purple-50 to-pink-50",
      glowColor: "purple",
      features: [
        "Repetição espaçada otimizada",
        "Técnicas de neuroplasticidade",
        "Curva de esquecimento personalizada",
        "Métodos baseados em evidências"
      ],
      delay: 0.2
    },
    {
      icon: <Zap className="h-10 w-10" />,
      title: "Gamificação Avançada",
      subtitle: "Vício Positivo nos Estudos",
      description: "Sistema baseado em dopamina que torna o aprendizado naturalmente viciante.",
      longDescription: "Transformamos estudar em um jogo irresistível, com conquistas que liberam neurotransmissores e reforçam o hábito de estudar.",
      stats: "89% mais motivação",
      gradient: "from-emerald-500 via-teal-500 to-cyan-600",
      bgGradient: "from-emerald-50 to-teal-50",
      glowColor: "emerald",
      features: [
        "Sistema de conquistas dinâmicas",
        "Batalhas intelectuais",
        "Missões personalizadas diárias",
        "Ranking inteligente e motivador"
      ],
      delay: 0.4
    },
    {
      icon: <BarChart3 className="h-10 w-10" />,
      title: "Analytics Preditivos",
      subtitle: "Inteligência de Dados",
      description: "Análise avançada que prevê seu desempenho e otimiza sua preparação.",
      longDescription: "Algoritmos de machine learning analisam milhões de dados para prever sua nota e identificar exatamente onde focar seus estudos.",
      stats: "Previsão 94% precisa",
      gradient: "from-orange-500 via-red-500 to-pink-600",
      bgGradient: "from-orange-50 to-red-50",
      glowColor: "orange",
      features: [
        "Previsão de nota por matéria",
        "Identificação de gaps de conhecimento",
        "Otimização automática de cronograma",
        "Relatórios em tempo real"
      ],
      delay: 0.6
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      university: "USP - Medicina",
      text: "O Aprova.AE foi fundamental na minha aprovação. A IA identificou exatamente onde eu precisava melhorar e me ajudou a focar nos pontos certos.",
      score: "850 pontos no ENEM",
      avatar: "MS"
    },
    {
      name: "João Santos",
      university: "UNICAMP - Engenharia",
      text: "Os simulados adaptativos me prepararam perfeitamente. Consegui identificar meus pontos fracos e trabalhar neles de forma eficiente.",
      score: "1º lugar no vestibular",
      avatar: "JS"
    },
    {
      name: "Ana Costa",
      university: "UFRJ - Direito",
      text: "A plataforma é incrível! O cronograma personalizado me ajudou a organizar meus estudos e não perder nenhum conteúdo importante.",
      score: "Top 5% dos aprovados",
      avatar: "AC"
    }
  ];

  const stats = [
    { number: "10.000+", label: "Estudantes aprovados" },
    { number: "95%", label: "Taxa de aprovação" },
    { number: "50+", label: "Vestibulares cobertos" },
    { number: "24/7", label: "Suporte disponível" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src="/LOGO-NOVA-APROVA.png" 
                  alt="APROVA.AE" 
                  className="h-14 w-auto drop-shadow-sm"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              </div>
            </div>
            <nav className="hidden md:flex space-x-10">
              <a href="#por-que-escolher" className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 relative group">
                Por que escolher
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a href="#funcionalidades" className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 relative group">
                Funcionalidades
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a href="#depoimentos" className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 relative group">
                Depoimentos
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
            </nav>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Começar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="space-y-10"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-8">
                <motion.div 
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 text-blue-800 px-6 py-3 rounded-full text-sm font-semibold shadow-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span>Powered by Advanced AI</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </motion.div>
                
                <h1 className="text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                  Sua aprovação no{' '}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                      vestibular
                    </span>
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-lg -z-10"></div>
                  </span>
                  {' '}começa aqui
                </h1>
                
                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed font-medium max-w-2xl">
                  A primeira plataforma de estudos com{' '}
                  <span className="text-blue-600 font-semibold">Inteligência Artificial dupla</span>
                  {' '}que personaliza seu aprendizado e acelera sua aprovação nos melhores vestibulares do Brasil.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Button 
                  onClick={() => navigate('/login')}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 text-lg font-bold rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 group"
                >
                  <span>Começar Gratuitamente</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/50 px-10 py-5 text-lg font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 backdrop-blur-sm group"
                >
                  <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>Ver Demonstração</span>
                </Button>
              </div>
              
              <div className="flex items-center space-x-8 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Grátis para começar</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Sem cartão de crédito</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">10k+</div>
                  <div className="text-sm text-gray-600 font-medium">Aprovados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600 font-medium">Taxa de sucesso</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">4.9★</div>
                  <div className="text-sm text-gray-600 font-medium">Avaliação</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Interface Completa do Sistema APROVA.AE */}
              <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-700">
                {/* Barra Superior Realística */}
                <div className="bg-slate-800 px-6 py-4 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="bg-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300 font-mono">
                        🔒 https://aprova.ae/dashboard
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-400 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Conectado</span>
                    </div>
                  </div>
                </div>
                
                {/* Dashboard Principal */}
                <div className="bg-gradient-to-br from-white to-slate-50 p-8">
                  {/* Header com Logo e Perfil */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">APROVA.AE</h2>
                        <p className="text-slate-600">Dashboard do Estudante</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 px-4 py-2 rounded-full flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-700 font-medium text-sm">Maria Silva - Online</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Métricas Principais */}
                  <div className="grid grid-cols-4 gap-6 mb-8">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Target className="w-8 h-8 text-blue-200" />
                        <span className="text-blue-200 text-sm font-medium">ENEM</span>
                      </div>
                      <div className="text-3xl font-bold mb-1">847</div>
                      <div className="text-blue-200 text-sm">Pontos Estimados</div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="w-8 h-8 text-green-200" />
                        <span className="text-green-200 text-sm font-medium">Acertos</span>
                      </div>
                      <div className="text-3xl font-bold mb-1">94%</div>
                      <div className="text-green-200 text-sm">Última Semana</div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <BookOpen className="w-8 h-8 text-purple-200" />
                        <span className="text-purple-200 text-sm font-medium">Exercícios</span>
                      </div>
                      <div className="text-3xl font-bold mb-1">1.247</div>
                      <div className="text-purple-200 text-sm">Resolvidos</div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Clock className="w-8 h-8 text-orange-200" />
                        <span className="text-orange-200 text-sm font-medium">Tempo</span>
                      </div>
                      <div className="text-3xl font-bold mb-1">47h</div>
                      <div className="text-orange-200 text-sm">Este Mês</div>
                    </motion.div>
                  </div>
                  
                  {/* Progresso Detalhado por Matéria */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Desempenho por Matéria</h3>
                      <div className="flex items-center space-x-2 text-green-600">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-semibold">+18% esta semana</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { name: 'Matemática', progress: 89, color: 'blue', icon: Brain },
                        { name: 'Português', progress: 94, color: 'green', icon: BookOpen },
                        { name: 'Física', progress: 82, color: 'purple', icon: Zap },
                        { name: 'Química', progress: 76, color: 'orange', icon: Target },
                        { name: 'Biologia', progress: 91, color: 'emerald', icon: Sparkles }
                      ].map((subject, index) => {
                        const IconComponent = subject.icon;
                        return (
                          <motion.div 
                            key={subject.name}
                            className="flex items-center space-x-4"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1.3 + index * 0.1 }}
                          >
                            <div className={`w-10 h-10 bg-${subject.color}-100 rounded-xl flex items-center justify-center`}>
                              <IconComponent className={`w-5 h-5 text-${subject.color}-600`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-slate-900">{subject.name}</span>
                                <span className="text-slate-600 font-medium">{subject.progress}%</span>
                              </div>
                              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div 
                                  className={`h-full bg-gradient-to-r from-${subject.color}-500 to-${subject.color}-600 rounded-full`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${subject.progress}%` }}
                                  transition={{ duration: 1.5, delay: 1.5 + index * 0.1 }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Atividade Recente e Próximos Eventos */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                          <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">Atividade Hoje</h4>
                          <p className="text-slate-600 text-sm">Meta: 25 exercícios</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700">Progresso</span>
                          <span className="font-bold text-blue-600">18/25</span>
                        </div>
                        <div className="w-full h-2 bg-blue-200 rounded-full">
                          <motion.div 
                            className="h-full bg-blue-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '72%' }}
                            transition={{ duration: 2, delay: 2 }}
                          />
                        </div>
                        <p className="text-sm text-slate-600">Faltam apenas 7 exercícios!</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">Próximo Simulado</h4>
                          <p className="text-slate-600 text-sm">ENEM 2024 - Completo</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700">Data</span>
                          <span className="font-bold text-purple-600">Sábado, 15:00</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700">Duração</span>
                          <span className="font-bold text-purple-600">5h 30min</span>
                        </div>
                        <div className="bg-purple-100 rounded-lg p-3 mt-3">
                          <p className="text-sm text-purple-800 font-medium">✨ Simulado com IA personalizada</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Revolutionary Why Choose Section */}
      <section id="por-que-escolher" className="py-32 relative overflow-hidden">
        {/* Dynamic Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Hero Header */}
          <motion.div 
            className="text-center mb-24"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full text-white font-medium mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <span>Revolução na Educação</span>
            </motion.div>
            
            <motion.h2 
              className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Por que escolher o{' '}
              <motion.span 
                className="relative inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-300% bg-size-300">
                  Aprova.AE
                </span>
                <motion.div 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  viewport={{ once: true }}
                />
              </motion.span>
              ?
            </motion.h2>
            
            <motion.p 
              className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              viewport={{ once: true }}
            >
              A primeira plataforma que combina <span className="text-cyan-400 font-semibold">IA Generativa</span>, 
              <span className="text-purple-400 font-semibold"> Neurociência</span> e 
              <span className="text-blue-400 font-semibold">Gamificação</span> para revolucionar seus estudos.
            </motion.p>
          </motion.div>
          
          {/* Interactive Window Cards */}
           <div className="grid lg:grid-cols-3 gap-8 mb-20">
             {[
               {
                 icon: <Brain className="h-12 w-12" />,
                 title: "Inteligência Artificial",
                 subtitle: "Que Realmente Entende Você",
                 shortDesc: "IA que aprende com você",
                 fullContent: {
                   headline: "Dois Cérebros Artificiais Trabalhando Para Você",
                   description: "APRU 1B processa suas respostas em milissegundos, enquanto APRU Reasoning analisa profundamente seus padrões de aprendizado. Juntos, criam uma experiência única e personalizada.",
                   benefits: [
                     { icon: "⚡", text: "Feedback instantâneo em cada questão" },
                     { icon: "🎯", text: "Identificação precisa dos seus pontos fracos" },
                     { icon: "🧠", text: "Adaptação contínua ao seu ritmo de aprendizado" },
                     { icon: "📊", text: "Análise preditiva do seu desempenho" }
                   ],
                   stats: { number: "97%", label: "Precisão na personalização" }
                 },
                 gradient: "from-blue-500 via-cyan-500 to-blue-600",
                 bgPattern: "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)",
                 delay: 0
               },
               {
                 icon: <Target className="h-12 w-12" />,
                 title: "Metodologia Científica",
                 subtitle: "Baseada em Neurociência",
                 shortDesc: "Ciência aplicada aos estudos",
                 fullContent: {
                   headline: "Técnicas Validadas por Harvard e MIT",
                   description: "Utilizamos descobertas revolucionárias sobre como o cérebro aprende e memoriza. Cada técnica foi testada e comprovada em laboratórios de neurociência das melhores universidades do mundo.",
                   benefits: [
                     { icon: "🧬", text: "Repetição espaçada otimizada" },
                     { icon: "💡", text: "Técnicas de neuroplasticidade" },
                     { icon: "⏰", text: "Curva de esquecimento personalizada" },
                     { icon: "🔬", text: "Métodos baseados em evidências científicas" }
                   ],
                   stats: { number: "15+", label: "Técnicas de neurociência aplicadas" }
                 },
                 gradient: "from-purple-500 via-pink-500 to-purple-600",
                 bgPattern: "radial-gradient(circle at 30% 70%, rgba(168, 85, 247, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
                 delay: 0.2
               },
               {
                 icon: <Zap className="h-12 w-12" />,
                 title: "Gamificação Avançada",
                 subtitle: "Vício Positivo nos Estudos",
                 shortDesc: "Estudar nunca foi tão viciante",
                 fullContent: {
                   headline: "Transformamos Estudar em um Jogo Irresistível",
                   description: "Sistema baseado em dopamina e flow state que torna o aprendizado naturalmente viciante. Cada conquista libera neurotransmissores que reforçam o hábito de estudar.",
                   benefits: [
                     { icon: "🏆", text: "Sistema de conquistas dinâmicas" },
                     { icon: "⚔️", text: "Batalhas intelectuais com outros estudantes" },
                     { icon: "🎮", text: "Missões personalizadas diárias" },
                     { icon: "📈", text: "Ranking inteligente e motivador" }
                   ],
                   stats: { number: "89%", label: "Aumento na motivação para estudar" }
                 },
                 gradient: "from-emerald-500 via-teal-500 to-cyan-600",
                 bgPattern: "radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 40%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)",
                 delay: 0.4
               }
             ].map((item, index) => (
               <motion.div 
                 key={index}
                 className="group relative perspective-1000"
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ 
                   duration: 0.8, 
                   delay: item.delay,
                   type: "spring",
                   stiffness: 100
                 }}
                 viewport={{ once: true }}
               >
                 {/* Enhanced Glow Effect */}
                 <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-60 transition-all duration-700 scale-110`}></div>
                 
                 {/* Window Card Container */}
                 <div className="relative h-96 preserve-3d group-hover:rotateY-12 transition-all duration-700">
                   
                   {/* Front Face - Closed Window */}
                   <div className="absolute inset-0 backface-hidden">
                     <div 
                       className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 h-full overflow-hidden group-hover:opacity-0 transition-all duration-700"
                       style={{ background: item.bgPattern }}
                     >
                       {/* Window Frame Effect */}
                       <div className="absolute inset-4 border-2 border-white/10 rounded-2xl"></div>
                       <div className="absolute top-6 left-6 right-6 h-8 bg-white/5 rounded-t-xl border-b border-white/10"></div>
                       
                       {/* Window Controls */}
                       <div className="absolute top-8 left-10 flex space-x-2">
                         <div className="w-3 h-3 bg-red-400/60 rounded-full"></div>
                         <div className="w-3 h-3 bg-yellow-400/60 rounded-full"></div>
                         <div className="w-3 h-3 bg-green-400/60 rounded-full"></div>
                       </div>
                       
                       {/* Closed Content */}
                       <div className="relative z-10 pt-12">
                         <motion.div 
                           className={`w-24 h-24 bg-gradient-to-r ${item.gradient} rounded-3xl flex items-center justify-center text-white mb-6 mx-auto shadow-2xl`}
                           whileHover={{ scale: 1.1, rotate: 5 }}
                         >
                           {item.icon}
                         </motion.div>
                         
                         <h3 className="text-2xl font-bold text-white mb-2 text-center">
                           {item.title}
                         </h3>
                         <p className="text-blue-200 text-center mb-4 font-medium">
                           {item.subtitle}
                         </p>
                         <div className="text-center">
                           <span className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/80 text-sm border border-white/20">
                             {item.shortDesc}
                           </span>
                         </div>
                         
                         {/* Hover Indicator */}
                         <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                           <motion.div 
                             className="flex items-center space-x-2 text-white/60 text-sm"
                             animate={{ y: [0, -5, 0] }}
                             transition={{ duration: 2, repeat: Infinity }}
                           >
                             <span>Passe o mouse para abrir</span>
                             <ArrowRight className="h-4 w-4" />
                           </motion.div>
                         </div>
                       </div>
                     </div>
                   </div>
                   
                   {/* Back Face - Opened Window */}
                   <div className="absolute inset-0 backface-hidden rotateY-180">
                     <div className="relative bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-8 h-full overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                       {/* Enhanced Window Frame */}
                       <div className="absolute inset-2 border-2 border-white/20 rounded-2xl"></div>
                       <div className="absolute top-4 left-4 right-4 h-10 bg-white/10 rounded-t-xl border-b border-white/20"></div>
                       
                       {/* Enhanced Window Controls */}
                       <div className="absolute top-7 left-8 flex space-x-2">
                         <div className="w-4 h-4 bg-red-400 rounded-full shadow-lg"></div>
                         <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-lg"></div>
                         <div className="w-4 h-4 bg-green-400 rounded-full shadow-lg"></div>
                       </div>
                       
                       {/* Opened Content */}
                       <div className="relative z-10 pt-16 h-full overflow-y-auto">
                         <motion.div 
                           className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center text-white mb-4 shadow-2xl`}
                           initial={{ scale: 0, rotate: -180 }}
                           whileInView={{ scale: 1, rotate: 0 }}
                           transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                         >
                           {item.icon}
                         </motion.div>
                         
                         <motion.h4 
                           className="text-xl font-bold text-white mb-3 leading-tight"
                           initial={{ opacity: 0, x: -20 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           transition={{ delay: 0.6 }}
                         >
                           {item.fullContent.headline}
                         </motion.h4>
                         
                         <motion.p 
                           className="text-blue-100 text-sm leading-relaxed mb-4"
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ delay: 0.7 }}
                         >
                           {item.fullContent.description}
                         </motion.p>
                         
                         {/* Benefits List */}
                         <div className="space-y-2 mb-4">
                           {item.fullContent.benefits.map((benefit, benefitIndex) => (
                             <motion.div 
                               key={benefitIndex}
                               className="flex items-center space-x-3"
                               initial={{ opacity: 0, x: -20 }}
                               whileInView={{ opacity: 1, x: 0 }}
                               transition={{ delay: 0.8 + benefitIndex * 0.1 }}
                             >
                               <span className="text-lg">{benefit.icon}</span>
                               <span className="text-white/90 text-xs font-medium">{benefit.text}</span>
                             </motion.div>
                           ))}
                         </div>
                         
                         {/* Stats */}
                         <motion.div 
                           className="mt-auto pt-4 border-t border-white/20"
                           initial={{ opacity: 0, scale: 0.8 }}
                           whileInView={{ opacity: 1, scale: 1 }}
                           transition={{ delay: 1.2 }}
                         >
                           <div className="text-center">
                             <div className={`text-2xl font-black bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                               {item.fullContent.stats.number}
                             </div>
                             <div className="text-white/70 text-xs font-medium">
                               {item.fullContent.stats.label}
                             </div>
                           </div>
                         </motion.div>
                       </div>
                     </div>
                   </div>
                 </div>
               </motion.div>
             ))}
           </div>
          
          {/* Revolutionary Stats */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Stats Background */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10"></div>
            
            <div className="relative p-12">
              <div className="text-center mb-16">
                <motion.h3 
                  className="text-4xl font-bold text-white mb-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  viewport={{ once: true }}
                >
                  Resultados que Falam por Si
                </motion.h3>
                <motion.p 
                  className="text-blue-200 text-xl mb-12"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  viewport={{ once: true }}
                >
                  Milhares de estudantes já conquistaram seus objetivos com nossa plataforma.
                </motion.p>
                
                {/* Hero Stat - 85% */}
                <motion.div 
                  className="relative mb-16 mx-auto max-w-2xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
                  viewport={{ once: true }}
                >
                  {/* Glowing Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 rounded-3xl blur-3xl animate-pulse"></div>
                  
                  {/* Main Card */}
                  <motion.div 
                    className="relative bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-12 shadow-2xl"
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Floating Particles */}
                    <motion.div 
                      className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full shadow-lg"
                      animate={{ 
                        y: [-8, 8, -8],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    ></motion.div>
                    
                    <motion.div 
                      className="absolute bottom-4 left-4 w-2 h-2 bg-green-400 rounded-full shadow-lg"
                      animate={{ 
                        x: [-6, 6, -6],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    ></motion.div>
                    
                    <motion.div 
                      className="absolute top-1/2 left-4 w-1 h-1 bg-purple-400 rounded-full shadow-lg"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                      }}
                    ></motion.div>
                    
                    {/* Main Number */}
                    <motion.div 
                      className="text-9xl font-black bg-gradient-to-r from-yellow-400 via-white to-green-400 bg-clip-text text-transparent mb-4"
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 200, 
                        delay: 1.6,
                        duration: 1
                      }}
                      whileHover={{ 
                        scale: 1.1,
                        filter: "drop-shadow(0 0 30px rgba(255, 255, 255, 0.8))"
                      }}
                    >
                      85%
                    </motion.div>
                    
                    {/* Description */}
                    <motion.p 
                      className="text-2xl text-white font-semibold mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.8 }}
                    >
                      dos nossos alunos passaram no vestibular
                    </motion.p>
                    
                    {/* Progress Bar */}
                    <motion.div 
                      className="w-full h-3 bg-white/20 rounded-full overflow-hidden mb-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 2 }}
                    >
                      <motion.div 
                        className="h-full bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 rounded-full shadow-lg"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "85%" }}
                        transition={{ 
                          delay: 2.2, 
                          duration: 2,
                          ease: "easeOut"
                        }}
                      ></motion.div>
                    </motion.div>
                    
                    {/* Additional Info */}
                    <motion.p 
                      className="text-blue-200 text-lg"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 2.4 }}
                    >
                      Baseado em dados reais de mais de 15.000 estudantes
                    </motion.p>
                  </motion.div>
                </motion.div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { 
                    number: "10.000", 
                    label: "Estudantes ativos", 
                    icon: <Users className="h-10 w-10" />,
                    gradient: "from-blue-500 to-cyan-400",
                    prefix: "+",
                    bgPattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_70%)]",
                    description: "Comunidade ativa de estudantes"
                  },
                  { 
                    number: "50.000", 
                    label: "Questões resolvidas", 
                    icon: <BookOpen className="h-10 w-10" />,
                    gradient: "from-emerald-500 to-teal-400",
                    prefix: "+",
                    bgPattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.3),transparent_70%)]",
                    description: "Base completa de exercícios"
                  },
                  { 
                    number: "95", 
                    label: "Taxa de satisfação", 
                    icon: <Target className="h-10 w-10" />,
                    gradient: "from-purple-500 to-pink-400",
                    suffix: "%",
                    bgPattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.3),transparent_70%)]",
                    description: "Aprovação dos estudantes"
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="group relative"
                    initial={{ opacity: 0, y: 50, rotateX: -15 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ 
                      delay: 2.6 + index * 0.2,
                      type: "spring",
                      stiffness: 200
                    }}
                    viewport={{ once: true }}
                  >
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 ${stat.bgPattern} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {/* Main Card */}
                    <motion.div
                      className={`relative bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl overflow-hidden`}
                      whileHover={{ 
                        scale: 1.05,
                        y: -10,
                        rotateY: 5,
                        transition: { 
                          type: "spring", 
                          stiffness: 300,
                          damping: 20
                        }
                      }}
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
                      </div>
                      
                      {/* Icon Container */}
                      <motion.div 
                        className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-6 shadow-lg mx-auto`}
                        whileHover={{ 
                          rotate: [0, -10, 10, 0],
                          scale: 1.1
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div
                          className="text-white"
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          {stat.icon}
                        </motion.div>
                        
                        {/* Icon Glow */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl blur-lg opacity-50 -z-10`}></div>
                      </motion.div>
                      
                      {/* Number with Counter Animation */}
                      <motion.div 
                        className="text-5xl font-black text-white mb-3 text-center"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ 
                          delay: 2.8 + index * 0.2,
                          type: "spring",
                          stiffness: 300
                        }}
                        whileHover={{ 
                          scale: 1.1,
                          textShadow: "0 0 20px rgba(255,255,255,0.8)"
                        }}
                      >
                        {stat.prefix}{stat.number}{stat.suffix}
                      </motion.div>
                      
                      {/* Label */}
                      <motion.div 
                        className="text-white font-semibold text-lg mb-2 text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 3 + index * 0.2 }}
                      >
                        {stat.label}
                      </motion.div>
                      
                      {/* Description */}
                      <motion.div 
                        className="text-blue-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center"
                        initial={{ y: 10 }}
                        whileHover={{ y: 0 }}
                      >
                        {stat.description}
                      </motion.div>
                      
                      {/* Hover Line Effect */}
                      <motion.div 
                        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.gradient} rounded-full`}
                        initial={{ width: "0%" }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      ></motion.div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Section - Como Funciona */}
      <section id="funcionalidades" className="py-32 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-purple-600/20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full text-white font-medium mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <span>Como Funciona</span>
            </motion.div>
            
            <motion.h2 
              className="text-5xl lg:text-6xl font-black text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Tecnologia que{' '}
              <motion.span 
                className="relative inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-300% bg-size-300">
                  Revoluciona
                </span>
                <motion.div 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  viewport={{ once: true }}
                />
              </motion.span>
            </motion.h2>
            
            <motion.p 
              className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Quatro pilares tecnológicos que transformam completamente sua forma de estudar
            </motion.p>
          </motion.div>
          
          {/* Interactive Feature Cards */}
          <div className="grid lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="group relative perspective-1000"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: feature.delay,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
              >
                {/* Enhanced Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-3xl opacity-0 group-hover:opacity-40 transition-all duration-700 scale-110`}></div>
                
                {/* Main Card Container */}
                <div className="relative h-auto preserve-3d group-hover:rotateY-6 transition-all duration-700">
                  
                  {/* Card Content */}
                  <div className={`relative bg-gradient-to-br ${feature.bgGradient} backdrop-blur-xl border border-white/20 rounded-3xl p-8 overflow-hidden group-hover:shadow-2xl transition-all duration-700`}>
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient}`}></div>
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), 
                                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
                      }}></div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon and Header */}
                      <div className="flex items-start space-x-6 mb-6">
                        <motion.div 
                          className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-all duration-500`}
                          whileHover={{ rotate: 5, scale: 1.1 }}
                        >
                          {feature.icon}
                        </motion.div>
                        
                        <div className="flex-1">
                          <motion.h3 
                            className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: feature.delay + 0.2 }}
                          >
                            {feature.title}
                          </motion.h3>
                          <motion.p 
                            className={`text-sm font-semibold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: feature.delay + 0.3 }}
                          >
                            {feature.subtitle}
                          </motion.p>
                        </div>
                        
                        {/* Stats Badge */}
                        <motion.div 
                          className={`bg-gradient-to-r ${feature.gradient} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: feature.delay + 0.4, type: "spring", stiffness: 200 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {feature.stats}
                        </motion.div>
                      </div>
                      
                      {/* Description */}
                      <motion.p 
                        className="text-gray-700 text-lg leading-relaxed mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: feature.delay + 0.5 }}
                      >
                        {feature.description}
                      </motion.p>
                      
                      {/* Expandable Content */}
                      <motion.div 
                        className="space-y-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"
                        initial={{ height: 0 }}
                        whileInView={{ height: "auto" }}
                        transition={{ delay: feature.delay + 0.6 }}
                      >
                        <p className="text-gray-600 leading-relaxed">
                          {feature.longDescription}
                        </p>
                        
                        {/* Feature List */}
                        <div className="grid grid-cols-1 gap-3 mt-6">
                          {feature.features.map((item, itemIndex) => (
                            <motion.div 
                              key={itemIndex}
                              className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/30"
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: feature.delay + 0.7 + itemIndex * 0.1 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                            >
                              <div className={`w-2 h-2 bg-gradient-to-r ${feature.gradient} rounded-full`}></div>
                              <span className="text-gray-700 font-medium text-sm">{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                      
                      {/* Hover Indicator */}
                      <motion.div 
                        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                          <span>Explore mais</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Bottom CTA */}
          <motion.div 
            className="text-center mt-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full text-white"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="h-6 w-6 text-cyan-400" />
              <span className="text-lg font-semibold">Experimente a revolução tecnológica nos estudos</span>
              <ArrowRight className="h-6 w-6 text-cyan-400" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section id="depoimentos" className="relative py-32 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Animated Background Patterns */}
          <motion.div 
            className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-green-400/10 to-cyan-400/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
          />
          
          {/* Floating Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Success Badge */}
            <motion.div 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-200/50 px-6 py-3 rounded-full mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05 }}
            >
              <Award className="h-5 w-5 text-green-600" />
              <span className="text-green-700 font-semibold text-sm">Histórias Reais de Sucesso</span>
              <Sparkles className="h-4 w-4 text-green-500" />
            </motion.div>
            
            {/* Main Title */}
            <motion.h2 
              className="text-5xl md:text-6xl font-black mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Transformamos
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent relative">
                Sonhos em Realidade
                {/* Animated Underline */}
                <motion.div 
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
                />
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Conheça estudantes que <span className="font-semibold text-blue-600">conquistaram suas aprovações</span> e 
              <span className="font-semibold text-green-600"> mudaram suas vidas</span> com nossa plataforma revolucionária.
            </motion.p>
            
            {/* Success Stats */}
            <motion.div 
              className="flex flex-wrap justify-center gap-8 mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {[
                { number: "15.000+", label: "Aprovados", icon: <Users className="h-5 w-5" />, color: "from-blue-500 to-cyan-400" },
                { number: "85%", label: "Taxa de Sucesso", icon: <Target className="h-5 w-5" />, color: "from-green-500 to-emerald-400" },
                { number: "4.9/5", label: "Avaliação", icon: <Star className="h-5 w-5" />, color: "from-yellow-500 to-orange-400" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm border border-white/50 px-6 py-3 rounded-2xl shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Enhanced Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-110"></div>
                
                {/* Main Card */}
                <motion.div 
                  className="relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl group-hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500"></div>
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%), 
                                       radial-gradient(circle at 75% 75%, rgba(255,255,255,0.3) 0%, transparent 50%)`
                    }}></div>
                  </div>
                  
                  {/* Quote Icon */}
                  <motion.div 
                    className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.2 + 0.5, type: "spring", stiffness: 200 }}
                  >
                    <Quote className="h-6 w-6 text-blue-600/60" />
                  </motion.div>
                  
                  {/* Content */}
                  <div className="relative z-10 space-y-6">
                    {/* Stars */}
                    <motion.div 
                      className="flex items-center space-x-1"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          transition={{ 
                            delay: index * 0.2 + 0.4 + i * 0.1,
                            type: "spring",
                            stiffness: 300
                          }}
                        >
                          <Star className="h-5 w-5 text-yellow-400 fill-current drop-shadow-sm" />
                        </motion.div>
                      ))}
                    </motion.div>
                    
                    {/* Testimonial Text */}
                    <motion.blockquote 
                      className="text-gray-700 text-lg leading-relaxed font-medium italic relative"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 + 0.6 }}
                    >
                      <span className="text-2xl text-blue-500/40 absolute -top-2 -left-1">"</span>
                      {testimonial.text}
                      <span className="text-2xl text-blue-500/40 absolute -bottom-4 -right-1">"</span>
                    </motion.blockquote>
                    
                    {/* Student Info */}
                    <motion.div 
                      className="flex items-center space-x-4 pt-4 border-t border-gray-200/50"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 + 0.8 }}
                    >
                      {/* Avatar */}
                      <motion.div 
                        className="relative"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {testimonial.avatar}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      </motion.div>
                      
                      {/* Student Details */}
                      <div className="flex-1">
                        <motion.div 
                          className="font-bold text-gray-900 text-lg"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 + 0.9 }}
                        >
                          {testimonial.name}
                        </motion.div>
                        <motion.div 
                          className="text-gray-600 font-medium"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 + 1 }}
                        >
                          {testimonial.university}
                        </motion.div>
                        <motion.div 
                          className="flex items-center space-x-2 mt-1"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 + 1.1 }}
                        >
                          <div className="bg-gradient-to-r from-green-500 to-emerald-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                            {testimonial.score}
                          </div>
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Hover Effect Indicator */}
                  <motion.div 
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="flex items-center space-x-1 text-blue-500 text-xs font-medium">
                      <span>Aprovado</span>
                      <CheckCircle className="h-3 w-3" />
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
          
          {/* Bottom CTA */}
          <motion.div 
            className="text-center mt-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 backdrop-blur-md border border-white/30 px-8 py-4 rounded-full text-gray-800 shadow-lg"
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "rgba(255,255,255,0.8)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Users className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold">Junte-se a mais de 15.000 estudantes aprovados</span>
              <ArrowRight className="h-6 w-6 text-green-600" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Animated Background Patterns */}
          <motion.div 
            className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
            animate={{ 
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 10
            }}
          />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          {/* Floating Elements */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-30, 30, -30],
                x: [-20, 20, -20],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 6 + Math.random() * 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="space-y-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            {/* CTA Badge */}
            <motion.div 
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-300/30 px-8 py-4 rounded-full mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(6, 182, 212, 0.15)" }}
            >
              <Zap className="h-6 w-6 text-cyan-400" />
              <span className="text-cyan-300 font-bold text-lg">Transforme Seu Futuro Agora</span>
              <Sparkles className="h-5 w-5 text-cyan-400" />
            </motion.div>
            
            {/* Main CTA Title */}
            <motion.h2 
              className="text-6xl md:text-7xl font-black mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                Pronto para
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent relative">
                Conquistar Sua Aprovação?
                {/* Animated Underline */}
                <motion.div 
                  className="absolute -bottom-4 left-0 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                />
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-2xl md:text-3xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Junte-se a <span className="font-bold text-cyan-300">mais de 15.000 estudantes</span> que já 
              <span className="font-bold text-white">transformaram seus estudos</span> e conquistaram suas vagas nos 
              <span className="font-bold text-purple-300">melhores vestibulares</span> do país.
            </motion.p>
            
            {/* Enhanced CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button 
                  onClick={() => navigate('/login')}
                  size="lg"
                  className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl border-0 overflow-hidden group"
                >
                  {/* Button Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/50 to-blue-500/50 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
                  
                  {/* Button Content */}
                  <div className="relative flex items-center space-x-3">
                    <Zap className="h-6 w-6" />
                    <span>Começar Agora - É Grátis</span>
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                  
                  {/* Shine Effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.8 }}
                  />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button 
                  variant="outline"
                  size="lg"
                  className="relative border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-12 py-6 text-xl font-bold rounded-2xl backdrop-blur-sm group overflow-hidden"
                >
                  {/* Button Content */}
                  <div className="relative flex items-center space-x-3">
                    <Users className="h-6 w-6" />
                    <span>Falar com Especialista</span>
                    <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </div>
                  
                  {/* Hover Background */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-white/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  />
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Enhanced Benefits */}
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-8 mt-12 text-blue-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              {[
                { icon: <CheckCircle className="h-6 w-6" />, text: "Teste grátis por 7 dias", color: "from-green-400 to-emerald-400" },
                { icon: <Clock className="h-6 w-6" />, text: "Cancele quando quiser", color: "from-blue-400 to-cyan-400" },
                { icon: <Award className="h-6 w-6" />, text: "Garantia de satisfação", color: "from-purple-400 to-pink-400" }
              ].map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${benefit.color} rounded-full flex items-center justify-center text-white`}>
                    {benefit.icon}
                  </div>
                  <span className="font-semibold text-lg">{benefit.text}</span>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div 
              className="mt-16 pt-12 border-t border-white/20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <p className="text-blue-200 text-lg mb-8 font-medium">
                Mais de <span className="font-bold text-cyan-300">15.000 estudantes</span> já confiam em nossa plataforma
              </p>
              
              {/* Success Metrics */}
              <div className="flex flex-wrap justify-center gap-12">
                {[
                  { number: "85%", label: "Taxa de Aprovação", icon: <Target className="h-8 w-8" /> },
                  { number: "4.9/5", label: "Avaliação dos Usuários", icon: <Star className="h-8 w-8" /> },
                  { number: "24/7", label: "Suporte Disponível", icon: <Users className="h-8 w-8" /> }
                ].map((metric, index) => (
                  <motion.div 
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex justify-center mb-3 text-cyan-400">
                      {metric.icon}
                    </div>
                    <div className="text-3xl font-black text-white mb-2">{metric.number}</div>
                    <div className="text-blue-200 font-medium">{metric.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Subtle Grid */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          {/* Floating Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            {/* Brand Section */}
            <div className="md:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <img 
                  src="/LOGO-NOVA-APROVA.png" 
                  alt="APROVA.AE" 
                  className="h-16 w-auto filter brightness-0 invert mb-6"
                />
                <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                  <span className="font-semibold text-white">Sua aprovação é nossa meta.</span><br />
                  Transformamos sonhos em realidade através da tecnologia mais avançada em educação.
                </p>
                
                {/* Social Proof */}
                <div className="flex items-center space-x-4 mt-6">
                  <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 font-medium text-sm">15.000+ estudantes ativos</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Navigation Columns */}
            {[
              {
                title: "Produto",
                links: [
                  { name: "Funcionalidades", href: "#funcionalidades" },
                  { name: "IA Personalizada", href: "#" },
                  { name: "Planos e Preços", href: "#" },
                  { name: "Demonstração", href: "#" }
                ]
              },
              {
                title: "Empresa",
                links: [
                  { name: "Sobre Nós", href: "#" },
                  { name: "Nossa Missão", href: "#" },
                  { name: "Blog", href: "#" },
                  { name: "Carreiras", href: "#" }
                ]
              },
              {
                title: "Suporte",
                links: [
                  { name: "Central de Ajuda", href: "#" },
                  { name: "Contato", href: "#" },
                  { name: "Política de Privacidade", href: "#" },
                  { name: "Termos de Serviço", href: "#" }
                ]
              }
            ].map((column, columnIndex) => (
              <motion.div 
                key={columnIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: columnIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-bold text-xl text-white mb-6 relative">
                  {column.title}
                  <div className="absolute -bottom-2 left-0 w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </h4>
                <ul className="space-y-4">
                  {column.links.map((link, linkIndex) => (
                    <motion.li 
                      key={linkIndex}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <a 
                        href={link.href} 
                        className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
                      >
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span>{link.name}</span>
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          
          {/* Bottom Section */}
          <motion.div 
            className="border-t border-gray-800 pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6 text-gray-400">
                <p>&copy; 2024 APROVA.AE. Todos os direitos reservados.</p>
                <div className="hidden md:flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Sistema operacional</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">Feito com</span>
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <span className="text-red-400 text-lg">❤️</span>
                  </motion.div>
                  <span className="text-gray-400 text-sm">para estudantes brasileiros</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
