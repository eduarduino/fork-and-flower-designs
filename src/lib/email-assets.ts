/**
 * Email clients (Gmail in particular) load images through an image
 * proxy that can only reach publicly-routable URLs. Every `<Img>` in
 * `src/emails/` therefore reads from this module so the rendered HTML
 * always carries a fully-qualified absolute URL.
 *
 * Resolution order, highest priority first:
 *
 *   1. NEXT_PUBLIC_EMAIL_ASSET_BASE_URL
 *      Explicit override for the email asset host. Useful when assets
 *      are served from a CDN, or to point local dev at a deployed
 *      preview while iterating on email sends (Gmail can't fetch
 *      `localhost`, so a tunneled / preview URL is needed for live
 *      testing).
 *
 *   2. NEXT_PUBLIC_SITE_URL
 *      Standard marketing-site URL. Used as the fallback so a single
 *      env var configures both the site and the emails.
 *
 *   3. https://${VERCEL_URL}
 *      Set automatically on every Vercel deploy / preview.
 *
 *   4. http://localhost:3000
 *      Last-resort dev fallback. Will *not* render in real email
 *      clients — a warning is logged on first resolution in production.
 *
 * Resolution happens at render time on the server (`process.env` is
 * only read inside the Node runtime that sends the mail), so a deploy
 * always picks up the freshest value.
 */

const LOCAL_FALLBACK = "http://localhost:3000";

let warnedAboutLocalFallback = false;

function stripTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalize(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withScheme = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
  if (!isValidHttpUrl(withScheme)) return null;
  return stripTrailingSlash(withScheme);
}

export function getEmailBaseUrl(): string {
  const explicit =
    normalize(process.env.NEXT_PUBLIC_EMAIL_ASSET_BASE_URL) ??
    normalize(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalize(process.env.VERCEL_URL);

  if (explicit) return explicit;

  if (process.env.NODE_ENV === "production" && !warnedAboutLocalFallback) {
    warnedAboutLocalFallback = true;
    console.warn(
      "[email-assets] No NEXT_PUBLIC_EMAIL_ASSET_BASE_URL, " +
        "NEXT_PUBLIC_SITE_URL, or VERCEL_URL set in production. " +
        "Email images will fall back to localhost and will not render " +
        "in Gmail, Apple Mail, or Outlook.",
    );
  }
  return LOCAL_FALLBACK;
}

export interface EmailImageAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface EmailAssetBundle {
  logoOnLight: EmailImageAsset;
  logoOnDark: EmailImageAsset;
  instagramIcon: EmailImageAsset;
}

/**
 * Resolved at render time so a single deploy can drive any environment
 * without rebuilding the templates.
 *
 * Width / height are the **native** pixel dimensions of the source PNG
 * in `public/email/`. Templates downscale via the `<Img>` width / height
 * attributes; keeping the native values here documents the source and
 * lets templates compute aspect-correct display sizes if needed.
 */
export function getEmailAssets(): EmailAssetBundle {
  const base = getEmailBaseUrl();
  return {
    logoOnLight: {
      src: `${base}/email/logo-on-light.png`,
      width: 320,
      height: 320,
      alt: "Fork & Flower Designs",
    },
    logoOnDark: {
      src: `${base}/email/logo-on-dark.png`,
      width: 320,
      height: 419,
      alt: "Fork & Flower Designs",
    },
    instagramIcon: {
      src: `${base}/email/instagram.png`,
      width: 64,
      height: 64,
      alt: "Fork & Flower Designs on Instagram",
    },
  };
}
