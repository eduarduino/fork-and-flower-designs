import { Link, Section, Text } from "@react-email/components";
import type { InquiryFormData } from "@/lib/schemas/inquiry";
import {
  ADDON_LABELS,
  PACKAGE_LABELS,
  SERVICE_LABELS,
  labelList,
} from "@/lib/inquiry-labels";
import { sampleInquiryTyped } from "./data/sampleInquiry";
import { formatEventDate } from "./lib/format-event-date";
import { EmailLayout } from "./components/EmailLayout";
import { EmailHeader } from "./components/EmailHeader";
import { EmailFooter } from "./components/EmailFooter";
import { EmailHeading } from "./components/EmailHeading";
import {
  InquiryDetailsCard,
  type DetailGroup,
} from "./components/InquiryDetailsCard";
import { SignatureBlock } from "./components/SignatureBlock";
import { brandColors, brandFonts } from "./components/theme";

export interface NewInquiryNotificationEmailProps {
  data: InquiryFormData;
  /**
   * Set to `true` when an inline `cid:signature` PNG attachment is
   * being sent with the message. Drives the `SignatureBlock` render
   * mode.
   */
  hasSignatureAttachment: boolean;
}

export function NewInquiryNotificationEmail({
  data,
  hasSignatureAttachment,
}: NewInquiryNotificationEmailProps) {
  const fullName = `${data.firstName} ${data.lastName}`;
  const services = labelList(data.services, SERVICE_LABELS, "—");
  const packages = labelList(data.packages, PACKAGE_LABELS, "—");
  const addOns = labelList(data.addOns, ADDON_LABELS, "None");
  const foodOnIsland = data.foodOnIsland === "yes" ? "Yes" : "No";

  const hasDesignPrefs = Boolean(
    data.colorPalette || data.themeOrVibe || data.mustHaveElements,
  );

  const contactGroup: DetailGroup = {
    title: "Contact Information",
    rows: [
      { label: "Name", value: fullName },
      {
        label: "Email",
        value: (
          <Link
            href={`mailto:${data.email}`}
            style={{
              color: brandColors.gold.dark,
              textDecoration: "none",
            }}
          >
            {data.email}
          </Link>
        ),
      },
      {
        label: "Phone",
        value: (
          <Link
            href={`tel:${data.phone.replace(/[^\d+]/g, "")}`}
            style={{
              color: brandColors.gold.dark,
              textDecoration: "none",
            }}
          >
            {data.phone}
          </Link>
        ),
      },
    ],
  };

  const eventGroup: DetailGroup = {
    title: "Event Details",
    rows: [
      { label: "Event Date", value: formatEventDate(data.eventDate) },
      { label: "Start Time", value: data.startTime },
      { label: "Event Type", value: data.eventType },
      { label: "Guest Count", value: data.guestCount },
    ],
  };

  const servicesGroup: DetailGroup = {
    title: "Services & Packages",
    rows: [
      { label: "Services", value: services },
      { label: "Packages", value: packages },
    ],
  };

  const arrangementsGroup: DetailGroup = {
    title: "Arrangements",
    rows: [
      { label: "Add-Ons", value: addOns },
      { label: "Food on Island", value: foodOnIsland },
    ],
  };

  const designGroup: DetailGroup | null = hasDesignPrefs
    ? {
        title: "Design Preferences",
        rows: [
          ...(data.colorPalette
            ? [{ label: "Color Palette", value: data.colorPalette }]
            : []),
          ...(data.themeOrVibe
            ? [{ label: "Theme / Vibe", value: data.themeOrVibe }]
            : []),
          ...(data.mustHaveElements
            ? [{ label: "Must-Haves", value: data.mustHaveElements }]
            : []),
        ],
      }
    : null;

  const detailGroups: DetailGroup[] = [
    contactGroup,
    eventGroup,
    servicesGroup,
    ...(designGroup ? [designGroup] : []),
    arrangementsGroup,
  ];

  const previewParts = [
    `New inquiry from ${fullName}`,
    `${data.eventType} on ${formatEventDate(data.eventDate)}`,
    `${data.guestCount} guests`,
  ];

  return (
    <EmailLayout preview={previewParts.join(" — ")}>
      <EmailHeader eyebrow="New Event Inquiry" />

      <EmailHeading
        title={fullName}
        subtitle={`${data.eventType} • ${formatEventDate(data.eventDate)}`}
        size="lg"
      />

      <Section style={{ padding: "28px 32px 8px 32px" }}>
        <Text
          style={{
            fontFamily: brandFonts.sans,
            color: brandColors.charcoal.light,
            fontSize: "14px",
            lineHeight: "1.7",
            margin: 0,
            textAlign: "center",
          }}
        >
          Reply to this email to respond directly to{" "}
          <Link
            href={`mailto:${data.email}`}
            style={{
              color: brandColors.gold.dark,
              textDecoration: "none",
            }}
          >
            {data.firstName}
          </Link>
          .
        </Text>
      </Section>

      <Section style={{ padding: "28px 32px 0 32px" }}>
        <InquiryDetailsCard groups={detailGroups} />
      </Section>

      <Section style={{ padding: "28px 32px 40px 32px" }}>
        <Text
          style={{
            fontFamily: brandFonts.sans,
            color: brandColors.gold.dark,
            fontSize: "11px",
            letterSpacing: "0.22em",
            margin: "0 0 12px 0",
            textTransform: "uppercase",
          }}
        >
          Signature
        </Text>
        <div
          style={{
            backgroundColor: brandColors.blush.light,
            border: `1px solid ${brandColors.cream.dark}`,
            padding: "24px 28px",
          }}
        >
          <Text
            style={{
              fontFamily: brandFonts.sans,
              color: brandColors.charcoal.light,
              fontSize: "11px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              margin: "0 0 6px 0",
            }}
          >
            Printed Name
          </Text>
          <Text
            style={{
              fontFamily: brandFonts.sans,
              color: brandColors.charcoal.DEFAULT,
              fontSize: "14px",
              margin: "0 0 18px 0",
            }}
          >
            {data.printName}
          </Text>
          <Text
            style={{
              fontFamily: brandFonts.sans,
              color: brandColors.charcoal.light,
              fontSize: "11px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              margin: "0 0 10px 0",
            }}
          >
            Signature
          </Text>
          <SignatureBlock
            signature={data.signature}
            hasAttachment={hasSignatureAttachment}
          />
        </div>
      </Section>

      <EmailFooter tagline="Inquiry received via forkandflowerdesigns.com" />
    </EmailLayout>
  );
}

// Used by `react-email dev` to populate the preview UI. Default
// preview shows the typed-name signature fallback; for the drawn-PNG
// path, swap to `sampleInquiryDrawn` and flip `hasSignatureAttachment`.
(NewInquiryNotificationEmail as unknown as { PreviewProps: NewInquiryNotificationEmailProps }).PreviewProps = {
  data: sampleInquiryTyped,
  hasSignatureAttachment: false,
};

export default NewInquiryNotificationEmail;
