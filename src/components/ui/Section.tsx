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
    "cream-dark": "bg-cream-dark",
    charcoal: "bg-charcoal text-cream",
  };

  return (
    <section
      id={id}
      className={`px-6 py-20 md:py-28 lg:py-32 ${backgrounds[background]} ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
