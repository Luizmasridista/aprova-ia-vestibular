export interface Course {
  id: string;
  name: string;
  category: string;
  icon: string;
  searchTerms: string[];
  description?: string;
}

export const courses: Course[] = [
  // Ciências da Saúde
  {
    id: 'medicina',
    name: 'Medicina',
    category: 'Ciências da Saúde',
    icon: '🩺',
    searchTerms: ['medicina', 'médico', 'doutor', 'saúde', 'hospital'],
    description: 'Formação médica para diagnóstico e tratamento'
  },
  {
    id: 'enfermagem',
    name: 'Enfermagem',
    category: 'Ciências da Saúde',
    icon: '👩‍⚕️',
    searchTerms: ['enfermagem', 'enfermeiro', 'cuidados', 'saúde'],
    description: 'Cuidados de enfermagem e assistência à saúde'
  },
  {
    id: 'odontologia',
    name: 'Odontologia',
    category: 'Ciências da Saúde',
    icon: '🦷',
    searchTerms: ['odontologia', 'dentista', 'dente', 'oral'],
    description: 'Saúde bucal e tratamentos odontológicos'
  },
  {
    id: 'farmacia',
    name: 'Farmácia',
    category: 'Ciências da Saúde',
    icon: '💊',
    searchTerms: ['farmácia', 'farmacêutico', 'medicamento', 'remédio'],
    description: 'Medicamentos e assistência farmacêutica'
  },
  {
    id: 'fisioterapia',
    name: 'Fisioterapia',
    category: 'Ciências da Saúde',
    icon: '🏃‍♂️',
    searchTerms: ['fisioterapia', 'fisioterapeuta', 'reabilitação', 'movimento'],
    description: 'Reabilitação e movimento humano'
  },
  {
    id: 'psicologia',
    name: 'Psicologia',
    category: 'Ciências da Saúde',
    icon: '🧠',
    searchTerms: ['psicologia', 'psicólogo', 'mente', 'comportamento'],
    description: 'Comportamento humano e saúde mental'
  },
  {
    id: 'veterinaria',
    name: 'Medicina Veterinária',
    category: 'Ciências da Saúde',
    icon: '🐕',
    searchTerms: ['veterinária', 'veterinário', 'animal', 'pet'],
    description: 'Saúde e bem-estar animal'
  },

  // Engenharias
  {
    id: 'engenharia-civil',
    name: 'Engenharia Civil',
    category: 'Engenharias',
    icon: '🏗️',
    searchTerms: ['engenharia civil', 'civil', 'construção', 'obra'],
    description: 'Construção e infraestrutura'
  },
  {
    id: 'engenharia-mecanica',
    name: 'Engenharia Mecânica',
    category: 'Engenharias',
    icon: '⚙️',
    searchTerms: ['engenharia mecânica', 'mecânica', 'máquina', 'motor'],
    description: 'Sistemas mecânicos e máquinas'
  },
  {
    id: 'engenharia-eletrica',
    name: 'Engenharia Elétrica',
    category: 'Engenharias',
    icon: '⚡',
    searchTerms: ['engenharia elétrica', 'elétrica', 'eletricidade', 'energia'],
    description: 'Sistemas elétricos e energia'
  },
  {
    id: 'engenharia-computacao',
    name: 'Engenharia de Computação',
    category: 'Engenharias',
    icon: '💻',
    searchTerms: ['engenharia de computação', 'computação', 'hardware', 'software'],
    description: 'Hardware e software de computadores'
  },
  {
    id: 'engenharia-producao',
    name: 'Engenharia de Produção',
    category: 'Engenharias',
    icon: '📊',
    searchTerms: ['engenharia de produção', 'produção', 'gestão', 'processo'],
    description: 'Otimização de processos produtivos'
  },
  {
    id: 'engenharia-quimica',
    name: 'Engenharia Química',
    category: 'Engenharias',
    icon: '🧪',
    searchTerms: ['engenharia química', 'química', 'processo químico'],
    description: 'Processos químicos industriais'
  },

  // Ciências Exatas
  {
    id: 'ciencia-computacao',
    name: 'Ciência da Computação',
    category: 'Ciências Exatas',
    icon: '🖥️',
    searchTerms: ['ciência da computação', 'computação', 'programação', 'software'],
    description: 'Desenvolvimento de software e sistemas'
  },
  {
    id: 'matematica',
    name: 'Matemática',
    category: 'Ciências Exatas',
    icon: '📐',
    searchTerms: ['matemática', 'cálculo', 'números', 'estatística'],
    description: 'Ciências matemáticas e estatística'
  },
  {
    id: 'fisica',
    name: 'Física',
    category: 'Ciências Exatas',
    icon: '🔬',
    searchTerms: ['física', 'ciência', 'laboratório', 'pesquisa'],
    description: 'Fenômenos físicos e pesquisa científica'
  },
  {
    id: 'quimica',
    name: 'Química',
    category: 'Ciências Exatas',
    icon: '⚗️',
    searchTerms: ['química', 'laboratório', 'substância', 'reação'],
    description: 'Substâncias químicas e reações'
  },

  // Ciências Humanas
  {
    id: 'direito',
    name: 'Direito',
    category: 'Ciências Humanas',
    icon: '⚖️',
    searchTerms: ['direito', 'advogado', 'lei', 'justiça'],
    description: 'Ciências jurídicas e advocacia'
  },
  {
    id: 'administracao',
    name: 'Administração',
    category: 'Ciências Humanas',
    icon: '💼',
    searchTerms: ['administração', 'gestão', 'negócios', 'empresa'],
    description: 'Gestão empresarial e negócios'
  },
  {
    id: 'economia',
    name: 'Economia',
    category: 'Ciências Humanas',
    icon: '💰',
    searchTerms: ['economia', 'economista', 'mercado', 'finanças'],
    description: 'Ciências econômicas e mercado financeiro'
  },
  {
    id: 'contabilidade',
    name: 'Ciências Contábeis',
    category: 'Ciências Humanas',
    icon: '📊',
    searchTerms: ['contabilidade', 'contador', 'finanças', 'balanço'],
    description: 'Contabilidade e controle financeiro'
  },
  {
    id: 'pedagogia',
    name: 'Pedagogia',
    category: 'Ciências Humanas',
    icon: '👩‍🏫',
    searchTerms: ['pedagogia', 'educação', 'professor', 'ensino'],
    description: 'Educação e processos de ensino'
  },
  {
    id: 'historia',
    name: 'História',
    category: 'Ciências Humanas',
    icon: '📚',
    searchTerms: ['história', 'historiador', 'passado', 'cultura'],
    description: 'Estudos históricos e culturais'
  },
  {
    id: 'geografia',
    name: 'Geografia',
    category: 'Ciências Humanas',
    icon: '🌍',
    searchTerms: ['geografia', 'geógrafo', 'espaço', 'território'],
    description: 'Espaço geográfico e territorial'
  },
  {
    id: 'filosofia',
    name: 'Filosofia',
    category: 'Ciências Humanas',
    icon: '🤔',
    searchTerms: ['filosofia', 'filósofo', 'pensamento', 'reflexão'],
    description: 'Pensamento filosófico e reflexão'
  },

  // Comunicação e Artes
  {
    id: 'jornalismo',
    name: 'Jornalismo',
    category: 'Comunicação e Artes',
    icon: '📰',
    searchTerms: ['jornalismo', 'jornalista', 'notícia', 'mídia'],
    description: 'Comunicação e jornalismo'
  },
  {
    id: 'publicidade',
    name: 'Publicidade e Propaganda',
    category: 'Comunicação e Artes',
    icon: '📢',
    searchTerms: ['publicidade', 'propaganda', 'marketing', 'comunicação'],
    description: 'Marketing e comunicação publicitária'
  },
  {
    id: 'design',
    name: 'Design',
    category: 'Comunicação e Artes',
    icon: '🎨',
    searchTerms: ['design', 'designer', 'criação', 'arte'],
    description: 'Design gráfico e criação visual'
  },
  {
    id: 'arquitetura',
    name: 'Arquitetura e Urbanismo',
    category: 'Comunicação e Artes',
    icon: '🏛️',
    searchTerms: ['arquitetura', 'arquiteto', 'urbanismo', 'projeto'],
    description: 'Projetos arquitetônicos e urbanísticos'
  },
  {
    id: 'musica',
    name: 'Música',
    category: 'Comunicação e Artes',
    icon: '🎵',
    searchTerms: ['música', 'músico', 'instrumento', 'som'],
    description: 'Arte musical e performance'
  },

  // Ciências Biológicas
  {
    id: 'biologia',
    name: 'Ciências Biológicas',
    category: 'Ciências Biológicas',
    icon: '🧬',
    searchTerms: ['biologia', 'biólogo', 'vida', 'organismo'],
    description: 'Estudo dos seres vivos'
  },
  {
    id: 'biomedicina',
    name: 'Biomedicina',
    category: 'Ciências Biológicas',
    icon: '🔬',
    searchTerms: ['biomedicina', 'biomédico', 'laboratório', 'análise'],
    description: 'Análises clínicas e diagnóstico'
  },
  {
    id: 'agronomia',
    name: 'Agronomia',
    category: 'Ciências Biológicas',
    icon: '🌱',
    searchTerms: ['agronomia', 'agrônomo', 'agricultura', 'plantação'],
    description: 'Agricultura e produção vegetal'
  },

  // Outros
  {
    id: 'educacao-fisica',
    name: 'Educação Física',
    category: 'Outros',
    icon: '🏃‍♂️',
    searchTerms: ['educação física', 'esporte', 'atividade física', 'professor'],
    description: 'Esporte e atividade física'
  },
  {
    id: 'nutricao',
    name: 'Nutrição',
    category: 'Outros',
    icon: '🥗',
    searchTerms: ['nutrição', 'nutricionista', 'alimentação', 'dieta'],
    description: 'Alimentação e nutrição humana'
  },
  {
    id: 'turismo',
    name: 'Turismo',
    category: 'Outros',
    icon: '✈️',
    searchTerms: ['turismo', 'viagem', 'hospitalidade', 'lazer'],
    description: 'Turismo e hospitalidade'
  }
];

export const searchCourses = (query: string): Course[] => {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return courses.filter(course => 
    course.searchTerms.some(term => 
      term.toLowerCase().includes(normalizedQuery)
    ) ||
    course.name.toLowerCase().includes(normalizedQuery) ||
    course.category.toLowerCase().includes(normalizedQuery)
  ).slice(0, 8); // Limitar a 8 resultados
};

export const getCoursesByCategory = (): Record<string, Course[]> => {
  return courses.reduce((acc, course) => {
    if (!acc[course.category]) {
      acc[course.category] = [];
    }
    acc[course.category].push(course);
    return acc;
  }, {} as Record<string, Course[]>);
};
