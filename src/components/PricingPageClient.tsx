'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, StretchHorizontal, Armchair, Building2 } from 'lucide-react';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const tierIcons = [StretchHorizontal, Armchair, Building2] as const;
const tierKeys = ['flooring', 'furniture', 'complete'] as const;
const tierImages = [
  `${base}/assets/images/materials/materials-2.jpg`,
  `${base}/assets/images/creation/creation.jpg`,
  `${base}/assets/images/portfolio/portfolio-2.jpg`,
];

const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'] as const;

const includedImages = [
  `${base}/assets/images/materials/materials-1.jpg`,
  `${base}/assets/images/creation/building-2.jpg`,
  `${base}/assets/images/creation/creation.jpg`,
  `${base}/assets/images/creation/building-4.jpg`,
  `${base}/assets/images/installation/installation-6.jpg`,
  `${base}/assets/images/installation/installation-3.jpg`,
  `${base}/assets/images/installation/installation-5.jpg`,
];

type TierKey = (typeof tierKeys)[number];
type FaqKey = (typeof faqKeys)[number];

interface TierMessages {
  name: string;
  tagline: string;
  description: string;
  examples: string;
  priceNote: string;
  cta: string;
  badge?: string;
}

interface FaqEntry {
  question: string;
  answer: string;
}

interface PricingMessages {
  hero: { title: string; titleAccent: string; subtitle: string };
  tiers: {
    title: string;
    flooring: TierMessages;
    furniture: TierMessages;
    complete: TierMessages;
  };
  included: { title: string; items: string[] };
  faq: {
    title: string;
    subtitle: string;
    q1: FaqEntry; q2: FaqEntry; q3: FaqEntry; q4: FaqEntry;
    q5: FaqEntry; q6: FaqEntry; q7: FaqEntry;
  };
}

interface CtaMessages {
  requestQuote: string;
}

interface PricingPageClientProps {
  locale: string;
  messages: PricingMessages;
  cta: CtaMessages;
}

export default function PricingPageClient({ locale, messages: p, cta }: PricingPageClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedTier, setSelectedTier] = useState<TierKey | null>(null);

  return (
    <>
      {/* Section: Page Hero */}
      <section className="relative py-24 bg-forest-900 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src={`${base}/assets/images/materials/materials-3.jpg`}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            aria-hidden="true"
          />
        </div>
        <div className="relative container-wide text-center">
          <p className="section-label text-timber-300 mb-4">TNP</p>
          <h1 className="font-serif text-display-xl text-white leading-tight mb-2">
            {p.hero.title}
          </h1>
          <p className="font-serif text-display-md text-timber-300 mb-6">
            {p.hero.titleAccent}
          </p>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto">
            {p.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Section: Pricing Tiers */}
      <section className="section-padding bg-cream-50">
        <div className="container-wide">
          <header className="text-center mb-14">
            <h2 className="section-title">{p.tiers.title}</h2>
          </header>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {tierKeys.map((key: TierKey, idx) => {
              const Icon = tierIcons[idx];
              const tier = p.tiers[key];
              const isSelected = selectedTier === key;
              const isHighlighted = isSelected || (selectedTier === null && idx === 0);

              return (
                <article
                  key={key}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedTier(isSelected ? null : key)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedTier(isSelected ? null : key); } }}
                  className={`relative rounded-2xl overflow-hidden flex flex-col bg-white cursor-pointer transition-all duration-200 ${
                    isHighlighted
                      ? 'ring-2 ring-timber-500 shadow-2xl scale-[1.01]'
                      : 'border border-cream-200 shadow-lg hover:shadow-xl hover:border-timber-200'
                  }`}
                >
                  {tier.badge && !isSelected && (
                    <div className="absolute top-4 right-4 bg-timber-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                      {tier.badge}
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-timber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 flex items-center gap-1.5">
                      <Check className="w-3 h-3" aria-hidden="true" />
                      Selected
                    </div>
                  )}

                  <div className="relative h-48 bg-cream-100">
                    <Image
                      src={tierImages[idx]}
                      alt={tier.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-timber-600' : 'text-timber-500'}`} aria-hidden="true" />
                      <h3 className="font-serif text-xl font-semibold text-forest-900">
                        {tier.name}
                      </h3>
                    </div>
                    <p className="text-timber-500 text-sm font-medium mb-4">{tier.tagline}</p>
                    <p className="text-stone-600 text-sm leading-relaxed mb-4 flex-1">{tier.description}</p>
                    <p className="text-xs text-stone-400 italic mb-6">{tier.examples}</p>

                    <div className="border-t border-cream-100 pt-5">
                      <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">{tier.priceNote}</p>
                      {/* TODO: set price per m² / per project */}
                      <p className="font-serif text-2xl font-bold text-forest-900 mb-5">—</p>
                      <Link
                        href={`/${locale}/contact?type=${key}`}
                        onClick={(e) => e.stopPropagation()}
                        className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm transition-colors duration-200 ${
                          isHighlighted
                            ? 'bg-timber-500 hover:bg-timber-600 text-white'
                            : 'bg-cream-100 hover:bg-cream-200 text-forest-800'
                        }`}
                      >
                        {tier.cta}
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section: Always Included */}
      <section className="py-20 relative overflow-hidden bg-forest-950">
        {/* Subtle background texture */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <Image
            src={`${base}/assets/images/creation/building-1.jpg`}
            alt=""
            fill
            aria-hidden="true"
            className="object-cover opacity-[0.08]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-forest-950/60" />
        </div>

        <div className="relative container-wide">
          <div className="text-center mb-12">
            <p className="section-label text-timber-300 mb-3">TNP</p>
            <h2 className="font-serif text-3xl lg:text-4xl text-white">{p.included.title}</h2>
          </div>

          <ul className="flex flex-wrap justify-center gap-4">
            {p.included.items.map((item: string, i: number) => (
              <li key={i} className="group relative rounded-2xl overflow-hidden h-40 sm:h-44 cursor-default w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]">
                {/* Background image */}
                <Image
                  src={includedImages[i % includedImages.length]}
                  alt=""
                  fill
                  aria-hidden="true"
                  className="object-cover brightness-[0.45] group-hover:brightness-[0.7] group-hover:scale-105 transition-all duration-500 ease-out"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {/* Persistent gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/20 to-transparent" />
                {/* Hover amber border */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-timber-400/70 transition-all duration-300" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-timber-500/80 group-hover:bg-timber-500 flex items-center justify-center transition-colors duration-300">
                    <Check className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-white text-sm font-medium leading-snug">{item}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Section: FAQ */}
      <section className="section-padding bg-white">
        <div className="container-wide max-w-3xl">
          <header className="text-center mb-12">
            <p className="section-label mb-3">FAQ</p>
            <h2 className="section-title mb-3">{p.faq.title}</h2>
            <p className="text-stone-500">{p.faq.subtitle}</p>
          </header>

          <dl className="flex flex-col gap-2">
            {faqKeys.map((key: FaqKey, idx) => {
              const entry = p.faq[key];
              return (
                <div key={key} className="border border-cream-200 rounded-xl overflow-hidden bg-cream-50">
                  <dt>
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      aria-expanded={openFaq === idx}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer hover:bg-cream-100 transition-colors duration-200"
                    >
                      <span className="font-medium text-forest-900 text-base">
                        {entry.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-timber-500 shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                  </dt>
                  {openFaq === idx && (
                    <dd className="px-6 pb-5 text-stone-600 text-sm leading-relaxed border-t border-cream-200 pt-4">
                      {entry.answer}
                    </dd>
                  )}
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      {/* Section: CTA */}
      <section className="section-padding bg-cream-100">
        <div className="container-wide text-center">
          <h2 className="section-title mb-4">Ready to start?</h2>
          <p className="text-stone-500 max-w-lg mx-auto mb-8">
            Tell us about your space and we&apos;ll get back within 48 hours with a free quote.
          </p>
          <Link
            href={selectedTier ? `/${locale}/contact?type=${selectedTier}` : `/${locale}/contact`}
            className="btn-primary text-base px-8 py-4"
          >
            {cta.requestQuote}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
