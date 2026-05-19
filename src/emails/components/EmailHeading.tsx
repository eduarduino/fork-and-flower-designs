import { Heading, Section } from "@react-email/components";
import { brandColors, brandFonts } from "./theme";

interface EmailHeadingProps {
  title: string;
  subtitle?: string;
  /** Visual size of the heading. */
  size?: "xl" | "lg" | "md";
}

const sizeStyles: Record<
  NonNullable<EmailHeadingProps["size"]>,
  { fontSize: string; lineHeight: string }
> = {
  xl: { fontSize: "34px", lineHeight: "1.15" },
  lg: { fontSize: "28px", lineHeight: "1.2" },
  md: { fontSize: "20px", lineHeight: "1.3" },
};

/**
 * Mirrors `SectionHeading` from the website: centered serif title in
 * `font-light` with a short gold hairline beneath, followed by an
 * optional uppercase tracked subtitle.
 */
export function EmailHeading({
  title,
  subtitle,
  size = "lg",
}: EmailHeadingProps) {
  const { fontSize, lineHeight } = sizeStyles[size];

  return (
    <Section style={{ textAlign: "center" }}>
      <Heading
        as="h2"
        style={{
          fontFamily: brandFonts.serif,
          fontWeight: 300,
          color: brandColors.charcoal.DEFAULT,
          fontSize,
          lineHeight,
          margin: 0,
          letterSpacing: "0.01em",
          textAlign: "center",
        }}
      >
        {title}
      </Heading>

      <div
        aria-hidden
        style={{
          backgroundColor: brandColors.gold.DEFAULT,
          height: "1px",
          width: "56px",
          margin: "20px auto 0 auto",
          lineHeight: "1px",
          fontSize: 0,
        }}
      />

      {subtitle ? (
        <p
          style={{
            color: brandColors.charcoal.light,
            fontFamily: brandFonts.sans,
            fontSize: "12px",
            letterSpacing: "0.18em",
            margin: "20px 0 0 0",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </Section>
  );
}
