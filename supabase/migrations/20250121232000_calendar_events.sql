Pode -- Criação da tabela de eventos do calendário
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
  event_type VARCHAR(50) NOT NULL DEFAULT 'study', -- 'study', 'exam', 'review', 'break'
  subject VARCHAR(100),
  topic VARCHAR(255),
  
  -- Configurações de recorrência
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern JSONB, -- {type: 'daily|weekly|monthly', interval: 1, days_of_week: [1,2,3], end_date: '2024-12-31'}
  
  -- Status e progresso
  status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadados
  color VARCHAR(7) DEFAULT '#2563eb', -- Cor hexadecimal para o evento
  priority INTEGER DEFAULT 1, -- 1=baixa, 2=média, 3=alta
  
  -- Configurações de notificação
  reminder_minutes INTEGER DEFAULT 15, -- Lembrete X minutos antes
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_study_plan_id ON calendar_events(study_plan_id);
CREATE INDEX idx_calendar_events_start_date ON calendar_events(start_date);
CREATE INDEX idx_calendar_events_event_type ON calendar_events(event_type);
CREATE INDEX idx_calendar_events_status ON calendar_events(status);

-- Índice composto para consultas por usuário e período
CREATE INDEX idx_calendar_events_user_date_range ON calendar_events(user_id, start_date, end_date);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_calendar_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_calendar_events_updated_at();

-- RLS (Row Level Security) para garantir que usuários só vejam seus próprios eventos
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Política para SELECT: usuários só podem ver seus próprios eventos
CREATE POLICY calendar_events_select_policy ON calendar_events
  FOR SELECT USING (auth.uid() = user_id);

-- Política para INSERT: usuários só podem criar eventos para si mesmos
CREATE POLICY calendar_events_insert_policy ON calendar_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para UPDATE: usuários só podem atualizar seus próprios eventos
CREATE POLICY calendar_events_update_policy ON calendar_events
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para DELETE: usuários só podem deletar seus próprios eventos
CREATE POLICY calendar_events_delete_policy ON calendar_events
  FOR DELETE USING (auth.uid() = user_id);

-- Função para gerar eventos recorrentes
CREATE OR REPLACE FUNCTION generate_recurring_events(
  base_event_id UUID,
  end_date DATE DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  base_event calendar_events%ROWTYPE;
  pattern JSONB;
  current_date DATE;
  events_created INTEGER := 0;
  max_events INTEGER := 100; -- Limite de segurança
BEGIN
  -- Buscar o evento base
  SELECT * INTO base_event FROM calendar_events WHERE id = base_event_id;
  
  IF NOT FOUND OR NOT base_event.is_recurring THEN
    RETURN 0;
  END IF;
  
  pattern := base_event.recurrence_pattern;
  current_date := (base_event.start_date + INTERVAL '1 day')::DATE;
  
  -- Se não foi especificado end_date, usar o padrão do evento ou 3 meses
  IF end_date IS NULL THEN
    end_date := COALESCE(
      (pattern->>'end_date')::DATE,
      current_date + INTERVAL '3 months'
    );
  END IF;
  
  -- Gerar eventos baseado no padrão
  WHILE current_date <= end_date AND events_created < max_events LOOP
    CASE pattern->>'type'
      WHEN 'daily' THEN
        -- Criar evento diário
        INSERT INTO calendar_events (
          user_id, study_plan_id, title, description, start_date, end_date,
          all_day, event_type, subject, topic, status, color, priority,
          reminder_minutes, is_recurring, recurrence_pattern
        ) VALUES (
          base_event.user_id, base_event.study_plan_id, base_event.title,
          base_event.description,
          current_date + (base_event.start_date::TIME),
          current_date + (base_event.end_date::TIME),
          base_event.all_day, base_event.event_type, base_event.subject,
          base_event.topic, 'scheduled', base_event.color, base_event.priority,
          base_event.reminder_minutes, FALSE, NULL
        );
        
        current_date := current_date + ((pattern->>'interval')::INTEGER || ' days')::INTERVAL;
        events_created := events_created + 1;
        
      WHEN 'weekly' THEN
        -- Criar evento semanal (implementação simplificada)
        INSERT INTO calendar_events (
          user_id, study_plan_id, title, description, start_date, end_date,
          all_day, event_type, subject, topic, status, color, priority,
          reminder_minutes, is_recurring, recurrence_pattern
        ) VALUES (
          base_event.user_id, base_event.study_plan_id, base_event.title,
          base_event.description,
          current_date + (base_event.start_date::TIME),
          current_date + (base_event.end_date::TIME),
          base_event.all_day, base_event.event_type, base_event.subject,
          base_event.topic, 'scheduled', base_event.color, base_event.priority,
          base_event.reminder_minutes, FALSE, NULL
        );
        
        current_date := current_date + ((pattern->>'interval')::INTEGER * 7 || ' days')::INTERVAL;
        events_created := events_created + 1;
        
      ELSE
        -- Padrão não reconhecido, sair do loop
        EXIT;
    END CASE;
  END LOOP;
  
  RETURN events_created;
END;
$$ LANGUAGE plpgsql;

-- Comentários para documentação
COMMENT ON TABLE calendar_events IS 'Tabela para armazenar eventos do calendário dos usuários';
COMMENT ON COLUMN calendar_events.recurrence_pattern IS 'Padrão de recorrência em formato JSON';
COMMENT ON COLUMN calendar_events.event_type IS 'Tipo do evento: study, exam, review, break';
COMMENT ON COLUMN calendar_events.status IS 'Status do evento: scheduled, in_progress, completed, cancelled';
COMMENT ON FUNCTION generate_recurring_events IS 'Função para gerar eventos recorrentes baseado em um evento base';
