import type { VideoDisplayMetadata } from '@/schemas/video';

type VideoPageViewProps = {
  videoId: string;
  videoEmbedUrl: string;
  displayMetadata: VideoDisplayMetadata | undefined;
};

export function VideoPageView({ videoId, videoEmbedUrl }: VideoPageViewProps) {
  return (
    <main className="min-h-screen bg-surface px-4 py-8 text-slate-100 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-400 text-slate-950">▶</span>
          <p className="text-lg font-bold">Jawara <span className="text-amber-300">Video</span></p>
        </header>
        <section aria-label="Pemutar video">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black p-2 shadow-2xl">
            <div className="aspect-video overflow-hidden rounded-2xl">
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
        </section>
        <footer className="mt-12 border-t border-white/10 py-6 text-sm text-slate-400">
          © {new Date().getFullYear()} Jawara Video · Pengalaman menonton yang nyaman dan fokus.
        </footer>
      </div>
    </main>
  );
}
