import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteUrl';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Hammer, Truck, Wrench, CheckCircle, Factory, TreePine, Handshake } from 'lucide-react';
import SchemaJsonLd from '@/components/SchemaJsonLd';
import CtaBanner from '@/components/CtaBanner';
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
      canonical: `${baseUrl}/${locale}/`,
      languages: {
        en: `${baseUrl}/en/`,
        vi: `${baseUrl}/vi/`,
        ja: `${baseUrl}/ja/`,
        'x-default': `${baseUrl}/en/`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${baseUrl}/${locale}/`,
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
    description: 'Premium solid wood flooring and custom timber furniture. Japanese material standards, Vietnamese craftsmanship. Factory-direct from Biên Hòa, Vietnam.',
    itemListElement: [
      {
        '@type': 'Service',
        position: 1,
        name: 'Solid Wood Flooring',
        serviceType: 'Flooring Manufacturing and Installation',
        description: 'Premium solid wood flooring in Keyaki (Japanese zelkova), Hinoki (Japanese cypress), oak, walnut, ash and select hardwoods. Kiln-dried, precision-milled, and finished in-house at our Biên Hòa factory. Professional installation for domestic clients; export-packaged for Japan and international markets.',
        provider: { '@type': 'Organization', name: 'TNP', url: 'https://tnpgr.vn' },
        areaServed: ['VN', 'JP'],
        keywords: 'solid wood flooring, Hinoki flooring, Keyaki flooring, hardwood floor Vietnam',
      },
      {
        '@type': 'Service',
        position: 2,
        name: 'Custom Timber Furniture',
        serviceType: 'Bespoke Furniture Manufacturing',
        description: 'One-of-a-kind furniture designed and manufactured to specification. Keyaki for its exceptional hardness and rich luster; Hinoki for its natural fragrance. Dining tables, shelving, cabinetry, desks, bedroom sets. Consultation, design, in-house manufacturing, delivery and installation all included.',
        provider: { '@type': 'Organization', name: 'TNP', url: 'https://tnpgr.vn' },
        areaServed: ['VN', 'JP'],
        keywords: 'custom timber furniture, Keyaki furniture, Hinoki furniture, bespoke hardwood furniture Vietnam',
      },
      {
        '@type': 'Service',
        position: 3,
        name: 'Delivery & Professional Installation',
        serviceType: 'Logistics and On-Site Installation',
        description: 'Scheduled and protected delivery across Vietnam and internationally to Japan and beyond. Professional on-site flooring and furniture installation for domestic clients. Export documentation, containerization, and installation guides for international orders.',
        provider: { '@type': 'Organization', name: 'TNP', url: 'https://tnpgr.vn' },
        areaServed: ['VN', 'JP'],
      },
    ],
  };

  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  const pillars = [
    { key: 'heritage' as const, icon: Handshake },
    { key: 'hinoki' as const, icon: TreePine },
    { key: 'factory' as const, icon: Factory },
    { key: 'endToEnd' as const, icon: CheckCircle },
  ];

  const processSteps = [
    { key: 'creation' as const, icon: Hammer, image: `${base}/assets/images/creation/creation.jpg` },
    { key: 'delivery' as const, icon: Truck, image: `${base}/assets/images/installation/installation-2.jpg` },
    { key: 'installation' as const, icon: Wrench, image: `${base}/assets/images/installation/installation-1.jpg` },
  ];

  return (
    <>
      <SchemaJsonLd schema={servicesSchema} />

      {/* Section: Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-forest-900">
        <div className="absolute inset-0">
          <Image
            src={`${base}/assets/images/portfolio/portfolio-1.jpg`}
            alt={h.hero.imageAlt}
            fill
            priority
            className="object-cover object-center opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950/80 via-forest-900/60 to-transparent" />
        </div>

        <div className="relative container-wide py-24">
          <div className="max-w-2xl">
            <p className="section-label text-timber-300 mb-6">TNP — Biên Hòa, Vietnam</p>
            <h1 className="font-serif text-display-xl text-white leading-tight mb-2">
              {h.hero.title}
            </h1>
            <p className="font-serif text-display-md text-timber-300 mb-8">
              {h.hero.titleAccent}
            </p>
            <p className="text-cream-200 text-lg leading-relaxed mb-10 max-w-xl">
              {h.hero.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href={`/${locale}/contact`} className="btn-primary text-base px-8 py-3.5">
                {cta.startProject}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a href="#process" className="btn-ghost text-cream-200 hover:text-white">
                {cta.seeHowItWorks}
              </a>
            </div>
          </div>
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
                {pillars.map(({ key, icon: Icon }) => (
                  <div key={key} className="flex gap-3 p-4 rounded-xl bg-white border border-cream-200">
                    <Icon className="w-5 h-5 text-timber-500 mt-0.5 shrink-0" aria-hidden="true" />
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

      {/* Section: Process */}
      <section id="process" className="section-padding bg-white">
        <div className="container-wide">
          <header className="text-center mb-16">
            <p className="section-label mb-4">TNP</p>
            <h2 className="section-title max-w-2xl mx-auto mb-6">{h.process.title}</h2>
            <p className="text-stone-500 max-w-xl mx-auto text-base">{h.process.leadIn}</p>
          </header>

          <ol className="flex flex-col gap-24">
            {processSteps.map(({ key, icon: Icon, image }, idx) => (
              <li key={key} className={`grid lg:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-serif text-6xl font-bold text-cream-200 leading-none">
                      {h.process.steps[key].number}
                    </span>
                    <div className="w-px h-10 bg-cream-200" />
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-timber-500" aria-hidden="true" />
                      <span className="section-label">{h.process.steps[key].label}</span>
                    </div>
                  </div>
                  <h3 className="font-serif text-display-md text-forest-900 mb-4">
                    {h.process.steps[key].title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed">{h.process.steps[key].text}</p>
                </div>
                <figure className="relative h-80 lg:h-[420px] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={image}
                    alt={h.process.steps[key].imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </figure>
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
              <div key={i} className="py-4">
                <p className="font-serif text-4xl lg:text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-timber-100 text-sm font-medium uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
          {/* TODO: add real testimonials/stats */}
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
