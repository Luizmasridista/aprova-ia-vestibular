import React from 'react';
import { Card, CardContent } from '../components/ui/card';

const Progress: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Seu Progresso</h1>
      <Card>
        <CardContent>
          <p>Informações sobre seu progresso serão exibidas aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Progress;
