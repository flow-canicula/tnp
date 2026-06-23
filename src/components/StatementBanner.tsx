'use client';

import { useEffect, useRef, useState } from 'react';

interface StatementBannerProps {
  /** Small uppercase label above the statement. */
  eyebrow: string;
  /** Each entry renders as its own bold line, revealed with a staggered wipe. */
  lines: string[];
  /** Optional supporting line below the statement. */
  sub?: string;
}

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function StatementBanner({ eyebrow, lines, sub }: StatementBannerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-forest-950 py-28 lg:py-40">
      {/* Ambient heritage seal — slow rotation, low opacity */}
      <img
        src={`${base}/assets/images/motifs/heritage-seal.svg`}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-24 -bottom-24 w-[420px] h-[420px] opacity-[0.07] animate-motif-spin"
      />

      <div className="relative container-wide">
        <p
          className={`section-label text-timber-300 mb-6 transition-all duration-700 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {eyebrow}
        </p>

        <div className="max-w-4xl">
          {lines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <h2
                className="font-serif text-display-xl text-white leading-[1.05] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
                style={{
                  transform: visible ? 'translateY(0%)' : 'translateY(110%)',
                  transitionDelay: `${i * 0.12}s`,
                }}
              >
                {line}
              </h2>
            </div>
          ))}
        </div>

        {sub && (
          <p
            className={`text-stone-400 text-lg mt-8 max-w-xl transition-all duration-700 ease-out ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${lines.length * 0.12 + 0.15}s` }}
          >
            {sub}
          </p>
        )}
      </div>
    </section>
  );
}
