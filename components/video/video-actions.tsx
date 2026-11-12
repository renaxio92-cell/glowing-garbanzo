'use client';

import { useEffect, useState } from 'react';
import { Heart, Share2 } from 'lucide-react';

type VideoActionsProps = {
  videoId: string;
  videoEmbedUrl: string;
};

export function VideoActions({ videoId }: VideoActionsProps) {
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
      // The control remains usable if browser storage is unavailable.
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Jawara Video', url });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const buttonClass = 'inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-amber-200/30 hover:bg-amber-200/[0.06] focus-visible:outline-none';

  return (
    <div className="flex flex-wrap gap-2.5">
      <button type="button" onClick={toggleLike} aria-pressed={liked} className={buttonClass}>
        <Heart className={`h-4 w-4 ${liked ? 'fill-rose-400 text-rose-400' : ''}`} />
        {liked ? 'Disukai' : 'Suka'}
      </button>
      <button type="button" onClick={share} className={buttonClass}>
        <Share2 className="h-4 w-4" />
        {copied ? 'Tautan tersalin' : 'Bagikan'}
      </button>
    </div>
  );
}
