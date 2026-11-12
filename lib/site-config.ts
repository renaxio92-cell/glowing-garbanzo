export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com',
  siteName: 'Glowing Garbanzo',
  defaultDescription: 'Personal video playback page with simulated metadata values.',
  adsEnabled: process.env.NEXT_PUBLIC_ADS_ENABLED === 'true',
  trackingEnabled: process.env.NEXT_PUBLIC_TRACKING_ENABLED === 'true',
};
