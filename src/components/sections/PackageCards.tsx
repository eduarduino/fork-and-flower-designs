"use client";

import {
  StaggerChildren,
  StaggerItem,
} from "@/components/ui/AnimateIn";
import { packages } from "@/data/packages";

export function PackageCards() {
  return (
    <StaggerChildren
      className="grid gap-8 md:grid-cols-3"
      staggerDelay={0.15}
    >
      {packages.map((pkg) => (
        <StaggerItem key={pkg.name}>
          <div
            className={`relative flex flex-col h-full p-8 md:p-10 border transition-all duration-300 hover:shadow-lg ${
              pkg.highlighted
                ? "border-gold bg-cream-dark"
                : "border-cream-dark bg-white hover:border-gold/50"
            }`}
          >
            {pkg.highlighted && (
              <span className="absolute -top-3 left-8 bg-gold text-charcoal font-sans text-[9px] tracking-[0.2em] uppercase px-3 py-1">
                Most Popular
              </span>
            )}

            <h3 className="font-serif text-2xl tracking-wide text-charcoal">
              {pkg.name}
            </h3>
            <p className="mt-2 font-sans text-xs tracking-wider text-charcoal-light">
              {pkg.description}
            </p>

            <div className="mt-5 mb-6">
              <span className="font-serif text-lg text-gold italic">
                {pkg.startingAt}
              </span>
            </div>

            <div className="h-px bg-cream-dark mb-6" />

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
          </div>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
