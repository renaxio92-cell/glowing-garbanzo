import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Playback',
};

export default function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const videoId = params.then((p) => p.id);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 border-b border-slate-800 pb-4">
          <p className="text-xs uppercase tracking-[0.28em] text-sky-300">Glowing Garbanzo</p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-glow">
          <div className="aspect-video w-full overflow-hidden rounded-t-2xl bg-slate-950">
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Video Route</p>
                <p className="mt-4 text-2xl font-semibold text-white">Loading video details...</p>
                <p className="mt-2 text-sm text-slate-300">Video ID: {videoId}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-5 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-white">{videoId}.mp4</h1>
                <p className="mt-2 text-sm text-slate-300">Placeholder video page for route scaffolding.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {[
                ['Duration', '---'],
                ['File Size', '---'],
                ['Views', '---'],
                ['Upload Date', '---'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
                  <p className="mt-2 text-lg font-medium text-slate-100">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
