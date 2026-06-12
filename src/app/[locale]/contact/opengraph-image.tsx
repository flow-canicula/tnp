import { OG_SIZE, OG_CONTENT_TYPE, buildOgImage } from '@/lib/og-image';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }, { locale: 'ja' }];
}

const content = {
  en: {
    label: 'TNP · Start Your Project',
    headline: "Let's build something together.",
    sub: 'Free quote within 48 hours · Factory-direct from Vietnam',
  },
  vi: {
    label: 'TNP · Bat dau du an cua ban',
    headline: "Hay cung tao nen dieu gi do.",
    sub: 'Bao gia mien phi trong 48 gio · Truc tiep tu nha may',
  },
  ja: {
    label: 'TNP · Start Your Project',
    headline: "Let's build something together.",
    sub: 'Free quote within 48 hours · Factory-direct from Vietnam',
  },
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = content[locale as keyof typeof content] ?? content.en;
  return buildOgImage(locale, 'assets/images/company/company-3.jpg', c);
}
