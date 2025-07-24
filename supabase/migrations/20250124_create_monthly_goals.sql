-- Criar tabela de metas mensais
CREATE TABLE IF NOT EXISTS monthly_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  study_plan_id UUID REFERENCES study_plans(id) ON DELETE SET NULL,
  month VARCHAR(7) NOT NULL, -- YYYY-MM format
  study_hours_target INTEGER NOT NULL DEFAULT 40,
  study_hours_current INTEGER DEFAULT 0,
  events_target INTEGER NOT NULL DEFAULT 20,
  events_current INTEGER DEFAULT 0,
  streak_target INTEGER NOT NULL DEFAULT 15,
  streak_current INTEGER DEFAULT 0,
  intensity VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (intensity IN ('low', 'medium', 'high', 'intensive')),
  reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_monthly_goals_user_id ON monthly_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_goals_month ON monthly_goals(month);
CREATE INDEX IF NOT EXISTS idx_monthly_goals_study_plan ON monthly_goals(study_plan_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE monthly_goals ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas suas próprias metas
CREATE POLICY "Users can view their own monthly goals" ON monthly_goals
  FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários criarem suas próprias metas
CREATE POLICY "Users can create their own monthly goals" ON monthly_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem suas próprias metas
CREATE POLICY "Users can update their own monthly goals" ON monthly_goals
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para usuários excluírem suas próprias metas
CREATE POLICY "Users can delete their own monthly goals" ON monthly_goals
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_monthly_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_monthly_goals_updated_at
  BEFORE UPDATE ON monthly_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_monthly_goals_updated_at();

-- Comentários para documentação
COMMENT ON TABLE monthly_goals IS 'Metas mensais personalizadas dos usuários baseadas em seus planos de estudo';
COMMENT ON COLUMN monthly_goals.month IS 'Mês no formato YYYY-MM';
COMMENT ON COLUMN monthly_goals.intensity IS 'Intensidade do plano: low, medium, high, intensive';
COMMENT ON COLUMN monthly_goals.reasoning IS 'Explicação de por que essas metas foram definidas';
