#!/usr/bin/env node
/**
 * scripts/generate-og.mjs
 * Generates a 1200×630 OG image using company-4.jpg as the photo base.
 * Effects: dark vignette, warm amber centre glow, subtle light rays, amber border.
 * Run: node scripts/generate-og.mjs
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

// ── RGBA overlay: dark vignette + amber centre glow + border ──────────────────

function buildOverlay() {
  const buf = Buffer.allocUnsafe(W * H * 4);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const nx = x / W;
      const ny = y / H;
      const i  = (y * W + x) * 4;

      // Amber border — 4 px, fully opaque
      if (x < 4 || x >= W - 4 || y < 4 || y >= H - 4) {
        buf[i] = 110; buf[i+1] = 76; buf[i+2] = 30; buf[i+3] = 255;
        continue;
      }

      // Central radial glow — shifted slightly low to illuminate the group
      const gx   = (nx - 0.50) * 2.0;
      const gy   = (ny - 0.58) * 1.8;
      const glow = Math.max(0, 1 - Math.hypot(gx, gy) / 1.05) ** 1.8;

      // Upper-right warm accent
      const hx = (nx - 0.78) * 2.6;
      const hy = (ny - 0.20) * 2.6;
      const hi  = Math.max(0, 1 - Math.hypot(hx, hy)) ** 3;

      // Vignette — how dark the edge is (0 at centre → 1 at corners)
      const evx = Math.min(nx, 1 - nx) * 2;
      const evy = Math.min(ny, 1 - ny) * 2;
      const vig = 1 - Math.min(1, evx ** 0.55) * Math.min(1, evy ** 0.55);

      // Light vignette — soft edge darkening only, not a blackout
      const baseAlpha = 15 + vig * 70;
      const alpha     = Math.max(0, Math.min(255, Math.round(baseAlpha - glow * 40)));

      // Warm amber tint from glow + accent
      const warmR = glow * 90 + hi * 40;
      const warmG = glow * 52 + hi * 22;
      const warmB = glow * 12 + hi * 6;

      buf[i]   = Math.min(255, Math.round(warmR));
      buf[i+1] = Math.min(255, Math.round(warmG));
      buf[i+2] = Math.min(255, Math.round(warmB));
      buf[i+3] = alpha;
    }
  }

  return buf;
}

// ── RGBA screen-blend layer: subtle amber light rays ─────────────────────────

function buildRays() {
  const buf = Buffer.allocUnsafe(W * H * 4);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const nx = x / W;
      const ny = y / H;
      const i  = (y * W + x) * 4;

      const dx    = nx - 0.5;
      const dy    = ny - 0.5;
      const angle = Math.atan2(dy * H, dx * W);
      const ray   = (Math.sin(angle * 10) + 1) / 2;
      const dist  = Math.hypot(dx * 2.2, dy * 2.0);
      const fade  = Math.max(0, 1 - dist) ** 1.8;
      const v     = Math.round(ray * fade * 0.10 * 255);

      buf[i] = v; buf[i+1] = Math.round(v * 0.58); buf[i+2] = 0; buf[i+3] = v;
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

  // 1) Resize + crop photo to OG dimensions — keep it bright so the team is visible
  const base = await sharp(photoPath)
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .modulate({ brightness: 0.82, saturation: 0.90 })
    .png()
    .toBuffer();

  // 2) Composite: dark vignette/glow overlay (over) + ray highlights (screen)
  const out = await sharp(base)
    .composite([
      {
        input: buildOverlay(),
        raw: { width: W, height: H, channels: 4 },
        blend: 'over',
      },
      {
        input: buildRays(),
        raw: { width: W, height: H, channels: 4 },
        blend: 'screen',
      },
    ])
    .png({ compressionLevel: 7 })
    .toFile(outPath);

  console.log(
    `✓ OG image written: public/assets/og/og-default.png  (${(out.size / 1024).toFixed(1)} KB)  ${W}×${H}`,
  );

  // Mirror to out/assets/og/ if the export directory already exists
  const outExportDir = join(ROOT, 'out', 'assets', 'og');
  if (existsSync(outExportDir)) {
    copyFileSync(outPath, join(outExportDir, 'og-default.png'));
    console.log('✓ Mirrored → out/assets/og/og-default.png');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
