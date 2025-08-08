import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

console.log('Function "delete-user" iniciada');

serve(async (req) => {
  try {
    // Inicializa o Supabase com variáveis de ambiente
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { userId } = await req.json();
    if (!userId) throw new Error('userId é obrigatório');

    // Exclui dados do usuário em todas as tabelas relacionadas
    const { error: userDataError } = await supabase
      .from('user_data')
      .delete()
      .eq('user_id', userId);

    const { error: progressError } = await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', userId);

    const { error: sessionsError } = await supabase
      .from('user_sessions')
      .delete()
      .eq('user_id', userId);

    if (userDataError || progressError || sessionsError) {
      throw userDataError || progressError || sessionsError;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
