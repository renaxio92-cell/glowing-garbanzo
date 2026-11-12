'use client';

import { useEffect, useRef, useState } from 'react';

import type { VideoDisplayMetadata } from '@/schemas/video';

type VideoAccessGateProps = {
  videoId: string;
  videoEmbedUrl: string;
  displayMetadata: VideoDisplayMetadata | undefined;
  captchaEnabled: boolean;
  recaptchaSiteKey: string;
};

type CaptchaWindow = Window & {
  grecaptcha?: {
    render: (
      element: Element | DocumentFragment,
      options: { sitekey: string; callback: (token: string) => void },
    ) => void;
    ready: (callback: () => void) => void;
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
  captchaEnabled,
  recaptchaSiteKey,
}: VideoAccessGateProps) {
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const captchaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!captchaEnabled || !recaptchaSiteKey || verified) {
      return;
    }

    const scriptId = 'recaptcha-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const initializeRecaptcha = () => {
      const win = window as CaptchaWindow;
      if (!win.grecaptcha || !captchaRef.current) {
        return;
      }

      win.grecaptcha.render(captchaRef.current, {
        sitekey: recaptchaSiteKey,
        callback: async (token: string) => {
          setLoading(true);
          setError('');

          try {
            const response = await fetch('/api/captcha/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token }),
            });

            const data = (await response.json()) as { ok?: boolean; error?: string };

            if (!response.ok || !data.ok) {
              throw new Error(data.error ?? 'Captcha validation failed.');
            }

            setVerified(true);
          } catch (requestError) {
            setError(
              requestError instanceof Error
                ? requestError.message
                : 'Captcha verification could not be completed.',
            );
          } finally {
            setLoading(false);
          }
        },
      });
    };

    const win = window as CaptchaWindow;
    if (win.grecaptcha) {
      initializeRecaptcha();
      return;
    }

    const waitForCaptcha = () => {
      const readyWindow = window as CaptchaWindow;
      if (readyWindow.grecaptcha) {
        initializeRecaptcha();
      }
    };

    win.grecaptcha?.ready?.(waitForCaptcha);
    script.addEventListener('load', waitForCaptcha);

    return () => {
      script?.removeEventListener('load', waitForCaptcha);
    };
  }, [captchaEnabled, recaptchaSiteKey, verified]);

  const content = verified || !captchaEnabled || !recaptchaSiteKey ? (
    <main className="min-h-screen bg-surface px-4 py-6 text-slate-100 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-6 flex min-h-12 items-center border-b border-white/10 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">
            Video player
          </p>
        </header>

        <section aria-labelledby="video-title">
          <div
            className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black shadow-glow"
            aria-label="Video player area"
          >
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

          <div className="mt-5 flex flex-col gap-2 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 id="video-title" className="break-all text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {videoId}.mp4
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                Display name generated from the video ID.
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Provider integration is provisional until its official embed behavior is verified.
            </p>
          </div>

          <section className="mt-5" aria-labelledby="metadata-heading">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="metadata-heading" className="text-sm font-semibold text-slate-100">
                Video details
              </h2>
              <p className="text-xs text-slate-500">
                Display values are simulated sample data, not provider statistics.
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {metadataItems.map(({ key, label }) => {
                const value = displayMetadata?.[key];

                return (
                  <div
                    key={key}
                    className="min-h-20 rounded-lg border border-white/10 bg-panel p-3 sm:p-4"
                  >
                    <dt className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-slate-400">
                      {label}
                    </dt>
                    <dd className="mt-2 break-words text-sm font-semibold text-slate-100 sm:text-base">
                      {value === undefined ? 'Unavailable' : String(value)}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        </section>

        <footer className="mt-10 border-t border-white/10 pt-4 text-xs text-slate-500">
          Personal video playback
        </footer>
      </div>
    </main>
  ) : (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-10 text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-panel p-6 shadow-glow">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-200">
          Access check
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-white">Verify before playback</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Complete the CAPTCHA to unlock the embedded player for this video.
        </p>

        <div className="mt-6 min-h-[78px] rounded-lg border border-white/10 bg-slate-950/60 p-3">
          <div ref={captchaRef} />
        </div>

        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        {loading ? <p className="mt-4 text-sm text-sky-200">Verifying...</p> : null}
      </section>
    </main>
  );

  return content;
}
