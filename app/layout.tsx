import type { Metadata } from 'next';

import './globals.css';
import { getSiteUrl, siteConfig } from '@/lib/site-config';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: siteUrl } : {}),
  title: { default: siteConfig.siteName, template: `%s | ${siteConfig.siteName}` },
  description: siteConfig.defaultDescription,
  applicationName: siteConfig.siteName,
  openGraph: {
    type: 'website',
    siteName: siteConfig.siteName,
    title: siteConfig.siteName,
    description: siteConfig.defaultDescription,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-surface font-sans text-slate-100 antialiased">{children}</body>
    </html>
  );
}
