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
        <div className="mt-12 mx-auto max-w-xl space-y-3 text-center">
          <p className="font-sans text-xs tracking-wider text-charcoal-light">
            A non-refundable booking fee is required to secure your date:
            $100–$250 for standard packages, $250–$400 for premium packages.
          </p>
          <p className="font-sans text-xs tracking-wider text-charcoal-light">
            A designer fee applies to all bookings. Travel / delivery fee may
            apply.
          </p>
        </div>
      </Section>

      {/* CTA */}
      <Section background="cream">
        <div className="text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-charcoal tracking-wide">
            Need Something Custom?
          </h2>
          <p className="mx-auto mt-5 max-w-md font-sans text-sm text-charcoal-light tracking-wider">
            Every event is unique. Contact us for a full pricing guide and custom
            package tailored to your needs.
          </p>
          <div className="mt-8">
            <Button href="/inquiry">Contact for Full Pricing Guide</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
