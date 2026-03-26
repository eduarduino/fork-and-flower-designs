"use client";

import { AnimateIn } from "@/components/ui/AnimateIn";
import type { Service } from "@/data/services";

interface ServicePreviewCardProps {
  service: Service;
  index: number;
}

export function ServicePreviewCard({ service, index }: ServicePreviewCardProps) {
  return (
    <AnimateIn delay={index * 0.1}>
      <div className="group cursor-pointer">
        {/* Image placeholder */}
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-lg text-charcoal-light/30 italic">
              {service.title}
            </span>
          </div>
          <div className="absolute inset-0 bg-charcoal/0 transition-all duration-500 group-hover:bg-charcoal/10" />
        </div>

        {/* Content */}
        <div className="mt-5">
          <h3 className="font-serif text-xl tracking-wide text-charcoal">
            {service.title}
          </h3>
          <p className="mt-2 font-sans text-xs leading-relaxed text-charcoal-light tracking-wider">
            {service.description}
          </p>
        </div>
      </div>
    </AnimateIn>
  );
}

interface ServiceDetailCardProps {
  service: Service;
  index: number;
  reversed?: boolean;
}

export function ServiceDetailCard({
  service,
  index,
  reversed = false,
}: ServiceDetailCardProps) {
  return (
    <div
      className={`flex flex-col gap-8 md:gap-14 ${
        reversed ? "md:flex-row-reverse" : "md:flex-row"
      } items-center`}
    >
      {/* Image */}
      <AnimateIn
        className="w-full md:w-1/2"
        direction={reversed ? "right" : "left"}
        delay={index * 0.1}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-lg text-charcoal-light/30 italic">
              {service.title}
            </span>
          </div>
        </div>
      </AnimateIn>

      {/* Content */}
      <AnimateIn
        className="w-full md:w-1/2"
        direction={reversed ? "left" : "right"}
        delay={index * 0.1 + 0.1}
      >
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold">
          0{index + 1}
        </span>
        <h3 className="mt-3 font-serif text-2xl md:text-3xl tracking-wide text-charcoal font-light">
          {service.title}
        </h3>
        <div className="mt-3 h-px w-10 bg-gold" />
        <p className="mt-5 font-sans text-sm leading-relaxed text-charcoal-light tracking-wider">
          {service.description}
        </p>
      </AnimateIn>
    </div>
  );
}
