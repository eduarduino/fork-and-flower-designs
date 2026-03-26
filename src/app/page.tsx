import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { services } from "@/data/services";
import { HeroSection } from "@/components/sections/Hero";
import { ServicePreviewCard } from "@/components/sections/ServiceCard";
import { GalleryTeaser } from "@/components/sections/GalleryTeaser";

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Services Preview */}
      <Section background="white">
        <SectionHeading
          title="Our Services"
          subtitle="Elevating every detail of your gathering"
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 3).map((service, i) => (
            <ServicePreviewCard key={service.id} service={service} index={i} />
          ))}
        </div>
        <div className="mt-14 text-center">
          <Button href="/services" variant="outline">
            Explore All Services
          </Button>
        </div>
      </Section>

      {/* Gallery Teaser */}
      <Section background="cream">
        <SectionHeading
          title="A Glimpse of Our Work"
          subtitle="Curated moments, beautifully styled"
        />
        <GalleryTeaser />
        <div className="mt-14 text-center">
          <Button href="/gallery" variant="outline">
            View Full Gallery
          </Button>
        </div>
      </Section>

      {/* CTA Section */}
      <Section background="charcoal">
        <div className="text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-cream tracking-wide">
            Let&apos;s Create a Moment
            <br />
            You&apos;ll Remember
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-gold" />
          <p className="mx-auto mt-8 max-w-lg font-sans text-sm leading-relaxed text-cream/60 tracking-wider">
            Ready to transform your next gathering into an unforgettable
            experience? We&apos;d love to hear about your vision.
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
