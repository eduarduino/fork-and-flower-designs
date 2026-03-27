"use client";

import {
  StaggerChildren,
  StaggerItem,
} from "@/components/ui/AnimateIn";
import {
  packageCategories,
  fullHomeExperience,
  type Package,
} from "@/data/packages";

function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <div
      className={`relative flex flex-col h-full p-8 md:p-10 border transition-all duration-300 hover:shadow-lg ${
        pkg.highlighted
          ? "border-gold bg-cream-dark"
          : "border-cream-dark bg-white hover:border-gold/50"
      }`}
    >
      <h3 className="font-serif text-2xl tracking-wide text-charcoal">
        {pkg.name}
      </h3>
      <p className="mt-2 font-sans text-xs tracking-wider text-charcoal-light">
        {pkg.description}
      </p>

      <div className="h-px bg-cream-dark my-6" />

      <ul className="space-y-3 flex-1">
        {pkg.includes.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 font-sans text-xs tracking-wider text-charcoal-light"
          >
            <span className="mt-0.5 text-gold text-sm">✦</span>
            {item}
          </li>
        ))}
      </ul>

      {pkg.perfectFor && (
        <p className="mt-6 font-serif text-sm italic text-charcoal-light/80">
          {pkg.perfectFor}
        </p>
      )}
    </div>
  );
}

export function PackageCards() {
  return (
    <div className="space-y-16">
      {packageCategories.map((category) => (
        <div key={category.category}>
          <h3 className="font-serif text-2xl md:text-3xl text-charcoal tracking-wide text-center mb-10">
            {category.category}
          </h3>
          <StaggerChildren
            className="grid gap-8 md:grid-cols-3"
            staggerDelay={0.15}
          >
            {category.packages.map((pkg) => (
              <StaggerItem key={pkg.name}>
                <PackageCard pkg={pkg} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      ))}

      {/* Full Home Experience */}
      <div>
        <h3 className="font-serif text-2xl md:text-3xl text-charcoal tracking-wide text-center mb-10">
          The Full Home Experience
        </h3>
        <div className="mx-auto max-w-lg">
          <PackageCard pkg={fullHomeExperience} />
        </div>
      </div>
    </div>
  );
}
