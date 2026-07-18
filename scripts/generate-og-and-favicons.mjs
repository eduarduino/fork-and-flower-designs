/**
 * Generates the flat, committed social + favicon assets:
 *
 *   public/og-image.png        1200×630 Open Graph / Twitter card
 *   src/app/favicon.ico        multi-size ICO (16 / 32 / 48, PNG frames)
 *   src/app/icon.png           512×512 (App Router <link icon>)
 *   src/app/apple-icon.png     180×180 apple-touch-icon
 *   public/icon-192.png        manifest icon
 *   public/icon-512.png        manifest icon + JSON-LD logo
 *
 * Favicons are the two-lily mark (assets/logos/flowerFromLogo.png) centered on
 * a cream square — a colorful, distinctive mark that reads far better at 16px
 * than the faint fork line-art or the busy wordmark.
 *
 * The OG card is a flat rendering of the hero section: the cream marble
 * background (gradients + gold dot grid transcribed from src/app/globals.css),
 * the wordmark, the serif headline with its italic gold second line, the
 * sub-copy, the serving line, and the "Where flowers meet the table" tagline.
 * Brand typography is drawn from real glyph outlines (see
 * scripts/lib/text_to_paths.py) so the shipped PNG never depends on system
 * font matching. Fonts are fetched once into ./.cache/fonts (gitignored).
 *
 * Prerequisites: node (sharp devDependency) + python3 with fonttools
 *   pip install fonttools
 *
 * Run: node scripts/generate-og-and-favicons.mjs
 */
import { mkdirSync, existsSync, writeFileSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { execFileSync } from "child_process";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const appDir = join(root, "src/app");
const cacheDir = join(root, ".cache/fonts");
const pyHelper = join(__dirname, "lib/text_to_paths.py");

mkdirSync(publicDir, { recursive: true });
mkdirSync(appDir, { recursive: true });
mkdirSync(cacheDir, { recursive: true });

// --- Brand palette (from tailwind.config.ts) -----------------------------
const CREAM_DARK = "#EBDED4"; // cream.dark — hero background
const CHARCOAL = "#3A320C"; // charcoal.DEFAULT
const CHARCOAL_LIGHT = "#5C5230"; // charcoal.light
const GOLD = "#C9A96E"; // gold.DEFAULT
const GOLD_DARK = "#B08D4F"; // gold.dark — hero italic accents

// ---------------------------------------------------------------------------
// Fonts — fetch the variable TTFs once into the local cache
// ---------------------------------------------------------------------------
const FONTS = {
  cormorant: {
    file: join(cacheDir, "CormorantGaramond.ttf"),
    url: "https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf",
  },
  cormorantItalic: {
    file: join(cacheDir, "CormorantGaramond-Italic.ttf"),
    url: "https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond-Italic%5Bwght%5D.ttf",
  },
  montserrat: {
    file: join(cacheDir, "Montserrat.ttf"),
    url: "https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/Montserrat%5Bwght%5D.ttf",
  },
};

async function ensureFont({ file, url }) {
  if (existsSync(file)) return file;
  console.log(`  fetching ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Font download failed (${res.status}): ${url}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

/**
 * Render one line of text to a tightly-trimmed RGBA PNG buffer using real
 * glyph outlines (via the python helper), then recolor to `fill`.
 */
function renderTextLine({
  font,
  wght,
  size,
  text,
  fill,
  letterSpacing = 0,
  uppercase = false,
}) {
  const args = [
    pyHelper,
    "--font", font,
    "--wght", String(wght),
    "--size", String(size),
    "--letter-spacing", String(letterSpacing),
    "--text", text,
  ];
  if (uppercase) args.push("--uppercase");

  const out = execFileSync("python3", args, { encoding: "utf8" });
  const { paths, ascent, descent, width: rawWidth } = JSON.parse(out);
  const width = Math.ceil(rawWidth) + 4;
  const height = Math.ceil(ascent - descent) + 4;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
    `<g transform="translate(2 ${ascent.toFixed(2)})" fill="${fill}">${paths}</g></svg>`;
  return sharp(Buffer.from(svg)).png();
}

async function toTrimmed(pipeline) {
  const buf = await pipeline.trim().png().toBuffer();
  const meta = await sharp(buf).metadata();
  return { buf, width: meta.width, height: meta.height };
}

// ---------------------------------------------------------------------------
// 1. Open Graph card (1200×630) — a flat rendering of the hero section
// ---------------------------------------------------------------------------

/** Cream marble background: gradients + gold dot grid from globals.css. */
function heroBackground(W, H) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${CREAM_DARK}"/>
  <defs>
    <radialGradient id="v1">
      <stop offset="0" stop-color="#d4c4b8"/>
      <stop offset="0.4" stop-color="#d4c4b8" stop-opacity="0.5"/>
      <stop offset="0.7" stop-color="#d4c4b8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="v2">
      <stop offset="0" stop-color="#ddd0c6"/>
      <stop offset="0.4" stop-color="#ddd0c6" stop-opacity="0.5"/>
      <stop offset="0.65" stop-color="#ddd0c6" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="60" height="60" patternUnits="userSpaceOnUse">
      <circle cx="12" cy="30" r="1.1" fill="${GOLD}"/>
      <circle cx="48" cy="30" r="1.1" fill="${GOLD}"/>
    </pattern>
  </defs>
  <g opacity="0.35">
    <ellipse cx="${W * 0.15}" cy="${H * 0.4}" rx="600" ry="300" fill="url(#v1)"/>
    <ellipse cx="${W * 0.85}" cy="${H * 0.25}" rx="500" ry="250" fill="url(#v2)"/>
    <ellipse cx="${W * 0.5}" cy="${H * 0.75}" rx="400" ry="200" fill="url(#v1)"/>
  </g>
  <rect width="${W}" height="${H}" fill="url(#dots)" opacity="0.10"/>
</svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function buildOgImage() {
  const W = 1200;
  const H = 630;

  await ensureFont(FONTS.cormorant);
  await ensureFont(FONTS.cormorantItalic);
  await ensureFont(FONTS.montserrat);

  const background = await heroBackground(W, H);

  // Wordmark (same asset the hero uses: mainLogo)
  const logo = await toTrimmed(
    sharp(join(root, "assets/logos/mainLogo.png"))
      .trim({ threshold: 10 })
      .resize(null, 150, { fit: "inside", kernel: sharp.kernel.lanczos3 }),
  );

  const serifHead = (text, fill, italic) =>
    renderTextLine({
      font: italic ? FONTS.cormorantItalic.file : FONTS.cormorant.file,
      wght: 300,
      size: 58,
      text,
      fill,
    });

  const headline1 = await toTrimmed(
    serifHead("Floral-Forward Event Styling", CHARCOAL, false),
  );
  const headline2 = await toTrimmed(
    serifHead("for Intimate Gatherings", GOLD_DARK, true),
  );

  const subLine = (text) =>
    renderTextLine({
      font: FONTS.montserrat.file,
      wght: 400,
      size: 19,
      text,
      fill: CHARCOAL_LIGHT,
    });
  const sub1 = await toTrimmed(
    subLine("Creating warm, elevated tablescapes and island designs"),
  );
  const sub2 = await toTrimmed(
    subLine("that bring your home — and your moments — to life."),
  );

  const serving = await toTrimmed(
    renderTextLine({
      font: FONTS.montserrat.file,
      wght: 500,
      size: 13,
      text: "Serving New Jersey & Surrounding Areas",
      fill: CHARCOAL_LIGHT,
      letterSpacing: 4,
      uppercase: true,
    }),
  );

  const tagline = await toTrimmed(
    renderTextLine({
      font: FONTS.cormorantItalic.file,
      wght: 400,
      size: 27,
      text: "Where flowers meet the table",
      fill: GOLD_DARK,
    }),
  );

  // Vertical stack with gaps mirroring the hero's spacing rhythm.
  const el = (b) => ({ buf: b.buf, w: b.width, h: b.height });
  const blocks = [
    el(logo),
    { gap: 34 },
    el(headline1),
    { gap: 6 },
    el(headline2),
    { gap: 30 },
    el(sub1),
    { gap: 8 },
    el(sub2),
    { gap: 30 },
    el(serving),
    { gap: 26 },
    el(tagline),
  ];

  const totalH = blocks.reduce((acc, b) => acc + (b.h ?? b.gap), 0);
  let y = Math.round((H - totalH) / 2);

  const composites = [];
  for (const b of blocks) {
    if (b.gap) {
      y += b.gap;
      continue;
    }
    composites.push({
      input: b.buf,
      left: Math.round((W - b.w) / 2),
      top: Math.round(y),
    });
    y += b.h;
  }

  await sharp(background)
    .composite(composites)
    .png()
    .toFile(join(publicDir, "og-image.png"));
  console.log("  public/og-image.png (1200×630)");
}

// ---------------------------------------------------------------------------
// 2. Icons — three surfaces, each with the mark best suited to its context:
//
//   • Browser tab (favicon.ico, icon.png): the two-lily mark on a TRANSPARENT
//     square — colorful and recognizable even at 16px.
//   • App icons (apple-icon.png, manifest icon-192/512): the same lily on a
//     SOLID blush square — iOS ignores transparency (renders black) and Android
//     launchers expect a filled tile.
//   • Brand logo (public/logo-512.png, referenced by the Organization JSON-LD):
//     the full wordmark — this is what search shows as the business's logo.
// ---------------------------------------------------------------------------
const TRANSPARENT_BG = { r: 0, g: 0, b: 0, alpha: 0 };
const SOLID_ICON_BG = { r: 243, g: 235, b: 228, alpha: 1 }; // blush.light #F3EBE4

let lilyMasterPromise;

/** Trimmed two-lily mark centered on a square of `bg` (~10% margin). */
async function lilyMaster(bg) {
  const build = async () => {
    const trimmed = await sharp(join(root, "assets/logos/flowerFromLogo.png"))
      .trim({ threshold: 10 })
      .toBuffer();
    const meta = await sharp(trimmed).metadata();
    const canvas = Math.round(Math.max(meta.width, meta.height) / 0.8);
    return sharp({
      create: { width: canvas, height: canvas, channels: 4, background: bg },
    })
      .composite([{ input: trimmed, gravity: "centre" }])
      .png()
      .toBuffer();
  };
  // Only the transparent master is reused across many frames; cache it.
  if (bg === TRANSPARENT_BG) {
    if (!lilyMasterPromise) lilyMasterPromise = build();
    return lilyMasterPromise;
  }
  return build();
}

async function lilyIcon(size, bg) {
  return sharp(await lilyMaster(bg))
    .resize(size, size, { fit: "cover", position: "centre", kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
}

/** Assemble a multi-image ICO whose frames are full PNGs (widely supported). */
function buildIco(pngFrames) {
  const count = pngFrames.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  const bodies = [];
  pngFrames.forEach(({ size, buf }, i) => {
    const base = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, base + 0); // width
    dir.writeUInt8(size >= 256 ? 0 : size, base + 1); // height
    dir.writeUInt8(0, base + 2); // palette
    dir.writeUInt8(0, base + 3); // reserved
    dir.writeUInt16LE(1, base + 4); // color planes
    dir.writeUInt16LE(32, base + 6); // bits per pixel
    dir.writeUInt32LE(buf.length, base + 8); // image size
    dir.writeUInt32LE(offset, base + 12); // offset
    offset += buf.length;
    bodies.push(buf);
  });

  return Buffer.concat([header, dir, ...bodies]);
}

async function buildFavicons() {
  // Browser tab — transparent lily
  const icoFrames = [];
  for (const size of [16, 32, 48]) {
    icoFrames.push({ size, buf: await lilyIcon(size, TRANSPARENT_BG) });
  }
  writeFileSync(join(appDir, "favicon.ico"), buildIco(icoFrames));
  console.log("  src/app/favicon.ico (16/32/48, transparent)");

  writeFileSync(join(appDir, "icon.png"), await lilyIcon(512, TRANSPARENT_BG));
  console.log("  src/app/icon.png (512×512, transparent)");

  // App icons — solid blush lily
  const solidTargets = [
    [180, join(appDir, "apple-icon.png"), "src/app/apple-icon.png (180×180, solid)"],
    [192, join(publicDir, "icon-192.png"), "public/icon-192.png (solid)"],
    [512, join(publicDir, "icon-512.png"), "public/icon-512.png (solid)"],
  ];
  for (const [size, path, label] of solidTargets) {
    writeFileSync(path, await lilyIcon(size, SOLID_ICON_BG));
    console.log(`  ${label}`);
  }

  // Brand logo for JSON-LD — the wordmark, on a transparent canvas
  await sharp(join(root, "assets/logos/mainLogo.png"))
    .trim({ threshold: 10 })
    .resize(null, 512, { fit: "inside", kernel: sharp.kernel.lanczos3 })
    .png()
    .toFile(join(publicDir, "logo-512.png"));
  console.log("  public/logo-512.png (wordmark)");
}

// ---------------------------------------------------------------------------
async function main() {
  console.log("Generating social + favicon assets…");
  await buildOgImage();
  await buildFavicons();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
