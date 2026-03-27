"use client";

import { AnimateIn } from "@/components/ui/AnimateIn";

export function AboutContent() {
  return (
    <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
      {/* Photo placeholder */}
      <AnimateIn className="w-full md:w-5/12" direction="left">
        <div className="relative aspect-[3/4] overflow-hidden bg-cream-dark">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-lg text-charcoal-light/30 italic">
              Designer Photo
            </span>
          </div>
        </div>
      </AnimateIn>

      {/* Bio */}
      <AnimateIn className="w-full md:w-7/12" direction="right" delay={0.15}>
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold">
          The Designer
        </span>
        <h3 className="mt-3 font-serif text-3xl md:text-4xl tracking-wide text-charcoal font-light">
          Meet the Creative Behind
          <br />
          Fork & Flower
        </h3>
        <div className="mt-4 h-px w-10 bg-gold" />
        <div className="mt-6 space-y-4 font-sans text-sm leading-relaxed text-charcoal-light tracking-wider">
          <p>
            I&apos;ve always been drawn to creating things — whether it was
            rearranging a room, styling a table for a dinner party, or putting
            together a beautiful spread for friends and family. Flowers, food,
            and gathering have always been at the center of how I show love.
          </p>
          <p>
            Fork &amp; Flower started as a passion project — a way to combine my
            love for floral design, tablescaping, and entertaining into
            something meaningful. What began as styling my own events quickly
            turned into something bigger when friends and family started asking
            me to bring that same magic to their gatherings.
          </p>
          <p>
            Based in New Jersey, I work with clients throughout the surrounding
            areas to bring their entertaining visions to life, one curated table
            at a time.
          </p>
        </div>
      </AnimateIn>
    </div>
  );
}
