import type { Metadata } from 'next';

import './globals.css';
import { getSiteUrl } from '@/lib/site-config';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: siteUrl } : {}),
  title: { default: 'Glowing Garbanzo', template: '%s | Glowing Garbanzo' },
  description: 'Personal video playback.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
