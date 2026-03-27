import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { services } from "@/data/services";
import { ServiceDetailCard } from "@/components/sections/ServiceCard";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Tablescaping, island & buffet styling, floral artistry, prop & decor curation, and premium add-ons for your at-home events.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Page Header */}
      <Section background="cream-dark" className="pt-32 md:pt-40">
        <SectionHeading
          title="Our Services"
          subtitle="Every detail, thoughtfully curated"
        />
      </Section>

      {/* Service Sections */}
      <Section background="white">
        <div className="space-y-20 md:space-y-28">
          {services.map((service, i) => (
            <ServiceDetailCard
              key={service.id}
              service={service}
              index={i}
              reversed={i % 2 !== 0}
            />
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section background="charcoal">
        <div className="text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-cream tracking-wide">
            See Something You Love?
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-gold" />
          <p className="mx-auto mt-6 max-w-md font-sans text-sm leading-relaxed text-cream/60 tracking-wider">
            Let&apos;s discuss how we can tailor our services to your event.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/inquiry" variant="secondary">
              Start Your Inquiry
            </Button>
            <Button href="/packages" variant="outline" className="border-cream/30 text-cream hover:bg-cream hover:text-charcoal">
              View Packages
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
