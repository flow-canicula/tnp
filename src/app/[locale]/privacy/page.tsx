import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { routing } from '@/i18n/routing';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const p = messages.privacy;
  const baseUrl = 'https://tnpgr.vn';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? baseUrl;
  return {
    title: p.meta.title,
    description: p.meta.description,
    robots: { index: false, follow: true },
    openGraph: {
      title: p.meta.title,
      description: p.meta.description,
      url: `${baseUrl}/${locale}/privacy/`,
      siteName: 'TNP',
      images: [{ url: `${siteUrl}/${locale}/privacy/opengraph-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: p.meta.title,
      description: p.meta.description,
      images: [`${siteUrl}/${locale}/privacy/opengraph-image.png`],
    },
  };
}

const sectionKeys = ['collect', 'use', 'storage', 'cookies', 'rights', 'contact'] as const;

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const p = messages.privacy;

  return (
    <div className="bg-cream-50 min-h-screen">
      {/* Hero */}
      <section className="bg-forest-900 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-7 h-7 text-timber-300" aria-hidden="true" />
            <span className="text-timber-300 text-sm font-semibold uppercase tracking-wider">TNP</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-white mb-4">{p.title}</h1>
          <p className="text-stone-400 text-sm">{p.lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <p className="text-stone-600 leading-relaxed mb-12 text-base border-l-4 border-timber-400 pl-5">
          {p.intro}
        </p>

        <div className="flex flex-col gap-10">
          {sectionKeys.map((key, idx) => {
            const section = p.sections[key];
            return (
              <article key={key}>
                <h2 className="font-serif text-2xl text-forest-900 mb-3 flex items-baseline gap-3">
                  <span className="text-timber-400 text-sm font-mono font-bold tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {section.title}
                </h2>
                <p className="text-stone-600 leading-relaxed text-base">{section.body}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-14 pt-8 border-t border-cream-200">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-timber-500 hover:text-timber-600 font-medium text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {p.backToHome}
          </Link>
        </div>
      </section>
    </div>
  );
}
