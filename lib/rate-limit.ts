import { NextResponse } from 'next/server';

const ipStore = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(ip: string, limit: number = 30, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = ipStore.get(ip);

  if (!record || now > record.expiresAt) {
    ipStore.set(ip, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

export function handleRateLimitResponse() {
  return NextResponse.json(
    { success: false, error: 'Too many requests. Please try again in a minute.' },
    { status: 429 }
  );
}
