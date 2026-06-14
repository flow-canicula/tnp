import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteUrl';
import PricingPageClient from '@/components/PricingPageClient';
import SchemaJsonLd from '@/components/SchemaJsonLd';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const meta = messages.meta.pricing;
  const siteUrl = SITE_URL;
  const baseUrl = 'https://tnpgr.vn';
  const ogLocale = locale === 'vi' ? 'vi_VN' : locale === 'ja' ? 'ja_JP' : 'en_US';

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    authors: [{ name: 'TNP', url: baseUrl }],
    alternates: {
      canonical: `${baseUrl}/${locale}/pricing/`,
      languages: {
        en: `${baseUrl}/en/pricing/`,
        vi: `${baseUrl}/vi/pricing/`,
        ja: `${baseUrl}/ja/pricing/`,
        'x-default': `${baseUrl}/en/pricing/`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${baseUrl}/${locale}/pricing/`,
      siteName: 'TNP',
      locale: ogLocale,
      type: 'website',
      images: [{ url: `${siteUrl}/assets/og/og-default.png`, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [`${siteUrl}/assets/og/og-default.png`],
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const pricingSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'TNP Pricing',
    description: 'Pricing for solid wood flooring, custom timber furniture, and complete room projects.',
    itemListElement: [
      {
        '@type': 'Offer',
        position: 1,
        name: 'Solid Wood Flooring',
        description: 'Hinoki, oak, walnut, ash, or hardwood solid flooring. Priced per m².',
        seller: { '@type': 'Organization', name: 'TNP' },
      },
      {
        '@type': 'Offer',
        position: 2,
        name: 'Custom Timber Furniture',
        description: 'Bespoke furniture — dining tables, shelving, cabinetry. Quoted per project.',
        seller: { '@type': 'Organization', name: 'TNP' },
      },
      {
        '@type': 'Offer',
        position: 3,
        name: 'Complete Room Projects',
        description: 'Full space fit-out including flooring and furniture. Custom quote.',
        seller: { '@type': 'Organization', name: 'TNP' },
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'TNP', item: `https://tnpgr.vn/${locale}/` },
      { '@type': 'ListItem', position: 2, name: 'Pricing', item: `https://tnpgr.vn/${locale}/pricing/` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Keyaki and why is it special?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Keyaki (欅 / ケヤキ), or Japanese zelkova, is one of Japan\'s most prized hardwoods — known for its exceptional hardness, rich luster, and outstanding durability. It has been used for centuries in ancient temple pillars and high-end furniture and tableware. TNP sources Keyaki and manufactures it into premium flooring and bespoke furniture at our factory in Biên Hòa, Vietnam.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is Hinoki and why is it special?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hinoki (檜 / ヒノキ) is Japanese cypress — one of Japan\'s most treasured building timbers. Naturally aromatic, highly resistant to moisture, rot, and insects, with a beautiful fine grain. Used for centuries in Japanese temples, baths, and fine homes. TNP sources Hinoki and manufactures it into flooring and furniture at our Biên Hòa factory.',
        },
      },
      {
        '@type': 'Question',
        name: 'What timber species do you work with?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our signature materials are Keyaki (Japanese zelkova) and Hinoki (Japanese cypress). We also manufacture with oak, walnut, ash, teak, and select Vietnamese and Southeast Asian hardwoods. All timber is kiln-dried and precision-milled at our own facility in Biên Hòa, Vietnam.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does a project take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Solid wood flooring orders typically take 3–5 weeks from confirmation to delivery. Custom timber furniture takes 4–8 weeks depending on complexity. Full-space projects combining flooring and furniture take 8–12 weeks. We confirm your timeline before any work begins.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you ship internationally?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. TNP is export-ready. We ship to Japan and international markets worldwide. Export orders include containerization, freight coordination, and all necessary documentation. International shipping quoted by destination and volume.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is installation included?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For domestic clients in Vietnam — yes. Our crew handles flooring installation (subfloor prep, laying, finishing) and furniture assembly on-site. International clients receive detailed installation guides, technical specifications, and remote technical support.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I visit your factory in Biên Hòa?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely. Our facility is at Lô 35 đường số 9, Khu Công Nghiệp Tam Phước, Biên Hòa, Đồng Nai — about one hour from Ho Chi Minh City. Contact us to arrange a visit and see our production process firsthand.',
        },
      },
    ],
  };

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <>
      <SchemaJsonLd schema={[pricingSchema, faqSchema, breadcrumbSchema]} />
      <PricingPageClient
        locale={locale}
        messages={messages.pricing}
        cta={messages.common.cta}
      />
    </>
  );
}
