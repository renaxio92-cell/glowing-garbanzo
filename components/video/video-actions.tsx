'use client';

import { useEffect, useState } from 'react';

import { Download, Heart, Share2 } from 'lucide-react';

type VideoActionsProps = {
  videoId: string;
  videoEmbedUrl: string;
};

export function VideoActions({ videoId, videoEmbedUrl }: VideoActionsProps) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      setLiked(window.localStorage.getItem(`video-liked:${videoId}`) === 'true');
    } catch {
      setLiked(false);
    }
  }, [videoId]);

  const toggleLike = () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    try {
      window.localStorage.setItem(`video-liked:${videoId}`, String(nextLiked));
    } catch {
      // Keep the control usable when localStorage is unavailable.
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${videoId}.mp4`, url });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const downloadable = new URL(videoEmbedUrl).hostname !== 'vski.cc';

  return (
    <div className="mt-5 flex flex-wrap gap-3">
      <button type="button" onClick={toggleLike} aria-pressed={liked} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-panel px-4 py-2 text-sm hover:border-sky-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
        <Heart className={`h-4 w-4 ${liked ? 'fill-sky-300 text-sky-300' : ''}`} />{liked ? 'Liked' : 'Like'}
      </button>
      <button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-panel px-4 py-2 text-sm hover:border-sky-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
        <Share2 className="h-4 w-4" />{copied ? 'URL copied' : 'Share'}
      </button>
      {downloadable ? (
        <a href={videoEmbedUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-panel px-4 py-2 text-sm hover:border-sky-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
          <Download className="h-4 w-4" />Download
        </a>
      ) : null}
    </div>
  );
}
