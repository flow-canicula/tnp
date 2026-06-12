import { OG_SIZE, OG_CONTENT_TYPE, buildOgImage } from '@/lib/og-image';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }, { locale: 'ja' }];
}

const content = {
  en: {
    label: 'TNP · Privacy Policy',
    headline: 'Your privacy matters to us.',
    sub: 'Factory-direct from Bien Hoa, Vietnam · tnpgr.vn',
  },
  vi: {
    label: 'TNP · Chinh sach bao mat',
    headline: 'Quyen rieng tu cua ban la uu tien cua chung toi.',
    sub: 'Truc tiep tu nha may Bien Hoa, Viet Nam',
  },
  ja: {
    label: 'TNP · Privacy Policy',
    headline: 'Your privacy matters to us.',
    sub: 'Factory-direct from Bien Hoa, Vietnam · tnpgr.vn',
  },
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = content[locale as keyof typeof content] ?? content.en;
  return buildOgImage(locale, 'assets/images/company/company-2.jpg', c);
}
