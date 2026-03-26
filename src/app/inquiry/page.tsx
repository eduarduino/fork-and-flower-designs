import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InquiryForm } from "@/components/sections/InquiryForm";

export const metadata: Metadata = {
  title: "Inquiry",
  description:
    "Ready to elevate your next gathering? Fill out our inquiry form and we'll get back to you within 48 hours.",
};

export default function InquiryPage() {
  return (
    <>
      {/* Page Header */}
      <Section background="cream-dark" className="pt-32 md:pt-40">
        <SectionHeading
          title="Ready to Elevate Your Next Gathering?"
          subtitle="Tell us about your vision"
        />
      </Section>

      {/* Form */}
      <Section background="white">
        <div className="mx-auto max-w-2xl">
          <InquiryForm />
        </div>
      </Section>
    </>
  );
}
