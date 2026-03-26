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
            With a lifelong passion for design and a deep love for bringing
            people together, I founded Fork & Flower Designs to merge two of my
            greatest joys — creating beautiful spaces and celebrating life&apos;s
            moments.
          </p>
          <p>
            Every event I style is a reflection of intentional design — from the
            curve of a floral stem to the texture of a linen napkin. I believe
            that the details are what transform a gathering into a memory.
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
