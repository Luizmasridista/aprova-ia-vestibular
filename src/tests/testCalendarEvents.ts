/**
 * Script de teste para verificar o fluxo de criação de eventos no calendário
 * Este script simula o fluxo completo de criação de eventos via APRU
 */

import { CalendarEventActions } from '../lib/services/calendarEventActions';
import { CreateEventRequest } from '../lib/services/calendarService';

// Interface ScheduleItem conforme definida no sistema
interface ScheduleItem {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  startTime: string;
  endTime: string;
  event_type: 'study' | 'exam' | 'review' | 'break';
  subject?: string;
  topic?: string;
  color?: string;
  priority?: 1 | 2 | 3;
  reminder_minutes?: number;
}

// Função simulada para testar o fluxo
async function testEventCreation() {
  console.log('🧪 Iniciando teste de criação de eventos via APRU');
  
  // Callbacks simulados
  const mockCallbacks = {
    onCreateEvent: async (eventData: CreateEventRequest): Promise<void> => {
      console.log('✅ [TESTE] Callback onCreateEvent chamado com:', JSON.stringify(eventData, null, 2));
      // Não retornamos nada, apenas simulamos a criação
      console.log('✅ [TESTE] Evento criado com ID:', 'test-id-' + Date.now());
    },
    onCelebration: (message: string): void => {
      console.log('🎉 [TESTE] Callback onCelebration chamado com:', message);
    }
  };
  
  // Criar instância de CalendarEventActions com callbacks simulados
  const eventActions = new CalendarEventActions(mockCallbacks);
  
  // Testar criação de evento único
  console.log('\n📌 TESTE 1: Criação de evento único');
  try {
    const result = await eventActions.createScheduledEvent([], 'Matemática');
    console.log('🔍 Resultado:', result ? 'Sucesso' : 'Falha');
  } catch (error) {
    console.error('❌ Erro no teste 1:', error);
  }
  
  // Testar criação de cronograma
  console.log('\n📌 TESTE 2: Criação de cronograma');
  try {
    // Criar cronograma compatível com a interface ScheduleItem
    const mockSchedule: ScheduleItem[] = [
      {
        title: 'Revisão de Matemática',
        description: 'Sessão de estudos de Matemática',
        start_date: '2025-07-24',
        end_date: '2025-07-24',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        event_type: 'study',
        subject: 'Matemática',
        topic: 'Álgebra',
        color: '#3498db',
        priority: 2,
        reminder_minutes: 15
      },
      {
        title: 'Revisão de Física',
        description: 'Sessão de estudos de Física',
        start_date: '2025-07-25',
        end_date: '2025-07-25',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        event_type: 'study',
        subject: 'Física',
        topic: 'Mecânica',
        color: '#f39c12',
        priority: 2,
        reminder_minutes: 15
      }
    ];
    
    const result = await eventActions.createScheduleEvents(mockSchedule);
    console.log('🔍 Resultado:', result);
  } catch (error) {
    console.error('❌ Erro no teste 2:', error);
  }
  
  console.log('\n✅ Testes concluídos!');
}

// Executar teste
testEventCreation().catch(console.error);

// Nota: Este é apenas um script de teste e não deve ser usado em produção
// Para executar: ts-node testCalendarEvents.ts
