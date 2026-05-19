import { Img, Link, Section, Text } from "@react-email/components";
import type { CSSProperties, ReactNode } from "react";
import { brandColors, brandFonts } from "./theme";
import { getEmailAssets } from "@/lib/email-assets";

interface EmailFooterProps {
  /**
   * Optional tagline shown above the contact line. Defaults to the
   * site's footer copy.
   */
  tagline?: string;
  /**
   * Fully-qualified Instagram URL. When provided, a small centered
   * Instagram icon is rendered above the copyright. Pass `undefined`
   * (the default) on the owner notification email to omit it.
   */
  instagramUrl?: string;
}

const DEFAULT_TAGLINE =
  "Floral-forward event styling for intimate at-home gatherings.";
const CONTACT_EMAIL = "events@forkandflowerdesigns.com";
const LOGO_DISPLAY_WIDTH = 96;
const INSTAGRAM_DISPLAY_SIZE = 20;

/**
 * Link color on the dark-olive footer. Chosen for high contrast against
 * `brandColors.charcoal.DEFAULT` and bright enough to remain legible in
 * Gmail dark mode (Gmail's dark theme darkens light backgrounds rather
 * than inverting text colors, so a warm light tone stays warm).
 */
const FOOTER_LINK_COLOR = brandColors.cream.DEFAULT;

/**
 * Shared inline style for every clickable element in the footer.
 *
 * Why this exists: Gmail auto-detects email addresses, URLs, and phone
 * numbers and rewrites them as blue underlined links *even when they
 * are already wrapped in an `<a>`*. The reliable workaround is two
 * layers of explicit color: on the `<a>` (`FOOTER_LINK_STYLE`) and on
 * an inner `<span>` (`FOOTER_LINK_INNER_STYLE`) — Gmail's transform
 * targets the `<a>` element directly, so the inner span survives.
 */
const FOOTER_LINK_STYLE: CSSProperties = {
  color: FOOTER_LINK_COLOR,
  textDecoration: "none",
  fontFamily: brandFonts.sans,
};

const FOOTER_LINK_INNER_STYLE: CSSProperties = {
  color: FOOTER_LINK_COLOR,
  textDecoration: "none",
};

/**
 * Footer link with Gmail-resistant color enforcement.
 */
function FooterLink({
  href,
  children,
  style,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  style?: CSSProperties;
  ariaLabel?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      style={{ ...FOOTER_LINK_STYLE, ...style }}
    >
      <span style={FOOTER_LINK_INNER_STYLE}>{children}</span>
    </Link>
  );
}

/**
 * Charcoal footer block that mirrors the site `<Footer>` — brand mark,
 * tagline, contact email, optional Instagram glyph, tracked uppercase
 * copyright.
 */
export function EmailFooter({
  tagline = DEFAULT_TAGLINE,
  instagramUrl,
}: EmailFooterProps) {
  const { logoOnDark, instagramIcon } = getEmailAssets();
  const year = new Date().getFullYear();
  const logoDisplayHeight = Math.round(
    LOGO_DISPLAY_WIDTH * (logoOnDark.height / logoOnDark.width),
  );

  return (
    <Section
      style={{
        backgroundColor: brandColors.charcoal.DEFAULT,
        color: brandColors.cream.DEFAULT,
        padding: "48px 32px",
        textAlign: "center",
      }}
    >
      <Img
        src={logoOnDark.src}
        alt={logoOnDark.alt}
        width={LOGO_DISPLAY_WIDTH}
        height={logoDisplayHeight}
        style={{
          display: "block",
          margin: "0 auto",
          border: 0,
          outline: "none",
          textDecoration: "none",
        }}
      />

      <Text
        style={{
          color: "rgba(245, 239, 230, 0.78)",
          fontFamily: brandFonts.sans,
          fontSize: "12px",
          lineHeight: "1.7",
          margin: "24px auto 0 auto",
          maxWidth: "360px",
        }}
      >
        {tagline}
      </Text>

      <Text
        style={{
          fontFamily: brandFonts.sans,
          fontSize: "12px",
          letterSpacing: "0.05em",
          margin: "12px 0 0 0",
          color: FOOTER_LINK_COLOR,
        }}
      >
        <FooterLink href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </FooterLink>
      </Text>

      <div
        aria-hidden
        style={{
          height: "1px",
          backgroundColor: "rgba(245, 239, 230, 0.18)",
          margin: "32px auto",
          maxWidth: "360px",
          lineHeight: "1px",
          fontSize: 0,
        }}
      />

      {instagramUrl ? (
        <div style={{ margin: "0 0 20px 0", textAlign: "center" }}>
          <FooterLink
            href={instagramUrl}
            ariaLabel="Fork & Flower Designs on Instagram"
          >
            <Img
              src={instagramIcon.src}
              alt={instagramIcon.alt}
              width={INSTAGRAM_DISPLAY_SIZE}
              height={INSTAGRAM_DISPLAY_SIZE}
              style={{
                display: "inline-block",
                border: 0,
                outline: "none",
                textDecoration: "none",
              }}
            />
          </FooterLink>
        </div>
      ) : null}

      <Text
        style={{
          color: "rgba(245, 239, 230, 0.6)",
          fontFamily: brandFonts.sans,
          fontSize: "10px",
          letterSpacing: "0.2em",
          margin: 0,
          textTransform: "uppercase",
        }}
      >
        &copy; {year} Fork &amp; Flower Designs
      </Text>
    </Section>
  );
}
