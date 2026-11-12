import { useEffect, useState } from 'react';

import { Heart, Share2, Download } from 'lucide-react';

type VideoActionsProps = {
  videoId: string;
  videoEmbedUrl: string;
};

export function VideoActions({ videoId, videoEmbedUrl }: VideoActionsProps) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const key = `video-liked:${videoId}`;
    try {
      const stored = window.localStorage.getItem(key);
      setLiked(stored === 'true');
    } catch {
      setLiked(false);
    }
  }, [videoId]);

  const toggleLike = () => {
    const nextValue = !liked;
    const key = `video-liked:${videoId}`;
    setLiked(nextValue);

    try {
      window.localStorage.setItem(key, String(nextValue));
    } catch {
      // Ignore localStorage failures and keep interaction accessible.
    }
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${videoId}.mp4`,
          url: currentUrl,
        });
        return;
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }
    } catch {
      setCopied(false);
    }
  };

  const canDownload = !videoEmbedUrl.includes('vski.cc');

  return (
    <div className="mt-5 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={toggleLike}
        aria-pressed={liked}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-panel px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-sky-300/60 hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        <Heart className={`h-4 w-4 ${liked ? 'fill-sky-300 text-sky-300' : ''}`} />
        {liked ? 'Liked' : 'Like'}
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-panel px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-sky-300/60 hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        <Share2 className="h-4 w-4" />
        {copied ? 'URL copied' : 'Share'}
      </button>

      {canDownload ? (
        <a
          href={videoEmbedUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-panel px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-sky-300/60 hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <Download className="h-4 w-4" />
          Download
        </a>
      ) : null}
    </div>
  );
}
