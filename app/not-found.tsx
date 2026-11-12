import { siteConfig } from '@/lib/site-config';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6 text-slate-100">
      <section className="max-w-lg rounded-3xl border border-white/10 bg-white/[0.03] p-9 text-center shadow-2xl" aria-labelledby="not-found-title">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">Halaman tidak ditemukan</p>
        <h1 id="not-found-title" className="mt-4 text-3xl font-semibold">Video tidak tersedia</h1>
        <p className="mt-3 leading-6 text-slate-400">Tautan yang Anda buka mungkin sudah tidak aktif atau alamatnya tidak tepat.</p>
        <a href="/" className="mt-6 inline-flex rounded-xl bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200">Kembali ke {siteConfig.siteName}</a>
      </section>
    </main>
  );
}
