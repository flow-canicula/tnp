/**
 * Resolves the canonical site URL at build time.
 *
 * Priority:
 *  1. NEXT_PUBLIC_SITE_URL — set explicitly in Vercel Production env vars
 *     (e.g. https://tnpgr.vn) or in GitHub Actions for Pages builds.
 *  2. VERCEL_URL — injected automatically by Vercel for every deployment
 *     (preview + production). Gives the correct URL for preview branches
 *     (e.g. https://tnp-nine.vercel.app).
 *  3. Hard-coded fallback for local dev.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://tnpgr.vn');
