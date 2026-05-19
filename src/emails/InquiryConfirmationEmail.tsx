import { Section, Text } from "@react-email/components";
import type { InquiryFormData } from "@/lib/schemas/inquiry";
import {
  PACKAGE_LABELS,
  SERVICE_LABELS,
  labelList,
} from "@/lib/inquiry-labels";
import { getEmailBaseUrl } from "@/lib/email-assets";
import { socialLinks } from "@/data/navigation";
import { sampleInquiryTyped } from "./data/sampleInquiry";
import { formatEventDate } from "./lib/format-event-date";
import { EmailLayout } from "./components/EmailLayout";
import { EmailHeader } from "./components/EmailHeader";
import { EmailFooter } from "./components/EmailFooter";
import { EmailHeading } from "./components/EmailHeading";
import { EmailButton } from "./components/EmailButton";
import {
  InquiryDetailsCard,
  type DetailRow,
} from "./components/InquiryDetailsCard";
import { brandColors, brandFonts } from "./components/theme";

export interface InquiryConfirmationEmailProps {
  data: InquiryFormData;
  /**
   * Base URL used for the CTA link. Defaults to the resolved env value
   * so the template still renders sensibly in the preview server.
   */
  siteBaseUrl?: string;
}

export function InquiryConfirmationEmail({
  data,
  siteBaseUrl,
}: InquiryConfirmationEmailProps) {
  const base = siteBaseUrl ?? getEmailBaseUrl();
  const firstName = data.firstName;
  const eventTypeLower = data.eventType.toLowerCase();

  const rows: DetailRow[] = [
    { label: "Event Type", value: data.eventType },
    { label: "Date", value: formatEventDate(data.eventDate) },
    { label: "Start Time", value: data.startTime },
    { label: "Guest Count", value: data.guestCount },
    {
      label: "Services",
      value: labelList(data.services, SERVICE_LABELS, "—"),
    },
    {
      label: "Packages",
      value: labelList(data.packages, PACKAGE_LABELS, "—"),
    },
  ];

  return (
    <EmailLayout
      preview={`Thank you, ${firstName} — we've received your inquiry and will be in touch within 48 hours.`}
    >
      <EmailHeader />

      <EmailHeading
        title={`Thank you, ${firstName}.`}
        subtitle="Your inquiry has been received"
        size="xl"
      />

      <Section style={{ padding: "32px 32px 8px 32px" }}>
        <Text
          style={{
            fontFamily: brandFonts.sans,
            color: brandColors.charcoal.light,
            fontSize: "15px",
            lineHeight: "1.8",
            margin: 0,
          }}
        >
          We&rsquo;re so glad you&rsquo;ve reached out. Your details for the
          upcoming {eventTypeLower} are now with our team — we&rsquo;ll review
          them carefully and reply personally within{" "}
          <strong style={{ color: brandColors.charcoal.DEFAULT }}>
            48 hours
          </strong>
          .
        </Text>
        <Text
          style={{
            fontFamily: brandFonts.sans,
            color: brandColors.charcoal.light,
            fontSize: "15px",
            lineHeight: "1.8",
            margin: "18px 0 0 0",
          }}
        >
          A gentle reminder: a non&#8209;refundable booking fee is required to
          secure your date, and this inquiry does not guarantee availability.
          We&rsquo;ll confirm both as soon as we&rsquo;ve had a chance to look
          over your event.
        </Text>
      </Section>

      <Section style={{ padding: "32px 32px 8px 32px" }}>
        <InquiryDetailsCard
          eyebrow="Your inquiry at a glance"
          groups={[{ title: "Event", rows }]}
        />
      </Section>

      <Section
        style={{
          padding: "40px 32px 48px 32px",
          textAlign: "center",
        }}
      >
        <Text
          style={{
            fontFamily: brandFonts.sans,
            color: brandColors.charcoal.light,
            fontSize: "14px",
            lineHeight: "1.7",
            margin: "0 0 22px 0",
            textAlign: "center",
          }}
        >
          In the meantime, take a moment to wander through our recent work for
          a little inspiration.
        </Text>
        <EmailButton href={`${base}/gallery`}>Browse the Gallery</EmailButton>
      </Section>

      <EmailFooter instagramUrl={socialLinks.instagram} />
    </EmailLayout>
  );
}

// Used by `react-email dev` to populate the preview UI. Has no effect
// at runtime — the production send always passes real props from
// `src/lib/email.ts`.
(InquiryConfirmationEmail as unknown as {
  PreviewProps: InquiryConfirmationEmailProps;
}).PreviewProps = {
  data: sampleInquiryTyped,
  siteBaseUrl: "http://localhost:3000",
};

export default InquiryConfirmationEmail;
