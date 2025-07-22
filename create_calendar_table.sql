-- Script para criar a tabela calendar_events no Supabase
-- Execute este script diretamente no SQL Editor do Supabase

-- Criar a tabela calendar_events
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  study_plan_id UUID REFERENCES study_plans(id) ON DELETE CASCADE,
  
  -- Informações do evento
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Data e hora
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  
  -- Tipo e categoria
  event_type VARCHAR(50) NOT NULL DEFAULT 'study',
  subject VARCHAR(100),
  topic VARCHAR(255),
  
  -- Configurações de recorrência
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern JSONB,
  
  -- Status e progresso
  status VARCHAR(20) DEFAULT 'scheduled',
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadados
  color VARCHAR(7) DEFAULT '#2563eb',
  priority INTEGER DEFAULT 2,
  
  -- Configurações de notificação
  reminder_minutes INTEGER DEFAULT 15,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_study_plan_id ON calendar_events(study_plan_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date ON calendar_events(start_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_event_type ON calendar_events(event_type);
CREATE INDEX IF NOT EXISTS idx_calendar_events_status ON calendar_events(status);

-- Habilitar RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY IF NOT EXISTS calendar_events_select_policy ON calendar_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS calendar_events_insert_policy ON calendar_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS calendar_events_update_policy ON calendar_events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS calendar_events_delete_policy ON calendar_events
  FOR DELETE USING (auth.uid() = user_id);

-- Criar trigger para updated_at
CREATE OR REPLACE FUNCTION update_calendar_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_calendar_events_updated_at ON calendar_events;
CREATE TRIGGER trigger_update_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_calendar_events_updated_at();
