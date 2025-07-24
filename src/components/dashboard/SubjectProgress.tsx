import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, TrendingUp, Award } from 'lucide-react';

interface SubjectProgressProps {
  subjectProgress: {
    subject: string;
    completed: number;
    total: number;
    percentage: number;
  }[];
  isLoading?: boolean;
}

export const SubjectProgress: React.FC<SubjectProgressProps> = ({ 
  subjectProgress, 
  isLoading 
}) => {
  const getSubjectColor = (subject: string, index: number) => {
    const colors = [
      { bg: 'from-blue-50 to-blue-100', bar: 'from-blue-400 to-blue-600', text: 'text-blue-700' },
      { bg: 'from-emerald-50 to-emerald-100', bar: 'from-emerald-400 to-emerald-600', text: 'text-emerald-700' },
      { bg: 'from-purple-50 to-purple-100', bar: 'from-purple-400 to-purple-600', text: 'text-purple-700' },
      { bg: 'from-orange-50 to-orange-100', bar: 'from-orange-400 to-orange-600', text: 'text-orange-700' },
      { bg: 'from-pink-50 to-pink-100', bar: 'from-pink-400 to-pink-600', text: 'text-pink-700' },
      { bg: 'from-indigo-50 to-indigo-100', bar: 'from-indigo-400 to-indigo-600', text: 'text-indigo-700' }
    ];
    return colors[index % colors.length];
  };

  const getSubjectIcon = (subject: string) => {
    const icons: Record<string, string> = {
      'Matemática': '🔢',
      'Português': '📝',
      'Física': '⚛️',
      'Química': '🧪',
      'Biologia': '🧬',
      'História': '📚',
      'Geografia': '🌍',
      'Inglês': '🇺🇸',
      'Literatura': '📖',
      'Filosofia': '🤔',
      'Sociologia': '👥',
      'Redação': '✍️'
    };
    return icons[subject] || '📚';
  };

  if (isLoading) {
    return (
      <Card className="border-0 bg-white/50 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Progresso por Matéria
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (subjectProgress.length === 0) {
    return (
      <Card className="border-0 bg-white/50 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Progresso por Matéria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium mb-2">Nenhuma atividade registrada</p>
            <p className="text-sm text-gray-400">
              Complete algumas atividades para ver seu progresso por matéria
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/50 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Progresso por Matéria
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subjectProgress.slice(0, 6).map((subject, index) => {
          const colors = getSubjectColor(subject.subject, index);
          const icon = getSubjectIcon(subject.subject);
          
          return (
            <motion.div
              key={subject.subject}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{icon}</span>
                  <span className="font-medium text-gray-900 text-sm">
                    {subject.subject}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {subject.completed}/{subject.total}
                  </span>
                  <span className={`text-sm font-bold ${colors.text}`}>
                    {Math.round(subject.percentage)}%
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`bg-gradient-to-r ${colors.bar} h-2 rounded-full relative overflow-hidden`}
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                  >
                    {/* Efeito de brilho */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ 
                        duration: 2, 
                        delay: index * 0.1 + 0.5,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Badge de destaque para melhor performance */}
              {subject.percentage >= 80 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.8 }}
                  className="flex items-center space-x-1"
                >
                  <Award className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-yellow-600 font-medium">
                    Excelente!
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Insights */}
        {subjectProgress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-start space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 text-sm mb-1">
                  Insights de Performance
                </h4>
                <p className="text-xs text-blue-700">
                  {(() => {
                    const bestSubject = subjectProgress[0];
                    const worstSubject = subjectProgress[subjectProgress.length - 1];
                    
                    if (bestSubject.percentage >= 80) {
                      return `🎯 Excelente em ${bestSubject.subject}! Continue assim.`;
                    } else if (worstSubject.percentage < 50) {
                      return `💪 Foque mais em ${worstSubject.subject} para melhorar sua performance.`;
                    } else {
                      return `📈 Progresso equilibrado! Mantenha a consistência nos estudos.`;
                    }
                  })()}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
