/**
 * ⚠️ ARQUIVO DESCONTINUADO ⚠️
 * 
 * Este arquivo continha respostas pré-moldadas que foram REMOVIDAS.
 * Agora o APRU usa APENAS IA REAL (Gemini/DeepSeek) para todas as conversas.
 * 
 * TODAS as mensagens passam pelas APIs de IA real:
 * - Gemini para modo APRU 1b
 * - DeepSeek para modo APRU REASONING
 * 
 * Sem fallbacks locais, sem conversas mockadas.
 * Apenas IA real interpretando e respondendo.
 */

// Funções mantidas apenas para compatibilidade com código legado
// mas retornam null para forçar uso da IA real

export function detectMessageType(message: string): null {
  console.log('🚀 [AssistantResponses] DESCONTINUADO - Usando apenas IA real');
  return null;
}

export function getRandomResponse(type: string): string {
  console.log('🚀 [AssistantResponses] DESCONTINUADO - Usando apenas IA real');
  return '';
}

export function generateNaturalResponse(message: string): null {
  console.log('🚀 [AssistantResponses] DESCONTINUADO - Enviando para IA real:', message);
  return null;
}
