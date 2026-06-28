# TNP Website

Marketing site for **TNP Wood** (Thịnh Nguyên Phát Wooden Co., Ltd. / Công ty TNHH Thịnh Nguyên Phát) —
an international solid wood manufacturer, Japanese family-owned, established in Vietnam in 1997.
Factory: 9,950 m² facility, Tam Phước Industrial Zone, Biên Hòa. Products: solid wood flooring,
interior & exterior doors, folding & sliding doors, stairs. Exporting to Japan,
Korea (laminated freeboard, 20+ years), and the USA (knotty alder doors).

Tagline: **"Supplying solid wood flooring and timber furniture."**

Static export built with Next.js 15 (App Router), TypeScript, Tailwind CSS,
and `next-intl` for English / Vietnamese / Japanese localisation.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), `output: 'export'` |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS with custom `cream`, `timber`, `forest`, `stone` scales |
| i18n | `next-intl` — locales: `en` (default), `vi`, `ja` |
| Icons | Lucide React |
| Form backend | Formspree (static-compatible) |
| Testing | Vitest + React Testing Library + jsdom |
| Fonts | Space Mono (serif display) · Plus Jakarta Sans (body) |

## Getting started

```bash
node --version   # 20+
npm install
npm run dev      # http://localhost:3000 — routes live at /en/, /vi/, /ja/
```

## Build

```bash
npm run build    # builds and exports static site to out/
npx serve out    # preview the static export locally
```

`npm run build` runs `scripts/generate-og.mjs` first (via the `prebuild` npm
lifecycle hook), which generates the shared 1200×630 Open Graph image used
across all three locales.

## Testing

```bash
npm test               # run the unit test suite once (Vitest)
npm run test:watch     # watch mode, reruns on file changes
npm run test:coverage  # run once and print the coverage table
```

Unit tests live under `test/` — a sibling of `src/`, mirroring it 1:1 —
covering `src/lib`, `src/i18n`, every component, and every page/layout/
not-found file under `src/app`, using Vitest + React Testing Library +
jsdom.

- `next/image`, `next/link`, and `next/navigation` are mocked in `test/mocks/next.ts` (loaded from `test/setup.ts`)
- `test/renderServerPage.tsx` awaits + renders async Server Components directly, so both Server and Client Components can be asserted on without a running Next server
- 24 test files · 136 tests

Coverage thresholds (statements/branches/functions/lines, all 80%) are
enforced in `vitest.config.ts` — `vitest run --coverage` exits non-zero if
any metric falls below that bar. CI (`.github/workflows/deploy.yml`) runs
`npm run test:coverage` as its own step before `npm run build`, so a
failing test or a coverage regression blocks the deploy.

## Pages

| Route | Description |
|---|---|
| `/` | Redirects to the visitor's locale (`/en/`, `/vi/`, or `/ja/`) |
| `/[locale]/` | Home — hero, about, process (Creation → Delivery → Installation), trust stats |
| `/[locale]/pricing/` | Service tiers (flooring / furniture / complete projects), FAQ |
| `/[locale]/contact/` | Quote request form with sidebar |
| `/[locale]/portfolio/` | Project gallery with category filter and Vietnam service-area map |
| `/[locale]/privacy/` | Privacy policy (`noindex, follow`) |
| Custom 404 | `src/app/not-found.tsx` |

## Project structure

```
/
├── public/
│   ├── assets/
│   │   ├── images/          # All real client photos (flooring, doors, stairs, portfolio, etc.)
│   │   ├── images/motifs/   # SVG decorative motifs (heritage-seal, compass-seal, viet-pin, etc.)
│   │   ├── logo/            # TNP logo SVG + PNG
│   │   ├── og/              # OpenGraph images (1200×630)
│   │   └── favicon/         # favicon.ico, site.webmanifest (add favicon-192.png for Google)
│   ├── favicon.ico          # Root-level copy — Google checks /favicon.ico before <link> tags
│   ├── llms.txt             # AI agent context file (llmstxt.org standard)
│   ├── robots.txt           # Allows all major search + AI crawlers; references sitemap + llms.txt
│   └── sitemap.xml          # 9 URLs: 3 pages × 3 locales, with hreflang alternates
├── src/
│   ├── app/[locale]/        # Dynamic locale segment (en | vi | ja)
│   ├── components/          # Shared + page-specific client components
│   ├── i18n/                # next-intl routing + request config
│   └── messages/            # en.json, vi.json, ja.json — all UI strings
├── test/                    # Mirrors src/ 1:1
└── scripts/                 # generate-og.mjs prebuild script
```

## Internationalisation

All user-visible strings live in `src/messages/{en,vi,ja}.json`. The three
files share identical key structures — a missing key breaks the build. Keys
are namespaced by page and section (`home.hero.title`, `pricing.faq.q1`,
`contact.form.name`, etc.). English is the source language; Vietnamese and
Japanese are adapted — not machine-translated — by locale.

The locale switcher in the header and footer lets visitors toggle between
`/en/`, `/vi/`, and `/ja/` paths. Canonical and `hreflang` tags are generated
per-page via `generateMetadata`.

## Deployment

**Vercel** (primary): push to `main` and Vercel deploys automatically. The site is served as a static export from the project's domain root (no base path). `vercel.json` sets cache headers only; Vercel's native Next.js + `output: 'export'` support handles the rest. `NEXT_PUBLIC_SITE_URL` and canonical/OG URLs resolve dynamically from the deployment context (see `src/lib/siteUrl.ts`).

**GitHub Pages** (secondary / CI preview): `.github/workflows/deploy.yml` runs the test suite, builds, and publishes `out/` to GitHub Pages on every push to `main`, using a `basePath` of `/tnp` (set via `NEXT_PUBLIC_BASE_PATH`, only used in that workflow). Enable Pages once per repo: **Settings → Pages → Source: GitHub Actions**.

## Pre-launch checklist

Several values are intentionally left as `TODO` — search the repo for `TODO`
before going live:

- [x] Pricing and budget ranges (`PricingPageClient.tsx`, `ContactForm.tsx`)
- [x] Business hours — Monday – Saturday, 8:00 AM – 5:00 PM (GMT+7) (`src/messages/*.json` — `contact.sidebar.directContact.hours`)
- [ ] Trust certifications / badges (`Footer.tsx`) — FSC, ISO, JAS, export licences
- [ ] Real testimonials or client stats (`home.trust`)
- [x] Social media URLs — Facebook (`NEXT_PUBLIC_FACEBOOK_URL`) and Instagram (`NEXT_PUBLIC_INSTAGRAM_URL`) set in `.env.production`; consumed in `Footer.tsx` and schema `sameAs`
- [x] Formspree endpoint — set via `NEXT_PUBLIC_FORMSPREE_ID` in `.env.production` (form ID `mpqeyjea`). To change accounts, update only the env var — no source code change needed.
- [x] OG images per locale — `og-en.jpg`, `og-vi.jpg`, `og-ja.jpg` in `public/assets/og/` (currently duplicated from `og-default.png`; replace with locale-specific artwork when available)
- [x] PNG favicon for Google search results — `favicon-192.png` and `favicon-512.png` in `public/assets/favicon/`, registered in `site.webmanifest` and `metadata.icons`.

## Security

See [SECURITY.md](SECURITY.md) for the vulnerability reporting policy.

## Author

Jaime Canicula ([jaimecanicula@gmail.com](mailto:jaimecanicula@gmail.com)) —
freelance software architect and engineer, building for TNP in Vietnam.
