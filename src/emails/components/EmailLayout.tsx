import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Preview,
} from "@react-email/components";
import type { ReactNode } from "react";
import { brandColors, brandFonts } from "./theme";

interface EmailLayoutProps {
  /** Preview text shown in the inbox list before the body is opened. */
  preview: string;
  children: ReactNode;
}

/**
 * Outer chrome shared by every Fork & Flower email. Sets the brand
 * palette, loads the two Google Fonts used by the site (with safe
 * serif/sans fallbacks for clients that strip web fonts), and renders
 * a centered cream-coloured container at a comfortable max width.
 *
 * All styling is inline (no Tailwind transform): email clients only
 * reliably respect inline styles, and inlining everything here removes
 * a class of "did the class-to-inline transformer run?" questions for
 * audits.
 */
export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />
        <Font
          fontFamily="Cormorant Garamond"
          fallbackFontFamily={["Georgia", "Times New Roman", "serif"]}
          webFont={{
            url: "https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjornFLsS6V7w.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Cormorant Garamond"
          fallbackFontFamily={["Georgia", "Times New Roman", "serif"]}
          webFont={{
            url: "https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjorvFLsS6V7w.woff2",
            format: "woff2",
          }}
          fontWeight={300}
          fontStyle="normal"
        />
        <Font
          fontFamily="Montserrat"
          fallbackFontFamily={["Helvetica", "Arial", "sans-serif"]}
          webFont={{
            url: "https://fonts.gstatic.com/s/montserrat/v30/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXp-p7K4KLg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Montserrat"
          fallbackFontFamily={["Helvetica", "Arial", "sans-serif"]}
          webFont={{
            url: "https://fonts.gstatic.com/s/montserrat/v30/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtroH40aXp-p7K4KLg.woff2",
            format: "woff2",
          }}
          fontWeight={500}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: brandColors.blush.light,
          fontFamily: brandFonts.sans,
          color: brandColors.charcoal.DEFAULT,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <Container
          style={{
            margin: "0 auto",
            width: "100%",
            maxWidth: "640px",
            backgroundColor: brandColors.cream.DEFAULT,
          }}
        >
          {children}
        </Container>
      </Body>
    </Html>
  );
}
