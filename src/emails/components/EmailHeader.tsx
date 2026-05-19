import { Hr, Img, Section } from "@react-email/components";
import { brandColors } from "./theme";
import { getEmailAssets } from "@/lib/email-assets";

interface EmailHeaderProps {
  /**
   * Small tracked label that sits above the logo — e.g. "NEW INQUIRY"
   * on the owner email. Mirrors the eyebrow on the site's headings.
   */
  eyebrow?: string;
}

const LOGO_DISPLAY_WIDTH = 120;

/**
 * Cream banner with the centered brand mark and a gold hairline.
 * Used at the top of every email.
 *
 * The `<Img>` is rendered with both explicit `width`/`height` HTML
 * attributes (for Outlook + Gmail dimension calculation) and matching
 * CSS so the rendered size is identical across clients. Auto-height is
 * intentionally avoided — some Outlook builds collapse height when the
 * attribute disagrees with the rendered intrinsic size.
 */
export function EmailHeader({ eyebrow }: EmailHeaderProps) {
  const { logoOnLight } = getEmailAssets();
  const logoDisplayHeight = Math.round(
    LOGO_DISPLAY_WIDTH * (logoOnLight.height / logoOnLight.width),
  );

  return (
    <Section
      style={{
        backgroundColor: brandColors.cream.DEFAULT,
        padding: "40px 32px 32px 32px",
        textAlign: "center",
      }}
    >
      <Img
        src={logoOnLight.src}
        alt={logoOnLight.alt}
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
      {eyebrow ? (
        <p
          style={{
            color: brandColors.charcoal.light,
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            margin: "24px 0 0 0",
          }}
        >
          {eyebrow}
        </p>
      ) : null}
      <Hr
        style={{
          borderTop: `1px solid ${brandColors.gold.DEFAULT}`,
          borderBottom: 0,
          borderLeft: 0,
          borderRight: 0,
          width: "64px",
          margin: "32px auto 0 auto",
        }}
      />
    </Section>
  );
}
