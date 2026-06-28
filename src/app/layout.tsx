import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tnp.skaldris.com';

export const metadata: Metadata = {
  title: 'TNP — Premium Solid Wood Flooring & Custom Timber Furniture | Biên Hòa, Vietnam',
  description: 'Factory-direct solid wood flooring and custom timber furniture. Keyaki, Hinoki, oak, walnut — manufactured to the highest Japanese standards in our own facility in Biên Hòa, Vietnam. Serving Vietnam, Japan, and international buyers.',
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
    title: 'TNP — Premium Solid Wood Flooring & Custom Timber Furniture',
    description: 'Factory-direct solid wood flooring and custom timber furniture. Keyaki, Hinoki, oak, walnut — manufactured in our own facility in Biên Hòa, Vietnam.',
    url: siteUrl,
    siteName: 'TNP Wood',
    type: 'website',
    images: [{ url: `${siteUrl}/assets/og/og-default.png`, width: 1200, height: 630, alt: 'TNP — Solid Wood Flooring & Timber Furniture' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TNP — Premium Solid Wood Flooring & Custom Timber Furniture',
    description: 'Factory-direct solid wood flooring and custom timber furniture from Biên Hòa, Vietnam.',
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
