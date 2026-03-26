import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
    </>
  );
}
