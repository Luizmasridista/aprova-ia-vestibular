import React, { useState } from 'react';
import { Target, Clock, Users, Trophy, BookOpen, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '../contexts/AuthContext';

const SimuladosPage = () => {
  const { user } = useAuth();
  const [selectedSimulado, setSelectedSimulado] = useState<string | null>(null);

  const handleStartSimulado = (simuladoId: string) => {
    console.log('Iniciar simulado:', simuladoId);
    // Funcionalidade será implementada
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              Simulados de Vestibular
            </h1>
            <p className="text-muted-foreground text-lg">
              Pratique com simulados completos dos principais vestibulares brasileiros
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">0</div>
                <div className="text-sm text-muted-foreground">Simulados Feitos</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">0%</div>
                <div className="text-sm text-muted-foreground">Média Geral</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">0</div>
                <div className="text-sm text-muted-foreground">Melhor Posição</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">0h</div>
                <div className="text-sm text-muted-foreground">Tempo Total</div>
              </CardContent>
            </Card>
          </div>

          {/* Simulados Disponíveis */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Simulados Disponíveis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Simulado ENEM */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      ENEM 2024
                    </CardTitle>
                    <Badge className="bg-blue-100 text-blue-800">Nacional</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>5h 30min</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>180 questões</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Todas as áreas</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Simulado completo baseado no formato oficial do ENEM com questões de todas as áreas do conhecimento.
                  </p>
                  
                  <Button 
                    onClick={() => handleStartSimulado('enem-2024')}
                    className="w-full"
                    disabled
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Em Breve
                  </Button>
                </CardContent>
              </Card>

              {/* Simulado UFRGS */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-red-600" />
                      UFRGS 2024
                    </CardTitle>
                    <Badge className="bg-red-100 text-red-800">Regional</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>4h 00min</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>90 questões</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Multidisciplinar</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Simulado no formato da UFRGS com questões objetivas e discursivas adaptadas.
                  </p>
                  
                  <Button 
                    onClick={() => handleStartSimulado('ufrgs-2024')}
                    className="w-full"
                    disabled
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Em Breve
                  </Button>
                </CardContent>
              </Card>

              {/* Simulado USP */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-yellow-600" />
                      FUVEST 2024
                    </CardTitle>
                    <Badge className="bg-yellow-100 text-yellow-800">SP</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>5h 00min</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>90 questões</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>1ª Fase</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Simulado baseado na primeira fase da FUVEST com questões de múltipla escolha.
                  </p>
                  
                  <Button 
                    onClick={() => handleStartSimulado('fuvest-2024')}
                    className="w-full"
                    disabled
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Em Breve
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default SimuladosPage;