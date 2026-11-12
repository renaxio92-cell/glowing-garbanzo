import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  captchaSessionCookieName,
  captchaSessionTtlSeconds,
  createCaptchaSession,
} from '@/lib/captcha-session';

const requestSchema = z.object({ token: z.string().min(1).max(8192) }).strict();
const providerResponseSchema = z.object({
  success: z.literal(true),
  hostname: z.string().min(1),
});
const MAX_REQUEST_BYTES = 16 * 1024;

export async function POST(request: Request) {
  if (process.env.RECAPTCHA_ENABLED !== 'true') {
    return NextResponse.json({ ok: false, error: 'CAPTCHA verification is not enabled.' }, { status: 503 });
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!secretKey || !siteKey) {
    return NextResponse.json({ ok: false, error: 'CAPTCHA is not configured.' }, { status: 503 });
  }

  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return NextResponse.json({ ok: false, error: 'Expected application/json.' }, { status: 415 });
  }
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ ok: false, error: 'Request is too large.' }, { status: 413 });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }
  if (Buffer.byteLength(rawBody, 'utf8') > MAX_REQUEST_BYTES) {
    return NextResponse.json({ ok: false, error: 'Request is too large.' }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON request.' }, { status: 400 });
  }
  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'A valid CAPTCHA token is required.' }, { status: 400 });
  }

  try {
    const verifyResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: secretKey, response: parsed.data.token }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });

    if (!verifyResponse.ok) {
      return NextResponse.json({ ok: false, error: 'CAPTCHA provider could not verify the request.' }, { status: 502 });
    }

    const providerPayload: unknown = await verifyResponse.json();
    const providerResult = providerResponseSchema.safeParse(providerPayload);
    const requestHostname = new URL(request.url).hostname;
    if (!providerResult.success || providerResult.data.hostname.toLowerCase() !== requestHostname.toLowerCase()) {
      return NextResponse.json({ ok: false, error: 'CAPTCHA verification failed.' }, { status: 400 });
    }

    const session = createCaptchaSession();
    if (!session) {
      return NextResponse.json({ ok: false, error: 'CAPTCHA session signing is not configured.' }, { status: 503 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: captchaSessionCookieName,
      value: session,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: captchaSessionTtlSeconds,
    });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch {
    return NextResponse.json({ ok: false, error: 'Unable to verify CAPTCHA right now.' }, { status: 502 });
  }
}
