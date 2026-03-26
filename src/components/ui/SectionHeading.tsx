interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center" : "text-left";
  const textColor = light ? "text-cream" : "text-charcoal";
  const subtitleColor = light ? "text-cream/70" : "text-charcoal-light";
  const lineColor = light ? "bg-cream/30" : "bg-gold";

  return (
    <div className={`${alignment} mb-14 md:mb-20`}>
      <h2
        className={`font-serif text-3xl md:text-4xl lg:text-5xl font-light ${textColor} tracking-wide`}
      >
        {title}
      </h2>
      {align === "center" && (
        <div
          className={`mx-auto mt-5 h-px w-16 ${lineColor}`}
          aria-hidden="true"
        />
      )}
      {subtitle && (
        <p
          className={`mt-5 font-sans text-sm tracking-[0.1em] uppercase ${subtitleColor}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
