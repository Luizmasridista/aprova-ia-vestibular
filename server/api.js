const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001; // Porta diferente do frontend

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rota de configuração do plano de estudos
app.get('/api/study-plan/config', (req, res) => {
  try {
    const config = {
      modes: [
        { 
          id: 'APRU_1b', 
          name: 'APRU 1b', 
          description: 'Configuração leve e rápida para começar.',
          color: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        },
        { 
          id: 'APRU_REASONING', 
          name: 'APRU REASONING', 
          description: 'Análise avançada para rotinas detalhadas.',
          color: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
        },
      ],
      questions: [
        { 
          id: 'hoursPerDay', 
          text: 'Quantas horas por dia você pode dedicar aos estudos?', 
          type: 'number',
          description: 'Considere seu dia a dia e seja realista.',
          required: true
        },
        { 
          id: 'targetDate', 
          text: 'Quando é a sua prova ou data alvo?', 
          type: 'date',
          description: 'Selecione a data do seu exame ou quando deseja estar preparado.',
          required: true
        },
        {
          id: 'subjects',
          text: 'Quais matérias você precisa estudar?',
          type: 'multi-select',
          options: [
            'Matemática', 'Português', 'Física', 'Química', 'Biologia',
            'História', 'Geografia', 'Filosofia', 'Sociologia', 'Inglês',
            'Literatura', 'Redação', 'Atualidades'
          ],
          description: 'Selecione todas as matérias que você precisa estudar.',
          required: true
        },
        {
          id: 'difficulty',
          text: 'Qual o seu nível de conhecimento atual?',
          type: 'multiple-choice',
          options: ['Iniciante', 'Intermediário', 'Avançado'],
          description: 'Selecione o que melhor descreve seu nível atual.',
          required: true
        }
      ]
    };

    res.status(200).json(config);
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
    res.status(500).json({ message: 'Erro ao carregar configurações do plano de estudos' });
  }
});

// Rota para gerar o plano de estudos
app.post('/api/study-plan/generate', (req, res) => {
  try {
    const { mode, answers } = req.body;

    // Validação básica dos dados recebidos
    if (!mode || !answers) {
      return res.status(400).json({ message: 'Dados inválidos' });
    }

    // Gerar o plano de estudos
    const generatedPlan = generateStudyPlan(mode, answers);

    res.status(200).json({
      success: true,
      plan: generatedPlan,
      message: 'Plano de estudos gerado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao gerar plano de estudos:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao gerar o plano de estudos. Tente novamente mais tarde.'
    });
  }
});

// Função para gerar o plano de estudos
function generateStudyPlan(mode, answers) {
  // Extrair dados das respostas
  const hoursPerDay = parseFloat(answers.hoursPerDay) || 2;
  const targetDate = new Date(answers.targetDate);
  const today = new Date();
  
  // Calcular dias até a prova
  const timeDiff = targetDate.getTime() - today.getTime();
  const daysUntilTarget = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  // Gerar cronograma semanal
  const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const weeklySchedule = weekdays.map(day => ({
    day,
    subjects: Array(Math.ceil(hoursPerDay / 2)).fill(0).map((_, i) => ({
      name: `Matéria ${i + 1}`,
      time: `${8 + i * 2}:00`
    }))
  }));

  // Gerar metas diárias
  const dailyGoals = [
    { goal: 'Revisar conteúdos do dia', completed: false },
    { goal: 'Fazer exercícios práticos', completed: false },
    { goal: 'Assistir videoaulas', completed: false },
  ];

  // Recomendações baseadas no modo selecionado
  const recommendations = [];
  
  if (mode === 'APRU_1b') {
    recommendations.push({
      title: 'Foco em Resolução de Exercícios',
      description: 'Dedique 70% do seu tempo à resolução de exercícios e 30% à teoria.'
    });
  } else {
    recommendations.push({
      title: 'Estudo Detalhado',
      description: 'Faça mapas mentais e resumos para melhor fixação do conteúdo.'
    });
  }

  return {
    weeklySchedule,
    dailyGoals,
    recommendations,
    summary: {
      totalStudyHours: hoursPerDay * daysUntilTarget,
      daysUntilTarget,
      subjects: answers.subjects || ['Matemática', 'Português'],
      difficulty: answers.difficulty || 'Intermediário'
    }
  };
}

// Rota para gerar o plano de estudos
app.post('/api/study-plan/generate', (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { mode, answers } = req.body;

    // Validação básica dos dados recebidos
    if (!mode || !answers) {
      return res.status(400).json({ message: 'Dados inválidos' });
    }

    // Gerar o plano de estudos
    const generatedPlan = generateStudyPlan(mode, answers);

    return res.status(200).json({
      success: true,
      plan: generatedPlan,
      message: 'Plano de estudos gerado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao gerar plano de estudos:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erro ao gerar o plano de estudos. Tente novamente mais tarde.'
    });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor de API rodando em http://localhost:${port}`);
});
