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
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "IA Personalizada",
      description: "Algoritmos avançados que se adaptam ao seu ritmo e identificam suas dificuldades específicas.",
      stats: "95% de precisão"
    },
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: "Foco no Seu Vestibular",
      description: "Conteúdo direcionado para ENEM, FUVEST, UNICAMP e principais vestibulares do país.",
      stats: "50+ vestibulares"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Análise Detalhada",
      description: "Relatórios completos do seu desempenho com insights para melhorar seus pontos fracos.",
      stats: "Relatórios em tempo real"
    },
    {
      icon: <Calendar className="h-8 w-8 text-orange-600" />,
      title: "Cronograma Inteligente",
      description: "Planos de estudo otimizados que se ajustam automaticamente ao seu progresso.",
      stats: "Economia de 40% do tempo"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/LOGO-NOVA-APROVA.png" 
                alt="APROVA.AE" 
                className="h-12 w-auto"
              />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#funcionalidades" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Funcionalidades
              </a>
              <a href="#depoimentos" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Depoimentos
              </a>
              <a href="#estatisticas" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Resultados
              </a>
            </nav>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Começar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                <motion.div 
                  className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Powered by AI</span>
                </motion.div>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Sua aprovação no vestibular começa{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    aqui
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Plataforma de estudos com Inteligência Artificial que personaliza seu aprendizado 
                  e acelera sua aprovação nos melhores vestibulares do Brasil.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate('/login')}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Começar Gratuitamente</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl transition-colors flex items-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Ver Demonstração</span>
                </Button>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Grátis para começar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Sem cartão de crédito</span>
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

      {/* Stats Section */}
      <section id="estatisticas" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tecnologia que faz a diferença
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nossa plataforma combina inteligência artificial avançada com metodologias 
              comprovadas para maximizar seus resultados.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                    <div className="text-sm font-medium text-blue-600">
                      {feature.stats}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Histórias de sucesso
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Veja como nossos estudantes conquistaram suas aprovações
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {testimonial.university}
                        </div>
                        <div className="text-sm font-medium text-green-600">
                          {testimonial.score}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Pronto para conquistar sua aprovação?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Junte-se a milhares de estudantes que já transformaram seus estudos 
              e conquistaram suas vagas nos melhores vestibulares.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/login')}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl transition-colors"
              >
                Começar Agora - É Grátis
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl transition-colors"
              >
                Falar com Especialista
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-blue-100">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Teste grátis por 7 dias</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <img 
                src="/LOGO-NOVA-APROVA.png" 
                alt="APROVA.AE" 
                className="h-12 w-auto filter brightness-0 invert"
              />
              <p className="text-gray-400">
                Sua aprovação é nossa meta
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Planos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demonstração</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Serviço</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 APROVA.AE. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
