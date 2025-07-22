// Teste rápido da API do Gemini
const GEMINI_API_KEY = 'AIzaSyCu_-WP5O0_UkMJT2ChB510EFYFvggsCAg';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta';

async function testGemini() {
  try {
    console.log('🧪 Testando API do Gemini...');
    
    const response = await fetch(`${GEMINI_API_URL}/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Responda apenas com "OK" se você está funcionando.'
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 10,
        }
      }),
    });

    console.log('📊 Status da resposta:', response.status);
    console.log('📊 Status text:', response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ Resposta do Gemini:', JSON.stringify(data, null, 2));
    
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('📝 Conteúdo extraído:', content);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testGemini();
