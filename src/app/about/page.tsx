import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { AboutContent } from "@/components/sections/AboutContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the designer behind Fork & Flower Designs. Curated event styling rooted in creativity and a love for beautiful gatherings.",
};

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <Section background="cream-dark" className="pt-32 md:pt-40">
        <SectionHeading
          title="About Fork & Flower"
          subtitle="Where creativity meets celebration"
        />
      </Section>

      {/* Brand Story */}
      <Section background="white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-xl md:text-2xl leading-relaxed text-charcoal font-light tracking-wide">
            Fork & Flower Designs is a mobile custom event service dedicated to
            creating curated tables and serving islands for at-home events —
            blending florals, props, and decor into elevated, ready-to-serve
            moments.
          </p>
          <div className="mx-auto mt-8 h-px w-16 bg-gold" />
          <p className="mt-8 font-sans text-sm leading-relaxed text-charcoal-light tracking-wider">
            We believe that every gathering, no matter the size, deserves to feel
            intentional and beautiful. From intimate dinner parties to milestone
            celebrations, we bring the artistry so you can focus on what matters
            most — the people around your table.
          </p>
        </div>
      </Section>

      {/* The Designer */}
      <Section background="cream">
        <AboutContent />
      </Section>

      {/* CTA */}
      <Section background="cream-dark">
        <div className="text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-charcoal tracking-wide">
            Ready to Collaborate?
          </h2>
          <p className="mx-auto mt-5 max-w-md font-sans text-sm text-charcoal-light tracking-wider">
            We&apos;d love to hear about your next event and how we can bring your
            vision to life.
          </p>
          <div className="mt-8">
            <Button href="/inquiry">Start Your Inquiry</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
