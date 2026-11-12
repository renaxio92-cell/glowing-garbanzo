import { siteConfig } from '@/lib/site-config';

export default function robots() {
  const siteUrl = siteConfig.siteUrl;
  const sitemap = siteUrl ? new URL('/sitemap.xml', siteUrl).toString() : undefined;
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    ...(sitemap ? { sitemap } : {}),
  };
}
