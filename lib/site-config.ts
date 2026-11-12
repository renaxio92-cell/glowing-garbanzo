export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? '',
  siteName: 'Glowing Garbanzo',
  defaultDescription: 'Personal video playback page with simulated metadata values.',
  adsEnabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true',
  trackingEnabled: process.env.NEXT_PUBLIC_TRACKING_ENABLED === 'true',
};

export function getSiteUrl(): URL | undefined {
  const value = siteConfig.siteUrl.trim();
  if (!value) return undefined;

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && process.env.NODE_ENV === 'production') return undefined;
    return url;
  } catch {
    return undefined;
  }
}
