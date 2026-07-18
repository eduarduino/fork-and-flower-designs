/**
 * Lightweight metadata/asset regression checks (plain node, no test framework).
 *
 *   node scripts/check-metadata.mjs
 *
 * Asserts:
 *   - public/og-image.png is exactly 1200×630
 *   - all favicon/app-icon/manifest-icon files exist
 *   - SITE_URL is the production www host
 *   - no localhost / *.vercel.app / clark-spine leakage in src or built output
 *
 * Exits non-zero on the first failure so it can gate CI or a pre-deploy step.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const ok = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => {
  failures.push(msg);
  console.error(`  ✗ ${msg}`);
};

// 1. OG image dimensions -----------------------------------------------------
const ogPath = join(root, "public/og-image.png");
if (!existsSync(ogPath)) {
  fail("public/og-image.png is missing");
} else {
  const meta = await sharp(ogPath).metadata();
  if (meta.width === 1200 && meta.height === 630) {
    ok("og-image.png is 1200×630");
  } else {
    fail(`og-image.png is ${meta.width}×${meta.height} (expected 1200×630)`);
  }
}

// 2. Icon files exist --------------------------------------------------------
const iconFiles = [
  "src/app/favicon.ico",
  "src/app/icon.png",
  "src/app/apple-icon.png",
  "public/icon-192.png",
  "public/icon-512.png",
  "public/logo-512.png",
];
for (const rel of iconFiles) {
  if (existsSync(join(root, rel))) ok(`${rel} exists`);
  else fail(`${rel} is missing`);
}

// 3. SITE_URL is the production www host ------------------------------------
const siteSrc = readFileSync(join(root, "src/lib/site.ts"), "utf8");
if (/https:\/\/www\.forkandflowerdesigns\.com/.test(siteSrc)) {
  ok("SITE_URL points at https://www.forkandflowerdesigns.com");
} else {
  fail("SITE_URL production host not found in src/lib/site.ts");
}

// 4. No preview-host / stray-reference leakage -------------------------------
// Two different scopes:
//   - clark-spine must not appear ANYWHERE (source or output).
//   - localhost / *.vercel.app must not appear in the RENDERED output. We scan
//     the prerendered artifacts (HTML + route .body files), not compiled JS —
//     the site.ts guard legitimately names those hosts as string literals in
//     order to strip them, so grepping source/JS would be a false positive.
function walk(dir, matcher, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git") continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, matcher, out);
    else if (matcher(name)) out.push(p);
  }
  return out;
}

// clark-spine: source + built output
const CLARK = /clark[-_]?spine/i;
let clark = false;
for (const base of [join(root, "src"), join(root, ".next/server")]) {
  for (const file of walk(base, (n) => /\.(ts|tsx|js|html|json|body)$/.test(n))) {
    if (CLARK.test(readFileSync(file, "utf8"))) {
      fail(`${file.slice(root.length + 1)} references clark-spine`);
      clark = true;
    }
  }
}
if (!clark) ok("no clark-spine references anywhere");

// localhost / vercel.app: rendered output only
const builtApp = join(root, ".next/server/app");
if (!existsSync(builtApp)) {
  console.log("  … skipped rendered-output host scan (run `npm run build` first)");
} else {
  const PREVIEW = /\blocalhost\b|127\.0\.0\.1|[a-z0-9-]+\.vercel\.app/i;
  let leak = false;
  for (const file of walk(builtApp, (n) => /\.(html|body|txt)$/.test(n))) {
    if (PREVIEW.test(readFileSync(file, "utf8"))) {
      fail(`rendered ${file.slice(root.length + 1)} leaks a preview host`);
      leak = true;
    }
  }
  if (!leak) ok("no localhost / vercel.app in rendered output");
}

// ---------------------------------------------------------------------------
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll metadata checks passed.");
