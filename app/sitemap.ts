import { getSiteUrl } from '@/lib/site-config';
import { getVideoRecords } from '@/lib/video';

export default function sitemap() {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  return [
    { url: siteUrl.toString(), changeFrequency: 'weekly' as const, priority: 0.7 },
    ...getVideoRecords().map((video) => ({
      url: new URL(`/v/${encodeURIComponent(video.id)}`, siteUrl).toString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
