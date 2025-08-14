/// <reference lib="esnext" />
/// <reference lib="dom" />
/// <reference path="./types.d.ts" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers para todas as respostas
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

console.log('Function "delete-user" iniciada');

Deno.serve(async (req: Request) => {
  // Resposta para requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Inicializa clientes Supabase
    const url = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    if (!url || !serviceKey || !anonKey) {
      throw new Error('Variáveis de ambiente SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e SUPABASE_ANON_KEY são obrigatórias');
    }

    // Client admin para operações privilegiadas (deletar dados e usuário)
    const supabaseAdmin = createClient(url, serviceKey, {
      auth: { persistSession: false }
    });

    // Client autenticado com o JWT do usuário para obter a identidade com segurança
    const authHeader = req.headers.get('Authorization') || '';
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Token de autorização não fornecido' }), 
        { 
          status: 401, 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    const supabaseAuth = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false }
    });

    // Verifica autenticação do usuário
    const { data: userData, error: getUserError } = await supabaseAuth.auth.getUser();
    if (getUserError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: 'Não autenticado' }), 
        { 
          status: 401, 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    const userId = userData.user.id;

    try {
      // Inicia uma transação para garantir a atomicidade
      const { data, error: rpcError } = await supabaseAdmin
        .rpc('delete_user_data', { user_id: userId });

      if (rpcError) throw rpcError;

      // Exclui o usuário do Auth (Admin API)
      const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (deleteAuthError) throw deleteAuthError;

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Conta e dados excluídos com sucesso.' 
        }), 
        { 
          status: 200, 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      );
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao processar a exclusão';
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Falha ao excluir a conta',
          details: errorMessage
        }), 
        { 
          status: 500, 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('Erro na função delete-user:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Erro ao processar a requisição',
        details: message 
      }), 
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
