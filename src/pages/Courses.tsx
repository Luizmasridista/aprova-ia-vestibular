import React from 'react';
import { Card, CardContent } from '../components/ui/card';

const Courses: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Cursos Disponíveis</h1>
      <Card>
        <CardContent>
          <p>Lista de cursos será exibida aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Courses;
