/**
 * Daily usage limit for free AI (15 questions per day).
 * Uses a cookie so it works in serverless and stays per-browser.
 */

const COOKIE_NAME = 'zyra_usage';
const DAILY_LIMIT = 15;

export interface UsageState {
  date: string; // YYYY-MM-DD
  count: number;
}

export function getUsageFromCookie(cookieValue: string | undefined): UsageState {
  if (!cookieValue) return { date: today(), count: 0 };
  try {
    const decoded = decodeURIComponent(cookieValue);
    const parsed = JSON.parse(decoded) as UsageState;
    if (typeof parsed.count !== 'number' || typeof parsed.date !== 'string') return { date: today(), count: 0 };
    if (parsed.date !== today()) return { date: today(), count: 0 };
    return { date: parsed.date, count: Math.min(parsed.count, DAILY_LIMIT) };
  } catch {
    return { date: today(), count: 0 };
  }
}

export function serializeUsage(state: UsageState): string {
  return encodeURIComponent(JSON.stringify(state));
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isOverLimit(usage: UsageState): boolean {
  return usage.count >= DAILY_LIMIT;
}

export function incrementUsage(usage: UsageState): UsageState {
  return {
    date: usage.date,
    count: Math.min(usage.count + 1, DAILY_LIMIT),
  };
}

export { COOKIE_NAME, DAILY_LIMIT };
