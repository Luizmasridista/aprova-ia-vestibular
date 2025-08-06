import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import GradientText from '../components/ui/GradientText';
import AnimatedText from '../components/ui/AnimatedText';
import Stack from '@/components/ui/Stack';
import { 
  Brain, 
  Calendar, 
  Target, 
  Users, 
  Zap, 
  BookOpen, 
  BarChart3, 
  Sparkles, 
  CheckCircle 
} from 'lucide-react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';


// Hook para animações de scroll
const useScrollAnimation = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return {
    ref,
    initial: { opacity: 0, y: 60 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 },
    transition: { duration: 0.8, ease: "easeOut" }
  };
};

// Variantes de animação para seções
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);

  // Verifica se o usuário já está autenticado
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/');
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      }
    };
    
    checkSession();
  }, [navigate]);

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "Personalização com IA",
      description: "Planos individualizados e questionário de ensino adaptado às suas necessidades.",
      highlight: "Baseado em suas preferências"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      title: "Acompanhamento de desempenho",
      description: "Análise de progresso personalizada.",
      highlight: "Simulados e estatísticas"
    },
    {
      icon: <Target className="h-8 w-8 text-purple-600" />,
      title: "Prática direcionada",
      description: "Simulados e exercícios baseados em suas áreas de estudo.",
      highlight: "Baseado em suas áreas de estudo"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-orange-600" />,
      title: "Conteúdo de especialistas",
      description: "Elaborado por materiais e equipe especializada educação.",
      highlight: "Elaborado por especialistas"
    }
  ];

  if (showLoginForm || showSignupForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
          <button
            onClick={() => {
              setShowLoginForm(false);
              setShowSignupForm(false);
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <img 
                src="/LOGO-NOVA-APROVA.png" 
                alt="APROVA.AE" 
                className="h-25"
              />
            </div>

            <LoginForm initialMode={showSignupForm ? 'signup' : 'login'} />
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Ou continue com</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: {
                        redirectTo: window.location.origin,
                      },
                    });
                  }}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <span className="sr-only">Entrar com Google</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                  </svg>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    supabase.auth.signInWithOAuth({
                      provider: 'github',
                      options: {
                        redirectTo: window.location.origin,
                      },
                    });
                  }}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <span className="sr-only">Entrar com GitHub</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.699 1.028 1.595 1.028 2.688 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14,18.199,20,14.438,20,10.017C20,4.484,15.522,0,10,0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowLoginForm(false)}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                ← Voltar para página inicial
              </button>
            </div>
          </div>
          <div className="px-8 py-4 bg-gray-50 text-center">
            <p className="text-sm text-gray-600">
              Ao continuar, você concorda com nossos{' '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Termos de Serviço
              </a>{' '}
              e{' '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Política de Privacidade
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <motion.section 
        className="pt-8 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        {/* Navigation Bar */}
        <motion.div 
          className="flex justify-end items-center mb-12"
          variants={itemVariants}
        >
          <nav className="hidden md:flex space-x-8">
            <a href="#funcionalidades" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Funcionalidades
            </a>
            <a href="#depoimentos" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Depoimentos
            </a>
            <a href="#planos" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Planos
            </a>
          </nav>
          <div className="flex items-center space-x-4 ml-8">
            <Button 
              onClick={() => setShowLoginForm(true)}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Entrar
            </Button>
            <Button 
              onClick={() => setShowSignupForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Experimente Grátis
            </Button>
          </div>
        </motion.div>

        {/* Hero Content */}
        <div className="flex-1 flex items-center">
          <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div className="space-y-4" variants={itemVariants}>
              {/* Logo com animação de flutuação */}
              <motion.div 
                className="flex justify-center lg:justify-start"
                variants={itemVariants}
              >
                <motion.img 
                  src="/LOGO-NOVA-APROVA.png" 
                  alt="APROVA.AE" 
                  className="h-48 lg:h-64 w-auto"
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    y: -12,
                    transition: { duration: 0.3 }
                  }}
                />
              </motion.div>
              
              <div className="space-y-4">
                <motion.h1 
                  className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                  variants={itemVariants}
                >
                  Domine o vestibular com{' '}
                  <AnimatedText 
                    words={['Inteligência Artificial', 'Versatilidade', 'Exercícios', 'Simulados']}
                    className="text-5xl lg:text-6xl font-bold"
                    duration={3000}
                  />{' '}
                  <motion.span className="block" variants={itemVariants}>que realmente funciona</motion.span>
                </motion.h1>
                <motion.p 
                  className="text-xl text-gray-600 leading-relaxed"
                  variants={itemVariants}
                >
                  Transforme seus estudos com IA que adapta, personaliza e acelera
                  sua aprovação nos melhores vestibulares do país.
                </motion.p>
              </div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={() => setShowLoginForm(true)}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200"
                  >
                    Começar Agora
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl transition-colors"
                  >
                    Ver Demonstração
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative"
              variants={itemVariants}
            >
              {/* Preview do Dashboard Real */}
              <motion.div 
                className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 overflow-hidden"
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header do Dashboard */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Dashboard APROVA.AE</div>
                </div>

                {/* Quick Stats Preview */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <motion.div 
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">Hoje</span>
                    </div>
                    <div className="text-lg font-bold text-blue-800">5</div>
                    <div className="text-xs text-blue-600">atividades</div>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-3"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-700">Taxa</span>
                    </div>
                    <div className="text-lg font-bold text-emerald-800">87%</div>
                    <div className="text-xs text-emerald-600">conclusão</div>
                  </motion.div>
                </div>

                {/* Planos de Estudo Preview */}
                <motion.div 
                  className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-800">Planos com IA</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-purple-700">3</div>
                      <div className="text-xs text-purple-600">Ativos</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-indigo-700">12</div>
                      <div className="text-xs text-indigo-600">Horas/sem</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-700">92%</div>
                      <div className="text-xs text-blue-600">Progresso</div>
                    </div>
                  </div>
                </motion.div>

                {/* Progresso por Matéria */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-xs font-medium text-gray-700 mb-2">Progresso por Matéria</div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">M</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Matemática</span>
                        <span className="text-blue-600 font-medium">85%</span>
                      </div>
                      <motion.div 
                        className="h-2 bg-gray-200 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                      >
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ duration: 1, delay: 0.8 }}
                        />
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-green-600">P</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Português</span>
                        <span className="text-green-600 font-medium">78%</span>
                      </div>
                      <motion.div 
                        className="h-2 bg-gray-200 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                      >
                        <motion.div 
                          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "78%" }}
                          transition={{ duration: 1, delay: 1.0 }}
                        />
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-600">F</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Física</span>
                        <span className="text-purple-600 font-medium">72%</span>
                      </div>
                      <motion.div 
                        className="h-2 bg-gray-200 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 1.1 }}
                      >
                        <motion.div 
                          className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "72%" }}
                          transition={{ duration: 1, delay: 1.2 }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Footer com IA */}
                <motion.div 
                  className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs text-gray-600 font-medium">Powered by APRU AI</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        </div>
      </motion.section>

      {/* Mini Previews Section */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen flex items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              Explore todas as 
              <GradientText 
                className="inline-block text-4xl font-bold"
                colors={["#3b82f6", "#8b5cf6", "#06b6d4"]}
                animationSpeed={4}
              >
                funcionalidades
              </GradientText>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Descubra como nossa plataforma integra todas as ferramentas que você precisa para o sucesso no vestibular.
            </motion.p>
          </motion.div>

          {/* Mini Previews Grid */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            {/* Google Calendar Integration Preview */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 overflow-hidden"
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Google Calendar</h3>
                  <p className="text-sm text-gray-600">Sincronização automática</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-blue-900">Matemática - Álgebra</div>
                    <div className="text-xs text-blue-600">14:00 - 15:30</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-green-900">Português - Redação</div>
                    <div className="text-xs text-green-600">16:00 - 17:00</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-purple-50 rounded-lg">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-purple-900">Física - Mecânica</div>
                    <div className="text-xs text-purple-600">19:00 - 20:30</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">Próximas 3 atividades</span>
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Exercise Analytics Preview */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Análise de Exercícios</h3>
                  <p className="text-sm text-gray-600">Performance detalhada</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Acertos hoje</span>
                  <span className="text-lg font-bold text-emerald-600">23/30</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "77%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">156</div>
                    <div className="text-xs text-gray-600">Esta semana</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">89%</div>
                    <div className="text-xs text-gray-600">Precisão</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Study Streak Preview */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Sequência de Estudos</h3>
                  <p className="text-sm text-gray-600">Mantenha o foco</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">12</div>
                <div className="text-sm text-gray-600 mb-4">dias consecutivos</div>
                
                <div className="flex justify-center space-x-1 mb-4">
                  {[...Array(7)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-6 h-6 rounded-full ${
                        i < 5 ? 'bg-orange-500' : 'bg-gray-200'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {i < 5 && (
                        <CheckCircle className="w-4 h-4 text-white m-0.5" />
                      )}
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-xs text-gray-500">Meta: 30 dias</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        id="funcionalidades" 
        className="py-20 bg-white min-h-screen flex items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              Por que escolher o 
              <GradientText 
                className="inline-block text-4xl font-bold"
                colors={["#f59e0b", "#3b82f6", "#8b5cf6"]}
                animationSpeed={5}
              >
                Aprova.AE
              </GradientText>
              ?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Nossa plataforma combina inteligência artificial avançada com metodologias
              comprovadas para maximizar seus resultados.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="text-center group"
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-100 transition-colors"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <motion.h3 
                  className="text-xl font-semibold text-gray-900 mb-3"
                  variants={itemVariants}
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-600 mb-3"
                  variants={itemVariants}
                >
                  {feature.description}
                </motion.p>
                <motion.p 
                  className="text-sm font-medium text-blue-600"
                  variants={itemVariants}
                >
                  {feature.highlight}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>



      {/* AI Agents Scroll Stack Section */}
      <motion.section 
        className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.div 
              className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-purple-500/30"
              variants={itemVariants}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span>Powered by Advanced AI</span>
            </motion.div>
            <motion.h2 
              className="text-5xl font-bold text-white mb-6"
              variants={itemVariants}
            >
              Nossos Agentes de 
              <GradientText 
                className="inline-block text-5xl font-bold"
                colors={["#8b5cf6", "#06b6d4", "#3b82f6"]}
                animationSpeed={3}
              >
                Inteligência Artificial
              </GradientText>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Conheça os assistentes de IA que vão revolucionar sua forma de estudar para o vestibular.
            </motion.p>
          </motion.div>

          {/* Stack de Agentes de IA */}
          <motion.div 
            className="flex justify-center items-center"
            variants={itemVariants}
          >
            <Stack
              randomRotation={true}
              sensitivity={150}
              cardDimensions={{ width: 320, height: 400 }}
              sendToBackOnClick={true}
              animationConfig={{ stiffness: 300, damping: 25 }}
              cardsData={[
                 {
                   id: 1,
                   img: "/LOGO-NOVA-APROVA.png",
                   title: "APRU 1b",
                   description: "Assistente de IA rápido e eficiente para respostas instantâneas e análise de questões do vestibular.",
                   features: ["Respostas em tempo real", "Análise de questões", "Dicas personalizadas", "Correção automática"]
                 },
                 {
                   id: 2,
                   img: "/LOGO-NOVA-APROVA.png",
                   title: "APRU REASONING",
                   description: "IA avançada com raciocínio profundo para análises complexas e resolução detalhada de problemas.",
                   features: ["Raciocínio avançado", "Explicações detalhadas", "Resolução passo a passo", "Análise crítica"]
                 },
                 {
                   id: 3,
                   img: "/LOGO-NOVA-APROVA.png",
                   title: "APRU CALENDAR",
                   description: "Assistente especializado em organização e planejamento inteligente de estudos para vestibular.",
                   features: ["Planejamento inteligente", "Lembretes automáticos", "Otimização de tempo", "Cronograma adaptativo"]
                 },
                 {
                   id: 4,
                   img: "/LOGO-NOVA-APROVA.png",
                   title: "APRU EXERCISE",
                   description: "Gerador de exercícios personalizados com base no seu desempenho e áreas de dificuldade.",
                   features: ["Exercícios adaptativos", "Correção automática", "Feedback inteligente", "Progressão personalizada"]
                 },
               ]}
            />
          </motion.div>
          
          {/* Instruções de Interação */}
          <motion.div 
            className="text-center mt-8"
            variants={itemVariants}
          >
            <p className="text-gray-300 text-sm">
              💡 <strong>Arraste</strong> ou <strong>clique</strong> nos cards para explorar nossos agentes de IA
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-20 bg-white min-h-screen flex items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              Resultados que falam por si
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Milhares de estudantes já conquistaram seus objetivos com nossa plataforma.
            </motion.p>
          </motion.div>
          
          {/* Hero Stats with Interactive Elements */}
          <motion.div 
            className="relative mb-20"
            variants={itemVariants}
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-green-600/5 rounded-3xl blur-3xl"></div>
            
            {/* Main Stat Display */}
            <motion.div 
              className="relative text-center mb-12 p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-2xl"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-8xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-4"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                whileHover={{ 
                  scale: 1.1,
                  textShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
                }}
              >
                85%
              </motion.div>
              
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-xl text-gray-700 font-medium mb-2">
                  dos nossos alunos passaram no vestibular
                </p>
                <motion.div 
                  className="w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: 128 }}
                  transition={{ delay: 0.7, duration: 1 }}
                ></motion.div>
              </motion.div>
              
              {/* Floating Elements */}
              <motion.div 
                className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full shadow-lg"
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              ></motion.div>
              
              <motion.div 
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full shadow-lg"
                animate={{ 
                  y: [10, -10, 10],
                  x: [-5, 5, -5]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              ></motion.div>
            </motion.div>
          </motion.div>
          
          {/* Enhanced Stats Grid */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >
            {[
              {
                icon: Users,
                number: "10.000+",
                label: "Estudantes ativos",
                description: "Comunidade ativa de estudantes focados na aprovação",
                gradient: "from-blue-500 to-blue-600",
                bgGradient: "from-blue-50 to-blue-100",
                delay: 0
              },
              {
                icon: BookOpen,
                number: "50.000+",
                label: "Questões resolvidas",
                description: "Base completa com questões de todos os vestibulares",
                gradient: "from-green-500 to-green-600",
                bgGradient: "from-green-50 to-green-100",
                delay: 0.1
              },
              {
                icon: Target,
                number: "95%",
                label: "Taxa de satisfação",
                description: "Aprovação comprovada pelos nossos estudantes",
                gradient: "from-purple-500 to-purple-600",
                bgGradient: "from-purple-50 to-purple-100",
                delay: 0.2
              }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="group"
                >
                  <motion.div 
                    className={`relative p-8 bg-gradient-to-br ${stat.bgGradient} rounded-3xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden`}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -10,
                      rotateY: 5
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white to-transparent rounded-full translate-y-12 -translate-x-12"></div>
                    </div>
                    
                    {/* Icon */}
                    <motion.div 
                      className={`relative w-20 h-20 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl`}
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <IconComponent className="w-10 h-10 text-white" />
                      
                      {/* Glow Effect */}
                      <motion.div 
                        className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-50`}
                        transition={{ duration: 0.3 }}
                      ></motion.div>
                    </motion.div>
                    
                    {/* Number */}
                    <motion.h3 
                      className={`text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3 text-center`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 200, 
                        delay: stat.delay + 0.3 
                      }}
                    >
                      {stat.number}
                    </motion.h3>
                    
                    {/* Label */}
                    <p className="text-lg font-bold text-gray-800 mb-2 text-center">
                      {stat.label}
                    </p>
                    
                    {/* Description */}
                    <motion.p 
                      className="text-sm text-gray-600 text-center leading-relaxed"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: stat.delay + 0.5 }}
                    >
                      {stat.description}
                    </motion.p>
                    
                    {/* Progress Bar */}
                    <motion.div 
                      className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: stat.delay + 0.7 }}
                    >
                      <motion.div 
                        className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}
                        initial={{ width: "0%" }}
                        whileInView={{ width: "85%" }}
                        transition={{ 
                          delay: stat.delay + 0.8, 
                          duration: 1.5,
                          ease: "easeOut"
                        }}
                      ></motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* How it works */}
      <motion.section 
        className="py-20 bg-gray-50 min-h-screen flex items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              Como funciona?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Três passos simples para começar sua jornada rumo à aprovação.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <motion.div className="text-center" variants={itemVariants}>
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Crie sua conta
              </h3>
              <p className="text-gray-600">
                Registre-se gratuitamente e complete seu perfil acadêmico para uma experiência personalizada.
              </p>
            </motion.div>
            
            <motion.div className="text-center" variants={itemVariants}>
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Estude com a IA
              </h3>
              <p className="text-gray-600">
                Receba um plano de estudos criado especialmente para você pela nossa IA avançada.
              </p>
            </motion.div>
            
            <motion.div className="text-center" variants={itemVariants}>
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Acompanhe seu progresso
              </h3>
              <p className="text-gray-600">
                Monitore seu desempenho com relatórios detalhados e ajuste sua estratégia de estudos.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Pricing */}
      <motion.section 
        id="planos" 
        className="py-20 bg-white min-h-screen flex items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              Escolha seu plano
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Comece gratuitamente e evolua conforme suas necessidades.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <motion.div className="bg-white border-2 border-gray-200 rounded-2xl p-8" variants={itemVariants}>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Mensal</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">R$39</span>
                <span className="text-gray-600">/mês</span>
              </div>
              <p className="text-gray-600 mb-6">Flexível até atingir sua aprovação</p>
              <Button 
                onClick={() => setShowLoginForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                mais
              </Button>
            </motion.div>
            
            <motion.div 
              className="bg-blue-600 text-white rounded-2xl p-8 relative"
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Mais Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Anual</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$390</span>
                <span className="text-blue-100">/ano</span>
              </div>
              <p className="text-blue-100 mb-6">Pagamento mensalmente</p>
              <Button 
                onClick={() => setShowLoginForm(true)}
                className="w-full bg-white text-blue-600 hover:bg-gray-100 py-3 rounded-lg font-semibold"
              >
                mais
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/LOGO-NOVA-APROVA.png" 
                  alt="APROVA.AE" 
                  className="h-16 w-auto"
                />
              </div>
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
}
