/**
 * Canonical site origin + URL helpers for metadata, Open Graph, robots,
 * sitemap and JSON-LD.
 *
 * SITE_URL is hardcoded to the production www host so no Vercel preview
 * hostname (e.g. *.vercel.app) or localhost can ever leak into scraped
 * social/canonical tags. An explicit NEXT_PUBLIC_SITE_URL override is honored
 * only when it is a real, non-preview host.
 */
const PRODUCTION_URL = "https://www.forkandflowerdesigns.com";

function resolveSiteUrl(): string {
  const override = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (!override) return PRODUCTION_URL;

  try {
    const { hostname } = new URL(override);
    const isPreview =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".vercel.app") ||
      hostname.endsWith(".local");
    if (isPreview) return PRODUCTION_URL;
    return override;
  } catch {
    return PRODUCTION_URL;
  }
}

export const SITE_URL = resolveSiteUrl();

/** Join a root-relative path onto the canonical origin. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}
