import type { StaticImageData } from "next/image";

import mainLogo320 from "../../assets/logos/generated/mainLogo-320w.png";
import mainLogo480 from "../../assets/logos/generated/mainLogo-480w.png";
import inverseLogo320 from "../../assets/logos/generated/inverseLogo-320w.png";
import forkAsset from "../../assets/logos/generated/forkFromLogo-96w.png";
import forkHorizontalAsset from "../../assets/logos/generated/forkFromLogo-horizontal-360w.png";

export type BrandLogoPreset = "header" | "footer" | "hero" | "mobileNav";

export const BRAND_LOGO_ALT = "Fork & Flower Designs";

// Each preset renders in exactly one fixed context (light vs. dark
// background), so the source asset is keyed by preset alone.
const logoByPreset: Record<BrandLogoPreset, StaticImageData> = {
  header: mainLogo320,
  footer: inverseLogo320,
  hero: mainLogo480,
  mobileNav: mainLogo320,
};

export function getLogoForPreset(preset: BrandLogoPreset): StaticImageData {
  return logoByPreset[preset];
}

export function getForkAsset(): StaticImageData {
  return forkAsset;
}

export function getHorizontalForkAsset(): StaticImageData {
  return forkHorizontalAsset;
}
