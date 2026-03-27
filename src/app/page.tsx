import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { services } from "@/data/services";
import { HeroSection } from "@/components/sections/Hero";
import { ServicePreviewCard } from "@/components/sections/ServiceCard";

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* Decorative Script */}
      <div className="py-8 text-center bg-white">
        <p className="font-serif italic text-xl md:text-2xl text-gold-dark tracking-wide">
          Where flowers meet the table
        </p>
      </div>

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

      {/* Decorative Script */}
      <div className="py-8 text-center bg-cream">
        <p className="font-serif italic text-xl md:text-2xl text-gold-dark tracking-wide">
          Where décor comes to life
        </p>
      </div>

      {/* CTA Section */}
      <Section background="charcoal">
        <div className="text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-cream tracking-wide">
            Let&apos;s Create a Moment
            <br />
            You&apos;ll Remember
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-gold" />
          <p className="mx-auto mt-6 font-serif italic text-lg text-gold-light tracking-wide">
            Petals, plates, &amp; people
          </p>
          <p className="mx-auto mt-4 max-w-lg font-sans text-sm leading-relaxed text-cream/60 tracking-wider">
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
