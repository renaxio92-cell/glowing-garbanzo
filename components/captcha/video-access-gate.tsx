'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { VideoActions } from '@/components/video/video-actions';
import type { VideoDisplayMetadata } from '@/schemas/video';

type VideoAccessGateProps = {
  videoId: string;
  videoEmbedUrl: string;
  displayMetadata: VideoDisplayMetadata | undefined;
  recaptchaSiteKey: string;
  recaptchaConfigured: boolean;
  captchaVerified: boolean;
};

type CaptchaWindow = Window & {
  grecaptcha?: {
    ready: (callback: () => void) => void;
    render: (
      element: Element,
      options: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback'?: () => void;
      },
    ) => number;
    reset: (widgetId?: number) => void;
  };
};

const metadataItems = [
  { key: 'duration', label: 'Duration' },
  { key: 'fileSize', label: 'File size' },
  { key: 'views', label: 'Views (simulated)' },
  { key: 'uploadDate', label: 'Upload date' },
] as const;

export function VideoAccessGate({
  videoId,
  videoEmbedUrl,
  displayMetadata,
  recaptchaSiteKey,
  recaptchaConfigured,
  captchaVerified,
}: VideoAccessGateProps) {
  const router = useRouter();
  const captchaRef = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!recaptchaConfigured || captchaVerified || !captchaRef.current || widgetId.current !== null) return;

    const scriptId = 'google-recaptcha-v2';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    const createdScript = !script;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
    }

    const renderCaptcha = () => {
      const captcha = (window as CaptchaWindow).grecaptcha;
      if (!captcha || !captchaRef.current || widgetId.current !== null) return;

      captcha.ready(() => {
        if (!captchaRef.current || widgetId.current !== null) return;
        widgetId.current = captcha.render(captchaRef.current, {
          sitekey: recaptchaSiteKey,
          callback: async (token) => {
            setLoading(true);
            setError('');
            try {
              const response = await fetch('/api/captcha/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ token }),
              });
              const result = (await response.json()) as { ok?: boolean; error?: string };
              if (!response.ok || result.ok !== true) {
                throw new Error(result.error ?? 'CAPTCHA verification failed.');
              }
              router.refresh();
            } catch (verificationError) {
              setError(
                verificationError instanceof Error
                  ? verificationError.message
                  : 'CAPTCHA verification could not be completed.',
              );
              const captchaApi = (window as CaptchaWindow).grecaptcha;
              captchaApi?.reset(widgetId.current ?? undefined);
            } finally {
              setLoading(false);
            }
          },
          'expired-callback': () => setError('CAPTCHA expired. Please complete it again.'),
        });
      });
    };

    const onLoad = () => renderCaptcha();
    const onError = () => setError('Unable to load Google reCAPTCHA. Check your connection and try again.');

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);
    if (createdScript) document.head.appendChild(script);
    if ((window as CaptchaWindow).grecaptcha) renderCaptcha();

    return () => {
      script?.removeEventListener('load', onLoad);
      script?.removeEventListener('error', onError);
    };
  }, [captchaVerified, recaptchaConfigured, recaptchaSiteKey, router]);

  const accessGranted = recaptchaConfigured && captchaVerified;

  return (
    <main className="min-h-screen bg-surface px-4 py-6 text-slate-100 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-6 flex min-h-12 items-center border-b border-white/10 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">Video player</p>
        </header>

        {accessGranted ? (
          <section aria-labelledby="video-title">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black shadow-glow">
              <iframe
                title={`Video ${videoId}`}
                src={videoEmbedUrl}
                allow="fullscreen"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="h-full w-full border-0"
              />
            </div>
            <div className="mt-5 border-b border-white/10 pb-5">
              <h1 id="video-title" className="break-all text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {videoId}.mp4
              </h1>
              <p className="mt-1 text-xs text-slate-400">Display name generated from the video ID.</p>
              <p className="mt-2 text-xs text-slate-500">Provider embed is provisional and must be verified before production.</p>
              <VideoActions videoId={videoId} videoEmbedUrl={videoEmbedUrl} />
            </div>
            <section className="mt-5" aria-labelledby="metadata-heading">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="metadata-heading" className="text-sm font-semibold text-slate-100">Video details</h2>
                <p className="text-xs text-slate-500">Display values are simulated sample data, not provider statistics.</p>
              </div>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {metadataItems.map(({ key, label }) => {
                  const value = displayMetadata?.[key];
                  return (
                    <div key={key} className="min-h-20 rounded-lg border border-white/10 bg-panel p-3 sm:p-4">
                      <dt className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-slate-400">{label}</dt>
                      <dd className="mt-2 break-words text-sm font-semibold text-slate-100 sm:text-base">
                        {value === undefined ? 'Unavailable' : String(value)}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          </section>
        ) : (
          <section className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-panel p-6 shadow-glow" aria-labelledby="access-title">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-200">Access check</p>
            <h1 id="access-title" className="mt-4 text-2xl font-semibold text-white">Verify before playback</h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {recaptchaConfigured
                ? 'Complete the CAPTCHA to unlock this video. The player remains locked until the server confirms verification.'
                : 'Playback is unavailable because CAPTCHA verification is not configured. Contact the site administrator.'}
            </p>
            {recaptchaConfigured ? (
              <div className="mt-6 min-h-[78px] rounded-lg border border-white/10 bg-slate-950/60 p-3">
                <div ref={captchaRef} />
              </div>
            ) : null}
            {error ? <p role="alert" className="mt-4 text-sm text-rose-300">{error}</p> : null}
            {loading ? <p role="status" className="mt-4 text-sm text-sky-200">Verifying...</p> : null}
          </section>
        )}

        <footer className="mt-10 border-t border-white/10 pt-4 text-xs text-slate-500">Personal video playback</footer>
      </div>
    </main>
  );
}
