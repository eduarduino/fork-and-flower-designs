import { Button } from "@react-email/components";
import type { ReactNode } from "react";
import { brandColors, brandFonts } from "./theme";

interface EmailButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline";
}

/**
 * Matches the website `<Button>`: tracked, uppercase, square corners.
 * `primary` is charcoal-on-cream like the site's default CTA; `outline`
 * is a softer secondary action with a charcoal border on cream.
 */
export function EmailButton({
  href,
  children,
  variant = "primary",
}: EmailButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Button
      href={href}
      style={{
        display: "inline-block",
        backgroundColor: isPrimary ? brandColors.charcoal.DEFAULT : "transparent",
        color: isPrimary ? brandColors.cream.DEFAULT : brandColors.charcoal.DEFAULT,
        border: `1px solid ${brandColors.charcoal.DEFAULT}`,
        fontFamily: brandFonts.sans,
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        textDecoration: "none",
        padding: "14px 32px",
        borderRadius: "0px",
        lineHeight: "1",
      }}
    >
      {children}
    </Button>
  );
}
