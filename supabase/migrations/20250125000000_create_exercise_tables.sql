-- Criação das tabelas de exercícios

-- Tabela de sessões de exercícios
CREATE TABLE IF NOT EXISTS exercise_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de resultados de exercícios
CREATE TABLE IF NOT EXISTS exercise_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_id UUID REFERENCES exercise_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent INTEGER DEFAULT 0, -- em segundos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_exercise_sessions_user_id ON exercise_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_sessions_subject ON exercise_sessions(subject);
CREATE INDEX IF NOT EXISTS idx_exercise_sessions_difficulty ON exercise_sessions(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercise_sessions_created_at ON exercise_sessions(created_at);

CREATE INDEX IF NOT EXISTS idx_exercise_results_user_id ON exercise_results(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_results_exercise_id ON exercise_results(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercise_results_is_correct ON exercise_results(is_correct);
CREATE INDEX IF NOT EXISTS idx_exercise_results_created_at ON exercise_results(created_at);

-- Índice composto para consultas do dashboard
CREATE INDEX IF NOT EXISTS idx_exercise_results_user_correct ON exercise_results(user_id, is_correct);

-- Políticas RLS (Row Level Security)
ALTER TABLE exercise_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_results ENABLE ROW LEVEL SECURITY;

-- Políticas para exercise_sessions
CREATE POLICY exercise_sessions_select_policy ON exercise_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY exercise_sessions_insert_policy ON exercise_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY exercise_sessions_update_policy ON exercise_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY exercise_sessions_delete_policy ON exercise_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para exercise_results
CREATE POLICY exercise_results_select_policy ON exercise_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY exercise_results_insert_policy ON exercise_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY exercise_results_update_policy ON exercise_results
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY exercise_results_delete_policy ON exercise_results
  FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at em exercise_sessions
CREATE TRIGGER update_exercise_sessions_updated_at
    BEFORE UPDATE ON exercise_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir alguns dados de exemplo para teste (opcional)
INSERT INTO exercise_sessions (user_id, subject, difficulty, question, options, correct_answer, explanation, status)
SELECT 
  auth.uid(),
  'Matemática',
  'medium',
  'Qual é o resultado de 2 + 2?',
  '["2", "3", "4", "5"]'::jsonb,
  '4',
  'A soma de 2 + 2 é igual a 4.',
  'completed'
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO exercise_sessions (user_id, subject, difficulty, question, options, correct_answer, explanation, status)
SELECT 
  auth.uid(),
  'Português',
  'easy',
  'Qual é o plural de "casa"?',
  '["casa", "casas", "casaes", "casões"]'::jsonb,
  'casas',
  'O plural de "casa" é "casas".',
  'completed'
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO exercise_sessions (user_id, subject, difficulty, question, options, correct_answer, explanation, status)
SELECT 
  auth.uid(),
  'Física',
  'hard',
  'Qual é a fórmula da força?',
  '["F = ma", "F = mv", "F = mc²", "F = mgh"]'::jsonb,
  'F = ma',
  'A segunda lei de Newton estabelece que F = ma (força = massa × aceleração).',
  'completed'
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

-- Inserir resultados de exemplo
INSERT INTO exercise_results (exercise_id, user_id, user_answer, is_correct, time_spent)
SELECT 
  es.id,
  es.user_id,
  es.correct_answer,
  true,
  30
FROM exercise_sessions es
WHERE es.user_id = auth.uid()
ON CONFLICT DO NOTHING;

-- Comentários para documentação
COMMENT ON TABLE exercise_sessions IS 'Tabela que armazena as sessões de exercícios gerados para os usuários';
COMMENT ON TABLE exercise_results IS 'Tabela que armazena os resultados das respostas dos usuários aos exercícios';
COMMENT ON COLUMN exercise_sessions.options IS 'Array JSON com as opções de resposta do exercício';
COMMENT ON COLUMN exercise_results.time_spent IS 'Tempo gasto pelo usuário para responder o exercício em segundos';