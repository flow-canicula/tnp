#!/usr/bin/env node
/**
 * scripts/generate-og.mjs
 * Generates a 1200×630 brand-themed OG image as a static PNG.
 * Pure Node.js — no external dependencies. Uses built-in zlib.
 * Run: node scripts/generate-og.mjs
 * Output: public/assets/og/og-default.png
 */

import { writeFileSync, mkdirSync } from 'fs';
import { deflateSync } from 'zlib';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');

const W = 1200;
const H = 630;

// ── CRC32 ──────────────────────────────────────────────────────────────────

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// ── PNG chunk helper ───────────────────────────────────────────────────────

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf  = Buffer.allocUnsafe(4);
  lenBuf.writeUInt32BE(data.length);
  const crcBuf  = Buffer.allocUnsafe(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

// ── Colour per pixel ───────────────────────────────────────────────────────

function colour(x, y) {
  // Normalised coords
  const nx = x / W;   // 0..1
  const ny = y / H;   // 0..1

  // Base: very dark wood-charcoal  #100D09
  let r = 16, g = 13, b = 9;

  // Subtle horizontal wood-grain banding
  const grain1 = Math.sin(ny * H * 0.82) * 0.040;
  const grain2 = Math.sin(ny * H * 0.19) * 0.018;
  r += (grain1 + grain2) * 28;
  g += (grain1 + grain2) * 22;
  b += (grain1 + grain2) * 12;

  // Diagonal plank lines (two families, faint)
  const d1 = ((x + y * 0.50) % 200) / 200;
  const d2 = ((x - y * 0.30 + W) % 150) / 150;
  if (d1 < 0.007 || d2 < 0.006) { r += 9; g += 7; b += 4; }

  // Central amber radial glow — wider horizontally
  const gx = (nx - 0.50) * 2.2;
  const gy = (ny - 0.50) * 2.0;
  const gdist = Math.sqrt(gx * gx + gy * gy);
  const glow = Math.max(0, 1 - gdist / 1.05) ** 2.2;
  r += glow * 64;
  g += glow * 38;
  b += glow * 10;

  // Second warm highlight — upper-right accent
  const hx = (nx - 0.80) * 2.8;
  const hy = (ny - 0.22) * 2.8;
  const hdist = Math.sqrt(hx * hx + hy * hy);
  const hi = Math.max(0, 1 - hdist / 1.0) ** 3;
  r += hi * 28; g += hi * 14; b += hi * 4;

  // Vignette — darken all four edges
  const evx = nx < 0.5 ? nx : 1 - nx;
  const evy = ny < 0.5 ? ny : 1 - ny;
  const vig = Math.min(1, (evx * 2) ** 0.55) * Math.min(1, (evy * 2) ** 0.55);
  r *= vig; g *= vig; b *= vig;

  // Amber border frame (4 px)
  if (x < 4 || x >= W - 4 || y < 4 || y >= H - 4) {
    r = 110; g = 76; b = 30;
  }

  return [
    Math.max(0, Math.min(255, Math.round(r))),
    Math.max(0, Math.min(255, Math.round(g))),
    Math.max(0, Math.min(255, Math.round(b))),
  ];
}

// ── Build raw scanline buffer ──────────────────────────────────────────────

const raw = Buffer.allocUnsafe(H * (W * 3 + 1));  // filter byte + RGB per row
for (let y = 0; y < H; y++) {
  const rowOffset = y * (W * 3 + 1);
  raw[rowOffset] = 0;  // filter type: None
  for (let x = 0; x < W; x++) {
    const [pr, pg, pb] = colour(x, y);
    const i = rowOffset + 1 + x * 3;
    raw[i] = pr; raw[i + 1] = pg; raw[i + 2] = pb;
  }
}

// ── Assemble PNG ───────────────────────────────────────────────────────────

const ihdr = Buffer.allocUnsafe(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8]  = 8;   // bit depth
ihdr[9]  = 2;   // colour type: RGB truecolour (no alpha)
ihdr[10] = 0;   // compression method
ihdr[11] = 0;   // filter method
ihdr[12] = 0;   // interlace: none

const compressed = deflateSync(raw, { level: 7 });

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),  // PNG signature
  chunk('IHDR', ihdr),
  chunk('IDAT', compressed),
  chunk('IEND', Buffer.alloc(0)),
]);

// ── Write ──────────────────────────────────────────────────────────────────

const outDir  = join(ROOT, 'public', 'assets', 'og');
const outPath = join(outDir, 'og-default.png');

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, png);

console.log(`✓ OG image written: public/assets/og/og-default.png  (${(png.length / 1024).toFixed(1)} KB)  ${W}×${H}`);
