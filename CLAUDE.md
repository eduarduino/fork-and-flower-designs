# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run dev:webpack  # Start dev server with Webpack (fallback)
npm run dev:clean    # Clear caches and start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run clean        # Remove .next and node_modules/.cache
```

No test suite is configured.

## Architecture

**Fork & Flower Designs** is a Next.js 15 (App Router) portfolio and inquiry platform for a luxury floral event styling business. The site is primarily a marketing site with one key interactive feature: the event inquiry form.

### Inquiry Form Flow

The inquiry form is the core business feature. It spans:

1. **`src/lib/schemas/inquiry.ts`** — Zod schema for the full form payload. All field constraints, enum values for event types/services/packages/add-ons, phone formatting regex, signature validation (PNG data URL with base64 + magic byte check, or plain text name), and the honeypot field live here.

2. **`src/components/sections/InquiryForm.tsx`** — Large client component (~994 lines). React Hook Form + Zod integration, signature canvas (mouse + touch), phone auto-formatting, Cloudflare Turnstile widget, and form submission logic.

3. **`src/app/api/inquiry/route.ts`** — POST-only API route. Runs: CSRF check → Content-Type check → size cap → rate limit (5 req/60s per IP, in-memory) → honeypot drop → Turnstile verify → Zod parse → parallel email sends → Slack notification.

4. **`src/lib/email.ts`** — Resend integration. `sendOwnerNotification()` sends an HTML email with signature as inline PNG attachment. `sendClientConfirmation()` only fires when `FROM_EMAIL` is not a resend.dev sandbox address (checked via `canSendToArbitraryRecipients()`). Both calls are best-effort (failures logged, don't break response).

5. **`src/lib/slack.ts`** — Slack webhook notifications. Fires on every submission and also on owner email failure (includes error context). Always best-effort.

### Key Environment Variables

See `.env.example`. Notable dev behaviors:
- Turnstile verification is skipped in `NODE_ENV !== 'production'` when `TURNSTILE_SECRET_KEY` is unset
- Resend silently skips (logs warning) if `RESEND_API_KEY` is missing
- `FORCE_CLIENT_CONFIRMATION=true` overrides the sandbox guard to send client emails locally
- `SIMULATE_OWNER_EMAIL_FAILURE=true` tests the Slack failure-alert path

### Component Organization

- **`src/components/ui/`** — Generic layout primitives: `Section` (background color variants), `SectionHeading`, `Button`, `AnimateIn` (Framer Motion scroll wrapper)
- **`src/components/sections/`** — Page-specific content blocks
- **`src/components/layout/`** — Header, Footer, MobileNav
- **`src/components/brand/`** — `BrandLogo` with preset/context variants (header/footer/hero, onLight/onDark)
- **`src/components/providers/`** — `ForkStabProvider` — context for a fork-stab click animation easter egg throughout the site

### Styling

TailwindCSS with a custom palette: `cream`, `charcoal`, `gold` (+ light/dark), `blush`, `sage`. Fonts: `Cormorant Garamond` (serif/headings) and `Montserrat` (sans/body), loaded via Next.js Google Fonts.

Path alias `@/*` maps to `src/*`.

### Deployment & Credentials

Eddie develops under his own third-party credentials (Resend, Slack, Turnstile). At go-live, swap to the client's credentials by updating environment variables only — no code changes needed.
