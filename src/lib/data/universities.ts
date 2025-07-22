export interface University {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  state: string;
  type: 'publica' | 'privada';
  searchTerms: string[];
}

export const universities: University[] = [
  // Universidades Públicas Federais
  {
    id: 'usp',
    name: 'Universidade de São Paulo',
    shortName: 'USP',
    logo: 'https://logoeps.com/wp-content/uploads/2013/03/usp-vector-logo.png',
    state: 'SP',
    type: 'publica',
    searchTerms: ['usp', 'universidade de são paulo', 'são paulo', 'sp']
  },
  {
    id: 'unicamp',
    name: 'Universidade Estadual de Campinas',
    shortName: 'UNICAMP',
    logo: 'https://logoeps.com/wp-content/uploads/2013/03/unicamp-vector-logo.png',
    state: 'SP',
    type: 'publica',
    searchTerms: ['unicamp', 'universidade estadual de campinas', 'campinas', 'sp']
  },
  {
    id: 'ufrj',
    name: 'Universidade Federal do Rio de Janeiro',
    shortName: 'UFRJ',
    logo: 'https://logoeps.com/wp-content/uploads/2013/03/ufrj-vector-logo.png',
    state: 'RJ',
    type: 'publica',
    searchTerms: ['ufrj', 'universidade federal do rio de janeiro', 'rio de janeiro', 'rj']
  },
  {
    id: 'ufrgs',
    name: 'Universidade Federal do Rio Grande do Sul',
    shortName: 'UFRGS',
    logo: 'https://logoeps.com/wp-content/uploads/2013/03/ufrgs-vector-logo.png',
    state: 'RS',
    type: 'publica',
    searchTerms: ['ufrgs', 'universidade federal do rio grande do sul', 'rio grande do sul', 'rs', 'porto alegre']
  },
  {
    id: 'ufmg',
    name: 'Universidade Federal de Minas Gerais',
    shortName: 'UFMG',
    logo: 'https://logoeps.com/wp-content/uploads/2013/03/ufmg-vector-logo.png',
    state: 'MG',
    type: 'publica',
    searchTerms: ['ufmg', 'universidade federal de minas gerais', 'minas gerais', 'mg', 'belo horizonte']
  },
  {
    id: 'ufpr',
    name: 'Universidade Federal do Paraná',
    shortName: 'UFPR',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/UFPR_logo.svg',
    state: 'PR',
    type: 'publica',
    searchTerms: ['ufpr', 'universidade federal do paraná', 'paraná', 'pr', 'curitiba']
  },
  {
    id: 'ufsc',
    name: 'Universidade Federal de Santa Catarina',
    shortName: 'UFSC',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/UFSC_logo.svg',
    state: 'SC',
    type: 'publica',
    searchTerms: ['ufsc', 'universidade federal de santa catarina', 'santa catarina', 'sc', 'florianópolis']
  },
  {
    id: 'ufba',
    name: 'Universidade Federal da Bahia',
    shortName: 'UFBA',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/80/UFBA_logo.svg',
    state: 'BA',
    type: 'publica',
    searchTerms: ['ufba', 'universidade federal da bahia', 'bahia', 'ba', 'salvador']
  },
  {
    id: 'ufpe',
    name: 'Universidade Federal de Pernambuco',
    shortName: 'UFPE',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/UFPE_logo.svg',
    state: 'PE',
    type: 'publica',
    searchTerms: ['ufpe', 'universidade federal de pernambuco', 'pernambuco', 'pe', 'recife']
  },
  {
    id: 'ufc',
    name: 'Universidade Federal do Ceará',
    shortName: 'UFC',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/UFC_logo.svg',
    state: 'CE',
    type: 'publica',
    searchTerms: ['ufc', 'universidade federal do ceará', 'ceará', 'ce', 'fortaleza']
  },
  {
    id: 'unb',
    name: 'Universidade de Brasília',
    shortName: 'UnB',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/UnB_logo.svg',
    state: 'DF',
    type: 'publica',
    searchTerms: ['unb', 'universidade de brasília', 'brasília', 'df', 'distrito federal']
  },
  
  // Universidades Privadas
  {
    id: 'puc-sp',
    name: 'Pontifícia Universidade Católica de São Paulo',
    shortName: 'PUC-SP',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/PUC-SP_logo.svg',
    state: 'SP',
    type: 'privada',
    searchTerms: ['puc', 'puc-sp', 'pontifícia universidade católica', 'católica', 'são paulo']
  },
  {
    id: 'puc-rio',
    name: 'Pontifícia Universidade Católica do Rio de Janeiro',
    shortName: 'PUC-Rio',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/PUC-Rio_logo.svg',
    state: 'RJ',
    type: 'privada',
    searchTerms: ['puc', 'puc-rio', 'pontifícia universidade católica', 'católica', 'rio de janeiro']
  },
  {
    id: 'mackenzie',
    name: 'Universidade Presbiteriana Mackenzie',
    shortName: 'Mackenzie',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Mackenzie_logo.svg',
    state: 'SP',
    type: 'privada',
    searchTerms: ['mackenzie', 'universidade presbiteriana mackenzie', 'presbiteriana', 'são paulo']
  },
  {
    id: 'fgv',
    name: 'Fundação Getúlio Vargas',
    shortName: 'FGV',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/FGV_logo.svg',
    state: 'SP',
    type: 'privada',
    searchTerms: ['fgv', 'fundação getúlio vargas', 'getúlio vargas', 'são paulo']
  },
  {
    id: 'insper',
    name: 'Instituto de Ensino e Pesquisa',
    shortName: 'Insper',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Insper_logo.svg',
    state: 'SP',
    type: 'privada',
    searchTerms: ['insper', 'instituto de ensino e pesquisa', 'são paulo']
  },
  {
    id: 'anhembi',
    name: 'Universidade Anhembi Morumbi',
    shortName: 'Anhembi Morumbi',
    logo: 'https://logodownload.org/wp-content/uploads/2019/10/anhembi-morumbi-logo.png',
    state: 'SP',
    type: 'privada',
    searchTerms: ['anhembi', 'anhembi morumbi', 'universidade anhembi morumbi', 'morumbi', 'são paulo']
  },
  {
    id: 'estacio',
    name: 'Universidade Estácio de Sá',
    shortName: 'Estácio',
    logo: 'https://logodownload.org/wp-content/uploads/2019/10/estacio-logo.png',
    state: 'RJ',
    type: 'privada',
    searchTerms: ['estácio', 'universidade estácio de sá', 'estácio de sá', 'rio de janeiro']
  },
  
  // Mais Universidades Federais
  {
    id: 'ufes',
    name: 'Universidade Federal do Espírito Santo',
    shortName: 'UFES',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/UFES_logo.svg',
    state: 'ES',
    type: 'publica',
    searchTerms: ['ufes', 'universidade federal do espírito santo', 'espírito santo', 'es', 'vitória']
  },
  {
    id: 'ufmt',
    name: 'Universidade Federal de Mato Grosso',
    shortName: 'UFMT',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/UFMT_logo.svg',
    state: 'MT',
    type: 'publica',
    searchTerms: ['ufmt', 'universidade federal de mato grosso', 'mato grosso', 'mt', 'cuiabá']
  },
  {
    id: 'ufgo',
    name: 'Universidade Federal de Goiás',
    shortName: 'UFG',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/UFG_logo.svg',
    state: 'GO',
    type: 'publica',
    searchTerms: ['ufg', 'ufgo', 'universidade federal de goiás', 'goiás', 'go', 'goiânia']
  },
  {
    id: 'ufam',
    name: 'Universidade Federal do Amazonas',
    shortName: 'UFAM',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/UFAM_logo.svg',
    state: 'AM',
    type: 'publica',
    searchTerms: ['ufam', 'universidade federal do amazonas', 'amazonas', 'am', 'manaus']
  },
  {
    id: 'ufpa',
    name: 'Universidade Federal do Pará',
    shortName: 'UFPA',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/UFPA_logo.svg',
    state: 'PA',
    type: 'publica',
    searchTerms: ['ufpa', 'universidade federal do pará', 'pará', 'pa', 'belém']
  },
  
  // Universidades Estaduais
  {
    id: 'unesp',
    name: 'Universidade Estadual Paulista',
    shortName: 'UNESP',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/42/UNESP_logo.svg',
    state: 'SP',
    type: 'publica',
    searchTerms: ['unesp', 'universidade estadual paulista', 'paulista', 'sp']
  },
  {
    id: 'uerj',
    name: 'Universidade do Estado do Rio de Janeiro',
    shortName: 'UERJ',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/UERJ_logo.svg',
    state: 'RJ',
    type: 'publica',
    searchTerms: ['uerj', 'universidade do estado do rio de janeiro', 'estado rio de janeiro', 'rj']
  }
];

export const searchUniversities = (query: string): University[] => {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return universities.filter(university => 
    university.searchTerms.some(term => 
      term.toLowerCase().includes(normalizedQuery)
    ) ||
    university.name.toLowerCase().includes(normalizedQuery) ||
    university.shortName.toLowerCase().includes(normalizedQuery)
  ).slice(0, 8); // Limitar a 8 resultados
};
