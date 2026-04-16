import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
dotenv.config({ path: '.env.local' });

const ZYRA_SYSTEM_PROMPT = `You are Zyra AI — a smart, modern assistant for the L Bodi website. Be concise and professional.`;

async function testGemini() {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    console.log('❌ GOOGLE_GEMINI_API_KEY not found in .env.local');
    return;
  }

  console.log('Listing available models...');
  const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  try {
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();
    console.log('Available models:', JSON.stringify(listData.models?.map(m => m.name), null, 2));
  } catch (err) {
    console.warn('Could not list models:', err);
  }

  console.log('Testing Gemini connection...');

  const model = 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: ZYRA_SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: 'Hello, are you working?' }] }],
        generationConfig: { maxOutputTokens: 100 },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log('✅ Gemini response:', text);
    } else {
      const err = await res.text();
      console.log('❌ Gemini error:', res.status, err);
    }
  } catch (err) {
    console.error('❌ Gemini fetch error:', err);
  }
}

async function testOpenAI() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.log('ℹ️ OPENAI_API_KEY not found (optional fallback)');
      return;
    }
  
    console.log('Testing OpenAI connection...');
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: ZYRA_SYSTEM_PROMPT },
            { role: 'user', content: 'Hello, are you working?' },
          ],
          max_tokens: 100,
        }),
      });
  
      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        console.log('✅ OpenAI response:', text);
      } else {
        const err = await res.text();
        console.log('❌ OpenAI error:', res.status, err);
      }
    } catch (err) {
      console.error('❌ OpenAI fetch error:', err);
    }
  }

async function run() {
  await testGemini();
  await testOpenAI();
}

run();
