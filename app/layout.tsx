import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'Glowing Garbanzo',
    template: '%s | Glowing Garbanzo',
  },
  description: 'Personal video streaming experience built with Next.js.',
  openGraph: {
    title: 'Glowing Garbanzo',
    description: 'Personal video streaming experience built with Next.js.',
    siteName: 'Glowing Garbanzo',
    type: 'website',
    url: 'https://example.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glowing Garbanzo',
    description: 'Personal video streaming experience built with Next.js.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
