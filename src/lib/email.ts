import { Resend } from "resend";
import type { InquiryFormData } from "@/lib/schemas/inquiry";
import { InquiryConfirmationEmail } from "@/emails/InquiryConfirmationEmail";
import { NewInquiryNotificationEmail } from "@/emails/NewInquiryNotificationEmail";
import { getEmailBaseUrl } from "@/lib/email-assets";
import {
  SIGNATURE_CID,
  SIGNATURE_DATAURL_PREFIX,
} from "@/lib/signature-constants";

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
 * Email headers (Subject, From, To, Reply-To) must not contain CR/LF —
 * otherwise an attacker could inject additional headers. Schema already
 * restricts these fields, but we strip defensively.
 */
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

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
 * `hasSignatureAttachment={null !== result}` to the React Email template
 * so the body either renders `<Img src="cid:signature">` or falls back to
 * the typed-name path — base64 never leaks into the HTML body.
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

export async function sendOwnerNotification(data: InquiryFormData) {
  const resend = getResendClient();
  const fullName = `${data.firstName} ${data.lastName}`;

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
    react: NewInquiryNotificationEmail({
      data,
      hasSignatureAttachment: signatureAttachment !== null,
    }),
    attachments: signatureAttachment ? [signatureAttachment] : undefined,
  });
  if (ownerResult.error) throw new Error(ownerResult.error.message);
}

export async function sendClientConfirmation(data: InquiryFormData) {
  const resend = getResendClient();

  const from = process.env.FROM_EMAIL;
  if (!from) throw new Error("FROM_EMAIL is not configured");

  const clientResult = await resend.emails.send({
    from: sanitizeHeaderValue(from),
    to: sanitizeHeaderValue(data.email),
    subject: "Thank you for your inquiry — Fork & Flower Designs",
    react: InquiryConfirmationEmail({
      data,
      siteBaseUrl: getEmailBaseUrl(),
    }),
  });
  if (clientResult.error) throw new Error(clientResult.error.message);
}
