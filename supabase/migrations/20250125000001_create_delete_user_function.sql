-- Função para excluir todos os dados de um usuário
CREATE OR REPLACE FUNCTION delete_user_data(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o usuário está tentando excluir seus próprios dados
  IF auth.uid() != delete_user_data.user_id THEN
    RAISE EXCEPTION 'Apenas o próprio usuário pode excluir seus dados';
  END IF;

  -- Excluir dados em ordem de dependência (filhos primeiro)
  -- Notificações
  DELETE FROM notifications WHERE user_id = delete_user_data.user_id;
  
  -- Preferências do usuário
  DELETE FROM user_preferences WHERE user_id = delete_user_data.user_id;
  
  -- Planos de estudo
  DELETE FROM study_plans WHERE user_id = delete_user_data.user_id;
  
  -- Sessões de estudo
  DELETE FROM study_sessions WHERE user_id = delete_user_data.user_id;
  
  -- Resultados de exercícios
  DELETE FROM exercise_results WHERE user_id = delete_user_data.user_id;
  
  -- Sessões de exercícios
  DELETE FROM exercise_sessions WHERE user_id = delete_user_data.user_id;
  
  -- Eventos do calendário
  DELETE FROM calendar_events WHERE user_id = delete_user_data.user_id;
  
  -- Adicione outras tabelas conforme necessário
  -- DELETE FROM outra_tabela WHERE user_id = delete_user_data.user_id;
  
  -- Log da operação (opcional)
  INSERT INTO audit_log (user_id, action, details)
  VALUES (delete_user_data.user_id, 'account_deletion', 'User data deleted');
  
EXCEPTION WHEN OTHERS THEN
  -- Log do erro
  RAISE LOG 'Erro ao excluir dados do usuário %: %', delete_user_data.user_id, SQLERRM;
  RAISE;
END;
$$;

-- Permitir que usuários autenticados executem esta função apenas para seus próprios dados
GRANT EXECUTE ON FUNCTION delete_user_data(UUID) TO authenticated;

-- Criar políticas RLS para as tabelas (apenas o próprio usuário pode excluir seus dados)
CREATE POLICY "Users can delete their own exercise sessions" ON exercise_sessions
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercise results" ON exercise_results
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study plans" ON study_plans
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study sessions" ON study_sessions
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences" ON user_preferences
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar events" ON calendar_events
  FOR DELETE USING (auth.uid() = user_id);