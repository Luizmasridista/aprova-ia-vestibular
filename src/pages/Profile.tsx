import React from 'react';
import { Card, CardContent } from '../components/ui/card';

const Profile: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Perfil do Usuário</h1>
      <Card>
        <CardContent>
          <p>Informações do perfil serão exibidas aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
