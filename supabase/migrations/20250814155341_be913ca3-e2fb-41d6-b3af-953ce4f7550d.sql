-- Phase 1: Critical Database Security Fixes

-- 1. Fix Database Function Security - Add search_path protection to prevent SQL injection
CREATE OR REPLACE FUNCTION public.delete_user_data(user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  -- Verificar se o usuário está tentando excluir seus próprios dados
  IF auth.uid() != delete_user_data.user_id THEN
    RAISE EXCEPTION 'Apenas o próprio usuário pode excluir seus dados';
  END IF;

  -- Excluir dados em ordem de dependência (filhos primeiro)
  -- Notificações
  DELETE FROM public.notifications WHERE user_id = delete_user_data.user_id;
  
  -- Preferências do usuário
  DELETE FROM public.user_preferences WHERE user_id = delete_user_data.user_id;
  
  -- Planos de estudo
  DELETE FROM public.study_plans WHERE user_id = delete_user_data.user_id;
  
  -- Sessões de estudo
  DELETE FROM public.study_sessions WHERE user_id = delete_user_data.user_id;
  
  -- Resultados de exercícios
  DELETE FROM public.exercise_results WHERE user_id = delete_user_data.user_id;
  
  -- Sessões de exercícios
  DELETE FROM public.exercise_sessions WHERE user_id = delete_user_data.user_id;
  
  -- Eventos do calendário
  DELETE FROM public.calendar_events WHERE user_id = delete_user_data.user_id;
  
  -- Log da operação (opcional)
  INSERT INTO public.audit_log (user_id, action, details)
  VALUES (delete_user_data.user_id, 'account_deletion', 'User data deleted');
  
EXCEPTION WHEN OTHERS THEN
  -- Log do erro
  RAISE LOG 'Erro ao excluir dados do usuário %: %', delete_user_data.user_id, SQLERRM;
  RAISE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_exercise_sessions_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_monthly_goals_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- 2. Remove conflicting public read policies from exercise tables
-- Drop the public read policies that conflict with user-specific policies
DROP POLICY IF EXISTS "Allow authenticated users to view exercise sessions" ON public.exercise_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to view exercise results" ON public.exercise_results;

-- 3. Add encryption for Google Calendar OAuth tokens (prepare for future encryption)
-- Add audit logging table for security monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only allow reading own audit logs for regular users
CREATE POLICY "Users can view their own audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (auth.uid() = user_id);

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" 
ON public.security_audit_log 
FOR INSERT 
WITH CHECK (true);

-- 4. Add function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.security_audit_log (user_id, action, resource_type, resource_id)
  VALUES (p_user_id, p_action, p_resource_type, p_resource_id);
END;
$function$;