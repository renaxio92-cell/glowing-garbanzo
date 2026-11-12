export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jawvid.web.id',
  siteName: 'Jawara Video',
  defaultDescription: 'Tempat menikmati video dengan pengalaman menonton yang nyaman dan fokus.',
  adsEnabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true',
  trackingEnabled: process.env.NEXT_PUBLIC_TRACKING_ENABLED === 'true',
};

export function getSiteUrl(): URL | undefined {
  const value = siteConfig.siteUrl.trim();
  if (!value) return undefined;

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && process.env.NODE_ENV === 'production') return undefined;
    if (url.username || url.password || url.search || url.hash) return undefined;
    return url;
  } catch {
    return undefined;
  }
}
