import { OG_SIZE, OG_CONTENT_TYPE, buildOgImage } from '@/lib/og-image';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }, { locale: 'ja' }];
}

const content = {
  en: {
    label: 'TNP · Bien Hoa, Vietnam',
    headline: 'Solid wood flooring and timber furniture.',
    sub: 'Japanese quality · Vietnamese craftsmanship',
  },
  vi: {
    label: 'TNP · Bien Hoa, Viet Nam',
    headline: 'San go tu nhien va noi that go cao cap.',
    sub: 'Chat luong Nhat Ban · Tay nghe Viet Nam',
  },
  ja: {
    label: 'TNP · Bien Hoa, Vietnam',
    headline: 'Solid wood flooring and timber furniture.',
    sub: 'Japanese quality · Vietnamese craftsmanship',
  },
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = content[locale as keyof typeof content] ?? content.en;
  return buildOgImage(locale, 'assets/images/company/company-1.jpg', c);
}
