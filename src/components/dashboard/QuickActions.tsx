
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Calendar, 
  Award, 
  BookOpen,
  Plus,
  Sparkles
} from 'lucide-react';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Criar Plano de Estudos',
      description: 'IA personalizada para seu sucesso',
      icon: Brain,
      color: 'from-purple-500 to-indigo-600',
      hoverColor: 'from-purple-600 to-indigo-700',
      action: () => navigate('/study-plan')
    },
    {
      title: 'Calendário',
      description: 'Organize suas atividades',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-600',
      hoverColor: 'from-blue-600 to-cyan-700',
      action: () => navigate('/calendar')
    },
    {
      title: 'Simulados',
      description: 'Teste seus conhecimentos',
      icon: Award,
      color: 'from-emerald-500 to-teal-600',
      hoverColor: 'from-emerald-600 to-teal-700',
      action: () => navigate('/simulados')
    },
    {
      title: 'Exercícios',
      description: 'Pratique com questões',
      icon: BookOpen,
      color: 'from-orange-500 to-red-600',
      hoverColor: 'from-orange-600 to-red-700',
      action: () => navigate('/exercicios')
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <Sparkles className="h-6 w-6 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Ações Rápidas</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
              onClick={action.action}
            >
              <CardContent className="p-6">
                <div className="text-center">
                  <motion.div 
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${action.color} group-hover:${action.hoverColor} flex items-center justify-center transition-all duration-300 shadow-lg group-hover:shadow-xl`}
                    whileHover={{ rotate: 5 }}
                  >
                    <action.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                    {action.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
