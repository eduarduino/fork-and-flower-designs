import { Resend } from "resend";

function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface InquiryData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventDate: string;
  startTime: string;
  eventType: string;
  guestCount: string;
  services: string[];
  packages: string[];
  colorPalette?: string;
  themeOrVibe?: string;
  mustHaveElements?: string;
  addOns?: string[];
  foodOnIsland: "yes" | "no";
  acknowledgeBookingFee: true;
  acknowledgeAvailability: true;
  printName: string;
  signature: string;
}

const serviceLabels: Record<string, string> = {
  tablescape: "Tablescape Styling",
  "island-buffet": "Island / Buffet Styling",
};

export async function sendOwnerNotification(data: InquiryData) {
  const resend = getResendClient();
  const fullName = `${data.firstName} ${data.lastName}`;
  const packageList = data.packages.join(", ");
  const serviceList = data.services.map(s => serviceLabels[s] || s).join(", ");
  const addOnList = data.addOns?.length ? data.addOns.join(", ") : "None";

  console.log("Sending owner notification to:", process.env.BUSINESS_EMAIL);
  console.log("From:", process.env.FROM_EMAIL);
  const ownerResult = await resend.emails.send({
    from: process.env.FROM_EMAIL || "Fork & Flower <noreply@forkandflower.com>",
    to: process.env.BUSINESS_EMAIL || "",
    subject: `New Event Inquiry from ${fullName}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #3A320C;">
        <h1 style="color: #C9A96E; font-size: 24px; border-bottom: 1px solid #EBDED4; padding-bottom: 16px;">
          New Event Inquiry
        </h1>

        <h3 style="color: #C9A96E; margin-top: 24px;">Contact Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 160px;">Name:</td><td>${fullName}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${data.phone}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td>${data.email}</td></tr>
        </table>

        <h3 style="color: #C9A96E; margin-top: 24px;">Event Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 160px;">Event Date:</td><td>${data.eventDate}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Start Time:</td><td>${data.startTime}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Event Type:</td><td>${data.eventType}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;"># of Guests:</td><td>${data.guestCount}</td></tr>
        </table>

        <h3 style="color: #C9A96E; margin-top: 24px;">Services &amp; Packages</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 160px;">Services:</td><td>${serviceList}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Packages:</td><td>${packageList}</td></tr>
        </table>

        ${data.colorPalette || data.themeOrVibe || data.mustHaveElements ? `
        <h3 style="color: #C9A96E; margin-top: 24px;">Design Preferences</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${data.colorPalette ? `<tr><td style="padding: 6px 0; font-weight: bold; width: 160px;">Color Palette:</td><td>${data.colorPalette}</td></tr>` : ""}
          ${data.themeOrVibe ? `<tr><td style="padding: 6px 0; font-weight: bold;">Theme/Vibe:</td><td>${data.themeOrVibe}</td></tr>` : ""}
          ${data.mustHaveElements ? `<tr><td style="padding: 6px 0; font-weight: bold;">Must-Haves:</td><td>${data.mustHaveElements}</td></tr>` : ""}
        </table>
        ` : ""}

        <h3 style="color: #C9A96E; margin-top: 24px;">Arrangements</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 160px;">Add-Ons:</td><td>${addOnList}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Food on Island:</td><td>${data.foodOnIsland === "yes" ? "Yes" : "No"}</td></tr>
        </table>

        <h3 style="color: #C9A96E; margin-top: 24px;">Signature</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 160px;">Printed Name:</td><td>${data.printName}</td></tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Signature:</td>
            <td>${data.signature.startsWith("data:image") ? `<img src="${data.signature}" alt="Signature" style="max-width: 300px; height: auto;" />` : `<span style="font-style: italic;">${data.signature}</span>`}</td>
          </tr>
        </table>
      </div>
    `,
  });
  console.log("Owner notification result:", JSON.stringify(ownerResult));
}

export async function sendClientConfirmation(data: InquiryData) {
  const resend = getResendClient();
  const fullName = `${data.firstName} ${data.lastName}`;

  console.log("Sending client confirmation to:", data.email);
  const clientResult = await resend.emails.send({
    from: process.env.FROM_EMAIL || "Fork & Flower <noreply@forkandflower.com>",
    to: data.email,
    subject: "Thank you for your inquiry — Fork & Flower Designs",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #3A320C; background: #FFFFFF;">
        <div style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid #EBDED4;">
          <h1 style="color: #C9A96E; font-size: 28px; margin: 0; letter-spacing: 2px;">Fork & Flower</h1>
          <p style="color: #5C5230; font-size: 12px; letter-spacing: 3px; margin-top: 4px;">D E S I G N S</p>
        </div>
        <div style="padding: 32px 0;">
          <h2 style="font-size: 20px; color: #3A320C;">Thank you, ${fullName}!</h2>
          <p style="line-height: 1.8; color: #5C5230;">
            We've received your event inquiry and are so excited to learn more about your upcoming ${data.eventType.toLowerCase()}.
            Our team will review your details and get back to you within 48 hours.
          </p>
          <p style="line-height: 1.8; color: #5C5230;">
            Please note that a non-refundable booking fee is required to secure your date,
            and this inquiry does not guarantee availability.
          </p>
          <p style="line-height: 1.8; color: #5C5230;">
            In the meantime, feel free to browse our gallery for inspiration.
          </p>
        </div>
        <div style="text-align: center; padding-top: 24px; border-top: 1px solid #EBDED4; color: #5C5230; font-size: 12px;">
          <p>Fork & Flower Designs</p>
          <p style="font-size: 11px; margin-top: 4px;">events@forkandflowerdesigns.com</p>
        </div>
      </div>
    `,
  });
  console.log("Client confirmation result:", JSON.stringify(clientResult));
}
