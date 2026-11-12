export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <section className="max-w-lg text-center" aria-labelledby="not-found-title">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-300">
          404
        </p>
        <h1 id="not-found-title" className="mt-3 text-3xl font-semibold">
          Video not found
        </h1>
        <p className="mt-3 text-slate-300">
          The requested video is unavailable or does not exist.
        </p>
      </section>
    </main>
  );
}
