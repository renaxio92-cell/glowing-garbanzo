'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, BadgeCheck, Clapperboard, Film, LockKeyhole, Play, Sparkles } from 'lucide-react';

import { VideoActions } from '@/components/video/video-actions';

type VideoAccessGateProps = {
  videoId: string;
  videoEmbedUrl: string;
  displayMetadata: import('@/schemas/video').VideoDisplayMetadata | undefined;
  recaptchaSiteKey: string;
  recaptchaConfigured: boolean;
  captchaVerified: boolean;
};

type CaptchaWindow = Window & {
  grecaptcha?: {
    ready: (callback: () => void) => void;
    render: (
      element: Element,
      options: { sitekey: string; callback: (token: string) => void; 'expired-callback'?: () => void },
    ) => number;
    reset: (widgetId?: number) => void;
  };
};

const experiencePoints = [
  { icon: Film, title: 'Fokus pada video', description: 'Tampilan bersih yang menjaga perhatian tetap pada konten.' },
  { icon: LockKeyhole, title: 'Akses terlindungi', description: 'Verifikasi akses diterapkan sebelum pemutar dibuka.' },
  { icon: Sparkles, title: 'Nyaman di berbagai layar', description: 'Tata letak responsif untuk desktop maupun perangkat seluler.' },
];

export function VideoAccessGate({
  videoId,
  videoEmbedUrl,
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
                throw new Error(result.error ?? 'Verifikasi tidak berhasil. Silakan coba lagi.');
              }
              router.refresh();
            } catch (verificationError) {
              setError(verificationError instanceof Error ? verificationError.message : 'Verifikasi belum dapat diselesaikan.');
              (window as CaptchaWindow).grecaptcha?.reset(widgetId.current ?? undefined);
            } finally {
              setLoading(false);
            }
          },
          'expired-callback': () => setError('Verifikasi kedaluwarsa. Silakan ulangi.'),
        });
      });
    };

    const onLoad = () => renderCaptcha();
    const onError = () => setError('reCAPTCHA tidak dapat dimuat. Periksa koneksi lalu coba lagi.');
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
    <main className="relative min-h-screen overflow-hidden text-slate-100">
      <div aria-hidden="true" className="player-grid pointer-events-none absolute inset-x-0 top-0 h-[34rem]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-72 h-80 w-80 rounded-full bg-emerald-500/[0.07] blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-96 h-80 w-80 rounded-full bg-amber-400/[0.06] blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 sm:px-7 lg:px-10">
        <header className="flex items-center justify-between border-b border-white/[0.08] py-5">
          <a href="/" className="group inline-flex items-center gap-3" aria-label="Jawara Video, beranda">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-amber-200/20 bg-gradient-to-br from-amber-300 to-amber-600 text-slate-950 shadow-[0_8px_30px_rgba(217,167,72,0.2)] transition-transform group-hover:-rotate-3">
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </span>
            <span>
              <span className="block text-base font-bold tracking-tight text-white sm:text-lg">Jawara <span className="text-amber-300">Video</span></span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500 sm:block">Cerita untuk dinikmati</span>
            </span>
          </a>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-2 text-xs font-medium text-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
            Pemutar video
          </div>
        </header>

        <div className="flex-1 py-8 sm:py-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.23em] text-amber-300">
                <Clapperboard className="h-4 w-4" /> Ruang menonton
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Nikmati setiap momen.</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Pemutar video Jawara Video dirancang sederhana, nyaman, dan fokus pada pengalaman menonton.</p>
            </div>
            {accessGranted ? <VideoActions videoId={videoId} videoEmbedUrl={videoEmbedUrl} /> : null}
          </div>

          {accessGranted ? (
            <section aria-label="Pemutar video">
              <div className="group relative overflow-hidden rounded-[1.65rem] border border-white/[0.1] bg-[#05080e] p-1.5 shadow-[0_28px_90px_rgba(0,0,0,0.48)] sm:p-2">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[1.65rem] bg-gradient-to-br from-amber-300/[0.13] via-transparent to-emerald-300/[0.08]" />
                <div className="relative aspect-video overflow-hidden rounded-[1.2rem] bg-black">
                  <iframe
                    title={`Pemutar video Jawara Video ${videoId}`}
                    src={videoEmbedUrl}
                    allow="fullscreen"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="h-full w-full border-0"
                  />
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-300/[0.1] text-amber-200"><BadgeCheck className="h-5 w-5" /></span>
                  <div>
                    <h2 className="font-semibold text-white">Siap untuk menonton</h2>
                    <p className="mt-0.5 text-xs text-slate-400">Bagikan halaman ini agar teman ikut menikmati.</p>
                  </div>
                </div>
                <a href="#tentang" className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-200 transition-colors hover:text-amber-100">
                  Tentang Jawara Video <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </section>
          ) : (
            <section className="relative mx-auto max-w-xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#101824]/90 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-9" aria-labelledby="access-title">
              <div aria-hidden="true" className="absolute -right-10 -top-14 h-40 w-40 rounded-full border border-amber-200/10" />
              <div className="relative">
                <span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-amber-200/15 bg-amber-300/[0.08] text-amber-200"><LockKeyhole className="h-5 w-5" /></span>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">Pemeriksaan akses</p>
                <h2 id="access-title" className="mt-3 text-2xl font-semibold tracking-tight text-white">Verifikasi sebelum menonton</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                  {recaptchaConfigured
                    ? 'Selesaikan verifikasi di bawah ini untuk membuka pemutar video.'
                    : 'Pemutaran belum tersedia karena verifikasi belum dikonfigurasi. Silakan hubungi pengelola situs.'}
                </p>
                {recaptchaConfigured ? <div className="mt-7 min-h-[78px] rounded-xl border border-white/10 bg-[#090e17] p-3"><div ref={captchaRef} /></div> : null}
                {error ? <p role="alert" className="mt-4 text-sm text-rose-300">{error}</p> : null}
                {loading ? <p role="status" className="mt-4 text-sm text-amber-200">Memverifikasi…</p> : null}
              </div>
            </section>
          )}

          <section id="tentang" className="mt-16 scroll-mt-8" aria-labelledby="experience-title">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Dibuat untuk pengalaman menonton</p>
                <h2 id="experience-title" className="mt-2 text-2xl font-semibold tracking-tight text-white">Sederhana. Nyaman. Fokus.</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-400">Semua elemen dirancang untuk membantu Anda langsung menikmati video tanpa tampilan yang berlebihan.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {experiencePoints.map(({ icon: Icon, title, description }, index) => (
                <article key={title} className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.055] to-white/[0.015] p-5 transition-colors hover:border-amber-200/20">
                  <span className="absolute right-4 top-3 text-4xl font-semibold tracking-tighter text-white/[0.035]">0{index + 1}</span>
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-200/10 bg-emerald-300/[0.07] text-emerald-200"><Icon className="h-5 w-5" /></span>
                  <h3 className="mt-5 font-semibold text-slate-100">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <footer className="mt-auto border-t border-white/[0.08] py-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <a href="/" className="inline-flex items-center gap-2.5 font-semibold text-slate-200"><span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-300 text-slate-950"><Play className="ml-0.5 h-4 w-4 fill-current" /></span>Jawara <span className="-ml-2 text-amber-300">Video</span></a>
            <p className="text-xs leading-5 text-slate-500">Tempat menikmati video dengan pengalaman yang nyaman dan fokus.</p>
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} Jawara Video</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
