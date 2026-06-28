import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tnp.skaldris.com';

export const metadata: Metadata = {
  title: 'TNP Wood — International Solid Wood Manufacturer | Vietnam',
  description: 'International solid wood manufacturer in Vietnam. Japanese family-owned since 1997. Solid wood flooring, doors, and stairs — exporting to Japan, Korea, the USA, and worldwide from our 9,950 m² factory in Biên Hòa.',
  manifest: `${base}/assets/favicon/site.webmanifest`,
  icons: {
    icon: [
      { url: `${base}/favicon.ico`, sizes: '48x48 32x32 16x16', type: 'image/x-icon' },
      { url: `${base}/assets/favicon/favicon-192.png`, sizes: '192x192', type: 'image/png' },
      { url: `${base}/assets/favicon/favicon-512.png`, sizes: '512x512', type: 'image/png' },
    ],
    shortcut: `${base}/favicon.ico`,
    apple: { url: `${base}/assets/favicon/favicon-192.png`, sizes: '192x192', type: 'image/png' },
  },
  openGraph: {
    title: 'TNP Wood — International Solid Wood Manufacturer | Vietnam',
    description: 'International solid wood manufacturer in Vietnam since 1997. Solid wood flooring, doors, and stairs — Japanese family-owned, exporting to Japan, Korea, the USA, and worldwide.',
    url: siteUrl,
    siteName: 'TNP Wood',
    type: 'website',
    images: [{ url: `${siteUrl}/assets/og/og-default.png`, width: 1200, height: 630, alt: 'TNP Wood — International Solid Wood Manufacturer, Vietnam' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TNP Wood — International Solid Wood Manufacturer | Vietnam',
    description: 'International solid wood manufacturer in Vietnam. Japanese-owned since 1997. Exporting flooring, doors, and stairs to Japan, Korea, the USA, and worldwide.',
    images: [`${siteUrl}/assets/og/og-default.png`],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
