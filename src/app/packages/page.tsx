import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PackageCards } from "@/components/sections/PackageCards";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Explore our curated event styling packages. From intimate gatherings to grand celebrations.",
};

export default function PackagesPage() {
  return (
    <>
      {/* Page Header */}
      <Section background="cream-dark" className="pt-32 md:pt-40">
        <SectionHeading
          title="Packages"
          subtitle="Curated tiers for every occasion"
        />
      </Section>

      {/* Package Cards */}
      <Section background="white">
        <PackageCards />
      </Section>

      {/* CTA */}
      <Section background="charcoal">
        <div className="text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-cream tracking-wide">
            Need Something Custom?
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-gold" />
          <p className="mx-auto mt-6 max-w-md font-sans text-sm leading-relaxed text-cream/60 tracking-wider">
            Every event is unique. Contact us for a full pricing guide and custom
            package tailored to your needs.
          </p>
          <div className="mt-10">
            <Button href="/inquiry" variant="secondary">
              Contact for Full Pricing Guide
            </Button>
          </div>
          <div className="mx-auto mt-12 max-w-lg space-y-2">
            <p className="font-sans text-[10px] tracking-[0.12em] uppercase text-cream/40">
              A non-refundable styling fee of $100–$250 (smaller events) or
              $250–$400 (premium setups) secures your date and covers design
              time, planning, and floral sourcing.
            </p>
            <p className="font-sans text-[10px] tracking-[0.12em] uppercase text-cream/40">
              A designer fee also applies. Travel / delivery fee may apply.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
