interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "cream" | "white" | "cream-dark" | "charcoal";
}

export function Section({
  children,
  className = "",
  id,
  background = "cream",
}: SectionProps) {
  const backgrounds = {
    cream: "bg-cream",
    white: "bg-white",
    "cream-dark": "bg-cream-dark marble-texture",
    charcoal: "bg-charcoal text-cream",
  };

  return (
    <section
      id={id}
      className={`px-6 py-20 md:py-28 lg:py-32 overflow-hidden ${backgrounds[background]} ${className}`}
    >
      <div className="relative z-10 mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
