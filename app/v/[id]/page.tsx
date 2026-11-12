import { notFound } from 'next/navigation';

import { VideoAccessGate } from '@/components/captcha/video-access-gate';
import { findVideoById, getVideoDisplayMetadataById } from '@/lib/video';

type VideoPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: VideoPageProps) {
  const { id } = await params;
  const video = findVideoById(id);

  if (!video) {
    return {
      title: 'Video not found',
      description: 'The requested video could not be found.',
    };
  }

  return {
    title: `${id}.mp4`,
    description: 'Personal video playback page with simulated metadata values.',
    alternates: {
      canonical: `/v/${id}`,
    },
    openGraph: {
      title: `${id}.mp4`,
      description: 'Personal video playback page with simulated metadata values.',
      url: `/v/${id}`,
      siteName: 'Glowing Garbanzo',
      type: 'video.other',
      images: ['/images/social-preview.svg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${id}.mp4`,
      description: 'Personal video playback page with simulated metadata values.',
      images: ['/images/social-preview.svg'],
    },
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { id } = await params;
  const video = findVideoById(id);

  if (!video) {
    notFound();
  }

  const displayMetadata = getVideoDisplayMetadataById(id);
  const captchaEnabled =
    process.env.RECAPTCHA_ENABLED === 'true' && Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);

  return (
    <VideoAccessGate
      videoId={video.id}
      videoEmbedUrl={video.embedUrl}
      displayMetadata={displayMetadata}
      captchaEnabled={captchaEnabled}
      recaptchaSiteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''}
    />
  );
}
