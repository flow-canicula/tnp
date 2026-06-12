import { OG_SIZE, OG_CONTENT_TYPE, buildOgImage } from '@/lib/og-image';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }, { locale: 'ja' }];
}

const content = {
  en: {
    label: 'TNP Pricing · Bien Hoa, Vietnam',
    headline: 'Transparent pricing for flooring and furniture.',
    sub: 'Sourcing · Manufacturing · Delivery · Installation',
  },
  vi: {
    label: 'TNP Bao gia · Bien Hoa, Viet Nam',
    headline: 'Bao gia ro rang cho san go va noi that.',
    sub: 'Tu nguon go den lap dat hoan chinh',
  },
  ja: {
    label: 'TNP Pricing · Bien Hoa, Vietnam',
    headline: 'Transparent pricing for flooring and furniture.',
    sub: 'Sourcing · Manufacturing · Delivery · Installation',
  },
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = content[locale as keyof typeof content] ?? content.en;
  return buildOgImage(locale, 'assets/images/installation/installation-4.jpg', c);
}
