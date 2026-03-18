import type { AIProvider, ChatMessage } from './types';

function tryParseJson(str: string): { error?: { status?: string } } | null {
  try {
    return JSON.parse(str) as { error?: { status?: string } };
  } catch {
    return null;
  }
}

const ZYRA_SYSTEM_PROMPT = `You are Zyra AI — a smart, modern assistant for the L Bodi website (a bieluminescent cyber-nature agency). Be concise, helpful, and professional. Match the site's premium, futuristic tone. IMPORTANT: If anyone asks for our email address, contact information, or how to reach us, you must ONLY provide this exact email address: bodlizstudio@gmail.com. Do not mention any other email.`;

/**
 * Google Gemini provider. Set GOOGLE_GEMINI_API_KEY in env.
 */
function createGeminiProvider(apiKey: string): AIProvider {
  return {
    async chat(messages: ChatMessage[]): Promise<string> {
      const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      // Try models in order; first available with the user's API key wins
      const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-flash-lite-latest', 'gemini-pro'];
      const apiVersion = 'v1beta';

      let lastError: string | null = null;
      for (const model of modelsToTry) {
        const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: ZYRA_SYSTEM_PROMPT }] },
            contents,
            generationConfig: { maxOutputTokens: 512 },
          }),
        });

        if (res.ok) {
          const data = (await res.json()) as {
            candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
          };
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          return text ?? 'Sorry, I couldn’t generate a response.';
        }

        lastError = await res.text();
        const parsed = tryParseJson(lastError);
        if (parsed?.error?.status === 'NOT_FOUND' || res.status === 404) {
          continue;
        }
        if (res.status === 429) {
          await new Promise((resolve) => setTimeout(resolve, 3500));
          continue;
        }
        throw new Error(lastError || `Gemini error: ${res.status}`);
      }

      throw new Error(lastError ?? 'No Gemini model available.');
    },
  };
}

/**
 * OpenAI-compatible provider. Set OPENAI_API_KEY in env.
 */
function createOpenAIProvider(apiKey: string): AIProvider {
  return {
    async chat(messages: ChatMessage[]): Promise<string> {
      const body = {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: ZYRA_SYSTEM_PROMPT },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 512,
      };

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `OpenAI error: ${res.status}`);
      }

      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = data.choices?.[0]?.message?.content?.trim();
      return content ?? 'Sorry, I couldn’t generate a response.';
    },
  };
}

/**
 * Returns first available provider: Gemini → OpenAI → null (then use mock).
 */
export async function createAIProvider(): Promise<AIProvider | null> {
  const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (geminiKey) return createGeminiProvider(geminiKey);

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) return createOpenAIProvider(openaiKey);

  return null;
}

/**
 * Fallback when no API key: echo-style reply for development.
 */
export function createMockProvider(): AIProvider {
  return {
    async chat(messages: ChatMessage[]): Promise<string> {
      const last = messages[messages.length - 1];
      if (last?.role === 'user') {
        return `Zyra AI here. You said: "${last.content.slice(0, 100)}". Set GOOGLE_GEMINI_API_KEY or OPENAI_API_KEY in .env.local for real AI responses.`;
      }
      return "Hi! I'm Zyra AI — your smart assistant. How can I help?";
    },
  };
}
