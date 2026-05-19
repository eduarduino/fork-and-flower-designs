import type { InquiryFormData } from "@/lib/schemas/inquiry";
import {
  ADDON_LABELS,
  PACKAGE_LABELS,
  SERVICE_LABELS,
  labelList,
} from "@/lib/inquiry-labels";

export type SlackNotificationKind = "new_inquiry" | "owner_email_failed";

export interface OwnerEmailFailureContext {
  reason?: string;
}

/**
 * Slack mrkdwn reserves `&`, `<`, `>`. Escape them so that a customer
 * submission like `A & B <tag>` can't break formatting or be interpreted
 * as a Slack special link.
 */
function escapeSlack(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

type SlackBlock =
  | {
      type: "section";
      text?: { type: "mrkdwn"; text: string };
      fields?: Array<{ type: "mrkdwn"; text: string }>;
    }
  | { type: "divider" }
  | {
      type: "context";
      elements: Array<{ type: "mrkdwn"; text: string }>;
    };

interface SlackPayload {
  text: string;
  blocks: SlackBlock[];
}

function buildPayload(
  kind: SlackNotificationKind,
  data: InquiryFormData,
  errorContext?: OwnerEmailFailureContext
): SlackPayload {
  const fullName = `${data.firstName} ${data.lastName}`;
  const services = labelList(data.services, SERVICE_LABELS, "—");
  const packages = labelList(data.packages, PACKAGE_LABELS, "—");
  const addOns = labelList(data.addOns, ADDON_LABELS, "None");
  const foodOnIsland = data.foodOnIsland === "yes" ? "Yes" : "No";

  const isFailure = kind === "owner_email_failed";
  const fallbackText = isFailure
    ? `Owner email delivery failed — ${fullName} (${data.email})`
    : `New event inquiry from ${fullName} (${data.email})`;

  const headerBlock: SlackBlock = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: isFailure
        ? `:rotating_light: *Owner email delivery FAILED — manual follow-up required*\nInquiry details captured below. The customer may have seen an error; please reach out directly.`
        : `:tada: *New Event Inquiry from ${escapeSlack(fullName)}*`,
    },
  };

  const contactBlock: SlackBlock = {
    type: "section",
    fields: [
      { type: "mrkdwn", text: `*Name:*\n${escapeSlack(fullName)}` },
      { type: "mrkdwn", text: `*Email:*\n${escapeSlack(data.email)}` },
      { type: "mrkdwn", text: `*Phone:*\n${escapeSlack(data.phone)}` },
      { type: "mrkdwn", text: `*Event Type:*\n${escapeSlack(data.eventType)}` },
      { type: "mrkdwn", text: `*Event Date:*\n${escapeSlack(data.eventDate)}` },
      { type: "mrkdwn", text: `*Start Time:*\n${escapeSlack(data.startTime)}` },
      { type: "mrkdwn", text: `*Guests:*\n${escapeSlack(data.guestCount)}` },
      { type: "mrkdwn", text: `*Food on Island:*\n${foodOnIsland}` },
    ],
  };

  const selectionsBlock: SlackBlock = {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        `*Services:* ${escapeSlack(services)}\n` +
        `*Packages:* ${escapeSlack(packages)}\n` +
        `*Add-Ons:* ${escapeSlack(addOns)}`,
    },
  };

  const blocks: SlackBlock[] = [
    headerBlock,
    { type: "divider" },
    contactBlock,
    selectionsBlock,
  ];

  const prefs: string[] = [];
  if (data.colorPalette) {
    prefs.push(`*Color Palette:* ${escapeSlack(data.colorPalette)}`);
  }
  if (data.themeOrVibe) {
    prefs.push(`*Theme / Vibe:* ${escapeSlack(data.themeOrVibe)}`);
  }
  if (data.mustHaveElements) {
    prefs.push(`*Must-Haves:* ${escapeSlack(data.mustHaveElements)}`);
  }
  if (prefs.length > 0) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: prefs.join("\n") },
    });
  }

  if (isFailure && errorContext?.reason) {
    // Cap reason length; Slack section text has practical limits and we
    // never want a stack trace exploding the payload.
    const safeReason = escapeSlack(errorContext.reason).slice(0, 500);
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:warning: *Error context (server-side only):*\n\`\`\`${safeReason}\`\`\``,
      },
    });
  }

  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text:
          `Printed Name: ${escapeSlack(data.printName)}  •  ` +
          `Submitted: ${new Date().toISOString()}`,
      },
    ],
  });

  return { text: fallbackText, blocks };
}

/**
 * Post a Slack notification for an inquiry. Never throws — Slack is a
 * best-effort side channel; failure is logged but must not surface to
 * the user or block the response path.
 */
export async function sendSlackInquiryNotification(
  kind: SlackNotificationKind,
  data: InquiryFormData,
  errorContext?: OwnerEmailFailureContext
): Promise<void> {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) {
    console.warn(
      "SLACK_WEBHOOK_URL not configured — Slack notification skipped"
    );
    return;
  }

  const payload = buildPayload(kind, data, errorContext);

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      // Read at most ~300 chars of response for debugging; never echo
      // webhook URL or payload to logs.
      const body = await res.text().catch(() => "");
      console.error(
        `Slack notification failed: ${res.status} ${body.slice(0, 300)}`
      );
      return;
    }
    console.log(`Slack [${kind}] posted`);
  } catch (err) {
    console.error("Slack notification error:", err);
  }
}
