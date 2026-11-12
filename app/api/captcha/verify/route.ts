export async function POST(request: Request) {
  const recaptchaEnabled = process.env.RECAPTCHA_ENABLED === 'true';

  if (!recaptchaEnabled) {
    return Response.json({ ok: true });
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    return Response.json(
      { ok: false, error: 'reCAPTCHA secret key is not configured.' },
      { status: 500 },
    );
  }

  const body = (await request.json()) as { token?: string };
  const token = body.token;

  if (!token) {
    return Response.json(
      { ok: false, error: 'reCAPTCHA token is missing.' },
      { status: 400 },
    );
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const result = (await response.json()) as {
      success?: boolean;
      'error-codes'?: string[];
    };

    if (!response.ok || !result.success) {
      return Response.json(
        { ok: false, error: 'reCAPTCHA verification failed.' },
        { status: 400 },
      );
    }

    const nextResponse = Response.json({ ok: true });
    nextResponse.headers.set(
      'Set-Cookie',
      `captcha_verified=true; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=900`,
    );

    return nextResponse;
  } catch {
    return Response.json(
      { ok: false, error: 'Unable to verify reCAPTCHA challenge.' },
      { status: 500 },
    );
  }
}
