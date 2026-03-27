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
            Fork &amp; Flower is a mobile event-decorating service, based in New
            Jersey, that specializes in creating beautiful, floral-forward
            tablescapes and island styling for intimate at-home gatherings.
          </p>
          <div className="mx-auto mt-8 h-px w-16 bg-gold" />
          <p className="mt-8 font-sans text-sm leading-relaxed text-charcoal-light tracking-wider">
            We bring the design, the florals, and the styling to you — so all
            you have to do is gather, celebrate, and enjoy. Whether it&apos;s a
            birthday dinner, a holiday gathering, or a shower, we transform your
            space into something warm, elevated, and unforgettable.
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
