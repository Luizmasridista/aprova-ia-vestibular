import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import SunburstChart from '@/components/charts/SunburstChart';

interface ExerciseData {
  subject: string;
  correct: number;
  wrong: number;
  notAttempted: number;
  percentage: number;
}

interface SubjectSunburstChartProps {
  exerciseData: ExerciseData[];
  isLoading?: boolean;
}

export const SubjectSunburstChart: React.FC<SubjectSunburstChartProps> = ({
  exerciseData,
  isLoading = false,
}) => {
  // Transform the exercise data into the format expected by SunburstChart
  const transformData = () => {
    if (!exerciseData || exerciseData.length === 0) return null;

    // Create the root node
    const root = {
      name: 'root',
      children: exerciseData.map(subject => ({
        name: subject.subject,
        value: subject.correct + subject.wrong + subject.notAttempted,
        correct: subject.correct,
        wrong: subject.wrong,
        notAttempted: subject.notAttempted,
        percentage: subject.percentage,
        children: [
          {
            name: 'Acertos',
            value: subject.correct,
            correct: subject.correct,
            percentage: subject.percentage
          },
          {
            name: 'Erros',
            value: subject.wrong,
            wrong: subject.wrong
          },
          {
            name: 'Não feitos',
            value: subject.notAttempted,
            notAttempted: subject.notAttempted
          }
        ]
      }))
    };

    return root;
  };

  const chartData = transformData();

  if (isLoading) {
    return (
      <Card className="border-0 bg-white/50 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Desempenho por Matéria
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <div className="animate-pulse w-full h-full bg-gray-100 rounded-lg"></div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData || exerciseData.length === 0) {
    return (
      <Card className="border-0 bg-white/50 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Desempenho por Matéria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium mb-2">Nenhum dado disponível</p>
            <p className="text-sm text-gray-400">
              Complete alguns exercícios para ver seu desempenho
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
          Desempenho por Matéria
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <div className="w-full h-full">
          <SunburstChart data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectSunburstChart;
