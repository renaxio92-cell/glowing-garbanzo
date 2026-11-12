import { createHmac, timingSafeEqual } from 'node:crypto';

const SESSION_TTL_SECONDS = 15 * 60;
const COOKIE_NAME = 'captcha_verified';

type CaptchaSession = {
  expiresAt: number;
  signature: string;
};

function getSecret(): string | undefined {
  return process.env.RECAPTCHA_SECRET_KEY || undefined;
}

function sign(expiresAt: number, secret: string): string {
  return createHmac('sha256', secret).update(`${COOKIE_NAME}:${expiresAt}`).digest('hex');
}

export function createCaptchaSession(): string | undefined {
  const secret = getSecret();
  if (!secret) return undefined;

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  return `${expiresAt}.${sign(expiresAt, secret)}`;
}

export function verifyCaptchaSession(value: string | undefined): boolean {
  const secret = getSecret();
  if (!secret || !value) return false;

  const [expiresText, signature, extra] = value.split('.');
  if (!expiresText || !signature || extra !== undefined || !/^\d+$/.test(expiresText)) return false;

  const expiresAt = Number(expiresText);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now || expiresAt > now + SESSION_TTL_SECONDS) return false;

  const expected = sign(expiresAt, secret);
  const providedBuffer = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}

export const captchaSessionCookieName = COOKIE_NAME;
export const captchaSessionTtlSeconds = SESSION_TTL_SECONDS;
