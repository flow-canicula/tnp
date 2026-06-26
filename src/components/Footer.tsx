import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// ── SVG scene helpers ──────────────────────────────────────────────────────

const R = (n: number) => Math.round(n);

// Coconut palm — curved trunk + radiating drooping fronds
function makePalm(cx: number, baseY: number, h: number, lean: number): string {
  const tx = cx + lean;
  const ty = baseY - h;
  const tw = 4;
  // Control points create the natural S-bow of a palm trunk
  const c1x = cx + lean * 0.18;
  const c1y = baseY - h * 0.42;
  const c2x = cx + lean * 0.74;
  const c2y = baseY - h * 0.80;

  const trunk =
    `M${cx - tw},${baseY} C${R(c1x - tw)},${R(c1y)} ${R(c2x - tw)},${R(c2y)} ${tx - tw},${ty}` +
    ` L${tx + tw},${ty} C${R(c2x + tw)},${R(c2y)} ${R(c1x + tw)},${R(c1y)} ${cx + tw},${baseY}Z`;

  // 8 fronds: fan pointing outward + slightly downward (coconut droop)
  const fl = R(h * 0.40);
  const fb = 5;
  const angles = [-108, -74, -42, -10, 20, 52, 82, 116];

  const fronds = angles.map(deg => {
    const rad = (deg * Math.PI) / 180;
    const ex = R(tx + Math.cos(rad) * fl);
    const ey = R(ty + Math.sin(rad) * fl);
    const pr = rad + Math.PI / 2;
    return `M${R(tx + Math.cos(pr) * fb)},${R(ty + Math.sin(pr) * fb)} L${ex},${ey} L${R(tx - Math.cos(pr) * fb)},${R(ty - Math.sin(pr) * fb)}Z`;
  }).join(' ');

  return trunk + ' ' + fronds;
}

// Bamboo grove — thin stalks with nodes and simple leaf fans
function makeBambooGrove(stalks: { x: number; h: number }[], baseY: number): string {
  const sw = 3;
  return stalks.map(({ x, h }) => {
    const ty = baseY - h;
    let d = `M${x - sw},${baseY} L${x + sw},${baseY} L${x + sw},${ty} L${x - sw},${ty}Z`;
    for (let y = baseY - 42; y > ty + 12; y -= 34) {
      d += ` M${x - sw - 2},${y - 2} L${x + sw + 2},${y - 2} L${x + sw + 2},${y + 1} L${x - sw - 2},${y + 1}Z`;
    }
    d += ` M${x},${ty} L${x - 18},${ty - 16} L${x - 5},${ty}Z`;
    d += ` M${x},${ty} L${x + 16},${ty - 19} L${x + 6},${ty}Z`;
    d += ` M${x - 2},${ty - 5} L${x - 16},${ty - 23} L${x + 3},${ty - 6}Z`;
    return d;
  }).join(' ');
}

// Tropical broad-canopy tree (banyan / tropical hardwood silhouette)
function makeTropTree(cx: number, baseY: number, h: number): string {
  const trH = R(h * 0.30);
  const trW = R(h * 0.055);
  const cr  = R(h * 0.42);
  const ry  = R(cr * 0.78);
  const cy  = baseY - trH - ry;
  const k   = 0.552;

  const trunk =
    `M${cx - trW},${baseY} L${cx + trW},${baseY}` +
    ` L${R(cx + trW * 0.55)},${baseY - trH} L${R(cx - trW * 0.55)},${baseY - trH}Z`;

  const canopy =
    `M${cx},${cy - ry}` +
    ` C${R(cx + cr * k)},${cy - ry} ${cx + cr},${R(cy - ry * k)} ${cx + cr},${cy}` +
    ` C${cx + cr},${R(cy + ry * k)} ${R(cx + cr * k)},${cy + ry} ${cx},${cy + ry}` +
    ` C${R(cx - cr * k)},${cy + ry} ${cx - cr},${R(cy + ry * k)} ${cx - cr},${cy}` +
    ` C${cx - cr},${R(cy - ry * k)} ${R(cx - cr * k)},${cy - ry} ${cx},${cy - ry}Z`;

  return trunk + ' ' + canopy;
}

// ── Pre-computed scene elements ────────────────────────────────────────────

// Left bamboo grove — the heart of the scene's Vietnamese identity
const BAMBOO = makeBambooGrove(
  [
    { x: 6,   h: 192 }, { x: 20,  h: 258 }, { x: 36,  h: 218 }, { x: 52,  h: 272 },
    { x: 68,  h: 202 }, { x: 84,  h: 282 }, { x: 100, h: 228 }, { x: 118, h: 262 },
    { x: 135, h: 198 }, { x: 152, h: 275 }, { x: 170, h: 220 }, { x: 188, h: 248 },
    { x: 206, h: 192 }, { x: 224, h: 240 }, { x: 242, h: 188 },
  ],
  312,
);

// Scattered tropical trees (fill gaps; smaller behind palms)
const TROP_TREES = [
  makeTropTree(268, 312, 130),
  makeTropTree(445, 312, 145),
  makeTropTree(625, 312, 120),
  makeTropTree(838, 312, 140),
  makeTropTree(1055, 312, 132),
  makeTropTree(1255, 312, 148),
  makeTropTree(1436, 312, 112),
].join(' ');

// Coconut palms — scattered, each leaning in their own direction
const PALMS = [
  makePalm(318, 312, 208, 22),    // leans right
  makePalm(528, 312, 180, -16),   // leans left
  makePalm(938, 312, 195, -22),   // leans left
  makePalm(1152, 312, 222, 18),   // leans right
  makePalm(1362, 312, 172, -10),  // slight lean
].join(' ');

// Vietnamese craftsman wearing a nón lá (conical hat), carrying a timber plank
// Focal point at center x=720, baseline y=312
const NON_LA_FIGURE = [
  // Nón lá hat — the wide Vietnamese conical hat (immediately recognisable silhouette)
  `M720,232 L672,262 L768,262Z`,
  `M668,262 L772,262 L772,267 L668,267Z`,
  // Neck
  `M717,267 L723,267 L723,274 L717,274Z`,
  // Body
  `M713,274 L727,274 L729,312 L711,312Z`,
  // Left arm → grips plank
  `M713,282 L668,292 L664,299 L673,296 L713,289Z`,
  // Right arm → grips plank
  `M727,282 L772,292 L776,299 L767,296 L727,289Z`,
  // Timber plank (the woodwork reference)
  `M656,292 L784,292 L784,300 L656,300Z`,
].join(' ');

// Floating lanterns — đèn lồng, scattered in the dusk sky
const LANTERNS: { cx: number; cy: number; r: number }[] = [
  { cx: 168, cy: 148, r: 6  },
  { cx: 330, cy: 112, r: 8  },
  { cx: 558, cy: 96,  r: 5  },
  { cx: 878, cy: 118, r: 7  },
  { cx: 1108, cy: 104, r: 6 },
  { cx: 1328, cy: 136, r: 9 },
];

// ── Props ──────────────────────────────────────────────────────────────────

interface FooterProps {
  locale: string;
  messages: {
    common: {
      footer: {
        scene: { location: string; viLabel: string; materials: string; craft: string };
        brand: { tagline: string; social: string };
        quickLinks: {
          title: string; home: string; about: string; process: string;
          portfolio: string; pricing: string; contact: string; privacy: string;
        };
        contact: { title: string; address: string };
        markets: { title: string; text: string };
        copyright: string;
        certifications: string;
      };
      languageSwitcher: { label: string };
    };
  };
}

// ── Component ──────────────────────────────────────────────────────────────

export default function Footer({ locale, messages }: FooterProps) {
  const f    = messages.common.footer;
  const year = new Date().getFullYear();
  const copyright = f.copyright.replace('{year}', String(year));

  return (
    <footer style={{ background: '#070504' }}>

      {/* ── Vietnamese tropical landscape ──────────────────────────────── */}
      <div className="relative overflow-hidden h-60 sm:h-72 lg:h-[360px]">

        <svg
          viewBox="0 0 1440 400"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            {/* Saigon dusk sky — warm amber-orange tropical sunset */}
            <linearGradient id="sgSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#0C0808" />
              <stop offset="22%"  stopColor="#201208" />
              <stop offset="48%"  stopColor="#321A08" />
              <stop offset="72%"  stopColor="#1E1008" />
              <stop offset="100%" stopColor="#070504" />
            </linearGradient>
            {/* Humid horizon glow — more saturated than the Japanese version */}
            <radialGradient id="sgGlow" cx="50%" cy="68%" r="52%" fx="50%" fy="65%">
              <stop offset="0%"   stopColor="#D08030" stopOpacity="0.30" />
              <stop offset="50%"  stopColor="#D08030" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#D08030" stopOpacity="0"   />
            </radialGradient>
            {/* Lantern soft glow */}
            <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#C88A38" stopOpacity="0.80" />
              <stop offset="60%"  stopColor="#C88A38" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#C88A38" stopOpacity="0"   />
            </radialGradient>
          </defs>

          {/* Sky */}
          <rect width="1440" height="400" fill="url(#sgSky)" />
          {/* Horizon glow */}
          <rect width="1440" height="400" fill="url(#sgGlow)" />

          {/* Far tropical horizon — flat delta landscape, gentle rolling canopy */}
          <path
            fill="#1C1208"
            d="M0,248 C240,228 480,258 720,236 C960,214 1200,252 1440,238 L1440,400 L0,400Z"
          />
          {/* Mid-distance tree line */}
          <path
            fill="#150F07"
            d="M0,265 C200,250 420,272 640,258 C860,244 1060,270 1280,256 C1360,250 1405,262 1440,260 L1440,400 L0,400Z"
          />

          {/* Bamboo grove — left edge (most Vietnamese element) */}
          <path fill="#0D0B05" d={BAMBOO} />

          {/* Tropical broad-canopy trees (banyan, hardwood) */}
          <path fill="#0F0D07" d={TROP_TREES} />

          {/* Coconut palms — scattered across the scene */}
          <path fill="#0B0905" d={PALMS} />

          {/* Vietnamese craftsman with nón lá — scene focal point */}
          <path fill="#0D0B06" d={NON_LA_FIGURE} />

          {/* Ground */}
          <rect x="0" y="312" width="1440" height="88" fill="#070504" />

          {/* Floating lanterns — đèn lồng in the dusk sky, gently pulsing */}
          {LANTERNS.map(({ cx, cy, r }, i) => (
            <g key={`${cx}-${cy}`} className="animate-glow-pulse" style={{ animationDelay: `${i * 0.4}s` }}>
              {/* Soft glow halo */}
              <circle cx={cx} cy={cy} r={r * 3.5} fill="url(#lanternGlow)" />
              {/* Lantern body */}
              <ellipse cx={cx} cy={cy} rx={r} ry={r * 1.3} fill="rgba(200,140,55,0.72)" />
              {/* Lantern string */}
              <line x1={cx} y1={cy + r * 1.3} x2={cx} y2={cy + r * 2.8}
                stroke="rgba(180,120,40,0.45)" strokeWidth="0.8" />
            </g>
          ))}
        </svg>

        {/* Left gradient — darkens the text area for readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              'linear-gradient(to right, rgba(7,5,4,0.80) 0%, rgba(7,5,4,0.42) 38%, transparent 62%)',
              'linear-gradient(to top, rgba(7,5,4,0.75) 0%, transparent 42%)',
            ].join(', '),
          }}
        />

        {/* ── Identity overlay — left-aligned, Vietnamese-first ── */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 pb-6 sm:pb-8">

            {/* Location stamp */}
            <p className="text-timber-600 text-[9px] sm:text-[10px] font-bold tracking-[0.48em] uppercase mb-3 sm:mb-4">
              {f.scene.location}
            </p>

            {/* Vietnamese identity — always shown, the hero line */}
            <p
              className="font-serif text-white text-2xl sm:text-3xl lg:text-4xl leading-snug mb-4 sm:mb-5 max-w-xs sm:max-w-sm"
              lang="vi"
            >
              {f.scene.viLabel.replace(' · ', ' ·\n')}
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4 sm:mb-5" style={{ maxWidth: '14rem' }}>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(200,138,56,0.6), transparent)' }} />
              <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(200,138,56,0.8)' }} />
            </div>

            {/* Japanese material names */}
            <p
              className="text-timber-600 text-[10px] sm:text-xs tracking-[0.32em] mb-2 sm:mb-3"
              lang="ja"
            >
              {f.scene.materials}
            </p>

            {/* Locale-specific craft line */}
            <p className="font-serif italic text-stone-500 text-xs sm:text-sm max-w-[18rem]">
              {f.scene.craft}
            </p>

          </div>
        </div>
      </div>

      {/* ── Nav columns ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-10 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link href={`/${locale}`} className="inline-block mb-4">
              <Image
                src={`${base}/assets/logo/tnp_logo_primary.png`}
                alt="TNP logo"
                width={110}
                height={36}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-stone-600 text-sm leading-relaxed mb-4">{f.brand.tagline}</p>
            <div className="flex items-center gap-3">
              <a
                href={process.env.NEXT_PUBLIC_FACEBOOK_URL ?? 'https://www.facebook.com/Thinhnguyenphat.traocamgiacbinhyen'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TNP on Facebook"
                className="text-stone-700 hover:text-timber-400 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.024 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.278h3.328l-.532 3.49h-2.796v8.437C19.612 23.097 24 18.1 24 12.073z" />
                </svg>
              </a>
              <a
                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://www.instagram.com/thinhnguyenphattnp/'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TNP on Instagram"
                className="text-stone-700 hover:text-timber-400 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <h3 className="text-stone-400 font-semibold text-[11px] uppercase tracking-[0.16em] mb-4">
              {f.quickLinks.title}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: `/${locale}`,           label: f.quickLinks.home      },
                { href: `/${locale}#about`,      label: f.quickLinks.about     },
                { href: `/${locale}#process`,    label: f.quickLinks.process   },
                { href: `/${locale}/portfolio`,  label: f.quickLinks.portfolio },
                { href: `/${locale}/pricing`,    label: f.quickLinks.pricing   },
                { href: `/${locale}/contact`,    label: f.quickLinks.contact   },
                { href: `/${locale}/privacy`,    label: f.quickLinks.privacy   },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-stone-600 hover:text-timber-400 text-sm transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <address className="not-italic">
            <h3 className="text-stone-400 font-semibold text-[11px] uppercase tracking-[0.16em] mb-4">
              {f.contact.title}
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${base}/assets/images/motifs/envelope-seal.svg`} alt="" aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0 opacity-90" />
                <a href="mailto:thuyken52914@yahoo.com.vn" className="text-stone-600 hover:text-timber-400 text-sm transition-colors">
                  thuyken52914@yahoo.com.vn
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${base}/assets/images/motifs/envelope-seal.svg`} alt="" aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0 opacity-90" />
                <a href="mailto:thuy@tnpgr.vn" className="text-stone-600 hover:text-timber-400 text-sm transition-colors">
                  thuy@tnpgr.vn
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${base}/assets/images/motifs/hand-bell.svg`} alt="" aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0 opacity-90" />
                <a href="tel:+84903333729" className="text-stone-600 hover:text-timber-400 text-sm transition-colors">
                  +84 90 333 37 29
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${base}/assets/images/motifs/viet-pin.svg`} alt="" aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0 opacity-90" />
                <span className="text-stone-600 text-sm leading-relaxed">{f.contact.address}</span>
              </li>
            </ul>
          </address>

          {/* Markets */}
          <div>
            <h3 className="text-stone-400 font-semibold text-[11px] uppercase tracking-[0.16em] mb-4">
              {f.markets.title}
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">{f.markets.text}</p>
            {/* TODO: add certifications (FSC, ISO, JAS) when available */}
          </div>

        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.05] max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <p className="text-stone-700 text-xs">{copyright}</p>
          <Link
            href={`/${locale}/privacy`}
            className="text-stone-700 hover:text-timber-400 text-xs transition-colors duration-200"
          >
            {f.quickLinks.privacy}
          </Link>
        </div>
        <LanguageSwitcher label={messages.common.languageSwitcher.label} align="left" openUpward />
      </div>

    </footer>
  );
}
