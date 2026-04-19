/**
 * Generates resized logo assets and favicons from the new brand source files.
 *
 * Source logos (unchanged):
 *   assets/logos/mainLogo.png      (1563×1563, transparent)
 *   assets/logos/forkFromLogo.png  (1600×1600, fork content ~103×589 after trim)
 *
 * Outputs:
 *   assets/logos/generated/mainLogo-{width}w.png
 *   assets/logos/generated/forkFromLogo-{width}w.png  (trimmed first)
 *   src/app/icon.png, src/app/apple-icon.png, public/favicon.ico
 *
 * Run: node scripts/generate-logo-assets.mjs
 */
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const generatedDir = join(root, "assets/logos/generated");
const appDir = join(root, "src/app");
const publicDir = join(root, "public");

mkdirSync(generatedDir, { recursive: true });
mkdirSync(appDir, { recursive: true });
mkdirSync(publicDir, { recursive: true });

// ---------------------------------------------------------------------------
// 1. mainLogo resized variants
// ---------------------------------------------------------------------------
const mainLogoSrc = join(root, "assets/logos/mainLogo.png");
const mainLogoWidths = [200, 320, 480];

for (const w of mainLogoWidths) {
  await sharp(mainLogoSrc)
    .resize(w, w, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .png()
    .toFile(join(generatedDir, `mainLogo-${w}w.png`));
  console.log(`  mainLogo-${w}w.png`);
}

// ---------------------------------------------------------------------------
// 2. inverseLogo — trim to content, then generate sized variant for footer
// ---------------------------------------------------------------------------
const inverseSrc = join(root, "assets/logos/inverseLogo.png");
const trimmedInverse = await sharp(inverseSrc).trim({ threshold: 10 }).ensureAlpha().png().toBuffer();
const inverseMeta = await sharp(trimmedInverse).metadata();
console.log(`  inverseLogo trimmed: ${inverseMeta.width}×${inverseMeta.height}`);

const inverseWidths = [200, 320];
for (const w of inverseWidths) {
  const h = Math.round(w * (inverseMeta.height / inverseMeta.width));
  await sharp(trimmedInverse)
    .resize(w, h, { fit: "inside", kernel: sharp.kernel.lanczos3 })
    .ensureAlpha()
    .png()
    .toFile(join(generatedDir, `inverseLogo-${w}w.png`));
  console.log(`  inverseLogo-${w}w.png (${w}×${h})`);
}

// ---------------------------------------------------------------------------
// 3. forkFromLogo — trim to content, then generate sized variants
// ---------------------------------------------------------------------------
const forkSrc = join(root, "assets/logos/forkFromLogo.png");
const trimmedFork = await sharp(forkSrc).trim({ threshold: 10 }).ensureAlpha().png().toBuffer();
const forkMeta = await sharp(trimmedFork).metadata();
console.log(`  forkFromLogo trimmed: ${forkMeta.width}×${forkMeta.height}`);

const forkWidths = [48, 96, 192];
for (const w of forkWidths) {
  const h = Math.round(w * (forkMeta.height / forkMeta.width));
  await sharp(trimmedFork)
    .resize(w, h, { fit: "inside", kernel: sharp.kernel.lanczos3 })
    .ensureAlpha()
    .png()
    .toFile(join(generatedDir, `forkFromLogo-${w}w.png`));
  console.log(`  forkFromLogo-${w}w.png (${w}×${h})`);
}

// Horizontal (tines pointing right) — source fork points tines DOWN, so
// rotate 90° CCW (−90) to land tines on the right edge.
const rotatedFork = await sharp(trimmedFork).rotate(-90).ensureAlpha().png().toBuffer();
const rotatedMeta = await sharp(rotatedFork).metadata();
console.log(`  forkFromLogo rotated: ${rotatedMeta.width}×${rotatedMeta.height}`);

// The fork's ink mass sits on the right (tines) — pad transparent pixels on
// the right so the geometric center matches the visual center of ink,
// otherwise `flex justify-center` makes it look shifted right.
const { data: rawData, info: rawInfo } = await sharp(rotatedFork)
  .raw()
  .toBuffer({ resolveWithObject: true });
let inkWeightedX = 0;
let inkTotal = 0;
for (let x = 0; x < rawInfo.width; x++) {
  let colMass = 0;
  for (let y = 0; y < rawInfo.height; y++) {
    colMass += rawData[(y * rawInfo.width + x) * rawInfo.channels + 3];
  }
  inkWeightedX += x * colMass;
  inkTotal += colMass;
}
const inkCentroidX = inkWeightedX / inkTotal;
const balancedWidth = Math.round(inkCentroidX * 2);
const padRight = Math.max(0, balancedWidth - rotatedMeta.width);
console.log(
  `  forkFromLogo centroid x=${inkCentroidX.toFixed(1)}/${rotatedMeta.width}, padding right +${padRight}px`,
);

const balancedFork = await sharp({
  create: {
    width: rotatedMeta.width + padRight,
    height: rotatedMeta.height,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([{ input: rotatedFork, top: 0, left: 0 }])
  .png()
  .toBuffer();
const balancedMeta = await sharp(balancedFork).metadata();

const horizontalForkWidths = [240, 360];
for (const w of horizontalForkWidths) {
  const h = Math.round(w * (balancedMeta.height / balancedMeta.width));
  await sharp(balancedFork)
    .resize(w, h, { fit: "inside", kernel: sharp.kernel.lanczos3 })
    .ensureAlpha()
    .png()
    .toFile(join(generatedDir, `forkFromLogo-horizontal-${w}w.png`));
  console.log(`  forkFromLogo-horizontal-${w}w.png (${w}×${h})`);
}

// ---------------------------------------------------------------------------
// 4. Favicons from forkFromLogo (original colors, padded into square)
// ---------------------------------------------------------------------------
const forkSquareSize = Math.max(forkMeta.width, forkMeta.height);
const forkSquare = await sharp(trimmedFork)
  .resize(forkSquareSize, forkSquareSize, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .ensureAlpha()
  .png()
  .toBuffer();

await sharp(forkSquare)
  .resize(96, 96, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: sharp.kernel.lanczos3 })
  .ensureAlpha()
  .png()
  .toFile(join(appDir, "icon.png"));
console.log("  src/app/icon.png (96×96)");

await sharp(forkSquare)
  .resize(180, 180, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: sharp.kernel.lanczos3 })
  .ensureAlpha()
  .png()
  .toFile(join(appDir, "apple-icon.png"));
console.log("  src/app/apple-icon.png (180×180)");

console.log("\nDone. All assets generated.");
