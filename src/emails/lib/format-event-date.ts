/**
 * Format the schema's `eventDate` (ISO `YYYY-MM-DD`) as a human-readable
 * en-US date. Parsed as local-calendar parts (not `new Date(iso)`) to
 * avoid the UTC-midnight off-by-one issue that flips the displayed day
 * for negative timezone offsets.
 *
 * Returns the raw input on parse failure so we never silently drop data.
 */
export function formatEventDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(y, m - 1, d);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
