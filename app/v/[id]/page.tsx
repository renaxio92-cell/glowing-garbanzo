import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { VideoAccessGate } from '@/components/captcha/video-access-gate';
import { captchaSessionCookieName, verifyCaptchaSession } from '@/lib/captcha-session';
import { getSiteUrl, siteConfig } from '@/lib/site-config';
import { findVideoById, getVideoDisplayMetadataById } from '@/lib/video';

export const runtime = 'nodejs';

type VideoPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { id } = await params;
  const video = findVideoById(id);
  const title = video ? `${id}.mp4` : 'Video not found';
  const description = video
    ? 'Personal video playback page. Display metadata is sample data.'
    : 'The requested video could not be found.';
  const siteUrl = getSiteUrl();

  if (!video) return { title, description };

  const canonicalUrl = siteUrl
    ? new URL(`/v/${encodeURIComponent(id)}`, siteUrl).toString()
    : undefined;

  return {
    title,
    description,
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    openGraph: {
      title,
      description,
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      siteName: siteConfig.siteName,
      type: 'video.other',
      images: ['/images/social-preview.svg'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/social-preview.svg'],
    },
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { id } = await params;
  const video = findVideoById(id);
  if (!video) notFound();

  const cookieStore = await cookies();
  const recaptchaConfigured =
    process.env.RECAPTCHA_ENABLED === 'true' &&
    Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) &&
    Boolean(process.env.RECAPTCHA_SECRET_KEY);
  const captchaVerified = verifyCaptchaSession(
    cookieStore.get(captchaSessionCookieName)?.value,
  );

  return (
    <VideoAccessGate
      videoId={video.id}
      videoEmbedUrl={video.embedUrl}
      displayMetadata={getVideoDisplayMetadataById(id)}
      recaptchaSiteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''}
      recaptchaConfigured={recaptchaConfigured}
      captchaVerified={captchaVerified}
    />
  );
}
