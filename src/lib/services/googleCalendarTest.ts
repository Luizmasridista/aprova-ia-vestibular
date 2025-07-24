/**
 * Script de teste para verificar a integração com Google Calendar
 * Use este script para diagnosticar problemas de autenticação
 */

import { googleCalendarService } from './googleCalendarService';

export const testGoogleCalendarIntegration = async () => {
  console.log('🔍 [GoogleCalendarTest] Iniciando teste de integração...');
  
  try {
    // Teste 1: Verificar configuração
    console.log('\n📋 [GoogleCalendarTest] TESTE 1: Verificando configuração...');
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    console.log('🔑 Client ID:', clientId ? `${clientId.substring(0, 20)}...` : 'NÃO CONFIGURADO');
    
    if (!clientId || clientId === 'undefined') {
      console.error('❌ [GoogleCalendarTest] ERRO: VITE_GOOGLE_CLIENT_ID não configurado!');
      console.error('💡 [GoogleCalendarTest] Crie um arquivo .env com:');
      console.error('   VITE_GOOGLE_CLIENT_ID=487233347456-uvfdhq6tugm1kv5s0a30krg5nvbon2hd.apps.googleusercontent.com');
      return false;
    }
    
    // Teste 2: Inicialização
    console.log('\n📋 [GoogleCalendarTest] TESTE 2: Inicializando serviço...');
    const initialized = await googleCalendarService.initialize();
    if (!initialized) {
      console.error('❌ [GoogleCalendarTest] ERRO: Falha na inicialização');
      return false;
    }
    console.log('✅ [GoogleCalendarTest] Serviço inicializado com sucesso');
    
    // Teste 3: Autenticação
    console.log('\n📋 [GoogleCalendarTest] TESTE 3: Testando autenticação...');
    const authenticated = await googleCalendarService.signIn();
    if (!authenticated) {
      console.error('❌ [GoogleCalendarTest] ERRO: Falha na autenticação');
      console.error('💡 [GoogleCalendarTest] Possíveis causas:');
      console.error('   - Client ID incorreto');
      console.error('   - Domínio não autorizado no Google Console');
      console.error('   - Usuário cancelou a autenticação');
      return false;
    }
    console.log('✅ [GoogleCalendarTest] Autenticação realizada com sucesso');
    
    // Teste 4: Verificar permissões
    console.log('\n📋 [GoogleCalendarTest] TESTE 4: Verificando permissões...');
    const isAuth = googleCalendarService.isAuthenticated();
    if (!isAuth) {
      console.error('❌ [GoogleCalendarTest] ERRO: Usuário não está autenticado');
      return false;
    }
    console.log('✅ [GoogleCalendarTest] Usuário autenticado e com permissões');
    
    // Teste 5: Criar evento de teste
    console.log('\n📋 [GoogleCalendarTest] TESTE 5: Criando evento de teste...');
    const testEvent = {
      summary: 'Teste APROVA.AE - ' + new Date().toLocaleTimeString(),
      description: 'Evento de teste criado pelo sistema APROVA.AE',
      start: {
        dateTime: new Date(Date.now() + 60000).toISOString(), // 1 minuto no futuro
        timeZone: 'America/Sao_Paulo'
      },
      end: {
        dateTime: new Date(Date.now() + 120000).toISOString(), // 2 minutos no futuro
        timeZone: 'America/Sao_Paulo'
      }
    };
    
    const eventId = await googleCalendarService.createEvent(testEvent);
    if (!eventId) {
      console.error('❌ [GoogleCalendarTest] ERRO: Falha ao criar evento de teste');
      return false;
    }
    console.log('✅ [GoogleCalendarTest] Evento de teste criado com sucesso:', eventId);
    
    // Teste 6: Limpar evento de teste
    console.log('\n📋 [GoogleCalendarTest] TESTE 6: Limpando evento de teste...');
    const deleted = await googleCalendarService.deleteEvent(eventId);
    if (deleted) {
      console.log('✅ [GoogleCalendarTest] Evento de teste removido com sucesso');
    } else {
      console.warn('⚠️ [GoogleCalendarTest] Não foi possível remover o evento de teste');
    }
    
    console.log('\n🎉 [GoogleCalendarTest] TODOS OS TESTES PASSARAM!');
    console.log('✅ [GoogleCalendarTest] Integração com Google Calendar funcionando corretamente');
    return true;
    
  } catch (error) {
    console.error('\n❌ [GoogleCalendarTest] ERRO DURANTE OS TESTES:', error);
    console.error('📝 [GoogleCalendarTest] Detalhes do erro:', {
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : 'N/A'
    });
    return false;
  }
};

// Função para executar teste via console do navegador
(window as Window & { testGoogleCalendar?: () => Promise<boolean> }).testGoogleCalendar = testGoogleCalendarIntegration;

console.log('🔧 [GoogleCalendarTest] Script carregado!');
console.log('💡 [GoogleCalendarTest] Execute no console: testGoogleCalendar()');
