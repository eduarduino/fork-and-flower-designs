import Image from "next/image";
import { getHorizontalForkAsset } from "@/lib/brand";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  decoration?: "line" | "fork";
  className?: string;
  /**
   * Page intro under the nav: centered column for any title length; fork lines
   * span the same width as the title block.
   */
  pageIntro?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  light = false,
  decoration = "line",
  className = "",
  pageIntro = false,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center" : "text-left";
  const textColor = light ? "text-cream" : "text-charcoal";
  const subtitleColor = light ? "text-cream/70" : "text-charcoal-light";
  const lineColor = light ? "bg-cream/30" : "bg-gold";
  const fork = getHorizontalForkAsset();

  // Source fork asset is very light; `brightness-0` drives it to solid
  // black, then `invert` flips to cream for dark-background headings.
  const forkFilter = light ? "brightness-0 invert" : "brightness-0";

  const rootClasses = [
    alignment,
    pageIntro ? "mb-0" : "mb-10 md:mb-14",
    pageIntro && align === "center"
      ? "mx-auto w-full max-w-3xl md:max-w-4xl"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClasses}>
      <h2
        className={`font-serif text-3xl md:text-4xl lg:text-5xl font-light ${textColor} tracking-wide text-balance`}
      >
        {title}
      </h2>

      {align === "center" && decoration === "line" && (
        <div
          className={`mx-auto mt-5 h-px w-16 ${lineColor}`}
          aria-hidden="true"
        />
      )}

      {align === "center" && decoration === "fork" && (
        <div
          className="mx-auto mt-6 flex w-full max-w-full items-center justify-center gap-4 md:gap-5"
          aria-hidden="true"
        >
          <span className={`h-px min-w-[2rem] flex-1 ${lineColor}`} />
          <Image
            src={fork}
            alt=""
            width={fork.width}
            height={fork.height}
            sizes="(max-width: 768px) 72px, 88px"
            className={`h-auto w-[72px] md:w-[88px] shrink-0 object-contain ${forkFilter}`}
            draggable={false}
          />
          <span className={`h-px min-w-[2rem] flex-1 ${lineColor}`} />
        </div>
      )}

      {subtitle && (
        <p
          className={`mt-6 font-sans text-sm tracking-[0.1em] uppercase ${subtitleColor} text-pretty`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
