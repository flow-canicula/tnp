#!/usr/bin/env node
/**
 * scripts/generate-og.mjs
 * Generates a 1200×630 OG image using company-4.jpg as the photo base.
 * Filter: mahogany brown color grade + bottom marketing band + technical diagonal grid.
 * Run:    node scripts/generate-og.mjs
 * Output: public/assets/og/og-default.png
 */

import sharp from 'sharp';
import { mkdirSync, copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT  = join(__dir, '..');
const W = 1200;
const H = 630;

// ── Layer 1 (blend: over): Brown duotone wash + vignette + bottom marketing band ──

function buildBrownWash() {
  const buf = Buffer.allocUnsafe(W * H * 4);

  // Classic sepia shadow tone
  const R = 90, G = 58, B = 22;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const nx = x / W;
      const ny = y / H;
      const i  = (y * W + x) * 4;

      // Double-rule border: 7 px outer (dark walnut) + 2 px gap + 1 px inner line
      const outerBorder = x < 7 || x >= W - 7 || y < 7 || y >= H - 7;
      const innerBorder = !outerBorder && (x < 10 || x >= W - 10 || y < 10 || y >= H - 10);

      if (outerBorder) {
        buf[i]=55; buf[i+1]=32; buf[i+2]=10; buf[i+3]=255;
        continue;
      }
      if (innerBorder) {
        buf[i]=120; buf[i+1]=82; buf[i+2]=32; buf[i+3]=200;
        continue;
      }

      // Vignette — 0 at centre, 1 at corners
      const evx = Math.min(nx, 1 - nx) * 2;
      const evy = Math.min(ny, 1 - ny) * 2;
      const vig = 1 - Math.min(1, evx ** 0.7) * Math.min(1, evy ** 0.7);

      // Bottom marketing band — dark brown gradient that starts at 52% height.
      // Gives a cinematic base for white text/logo overlay.
      const bottomFade = Math.max(0, (ny - 0.52) / 0.48) ** 1.4;

      // Subtle upper-left warm wash (adds depth, counterbalances vignette)
      const llDist = Math.hypot(nx * 1.6, ny * 1.6);
      const lightLeak = Math.max(0, 1 - llDist) ** 2.8;

      const alpha = Math.min(255, Math.round(
        22              // global brown tint — ties the whole image to the brand palette
        + vig * 95      // edge vignette (brown, not black)
        + bottomFade * 155  // marketing band — heavy at very bottom
        - lightLeak * 15    // slight open-up from upper-left light source
      ));

      buf[i]=R; buf[i+1]=G; buf[i+2]=B; buf[i+3]=Math.max(0, alpha);
    }
  }

  return buf;
}

// ── Layer 2 (blend: screen): Technical diagonal grid ─────────────────────────
// Fine 45° lines at 36px intervals — like a precision technical drawing.
// Visible at corners/edges, fades to nearly invisible at centre (so the faces
// of the team stay clean and readable).

function buildTechGrid() {
  const buf = Buffer.allocUnsafe(W * H * 4);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const nx = x / W;
      const ny = y / H;
      const i  = (y * W + x) * 4;

      // Primary diagonal (NW→SE, 36px pitch)
      const diagA = (x + y) % 36 < 1.2;
      // Secondary diagonal (NE→SW, 72px pitch — half density)
      const diagB = ((W - x) + y) % 72 < 1.2;

      const isLine = diagA || diagB;

      if (!isLine) {
        buf[i]=0; buf[i+1]=0; buf[i+2]=0; buf[i+3]=0;
        continue;
      }

      // Grid is stronger toward corners, nearly invisible at centre
      const cx = Math.abs(nx - 0.5) * 2;   // 0 at centre-x, 1 at edges
      const cy = Math.abs(ny - 0.5) * 2;
      const edgeWeight = Math.max(cx, cy) ** 1.4;

      // Lines fade out in the lower half where the marketing band sits
      const bottomSuppress = Math.max(0, (ny - 0.55) / 0.45);

      const alpha = Math.max(0, Math.round(
        edgeWeight * 32 - bottomSuppress * 28
      ));

      // Sepia screen-blend colour — warm highlight on the grid lines
      buf[i]=140; buf[i+1]=98; buf[i+2]=38; buf[i+3]=alpha;
    }
  }

  return buf;
}

// ── Layer 3 (blend: screen): Warm upper-left light source ────────────────────
// Lifts the photo in the upper-left quadrant, balances the bottom band, and
// reinforces the warm, crafted feel of the brand.

function buildWarmLeak() {
  const buf = Buffer.allocUnsafe(W * H * 4);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const nx = x / W;
      const ny = y / H;
      const i  = (y * W + x) * 4;

      const dist = Math.hypot(nx * 1.9, ny * 2.1);
      const leak = Math.max(0, 1 - dist) ** 2.4;

      // Sepia highlight — warm ivory/parchment light leak
      const v = Math.round(leak * 0.16 * 255);
      buf[i]=v; buf[i+1]=Math.round(v * 0.72); buf[i+2]=Math.round(v * 0.28); buf[i+3]=v;
    }
  }

  return buf;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const photoPath = join(ROOT, 'public', 'assets', 'images', 'company', 'company-4.jpg');
  const outDir    = join(ROOT, 'public', 'assets', 'og');
  const outPath   = join(outDir, 'og-default.png');

  mkdirSync(outDir, { recursive: true });

  // Convert to greyscale then apply a classic sepia tint
  const base = await sharp(photoPath)
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .grayscale()
    .modulate({ brightness: 0.88 })
    .tint({ r: 168, g: 115, b: 55 })
    .png()
    .toBuffer();

  const out = await sharp(base)
    .composite([
      { input: buildBrownWash(), raw: { width: W, height: H, channels: 4 }, blend: 'over'   },
      { input: buildTechGrid(),  raw: { width: W, height: H, channels: 4 }, blend: 'screen' },
      { input: buildWarmLeak(),  raw: { width: W, height: H, channels: 4 }, blend: 'screen' },
    ])
    .png({ compressionLevel: 7 })
    .toFile(outPath);

  console.log(
    `✓ OG image written: public/assets/og/og-default.png  (${(out.size / 1024).toFixed(1)} KB)  ${W}×${H}`,
  );

  const outExportDir = join(ROOT, 'out', 'assets', 'og');
  if (existsSync(outExportDir)) {
    copyFileSync(outPath, join(outExportDir, 'og-default.png'));
    console.log('✓ Mirrored → out/assets/og/og-default.png');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
