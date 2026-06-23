'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import Reveal from './Reveal';
import StatementBanner from './StatementBanner';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const tierKeys = ['flooring', 'furniture', 'complete'] as const;
// One literal icon per product line — flooring planks, joined furniture,
// the full room build — replacing generic ruler/chair/building glyphs.
const tierHeaderMotifs = [
  `${base}/assets/images/motifs/flooring-plank.svg`,
  `${base}/assets/images/motifs/furniture-joinery.svg`,
  `${base}/assets/images/motifs/complete-build.svg`,
];
const tierImages = [
  `${base}/assets/images/materials/materials-2.jpg`,
  `${base}/assets/images/creation/creation.jpg`,
  `${base}/assets/images/portfolio/portfolio-2.jpg`,
];
// Motifs already drawn for these exact tiers — first conversation (tea),
// the full design package (Đông Sơn drum sun), the complete build (stilt house).
const tierMotifs = [
  `${base}/assets/images/motifs/pricing-consult.svg`,
  `${base}/assets/images/motifs/pricing-design.svg`,
  `${base}/assets/images/motifs/pricing-fullservice.svg`,
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
// One motif per included stage — sourcing, kiln/mill, in-house build, QC,
// protected delivery, on-site install, export crating. Same order as items.
const includedMotifs = [
  `${base}/assets/images/motifs/timber-stack.svg`,
  `${base}/assets/images/motifs/kiln-mill.svg`,
  `${base}/assets/images/motifs/factory-roofline.svg`,
  `${base}/assets/images/motifs/inspect-mark.svg`,
  `${base}/assets/images/motifs/pallet-wrap.svg`,
  `${base}/assets/images/motifs/installation.svg`,
  `${base}/assets/images/motifs/export-crate.svg`,
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
  statement: { eyebrow: string; line1: string; line2: string; sub: string };
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
  finalCta: { title: string; subtitle: string; imageAlt: string };
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
            className="object-cover animate-ken-burns"
            sizes="100vw"
            aria-hidden="true"
          />
        </div>
        <div className="relative container-wide text-center">
          <p className="section-label text-timber-300 mb-4 animate-drift-up" style={{ animationDelay: '0.1s' }}>
            TNP
          </p>
          <h1
            className="font-serif text-display-xl text-white leading-tight mb-2 animate-drift-up"
            style={{ animationDelay: '0.25s' }}
          >
            {p.hero.title}
          </h1>
          <p
            className="font-serif text-display-md text-timber-300 mb-6 animate-drift-up"
            style={{ animationDelay: '0.4s' }}
          >
            {p.hero.titleAccent}
          </p>
          <p
            className="text-stone-400 text-lg max-w-2xl mx-auto animate-drift-up"
            style={{ animationDelay: '0.55s' }}
          >
            {p.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Section: Bold Statement */}
      <StatementBanner
        eyebrow={p.statement.eyebrow}
        lines={[p.statement.line1, p.statement.line2]}
        sub={p.statement.sub}
      />

      {/* Section: Pricing Tiers */}
      <section className="section-padding bg-cream-50">
        <div className="container-wide">
          <Reveal>
            <header className="flex items-end gap-5 justify-center text-center mb-14">
              <span className="font-serif text-7xl lg:text-8xl font-bold text-cream-200 leading-none select-none">01</span>
              <h2 className="section-title">{p.tiers.title}</h2>
            </header>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {tierKeys.map((key: TierKey, idx) => {
              const tier = p.tiers[key];
              const isSelected = selectedTier === key;
              const isHighlighted = isSelected || (selectedTier === null && idx === 0);

              return (
                <Reveal key={key} delay={idx * 0.12}>
                  <article
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedTier(isSelected ? null : key)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedTier(isSelected ? null : key); } }}
                    className={`group relative rounded-2xl overflow-hidden flex flex-col bg-white cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 ${
                      isSelected
                        ? 'ring-2 ring-timber-500 scale-[1.03] animate-ring-glow-pulse'
                        : isHighlighted
                          ? 'ring-2 ring-timber-500 shadow-2xl scale-[1.01]'
                          : 'border border-cream-200 shadow-lg hover:shadow-2xl hover:border-timber-200'
                    }`}
                  >
                    {tier.badge && !isSelected && (
                      <div className="absolute top-4 right-4 bg-timber-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                        {tier.badge}
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-timber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 flex items-center gap-1.5 animate-pop-in">
                        <Check className="w-3 h-3" aria-hidden="true" />
                        Selected
                      </div>
                    )}

                    <div className="relative h-48 bg-cream-100 overflow-hidden">
                      <Image
                        src={tierImages[idx]}
                        alt={tier.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div
                        className={`absolute top-3 left-3 w-10 h-10 rounded-full bg-forest-950/70 backdrop-blur-sm p-1.5 shadow-lg transition-transform duration-300 group-hover:rotate-12 ${
                          isSelected ? 'animate-pop-in' : ''
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={tierMotifs[idx]} alt="" aria-hidden="true" className="w-full h-full" />
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2.5 mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={tierHeaderMotifs[idx]} alt="" aria-hidden="true" className="w-6 h-6 shrink-0" />
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
                        <p
                          className={`font-serif text-2xl font-bold mb-5 ${
                            isSelected ? 'gold-shimmer-text animate-gold-shimmer' : 'text-forest-900'
                          }`}
                        >
                          —
                        </p>
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
                </Reveal>
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
          <Reveal>
            <div className="flex items-end gap-5 justify-center text-center mb-12">
              <span className="font-serif text-7xl lg:text-8xl font-bold text-white/10 leading-none select-none">02</span>
              <div>
                <p className="section-label text-timber-300 mb-3">TNP</p>
                <h2 className="font-serif text-3xl lg:text-4xl text-white">{p.included.title}</h2>
              </div>
            </div>
          </Reveal>

          <ul className="flex flex-wrap justify-center gap-4">
            {p.included.items.map((item: string, i: number) => (
              <li key={i} className="group w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]">
                <Reveal delay={(i % 4) * 0.1} className="relative rounded-2xl overflow-hidden h-44 sm:h-48 cursor-default transition-transform duration-300 hover:-translate-y-1.5">
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

                  {/* Motif badge */}
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm p-1.5 shadow-lg transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={includedMotifs[i]} alt="" aria-hidden="true" className="w-full h-full" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-white text-sm font-medium leading-snug">{item}</span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Section: FAQ */}
      <section className="section-padding bg-white">
        <div className="container-wide max-w-3xl">
          <header className="flex items-end gap-5 justify-center text-center mb-12">
            <span className="font-serif text-7xl lg:text-8xl font-bold text-cream-200 leading-none select-none">03</span>
            <div>
              <p className="section-label mb-3">FAQ</p>
              <h2 className="section-title mb-3">{p.faq.title}</h2>
              <p className="text-stone-500">{p.faq.subtitle}</p>
            </div>
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

      {/* Section: CTA — dark, glowing, with background photography */}
      <section className="relative flex min-h-[48vh] items-center justify-center overflow-hidden bg-forest-950 px-6 py-20">
        {/* Background image */}
        <Image
          src={`${base}/assets/images/portfolio/portfolio-3.jpg`}
          alt={p.finalCta.imageAlt}
          fill
          aria-hidden="true"
          className="object-cover scale-110 animate-ken-burns brightness-[0.55] saturate-[0.9]"
          sizes="100vw"
        />
        {/* Gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/85 to-forest-950/55" />
        {/* Radial amber glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(217,138,43,0.22),transparent_60%)]" />

        {/* Floating glow motes */}
        <div aria-hidden="true" className="animate-float absolute left-[18%] top-[30%] h-3 w-3 rounded-full bg-timber-400/70 blur-[2px]" style={{ animationDuration: '5s' }} />
        <div aria-hidden="true" className="animate-float absolute right-[22%] top-[40%] h-2 w-2 rounded-full bg-timber-300/60 blur-[2px]" style={{ animationDuration: '7s', animationDelay: '1s' }} />
        <div aria-hidden="true" className="animate-float absolute right-[32%] top-[20%] h-1.5 w-1.5 rounded-full bg-cream-100/70 blur-[1px]" style={{ animationDuration: '6s', animationDelay: '0.4s' }} />

        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
          <Reveal delay={0}>
            <span aria-hidden="true" className="block h-8 w-[3px] bg-timber-400 mx-auto mb-5" />
          </Reveal>
          <Reveal delay={0.05}>
            <p className="section-label text-timber-300 mb-4">TNP</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-display-lg text-white mb-4">{p.finalCta.title}</h2>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="text-stone-300 max-w-lg mx-auto mb-8">{p.finalCta.subtitle}</p>
          </Reveal>
          <Reveal delay={0.26}>
            <Link
              href={selectedTier ? `/${locale}/contact?type=${selectedTier}` : `/${locale}/contact`}
              className="btn-primary text-base px-8 py-4 transition-transform duration-300 hover:scale-105"
            >
              {cta.requestQuote}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
