import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Bem-vindo ao APROVA.AE</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Grade de Estudos com IA</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Crie uma grade de estudos personalizada com nossa IA avançada.</p>
            <Link to="/study-plan">
              <Button className="mt-4">Criar Grade</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cursos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Acesse os cursos disponíveis para se preparar.</p>
            <Link to="/courses">
              <Button className="mt-4">Ver Cursos</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Simulados</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Teste seus conhecimentos com nossos simulados.</p>
            <Link to="/exams">
              <Button className="mt-4">Fazer Simulado</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Progresso</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Acompanhe seu progresso e desempenho.</p>
            <Link to="/progress">
              <Button className="mt-4">Ver Progresso</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gerencie suas informações pessoais.</p>
            <Link to="/profile">
              <Button className="mt-4">Editar Perfil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
