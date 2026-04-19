import type { StaticImageData } from "next/image";

import mainLogo200 from "../../assets/logos/generated/mainLogo-200w.png";
import mainLogo320 from "../../assets/logos/generated/mainLogo-320w.png";
import mainLogo480 from "../../assets/logos/generated/mainLogo-480w.png";
import inverseLogo200 from "../../assets/logos/generated/inverseLogo-200w.png";
import inverseLogo320 from "../../assets/logos/generated/inverseLogo-320w.png";
import forkAsset from "../../assets/logos/generated/forkFromLogo-96w.png";
import forkHorizontalAsset from "../../assets/logos/generated/forkFromLogo-horizontal-360w.png";

export type BrandLogoPreset = "header" | "footer" | "hero" | "mobileNav" | "cta";
export type BrandLogoContext = "onLight" | "onDark";

export const BRAND_LOGO_ALT = "Fork & Flower Designs";

const logoByPreset: Record<BrandLogoContext, Record<BrandLogoPreset, StaticImageData>> = {
  onLight: {
    cta: mainLogo200,
    footer: mainLogo320,
    header: mainLogo320,
    mobileNav: mainLogo320,
    hero: mainLogo480,
  },
  onDark: {
    cta: inverseLogo200,
    footer: inverseLogo320,
    header: inverseLogo320,
    mobileNav: inverseLogo320,
    hero: inverseLogo320,
  },
};

export function getLogoForPreset(
  preset: BrandLogoPreset,
  context: BrandLogoContext = "onLight",
): StaticImageData {
  return logoByPreset[context][preset];
}

export function getForkAsset(): StaticImageData {
  return forkAsset;
}

export function getHorizontalForkAsset(): StaticImageData {
  return forkHorizontalAsset;
}
