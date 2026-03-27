"use client";

import {
  StaggerChildren,
  StaggerItem,
} from "@/components/ui/AnimateIn";

const steps = [
  {
    number: "01",
    title: "Submit Your Event Form",
    description:
      "Fill out our event inquiry form with your details — date, event type, guest count, and your styling vision. We'll review and get back to you within 48 hours.",
  },
  {
    number: "02",
    title: "Design & Planning",
    description:
      "We'll connect to discuss your event in detail — colors, theme, must-have elements, and package selection. From there, we create a custom design plan tailored to your gathering.",
  },
  {
    number: "03",
    title: "Day-of Setup",
    description:
      "On the day of your event, we arrive early to transform your space. Every detail is styled and placed with care so everything is picture-perfect before your guests arrive.",
  },
  {
    number: "04",
    title: "Enjoy Your Gathering",
    description:
      "Relax, host, and soak in the moment. Your table is set, your island is styled, and all you need to do is enjoy the people around you.",
  },
  {
    number: "05",
    title: "Breakdown",
    description:
      "After your event, we return to break down and collect all styling elements. You don't have to worry about a thing.",
  },
];

export function HowItWorksSteps() {
  return (
    <StaggerChildren className="mx-auto max-w-2xl" staggerDelay={0.15}>
      {steps.map((step, i) => (
        <StaggerItem key={step.number}>
          <div
            className={`flex gap-6 md:gap-10 ${
              i !== steps.length - 1 ? "pb-12 md:pb-16" : ""
            }`}
          >
            {/* Number + line */}
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl md:text-3xl text-gold font-light">
                {step.number}
              </span>
              {i !== steps.length - 1 && (
                <div className="mt-3 w-px flex-1 bg-gold/20" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <h3 className="font-serif text-xl md:text-2xl tracking-wide text-charcoal">
                {step.title}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-charcoal-light tracking-wider">
                {step.description}
              </p>
            </div>
          </div>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
