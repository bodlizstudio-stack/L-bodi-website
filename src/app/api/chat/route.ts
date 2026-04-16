import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getUsageFromCookie,
  serializeUsage,
  incrementUsage,
  isOverLimit,
  COOKIE_NAME,
  DAILY_LIMIT,
} from '@/lib/ai/usage';
import { createAIProvider, createMockProvider } from '@/lib/ai/provider';
import type { ChatMessage } from '@/lib/ai/types';

const LIMIT_MESSAGE =
  "You reached today's free AI limit. Try again tomorrow.";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const usageCookie = cookieStore.get(COOKIE_NAME)?.value;
    const usage = getUsageFromCookie(usageCookie);

    if (isOverLimit(usage)) {
      return NextResponse.json(
        { error: 'limit_exceeded', message: LIMIT_MESSAGE },
        { status: 429 }
      );
    }

    const body = await request.json();
    const messages = body.messages as ChatMessage[] | undefined;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 }
      );
    }

    const provider = (await createAIProvider()) ?? createMockProvider();
    const reply = await provider.chat(messages);

    const newUsage = incrementUsage(usage);
    const response = NextResponse.json({ message: reply });
    response.cookies.set(COOKIE_NAME, serializeUsage(newUsage), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 * 2, // 2 days
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[Zyra API]', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const usageCookie = cookieStore.get(COOKIE_NAME)?.value;
  const usage = getUsageFromCookie(usageCookie);
  return NextResponse.json({
    count: usage.count,
    limit: DAILY_LIMIT,
    remaining: Math.max(0, DAILY_LIMIT - usage.count),
  });
}
