interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "cream" | "white" | "cream-dark" | "charcoal";
  /** Cream title strip under the nav: fixed top/bottom padding, no default section py. */
  pageHeader?: boolean;
  /** First content section after `pageHeader`: extra top padding so the body sits lower. */
  contentAfterPageHeader?: boolean;
}

export function Section({
  children,
  className = "",
  id,
  background = "cream",
  pageHeader = false,
  contentAfterPageHeader = false,
}: SectionProps) {
  const backgrounds = {
    cream: "bg-cream",
    white: "bg-white",
    "cream-dark": "bg-cream-dark marble-texture",
    charcoal: "bg-charcoal text-cream",
  };

  const padding = pageHeader
    ? "px-6 pt-32 md:pt-40 pb-28 md:pb-36 lg:pb-44"
    : contentAfterPageHeader
      ? "px-6 pt-20 md:pt-28 lg:pt-32 pb-14 md:pb-20 lg:pb-24"
      : "px-6 py-14 md:py-20 lg:py-24";

  return (
    <section
      id={id}
      className={`overflow-hidden ${padding} ${backgrounds[background]} ${className}`}
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}
