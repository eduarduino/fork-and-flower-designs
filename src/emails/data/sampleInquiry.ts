import type { InquiryFormData } from "@/lib/schemas/inquiry";

/**
 * Realistic preview fixtures for the `react-email dev` server. Two
 * variants are exported:
 *
 *   - `sampleInquiryTyped`  — typed-name signature fallback (default
 *     preview prop; safely renders in the browser preview UI)
 *   - `sampleInquiryDrawn`  — drawn PNG signature. In a real send this
 *     becomes an inline `cid:signature` attachment, which the preview
 *     server cannot resolve, so this variant exists mainly for
 *     completeness and ad-hoc testing.
 *
 * Swap in `sampleInquiryDrawn` on either email's `.PreviewProps` to
 * preview the alternative state.
 */

const base: Omit<InquiryFormData, "signature"> = {
  firstName: "Eloise",
  lastName: "Whitman",
  phone: "(555) 123-4567",
  email: "eloise.whitman@example.com",
  eventDate: "2026-09-12",
  startTime: "6:00 PM",
  eventType: "Dinner Party",
  guestCount: "24",
  services: ["tablescape", "island-buffet"],
  packages: ["signature-table", "styled-spread"],
  colorPalette: "Soft ivory, blush, dusty sage, antique gold",
  themeOrVibe: "Late-summer garden — relaxed, candlelit, with foraged florals",
  mustHaveElements:
    "Tapered candles, vintage glassware, and a generous family-style serving spread.",
  addOns: ["servers", "bar-cart", "extra-florals"],
  foodOnIsland: "yes",
  acknowledgeBookingFee: true,
  acknowledgeAvailability: true,
  printName: "Eloise Whitman",
  website: "",
  turnstileToken: "preview-token",
};

export const sampleInquiryTyped: InquiryFormData = {
  ...base,
  signature: "Eloise Whitman",
};

// 64×24 transparent PNG — enough to verify the data URL prefix path
// renders. Real submissions produce a larger signed PNG; this fixture
// is intentionally tiny so the file stays readable.
const TRANSPARENT_PNG_64x24 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAYCAQAAACYZ3vrAAAAH0lEQVR42mNkoBAwjmowamDUwKiBUQOjBkYNjBoAACahAAGw5e0RAAAAAElFTkSuQmCC";

export const sampleInquiryDrawn: InquiryFormData = {
  ...base,
  signature: TRANSPARENT_PNG_64x24,
};
