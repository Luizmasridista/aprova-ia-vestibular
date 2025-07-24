import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import GradientText from '../components/ui/GradientText';
import AnimatedText from '../components/ui/AnimatedText';
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

  if (showLoginForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <img 
                src="/LOGO-NOVA-APROVA.png" 
                alt="APROVA.AE" 
                className="h-24-auto"
              />
            </div>


            
            
            <LoginForm />
            
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
          <Button 
            onClick={() => setShowLoginForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors ml-8"
          >
            Experimente Grátis
          </Button>
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
              <motion.div 
                className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <motion.div 
                  className="space-y-4"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.3
                      }
                    }
                  }}
                >
                  <motion.div 
                    className="flex items-center space-x-3"
                    variants={itemVariants}
                  >
                    <motion.div 
                      className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Brain className="w-4 h-4 text-blue-600" />
                    </motion.div>
                    <div className="flex-1">
                      <motion.div 
                        className="h-3 bg-blue-100 rounded-full w-3/4"
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                      ></motion.div>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-3"
                    variants={itemVariants}
                  >
                    <motion.div 
                      className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Target className="w-4 h-4 text-green-600" />
                    </motion.div>
                    <div className="flex-1">
                      <motion.div 
                        className="h-3 bg-green-100 rounded-full w-2/3"
                        initial={{ width: 0 }}
                        animate={{ width: "66.666667%" }}
                        transition={{ duration: 1, delay: 0.7 }}
                      ></motion.div>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-3"
                    variants={itemVariants}
                  >
                    <motion.div 
                      className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                    </motion.div>
                    <div className="flex-1">
                      <motion.div 
                        className="h-3 bg-purple-100 rounded-full w-5/6"
                        initial={{ width: 0 }}
                        animate={{ width: "83.333333%" }}
                        transition={{ duration: 1, delay: 0.9 }}
                      ></motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
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

      {/* AI Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 min-h-screen flex items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.div 
              className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4"
              variants={itemVariants}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span>Estude com a IA</span>
            </motion.div>
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              Conheça nossos assistentes de IA
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Dois modos de IA personalizados para atender diferentes estilos de aprendizado
              e necessidades de estudo.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.3
                }
              }
            }}
          >
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    APRU 1b
                  </h3>
                  <p className="text-sm font-medium text-blue-600">
                    Configuração Rápida
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                IA rápida e eficiente para configuração de estudos
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Planos de estudo otimizados</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Cronogramas personalizados</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Análise de progresso</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    APRU REASONING
                  </h3>
                  <p className="text-sm font-medium text-purple-600">
                    Análise Profunda
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                IA avançada para análise profunda e estratégias detalhadas
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Análise comportamental</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Estratégias avançadas</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Feedback detalhado</span>
                </li>
              </ul>
            </motion.div>
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
          
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <motion.div 
              className="text-6xl font-bold text-blue-600 mb-2"
              variants={itemVariants}
            >
              85%
            </motion.div>
            <motion.p 
              className="text-gray-600"
              variants={itemVariants}
            >
              dos nossos alunos passaram no vestibular
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8 text-center"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <motion.div variants={itemVariants}>
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">10.000+</h3>
              <p className="text-gray-600">Estudantes ativos</p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">50.000+</h3>
              <p className="text-gray-600">Questões resolvidas</p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">95%</h3>
              <p className="text-gray-600">Taxa de satisfação</p>
            </motion.div>
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
