import type { VideoDisplayMetadata } from '@/schemas/video';

type VideoPageViewProps = {
  videoId: string;
  videoEmbedUrl: string;
  displayMetadata: VideoDisplayMetadata | undefined;
};

const metadataItems = [
  { key: 'duration', label: 'Duration' },
  { key: 'fileSize', label: 'File size' },
  { key: 'views', label: 'Views (simulated)' },
  { key: 'uploadDate', label: 'Upload date' },
] as const;

export function VideoPageView({
  videoId,
  videoEmbedUrl,
  displayMetadata,
}: VideoPageViewProps) {
  return (
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
  );
}
