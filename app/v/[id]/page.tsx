import { notFound } from 'next/navigation';

import { findVideoById } from '@/lib/video';

type VideoPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VideoPage({ params }: VideoPageProps) {
  const { id } = await params;
  const video = findVideoById(id);

  if (!video) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 border-b border-slate-800 pb-4">
          <p className="text-xs uppercase tracking-[0.28em] text-sky-300">
            Video Player
          </p>
        </header>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 md:p-6">
          <h1 className="text-2xl font-semibold text-white">{id}.mp4</h1>
          <p className="mt-2 text-sm text-slate-300">
            Video record found. Player integration is pending its implementation stage.
          </p>
        </section>
      </div>
    </main>
  );
}
