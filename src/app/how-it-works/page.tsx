import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { HowItWorksSteps } from "@/components/sections/HowItWorksSteps";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Our simple 5-step process to bring your event vision to life. From inquiry to styled perfection.",
};

export default function HowItWorksPage() {
  return (
    <>
      {/* Page Header */}
      <Section background="cream-dark" className="pt-32 md:pt-40">
        <SectionHeading
          title="How It Works"
          subtitle="From vision to styled perfection"
        />
      </Section>

      {/* Steps */}
      <Section background="white">
        <HowItWorksSteps />
      </Section>

      {/* CTA */}
      <Section background="charcoal">
        <div className="text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-cream tracking-wide italic">
            Let&apos;s create a moment you&apos;ll remember
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-gold" />
          <div className="mt-10">
            <Button href="/inquiry" variant="secondary">
              Start Your Inquiry
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
