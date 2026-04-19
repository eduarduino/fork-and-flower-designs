import Image from "next/image";
import Link from "next/link";
import {
  BRAND_LOGO_ALT,
  getLogoForPreset,
  type BrandLogoContext,
  type BrandLogoPreset,
} from "@/lib/brand";

/**
 * Explicit heights only — `w-auto` + `object-contain` shows the full
 * transparent asset at the chosen height.
 */
const presetClasses: Record<BrandLogoPreset, string> = {
  header:
    "h-14 min-[400px]:h-16 sm:h-[4.25rem] md:h-[4.75rem] lg:h-20 w-auto",
  footer: "h-20 w-auto sm:h-24 md:h-28",
  hero: "h-32 w-auto sm:h-40 md:h-48 lg:h-56",
  mobileNav: "h-[4.5rem] w-auto sm:h-20",
  cta: "h-12 w-auto sm:h-14 md:h-16",
};

const presetSizes: Record<BrandLogoPreset, string> = {
  header:
    "(max-width: 480px) 56px, (max-width: 640px) 68px, (max-width: 768px) 76px, (max-width: 1024px) 80px, 80px",
  footer: "(max-width: 640px) 80px, (max-width: 768px) 96px, 112px",
  hero: "(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 224px",
  mobileNav: "(max-width: 640px) 72px, 80px",
  cta: "(max-width: 640px) 48px, (max-width: 768px) 56px, 64px",
};

const presetLinkClasses: Record<BrandLogoPreset, string> = {
  header: "mr-3 min-[400px]:mr-4 sm:mr-6 md:mr-8 lg:mr-10 -translate-x-px",
  footer: "",
  hero: "",
  mobileNav: "",
  cta: "",
};

export interface BrandLogoProps {
  preset: BrandLogoPreset;
  context?: BrandLogoContext;
  /** Use for above-the-fold marks (header, hero) to improve LCP */
  priority?: boolean;
  className?: string;
}

export function BrandLogo({
  preset,
  context = "onLight",
  priority = false,
  className,
}: BrandLogoProps) {
  const src = getLogoForPreset(preset, context);
  const onDark = context === "onDark";

  return (
    <Link
      href="/"
      className={[
        "group inline-flex max-w-full shrink-0 items-center outline-offset-4 transition-opacity duration-300",
        "",
        presetLinkClasses[preset],
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src={src}
        alt=""
        width={src.width}
        height={src.height}
        priority={priority}
        sizes={presetSizes[preset]}
        className={[
          "pointer-events-none block w-auto max-w-full object-contain object-center",
          presetClasses[preset],
        ]
          .filter(Boolean)
          .join(" ")}
        draggable={false}
      />
      <span className="sr-only">{BRAND_LOGO_ALT}</span>
    </Link>
  );
}
