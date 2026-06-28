import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteUrl';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SchemaJsonLd from '@/components/SchemaJsonLd';
import CtaBanner from '@/components/CtaBanner';
import Reveal from '@/components/Reveal';
import StatCounter from '@/components/StatCounter';
import StatementBanner from '@/components/StatementBanner';
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
  const msgs = (await import(`@/messages/${locale}.json`)).default;
  const meta = msgs.meta.home;
  const ogLocale = locale === 'vi' ? 'vi_VN' : locale === 'ja' ? 'ja_JP' : 'en_US';

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    authors: [{ name: 'TNP', url: SITE_URL }],
    alternates: {
      canonical: `${SITE_URL}/${locale}/`,
      languages: {
        en: `${SITE_URL}/en/`,
        vi: `${SITE_URL}/vi/`,
        ja: `${SITE_URL}/ja/`,
        'x-default': `${SITE_URL}/en/`,
      },
    },
    openGraph: {
      title: meta.ogTitle ?? meta.title,
      description: meta.description,
      url: `${SITE_URL}/${locale}/`,
      siteName: 'TNP Wood',
      locale: ogLocale,
      type: 'website',
      images: [{ url: `${SITE_URL}/assets/og/og-default.png`, width: 1200, height: 630, alt: meta.ogTitle ?? meta.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.ogTitle ?? meta.title,
      description: meta.description,
      images: [`${SITE_URL}/assets/og/og-default.png`],
    },
    other: {
      'geo.region': 'VN-39',
      'geo.placename': 'Biên Hòa, Đồng Nai, Vietnam',
      'geo.position': '10.9334;106.8783',
      'ICBM': '10.9334, 106.8783',
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const msgs = (await import(`@/messages/${locale}.json`)).default;
  const h = msgs.home;
  const cta = msgs.common.cta;

  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'TNP Services — Solid Wood Flooring & Timber Furniture',
    description: 'International solid wood manufacturer in Vietnam since 1997. Premium solid wood flooring, doors, and stairs. Japanese family-owned. Exporting to Japan, Korea, the USA, and worldwide from Biên Hòa.',
    itemListElement: [
      {
        '@type': 'Service',
        position: 1,
        name: 'Solid Wood Flooring',
        serviceType: 'Flooring Manufacturing and Installation',
        description: 'Premium solid wood flooring in Keyaki (Japanese zelkova), Hinoki (Japanese cypress), oak, walnut, ash and select hardwoods. Kiln-dried, precision-milled, and finished in-house at our Biên Hòa factory. Professional installation for domestic clients; export-packaged for Japan and international markets.',
        provider: { '@type': 'Organization', name: 'TNP', legalName: 'Thịnh Nguyên Phát Wooden Co., Ltd.', url: SITE_URL },
        areaServed: ['VN', 'JP'],
        keywords: 'solid wood flooring, Hinoki flooring, Keyaki flooring, hardwood floor Vietnam',
      },
      {
        '@type': 'Service',
        position: 2,
        name: 'Custom Timber Furniture',
        serviceType: 'Bespoke Furniture Manufacturing',
        description: 'One-of-a-kind furniture designed and manufactured to specification. Keyaki for its exceptional hardness and rich luster; Hinoki for its natural fragrance. Dining tables, shelving, cabinetry, desks, bedroom sets. Consultation, design, in-house manufacturing, delivery and installation all included.',
        provider: { '@type': 'Organization', name: 'TNP', legalName: 'Thịnh Nguyên Phát Wooden Co., Ltd.', url: SITE_URL },
        areaServed: ['VN', 'JP'],
        keywords: 'custom timber furniture, Keyaki furniture, Hinoki furniture, bespoke hardwood furniture Vietnam',
      },
      {
        '@type': 'Service',
        position: 3,
        name: 'Delivery & Professional Installation',
        serviceType: 'Logistics and On-Site Installation',
        description: 'Scheduled and protected delivery across Vietnam and internationally to Japan and beyond. Professional on-site flooring and furniture installation for domestic clients. Export documentation, containerization, and installation guides for international orders.',
        provider: { '@type': 'Organization', name: 'TNP', legalName: 'Thịnh Nguyên Phát Wooden Co., Ltd.', url: SITE_URL },
        areaServed: ['VN', 'JP'],
      },
    ],
  };

  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  const pillars = [
    { key: 'heritage' as const, motif: `${base}/assets/images/motifs/heritage-bond.svg` },
    { key: 'hinoki' as const, motif: `${base}/assets/images/motifs/hardwood-rings.svg` },
    { key: 'factory' as const, motif: `${base}/assets/images/motifs/factory-roofline.svg` },
    { key: 'endToEnd' as const, motif: `${base}/assets/images/motifs/journey-link.svg` },
  ];

  const processSteps = [
    { key: 'creation' as const, image: `${base}/assets/images/creation/creation.jpg`, motif: `${base}/assets/images/motifs/blueprint-seal.svg` },
    { key: 'delivery' as const, image: `${base}/assets/images/installation/installation-2.jpg`, motif: `${base}/assets/images/motifs/documentation.svg` },
    { key: 'installation' as const, image: `${base}/assets/images/installation/installation-1.jpg`, motif: `${base}/assets/images/motifs/installation.svg` },
  ];

  const trustBadges = [
    { src: `${base}/assets/images/motifs/compass-seal.svg`, label: h.trust.badges.precision },
    { src: `${base}/assets/images/motifs/luban-ruler.svg`, label: h.trust.badges.standards },
    { src: `${base}/assets/images/motifs/watch-drum.svg`, label: h.trust.badges.craft },
  ];

  return (
    <>
      <SchemaJsonLd schema={servicesSchema} />

      {/* Section: Hero */}
      <section className="relative min-h-[85svh] sm:min-h-[92vh] flex items-end sm:items-center overflow-hidden bg-forest-950">
        {/* Background image — focal point shifted right so staircase + doors are centred on all screens */}
        <div className="absolute inset-0">
          <Image
            src={`${base}/assets/images/portfolio/stair-grand-curved-hall.jpg`}
            alt={h.hero.imageAlt}
            fill
            priority
            className="object-cover object-[65%_center] sm:object-[60%_center] lg:object-center opacity-55 animate-ken-burns"
            sizes="100vw"
          />

          {/* Mobile: heavy bottom-up scrim so text at bottom is always legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/95 via-forest-950/60 to-forest-950/20 sm:hidden" />

          {/* Desktop: diagonal scrim — dark on left where text sits, fades right */}
          <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-forest-950/90 via-forest-950/65 to-forest-950/10" />

          {/* Subtle warm vignette around all edges */}
          <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(15,14,12,0.55)]" />
        </div>

        {/* Timber accent bar — left edge on desktop, top edge on mobile */}
        <div className="absolute left-0 top-0 bottom-0 w-1 hidden sm:block bg-gradient-to-b from-transparent via-timber-400 to-transparent opacity-70" />
        <div className="absolute top-0 left-0 right-0 h-0.5 sm:hidden bg-gradient-to-r from-transparent via-timber-400 to-transparent opacity-60" />

        <div className="relative container-wide py-16 sm:py-24 pb-12 sm:pb-24">
          <div className="max-w-xl lg:max-w-2xl">
            {/* Eyebrow */}
            <div
              className="flex items-center gap-3 mb-5 animate-drift-up"
              style={{ animationDelay: '0.1s' }}
            >
              <span className="h-px w-8 bg-timber-400 opacity-80" />
              <p className="section-label text-timber-300">
                TNP — Biên Hòa, Vietnam
              </p>
            </div>

            {/* Headline */}
            <h1
              className="font-serif text-display-xl text-white leading-tight mb-3 animate-drift-up"
              style={{ animationDelay: '0.25s' }}
            >
              {h.hero.title}
            </h1>

            {/* Accent line */}
            <p
              className="font-serif text-display-md text-timber-300 mb-7 animate-drift-up"
              style={{ animationDelay: '0.4s' }}
            >
              {h.hero.titleAccent}
            </p>

            {/* Divider */}
            <div
              className="w-12 h-px bg-timber-500 mb-7 animate-drift-up"
              style={{ animationDelay: '0.48s' }}
            />

            {/* Subtitle */}
            <p
              className="text-cream-200/90 text-base sm:text-lg leading-relaxed mb-9 max-w-lg animate-drift-up"
              style={{ animationDelay: '0.55s' }}
            >
              {h.hero.subtitle}
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 animate-drift-up"
              style={{ animationDelay: '0.7s' }}
            >
              <Link
                href={`/${locale}/contact`}
                className="btn-primary text-sm sm:text-base px-7 py-3.5 transition-transform duration-300 hover:scale-105 w-full sm:w-auto justify-center"
              >
                {cta.startProject}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href="#process"
                className="btn-ghost text-cream-200/80 hover:text-white px-0 sm:px-4 text-sm sm:text-base"
              >
                {cta.seeHowItWorks}
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1.5 opacity-40 animate-float">
          <div className="w-px h-8 bg-cream-200" />
          <div className="w-1 h-1 rounded-full bg-cream-200" />
        </div>
      </section>

      {/* Section: About */}
      <section
        id="about"
        aria-label={h.about.ariaLabel}
        className="section-padding bg-cream-50"
      >
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label mb-4">TNP</p>
              <h2 className="section-title mb-6">{h.about.title}</h2>
              <p className="text-stone-600 leading-relaxed text-base lg:text-lg mb-10">
                {h.about.narrative}
              </p>
              <dl className="grid sm:grid-cols-2 gap-4">
                {pillars.map(({ key, motif }) => (
                  <div key={key} className="flex gap-3 p-4 rounded-xl bg-white border border-cream-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={motif} alt="" aria-hidden="true" className="w-9 h-9 shrink-0" />
                    <div>
                      <dt className="font-semibold text-forest-900 text-sm mb-0.5">
                        {h.about.pillars[key].title}
                      </dt>
                      <dd className="text-stone-500 text-xs leading-relaxed">
                        {h.about.pillars[key].text}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <figure className="relative">
              <div className="relative h-[520px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={`${base}/assets/images/materials/materials-1.jpg`}
                  alt={h.about.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-timber-500 text-white rounded-xl px-5 py-4 shadow-xl hidden sm:block">
                <p className="font-serif text-2xl font-bold">{h.trust.stat1.value}</p>
                <p className="text-xs text-timber-100 mt-0.5">{h.trust.stat1.label}</p>
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* Section: Bold Statement */}
      <StatementBanner
        eyebrow={h.statement.eyebrow}
        lines={[h.statement.line1, h.statement.line2]}
        sub={h.statement.sub}
      />

      {/* Section: Process */}
      <section id="process" className="section-padding bg-white">
        <div className="container-wide">
          <Reveal>
            <header className="text-center mb-16">
              <p className="section-label mb-4">TNP</p>
              <h2 className="section-title max-w-2xl mx-auto mb-6">{h.process.title}</h2>
              <p className="text-stone-500 max-w-xl mx-auto text-base">{h.process.leadIn}</p>
            </header>
          </Reveal>

          <ol className="flex flex-col gap-24">
            {processSteps.map(({ key, image, motif }, idx) => (
              <li key={key} className={`grid lg:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <Reveal direction={idx % 2 === 1 ? 'right' : 'left'}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-serif text-6xl font-bold text-cream-200 leading-none">
                      {h.process.steps[key].number}
                    </span>
                    <div className="w-px h-10 bg-cream-200" />
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={motif} alt="" aria-hidden="true" className="w-6 h-6" />
                      <span className="section-label">{h.process.steps[key].label}</span>
                    </div>
                  </div>
                  <h3 className="font-serif text-display-md text-forest-900 mb-4">
                    {h.process.steps[key].title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed">{h.process.steps[key].text}</p>
                </Reveal>
                <Reveal direction={idx % 2 === 1 ? 'left' : 'right'} delay={0.15}>
                  <figure className="relative h-80 lg:h-[420px] rounded-2xl overflow-hidden shadow-lg group">
                    <Image
                      src={image}
                      alt={h.process.steps[key].imageAlt}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-forest-950/70 backdrop-blur-sm p-2 shadow-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={motif} alt="" aria-hidden="true" className="w-full h-full" />
                    </div>
                  </figure>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Section: Trust / Stats */}
      <section className="section-padding bg-timber-500">
        <div className="container-wide">
          <div className="grid sm:grid-cols-3 gap-8 text-center text-white">
            {([h.trust.stat1, h.trust.stat2, h.trust.stat3]).map((stat, i) => (
              <StatCounter key={i} value={stat.value} label={stat.label} delay={i * 0.15} />
            ))}
          </div>
          {/* TODO: add real testimonials/stats */}

          <div className="mt-14 pt-10 border-t border-white/20 flex flex-wrap justify-center gap-x-10 gap-y-6">
            {trustBadges.map(({ src, label }, i) => (
              <Reveal key={label} delay={i * 0.1} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" aria-hidden="true" className="w-8 h-8 shrink-0" />
                <span className="text-white text-sm font-medium">{label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Company photos */}
      <section className="py-12 bg-cream-100">
        <div className="container-wide">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative h-48 rounded-xl overflow-hidden">
                <Image
                  src={`${base}/assets/images/company/company-${i}.jpg`}
                  alt="TNP factory and workshop — Biên Hòa, Vietnam"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Final CTA */}
      <CtaBanner locale={locale} messages={h.cta} />
    </>
  );
}
