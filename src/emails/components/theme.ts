/**
 * Brand tokens mirrored from `tailwind.config.ts`. Duplicated here (not
 * imported) because email templates must be renderable in isolation by
 * the `react-email` preview dev server, which does not run inside the
 * Next.js build pipeline that resolves `@/*` paths.
 *
 * Keep this file in lock-step with the website Tailwind palette and
 * fonts so that emails always feel like an extension of the site.
 */

export const brandColors = {
  cream: {
    DEFAULT: "#FFFFFF",
    dark: "#EBDED4",
  },
  charcoal: {
    DEFAULT: "#3A320C",
    light: "#5C5230",
  },
  gold: {
    DEFAULT: "#C9A96E",
    light: "#D4BC8B",
    dark: "#B08D4F",
  },
  blush: {
    DEFAULT: "#EBDED4",
    light: "#F3EBE4",
  },
  sage: "#A8B5A0",
} as const;

export const brandFonts = {
  serif:
    '"Cormorant Garamond", Garamond, "Times New Roman", Georgia, serif',
  sans:
    '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
} as const;
