/**
 * Canonical site origin + URL helpers for metadata, Open Graph, robots,
 * sitemap and JSON-LD.
 *
 * SITE_URL defaults to the production www host so no Vercel preview hostname
 * (e.g. *.vercel.app) or localhost can leak into scraped social/canonical tags.
 * An explicit NEXT_PUBLIC_SITE_URL override is honored only when it is a real,
 * non-preview host — and is normalized to its www form so the canonical always
 * matches the production apex→www redirect (a bare apex canonical would point
 * at a URL that immediately 308-redirects, a mixed signal to crawlers).
 */
const PRODUCTION_URL = "https://www.forkandflowerdesigns.com";

function resolveSiteUrl(): string {
  const override = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (!override) return PRODUCTION_URL;

  try {
    const url = new URL(override);
    const { hostname } = url;
    const isPreview =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".vercel.app") ||
      hostname.endsWith(".local");
    if (isPreview) return PRODUCTION_URL;

    // Coerce a bare apex (forkandflowerdesigns.com) up to its www form to
    // agree with the domain's apex→www redirect.
    if (!hostname.startsWith("www.")) {
      url.hostname = `www.${hostname}`;
    }
    return url.origin;
  } catch {
    return PRODUCTION_URL;
  }
}

export const SITE_URL = resolveSiteUrl();

/** Join a root-relative path onto the canonical origin. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}
