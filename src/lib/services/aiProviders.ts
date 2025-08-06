/*
  Unified AI provider layer used by CalendarChatService.
  This isolates the low-level HTTP calls from the chat logic, facilitando manutenção
  e permitindo adicionar novos modelos no futuro sem mexer no cérebro.
*/

export interface AIProvider {
  generate(prompt: string): Promise<string>;
}

class GeminiProvider implements AIProvider {
  private readonly apiKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
  // Allow model override via env, default to free model "gemini-1.5-flash"
  private readonly model =
    (import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash').trim();

  private readonly baseUrl =
    import.meta.env.VITE_GEMINI_API_URL ||
    (this.model.includes('pro')
      ? 'https://generativelanguage.googleapis.com/v1'
      : 'https://generativelanguage.googleapis.com/v1beta');

  async generate(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key missing');
    }

    const res = await fetch(
      `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${text}`);
    }

    interface GeminiResponse {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string;
          }>;
        };
      }>;
    }
    
    const data = await res.json() as GeminiResponse;
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error('Gemini empty response');
    return content as string;
  }
}

class DeepSeekProvider implements AIProvider {
  private readonly apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
  private readonly baseUrl = import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';

  async generate(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API key missing');
    }

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`DeepSeek API error ${res.status}: ${text}`);
    }

    interface DeepSeekResponse {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    }
    
    const data = await res.json() as DeepSeekResponse;
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('DeepSeek empty response');
    return content as string;
  }
}

export const geminiProvider: AIProvider = new GeminiProvider();
export const deepSeekProvider: AIProvider = new DeepSeekProvider();
