import { Resend } from "resend";
import type { InquiryFormData } from "@/lib/schemas/inquiry";
import {
  serviceOptions,
  packageOptions,
  addOnOptions,
} from "@/lib/schemas/inquiry";

function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not configured");
  return new Resend(key);
}

export function canSendToArbitraryRecipients(): boolean {
  if (process.env.FORCE_CLIENT_CONFIRMATION === "true") return true;
  const from = process.env.FROM_EMAIL ?? "";
  return from.length > 0 && !from.includes("resend.dev");
}

/**
 * Escape any string that will be interpolated into an HTML email body.
 * All customer-supplied fields must pass through this before hitting a
 * template literal — otherwise a crafted first name like `<img onerror=...>`
 * would execute in the recipient's mail client.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Email headers (Subject, From, To, Reply-To) must not contain CR/LF —
 * otherwise an attacker could inject additional headers. Schema already
 * restricts these fields, but we strip defensively.
 */
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

const SERVICE_LABELS: Record<string, string> = Object.fromEntries(
  serviceOptions.map((s) => [s.value, s.label])
);
const PACKAGE_LABELS: Record<string, string> = Object.fromEntries(
  packageOptions.map((p) => [p.value, p.label])
);
const ADDON_LABELS: Record<string, string> = Object.fromEntries(
  addOnOptions.map((a) => [a.value, a.label])
);

function labelList(
  values: readonly string[] | undefined,
  map: Record<string, string>,
  fallback = "None"
): string {
  if (!values || values.length === 0) return fallback;
  return values.map((v) => map[v] ?? v).join(", ");
}

const SIGNATURE_DATAURL_PREFIX = "data:image/png;base64,";
// Hardcoded — never derived from user input, so there is no CID injection
// surface. Keep as a plain token; Resend wraps it as <cid> over the wire.
const SIGNATURE_CID = "signature";
// PNG signature per RFC 2083 §3.1. Verifying these eight bytes after base64
// decode is the real content-type check — the `data:image/png;base64,`
// prefix is attacker-controlled and only tells us how to *decode*.
const PNG_MAGIC = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

type SignatureAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
  inlineContentId: string;
};

/**
 * Decode a signature data URL into an inline PNG attachment, or return null
 * if the payload is not a data URL or fails PNG verification. Caller passes
 * `null` through to renderSignatureCell so the email still sends with a
 * placeholder — we do not leak base64 into the HTML body under any path.
 */
function buildSignatureAttachment(
  signature: string
): SignatureAttachment | null {
  if (!signature.startsWith(SIGNATURE_DATAURL_PREFIX)) return null;
  const base64 = signature.slice(SIGNATURE_DATAURL_PREFIX.length);

  let buf: Buffer;
  try {
    buf = Buffer.from(base64, "base64");
  } catch {
    return null;
  }

  if (buf.length < PNG_MAGIC.length) return null;
  if (!buf.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) return null;

  return {
    filename: "signature.png",
    content: buf,
    contentType: "image/png",
    inlineContentId: SIGNATURE_CID,
  };
}

function renderSignatureCell(
  signature: string,
  hasAttachment: boolean
): string {
  // Schema guarantees either a data:image/png;base64,<base64> URL or a
  // plain name string. Anything else would have failed validation.
  if (signature.startsWith(SIGNATURE_DATAURL_PREFIX)) {
    if (hasAttachment) {
      return `<img src="cid:${SIGNATURE_CID}" alt="Signature" style="max-width: 300px; height: auto;" />`;
    }
    return `<span style="font-style: italic; color: #b45309;">[Signature image could not be embedded]</span>`;
  }
  return `<span style="font-style: italic;">${escapeHtml(signature)}</span>`;
}

export async function sendOwnerNotification(data: InquiryFormData) {
  const resend = getResendClient();
  const fullName = `${data.firstName} ${data.lastName}`;
  const eFullName = escapeHtml(fullName);
  const ePhone = escapeHtml(data.phone);
  const eEmail = escapeHtml(data.email);
  const eEventDate = escapeHtml(data.eventDate);
  const eStartTime = escapeHtml(data.startTime);
  const eEventType = escapeHtml(data.eventType);
  const eGuestCount = escapeHtml(data.guestCount);
  const eServices = escapeHtml(labelList(data.services, SERVICE_LABELS, "—"));
  const ePackages = escapeHtml(labelList(data.packages, PACKAGE_LABELS, "—"));
  const eAddOns = escapeHtml(labelList(data.addOns, ADDON_LABELS, "None"));
  const eColor = data.colorPalette ? escapeHtml(data.colorPalette) : "";
  const eTheme = data.themeOrVibe ? escapeHtml(data.themeOrVibe) : "";
  const eMustHaves = data.mustHaveElements
    ? escapeHtml(data.mustHaveElements)
    : "";
  const ePrintName = escapeHtml(data.printName);

  const from = process.env.FROM_EMAIL;
  const to = process.env.BUSINESS_EMAIL;
  if (!from) throw new Error("FROM_EMAIL is not configured");
  if (!to) throw new Error("BUSINESS_EMAIL is not configured");

  const signatureAttachment = buildSignatureAttachment(data.signature);

  const ownerResult = await resend.emails.send({
    from: sanitizeHeaderValue(from),
    to: sanitizeHeaderValue(to),
    replyTo: sanitizeHeaderValue(data.email),
    subject: sanitizeHeaderValue(`New Event Inquiry from ${fullName}`),
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #3A320C;">
        <h1 style="color: #C9A96E; font-size: 24px; border-bottom: 1px solid #EBDED4; padding-bottom: 16px;">
          New Event Inquiry
        </h1>

        <h3 style="color: #C9A96E; margin-top: 24px;">Contact Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 160px;">Name:</td><td>${eFullName}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${ePhone}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td>${eEmail}</td></tr>
        </table>

        <h3 style="color: #C9A96E; margin-top: 24px;">Event Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 160px;">Event Date:</td><td>${eEventDate}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Start Time:</td><td>${eStartTime}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Event Type:</td><td>${eEventType}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;"># of Guests:</td><td>${eGuestCount}</td></tr>
        </table>

        <h3 style="color: #C9A96E; margin-top: 24px;">Services &amp; Packages</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 160px;">Services:</td><td>${eServices}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Packages:</td><td>${ePackages}</td></tr>
        </table>

        ${eColor || eTheme || eMustHaves ? `
        <h3 style="color: #C9A96E; margin-top: 24px;">Design Preferences</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${eColor ? `<tr><td style="padding: 6px 0; font-weight: bold; width: 160px;">Color Palette:</td><td>${eColor}</td></tr>` : ""}
          ${eTheme ? `<tr><td style="padding: 6px 0; font-weight: bold;">Theme/Vibe:</td><td>${eTheme}</td></tr>` : ""}
          ${eMustHaves ? `<tr><td style="padding: 6px 0; font-weight: bold;">Must-Haves:</td><td>${eMustHaves}</td></tr>` : ""}
        </table>
        ` : ""}

        <h3 style="color: #C9A96E; margin-top: 24px;">Arrangements</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 160px;">Add-Ons:</td><td>${eAddOns}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Food on Island:</td><td>${data.foodOnIsland === "yes" ? "Yes" : "No"}</td></tr>
        </table>

        <h3 style="color: #C9A96E; margin-top: 24px;">Signature</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 160px;">Printed Name:</td><td>${ePrintName}</td></tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Signature:</td>
            <td>${renderSignatureCell(data.signature, signatureAttachment !== null)}</td>
          </tr>
        </table>
      </div>
    `,
    attachments: signatureAttachment ? [signatureAttachment] : undefined,
  });
  if (ownerResult.error) throw new Error(ownerResult.error.message);
}

export async function sendClientConfirmation(data: InquiryFormData) {
  const resend = getResendClient();
  const eFullName = escapeHtml(`${data.firstName} ${data.lastName}`);
  const eEventType = escapeHtml(data.eventType.toLowerCase());

  const from = process.env.FROM_EMAIL;
  if (!from) throw new Error("FROM_EMAIL is not configured");

  const clientResult = await resend.emails.send({
    from: sanitizeHeaderValue(from),
    to: sanitizeHeaderValue(data.email),
    subject: "Thank you for your inquiry — Fork & Flower Designs",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #3A320C; background: #FFFFFF;">
        <div style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid #EBDED4;">
          <h1 style="color: #C9A96E; font-size: 28px; margin: 0; letter-spacing: 2px;">Fork &amp; Flower</h1>
          <p style="color: #5C5230; font-size: 12px; letter-spacing: 3px; margin-top: 4px;">D E S I G N S</p>
        </div>
        <div style="padding: 32px 0;">
          <h2 style="font-size: 20px; color: #3A320C;">Thank you, ${eFullName}!</h2>
          <p style="line-height: 1.8; color: #5C5230;">
            We've received your event inquiry and are so excited to learn more about your upcoming ${eEventType}.
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
          <p>Fork &amp; Flower Designs</p>
          <p style="font-size: 11px; margin-top: 4px;">events@forkandflowerdesigns.com</p>
        </div>
      </div>
    `,
  });
  if (clientResult.error) throw new Error(clientResult.error.message);
}
