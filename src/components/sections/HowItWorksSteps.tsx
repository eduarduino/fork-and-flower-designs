"use client";

import {
  StaggerChildren,
  StaggerItem,
} from "@/components/ui/AnimateIn";

const steps = [
  {
    number: "01",
    title: "Reach Out",
    description:
      "Fill out our inquiry form to share your vision, event date, and what you're looking for. We'll get back to you within 48 hours.",
  },
  {
    number: "02",
    title: "Consultation",
    description:
      "We'll schedule a call or meet to discuss your style, event details, and how we can bring your vision to life.",
  },
  {
    number: "03",
    title: "Design & Curation",
    description:
      "We'll curate a custom design plan — selecting florals, linens, decor, and styling elements tailored to your event.",
  },
  {
    number: "04",
    title: "Setup & Styling",
    description:
      "On the day, our team arrives to transform your space. Relax and enjoy while we handle every detail.",
  },
  {
    number: "05",
    title: "Celebrate",
    description:
      "Gather around a beautifully styled table and create moments worth remembering. We handle breakdown too.",
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
