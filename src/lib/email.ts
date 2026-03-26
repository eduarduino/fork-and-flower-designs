import { Resend } from "resend";

function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface InquiryData {
  name: string;
  email: string;
  phone?: string;
  eventType: string;
  eventDate?: string;
  guestCount?: string;
  services: string[];
  referralSource?: string;
  details?: string;
}

export async function sendOwnerNotification(data: InquiryData) {
  const resend = getResendClient();
  const serviceList = data.services.join(", ");

  await resend.emails.send({
    from: process.env.FROM_EMAIL || "Fork & Flower <noreply@forkandflower.com>",
    to: process.env.BUSINESS_EMAIL || "",
    subject: `New Inquiry from ${data.name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #2C2C2C;">
        <h1 style="color: #C9A96E; font-size: 24px; border-bottom: 1px solid #E8D5C4; padding-bottom: 16px;">
          New Inquiry Received
        </h1>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Name:</td><td>${data.name}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${data.email}</td></tr>
          ${data.phone ? `<tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>${data.phone}</td></tr>` : ""}
          <tr><td style="padding: 8px 0; font-weight: bold;">Event Type:</td><td>${data.eventType}</td></tr>
          ${data.eventDate ? `<tr><td style="padding: 8px 0; font-weight: bold;">Event Date:</td><td>${data.eventDate}</td></tr>` : ""}
          ${data.guestCount ? `<tr><td style="padding: 8px 0; font-weight: bold;">Guest Count:</td><td>${data.guestCount}</td></tr>` : ""}
          <tr><td style="padding: 8px 0; font-weight: bold;">Services:</td><td>${serviceList}</td></tr>
          ${data.referralSource ? `<tr><td style="padding: 8px 0; font-weight: bold;">Referral:</td><td>${data.referralSource}</td></tr>` : ""}
        </table>
        ${data.details ? `<div style="margin-top: 20px; padding: 16px; background: #FAF7F2; border-left: 3px solid #C9A96E;"><strong>Additional Details:</strong><br/>${data.details}</div>` : ""}
      </div>
    `,
  });
}

export async function sendClientConfirmation(data: InquiryData) {
  const resend = getResendClient();

  await resend.emails.send({
    from: process.env.FROM_EMAIL || "Fork & Flower <noreply@forkandflower.com>",
    to: data.email,
    subject: "Thank you for your inquiry — Fork & Flower Designs",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #2C2C2C; background: #FAF7F2;">
        <div style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid #E8D5C4;">
          <h1 style="color: #C9A96E; font-size: 28px; margin: 0; letter-spacing: 2px;">Fork & Flower</h1>
          <p style="color: #4A4A4A; font-size: 12px; letter-spacing: 3px; margin-top: 4px;">D E S I G N S</p>
        </div>
        <div style="padding: 32px 0;">
          <h2 style="font-size: 20px; color: #2C2C2C;">Thank you, ${data.name}!</h2>
          <p style="line-height: 1.8; color: #4A4A4A;">
            We've received your inquiry and are excited to learn more about your upcoming ${data.eventType.toLowerCase()}.
            Our team will review your details and get back to you within 48 hours.
          </p>
          <p style="line-height: 1.8; color: #4A4A4A;">
            In the meantime, feel free to browse our gallery for inspiration.
          </p>
        </div>
        <div style="text-align: center; padding-top: 24px; border-top: 1px solid #E8D5C4; color: #4A4A4A; font-size: 12px;">
          <p>Fork & Flower Designs</p>
        </div>
      </div>
    `,
  });
}
