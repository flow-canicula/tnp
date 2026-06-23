import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/siteUrl';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
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
  const msgs = (await import(`@/messages/${locale}.json`)).default;
  const meta = msgs.meta.contact;
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
      canonical: `${baseUrl}/${locale}/contact/`,
      languages: {
        en: `${baseUrl}/en/contact/`,
        vi: `${baseUrl}/vi/contact/`,
        ja: `${baseUrl}/ja/contact/`,
        'x-default': `${baseUrl}/en/contact/`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${baseUrl}/${locale}/contact/`,
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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const msgs = (await import(`@/messages/${locale}.json`)).default;
  const c = msgs.contact;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'TNP', item: `https://tnpgr.vn/${locale}/` },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: `https://tnpgr.vn/${locale}/contact/` },
    ],
  };

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact TNP',
    description: 'Request a free quote for solid wood flooring or custom timber furniture from TNP.',
    url: `https://tnpgr.vn/${locale}/contact/`,
    mainEntity: {
      '@type': 'LocalBusiness',
      name: 'TNP',
      telephone: '+84903333729',
      email: 'thuy@tnpgr.vn',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Lô 35 đường số 9, Khu Công Nghiệp Tam Phước',
        addressLocality: 'Biên Hòa',
        addressRegion: 'Đồng Nai',
        addressCountry: 'VN',
      },
    },
  };

  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  const nextSteps = [
    { num: '01', text: c.sidebar.nextSteps.step1 },
    { num: '02', text: c.sidebar.nextSteps.step2 },
    { num: '03', text: c.sidebar.nextSteps.step3 },
  ];

  const sparkles = [
    { left: '8%', top: '22%', size: 5, delay: '0s' },
    { left: '92%', top: '18%', size: 3, delay: '0.6s' },
    { left: '14%', top: '74%', size: 4, delay: '1.1s' },
    { left: '85%', top: '68%', size: 6, delay: '0.3s' },
    { left: '50%', top: '12%', size: 3, delay: '1.6s' },
    { left: '96%', top: '46%', size: 4, delay: '0.9s' },
  ];

  return (
    <>
      <SchemaJsonLd schema={[contactSchema, breadcrumbSchema]} />

      {/* Section: Page Hero */}
      <section className="relative min-h-[52vh] flex items-center overflow-hidden bg-forest-950">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={`${base}/assets/images/portfolio/portfolio-7.jpg`}
            alt=""
            fill
            priority
            aria-hidden="true"
            className="object-cover object-center opacity-35 animate-ken-burns"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-950/70 to-forest-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
        </div>

        {/* Dual radial amber glow */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(217,138,43,0.22),transparent_60%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_80%,rgba(217,138,43,0.14),transparent_55%)]" />

        {/* Vertical accent bar */}
        <span aria-hidden="true" className="absolute right-0 top-0 h-32 w-2.5 bg-timber-500" />

        {/* Scattered sparkle motes */}
        {sparkles.map(({ left, top, size, delay }, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="animate-sparkle-pulse pointer-events-none absolute rounded-full bg-timber-200"
            style={{
              left,
              top,
              width: size,
              height: size,
              animationDelay: delay,
              boxShadow: '0 0 8px 2px rgba(217,138,43,0.6)',
            }}
          />
        ))}

        {/* Side accent strip — finished installation glimpse */}
        <div className="absolute right-0 top-0 bottom-0 w-[38%] hidden lg:block">
          <Image
            src={`${base}/assets/images/installation/installation-3.jpg`}
            alt=""
            fill
            aria-hidden="true"
            className="object-cover object-left opacity-30 animate-ken-burns"
            sizes="38vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950 to-transparent" />
        </div>

        <div className="relative container-wide py-24">
          <div className="max-w-2xl">
            <p className="section-label text-timber-300 mb-5 animate-drift-up" style={{ animationDelay: '0.1s' }}>
              TNP — Biên Hòa, Vietnam
            </p>
            <h1
              className="font-serif text-display-xl text-white leading-tight mb-2 animate-drift-up"
              style={{ animationDelay: '0.25s' }}
            >
              {c.hero.title}
            </h1>
            <p
              className="font-serif text-display-md text-timber-300 mb-6 animate-drift-up"
              style={{ animationDelay: '0.4s' }}
            >
              {c.hero.titleAccent}
            </p>
            <p
              className="text-stone-400 text-lg leading-relaxed max-w-xl animate-drift-up"
              style={{ animationDelay: '0.55s' }}
            >
              {c.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Section: Form + Sidebar */}
      <section className="section-padding bg-cream-50">
        <div className="container-wide">
          <div className="grid lg:grid-cols-[1fr_380px] gap-14 items-start">

            {/* Quote Request Form */}
            <article className="bg-white rounded-2xl border border-cream-200 shadow-lg p-8 lg:p-10">
              <h2 className="font-serif text-2xl text-forest-900 mb-8">{c.form.title}</h2>
              <ContactForm locale={locale} messages={c.form} />
            </article>

            {/* Sidebar */}
            <aside className="flex flex-col gap-6 sticky top-24">

              {/* Photo card */}
              <figure className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-timber-200 shadow-lg">
                <Image
                  src={`${base}/assets/images/installation/installation-4.jpg`}
                  alt={c.sidebar.photoAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="380px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-forest-950/0 to-transparent" />
                <span aria-hidden="true" className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-cream-100/30" />
              </figure>

              {/* Direct contact */}
              <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-6">
                <h3 className="flex items-center gap-2.5 font-serif text-lg text-forest-900 mb-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${base}/assets/images/motifs/envelope-seal.svg`} alt="" aria-hidden="true" className="w-5 h-5" />
                  {c.sidebar.directContact.title}
                </h3>
                <address className="not-italic flex flex-col gap-4">
                  <a href="mailto:thuyken52914@yahoo.com.vn" className="flex items-start gap-3 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${base}/assets/images/motifs/envelope-seal.svg`} alt="" aria-hidden="true" className="w-4 h-4 mt-1 shrink-0 opacity-80" />
                    <span className="text-sm text-stone-600 group-hover:text-timber-500 transition-colors">
                      thuyken52914@yahoo.com.vn
                    </span>
                  </a>
                  <a href="mailto:anhkiet3333@yahoo.com" className="flex items-start gap-3 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${base}/assets/images/motifs/envelope-seal.svg`} alt="" aria-hidden="true" className="w-4 h-4 mt-1 shrink-0 opacity-80" />
                    <span className="text-sm text-stone-600 group-hover:text-timber-500 transition-colors">
                      anhkiet3333@yahoo.com
                    </span>
                  </a>
                  <a href="mailto:thuy@tnpgr.vn" className="flex items-start gap-3 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${base}/assets/images/motifs/envelope-seal.svg`} alt="" aria-hidden="true" className="w-4 h-4 mt-1 shrink-0 opacity-80" />
                    <span className="text-sm text-stone-600 group-hover:text-timber-500 transition-colors">
                      thuy@tnpgr.vn
                    </span>
                  </a>
                  <a href="tel:+84903333729" className="flex items-start gap-3 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${base}/assets/images/motifs/hand-bell.svg`} alt="" aria-hidden="true" className="w-4 h-4 mt-1 shrink-0 opacity-80" />
                    <span className="text-sm text-stone-600 group-hover:text-timber-500 transition-colors">
                      +84 90 333 37 29
                    </span>
                  </a>
                  <div className="flex items-start gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${base}/assets/images/motifs/viet-pin.svg`} alt="" aria-hidden="true" className="w-4 h-4 mt-1 shrink-0 opacity-80" />
                    <span className="text-sm text-stone-600 leading-relaxed">
                      Lô 35 đường số 9, Khu Công Nghiệp Tam Phước, Biên Hòa, Vietnam
                    </span>
                  </div>
                  <span aria-hidden="true" className="block h-px w-full bg-gradient-to-r from-timber-300/50 via-timber-200/20 to-transparent" />
                  <div className="flex items-start gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${base}/assets/images/motifs/watch-drum.svg`} alt="" aria-hidden="true" className="w-4 h-4 mt-1 shrink-0 opacity-80" />
                    <span className="text-sm text-stone-400 italic">
                      {c.sidebar.directContact.hours}
                    </span>
                  </div>
                </address>
              </div>

              {/* What happens next */}
              <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-6">
                <h3 className="font-serif text-lg text-forest-900 mb-5">
                  {c.sidebar.nextSteps.title}
                </h3>
                <ol className="flex flex-col gap-5">
                  {nextSteps.map(({ num, text }) => (
                    <li key={num} className="flex items-start gap-4">
                      <span className="font-serif text-2xl font-bold text-timber-300 leading-none mt-0.5 shrink-0 w-8">
                        {num}
                      </span>
                      <p className="text-stone-600 text-sm leading-relaxed">{text}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Trust reinforcement */}
              <div className="bg-timber-500 rounded-2xl p-6 text-white">
                <div className="flex items-start gap-3 mb-3">
                  <ArrowRight className="w-5 h-5 mt-0.5 shrink-0" aria-hidden="true" />
                  <h3 className="font-serif text-lg">{c.sidebar.trust.title}</h3>
                </div>
                <p className="text-timber-100 text-sm leading-relaxed">{c.sidebar.trust.text}</p>
              </div>

              {/* Privacy note */}
              <p className="flex items-start gap-2.5 text-sm text-stone-400">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${base}/assets/images/motifs/lotus-seal.svg`} alt="" aria-hidden="true" className="w-5 h-5 mt-0.5 shrink-0" />
                {c.sidebar.privacyNote}
              </p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
