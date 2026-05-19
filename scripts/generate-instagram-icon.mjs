/**
 * One-shot generator for the Instagram footer icon used by the customer
 * confirmation email (`public/email/instagram.png`).
 *
 * Why a script and not a build step:
 *   - The asset is committed to `public/email/` and served as a stable
 *     URL from the marketing site. Regenerating on every build is
 *     wasteful and would invalidate Gmail's image proxy cache.
 *
 * Run with: `node scripts/generate-instagram-icon.mjs`
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const COLOR = "#F5EFE6"; // soft cream — matches footer text on charcoal

const SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <g fill="none" stroke="${COLOR}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round">
    <rect x="32" y="32" width="192" height="192" rx="52" ry="52"/>
    <circle cx="128" cy="128" r="44"/>
  </g>
  <circle cx="184" cy="76" r="10" fill="${COLOR}"/>
</svg>
`.trim();

const here = fileURLToPath(new URL(".", import.meta.url));
const out = resolve(here, "..", "public", "email", "instagram.png");

const png = await sharp(Buffer.from(SVG))
  .resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9, palette: false })
  .toBuffer();

writeFileSync(out, png);
console.log(`Wrote ${out} (${png.byteLength} bytes)`);
