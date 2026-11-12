import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({ token: z.string().min(1).max(8192) }).strict();

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

  let payload: unknown;
  try {
    payload = await request.json();
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

    const providerResult: unknown = await verifyResponse.json();
    const result = z.object({ success: z.literal(true) }).passthrough().safeParse(providerResult);
    if (!result.success) {
      return NextResponse.json({ ok: false, error: 'CAPTCHA verification failed.' }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: 'captcha_verified',
      value: 'true',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch {
    return NextResponse.json({ ok: false, error: 'Unable to verify CAPTCHA right now.' }, { status: 502 });
  }
}
