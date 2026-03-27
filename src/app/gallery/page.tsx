import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { GalleryGrid } from "@/components/sections/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse our portfolio of curated tablescapes, floral arrangements, and styled events.",
};

export default function GalleryPage() {
  return (
    <>
      {/* Page Header */}
      <Section background="cream-dark" className="pt-32 md:pt-40 pb-10 md:pb-12">
        <SectionHeading
          title="Gallery"
          subtitle="A collection of our curated moments"
        />
      </Section>

      {/* Gallery */}
      <Section background="white" className="pt-8 md:pt-10">
        <GalleryGrid />
        <p className="mt-14 text-center font-sans text-xs tracking-wider text-charcoal-light italic">
          Ask for a full gallery when inquiring to see more of our work.
        </p>
      </Section>

      {/* CTA */}
      <Section background="charcoal">
        <div className="text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-cream tracking-wide">
            Love What You See?
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-gold" />
          <p className="mx-auto mt-6 max-w-md font-sans text-sm leading-relaxed text-cream/60 tracking-wider">
            Let&apos;s create something beautiful for your next gathering.
          </p>
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
