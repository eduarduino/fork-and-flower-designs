import {
  serviceOptions,
  packageOptions,
  addOnOptions,
} from "@/lib/schemas/inquiry";

/**
 * Single source of truth for human-readable labels of the enum-shaped
 * inquiry fields (services / packages / add-ons). Both the email
 * templates and the Slack notification builder read from here so the
 * two channels can never drift apart.
 */
export const SERVICE_LABELS: Record<string, string> = Object.fromEntries(
  serviceOptions.map((s) => [s.value, s.label])
);

export const PACKAGE_LABELS: Record<string, string> = Object.fromEntries(
  packageOptions.map((p) => [p.value, p.label])
);

export const ADDON_LABELS: Record<string, string> = Object.fromEntries(
  addOnOptions.map((a) => [a.value, a.label])
);

/**
 * Join a list of enum values into their human labels, using `fallback`
 * when the list is empty or undefined. Unknown values fall back to the
 * raw value so we never silently drop data.
 */
export function labelList(
  values: readonly string[] | undefined,
  map: Record<string, string>,
  fallback: string
): string {
  if (!values || values.length === 0) return fallback;
  return values.map((v) => map[v] ?? v).join(", ");
}
