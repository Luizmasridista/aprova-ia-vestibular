-- Função para excluir todos os dados de um usuário
CREATE OR REPLACE FUNCTION delete_user_data(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Excluir resultados de exercícios
  DELETE FROM exercise_results WHERE user_id = delete_user_data.user_id;
  
  -- Excluir sessões de exercícios
  DELETE FROM exercise_sessions WHERE user_id = delete_user_data.user_id;
  
  -- Excluir eventos do calendário
  DELETE FROM calendar_events WHERE user_id = delete_user_data.user_id;
  
  -- Adicionar outras tabelas conforme necessário
  -- DELETE FROM outras_tabelas WHERE user_id = delete_user_data.user_id;
  
END;
$$;

-- Permitir que usuários autenticados executem esta função apenas para seus próprios dados
GRANT EXECUTE ON FUNCTION delete_user_data(UUID) TO authenticated;

-- Criar política RLS para a função (apenas o próprio usuário pode excluir seus dados)
CREATE POLICY "Users can delete their own data" ON exercise_sessions
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own results" ON exercise_results
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" ON calendar_events
  FOR DELETE USING (auth.uid() = user_id);