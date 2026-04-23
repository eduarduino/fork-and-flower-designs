import { NextResponse } from "next/server";
import { inquirySchema } from "@/lib/schemas/inquiry";
import {
  sendOwnerNotification,
  sendClientConfirmation,
  canSendToArbitraryRecipients,
} from "@/lib/email";
import { sendSlackInquiryNotification } from "@/lib/slack";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Hard cap on request body size. A legitimate submission (including a
// signed PNG data URL) is well under 500 KB; anything larger is either a
// bug or abuse.
const MAX_REQUEST_BYTES = 800_000;

// Best-effort per-IP throttle. This is in-memory, so on serverless it
// only throttles within a single warm instance — a determined attacker
// can fan out across regions. Treat as a first line of defense; do not
// rely on it for real abuse protection (see REMAINING RISKS in audit).
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_ENTRIES = 10_000;

type RateRecord = { count: number; resetTime: number };
const rateLimitMap = new Map<string, RateRecord>();

function pruneRateLimitMap(now: number) {
  if (rateLimitMap.size < RATE_LIMIT_MAX_ENTRIES) return;
  for (const [key, record] of rateLimitMap) {
    if (now > record.resetTime) rateLimitMap.delete(key);
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  pruneRateLimitMap(now);
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (record.count >= RATE_LIMIT_MAX) return true;
  record.count++;
  return false;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isSameOrigin(request: Request): boolean {
  const host = request.headers.get("host");
  if (!host) return false;
  // Prefer Origin (sent on POST), fall back to Referer.
  const candidate =
    request.headers.get("origin") || request.headers.get("referer");
  if (!candidate) return false;
  try {
    return new URL(candidate).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Defense-in-depth CSRF check. Same-origin content-type=json already
    // forces a preflight that we don't grant, but an explicit origin match
    // blocks misconfigured proxies and non-browser replay attempts.
    if (!isSameOrigin(request)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Enforce JSON content-type — rejects form-encoded / multipart shims
    // that would bypass our JSON-shaped schema expectations.
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 415 }
      );
    }

    // Reject obviously oversized payloads based on the declared length,
    // before we ever read the body into memory.
    const declaredLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
      return NextResponse.json(
        { error: "Payload too large" },
        { status: 413 }
      );
    }

    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Read the body as text first so we can enforce our size cap even
    // when the client lies about (or omits) content-length.
    const raw = await request.text();
    if (raw.length > MAX_REQUEST_BYTES) {
      return NextResponse.json(
        { error: "Payload too large" },
        { status: 413 }
      );
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    const result = inquirySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Silently drop honeypot hits — do not signal to bots that we saw them.
    if (data.website && data.website.length > 0) {
      return NextResponse.json({ success: true });
    }

    // Cloudflare Turnstile verification. Runs after schema validation so
    // `data.turnstileToken` is guaranteed non-empty; runs before any
    // expensive side effects (email/Slack) so bots cannot exercise them.
    // Dev escape hatch mirrors SIMULATE_OWNER_EMAIL_FAILURE: hard-gated on
    // NODE_ENV so an unset secret in production does NOT skip verification.
    const skipTurnstile =
      process.env.NODE_ENV !== "production" && !process.env.TURNSTILE_SECRET_KEY;

    if (skipTurnstile) {
      console.warn(
        "TURNSTILE_SECRET_KEY not configured — verification skipped (dev only)"
      );
    } else {
      const params = new URLSearchParams();
      params.append("secret", process.env.TURNSTILE_SECRET_KEY ?? "");
      params.append("response", data.turnstileToken);
      params.append("remoteip", ip);

      let verifyOk = false;
      try {
        const verifyRes = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString(),
          }
        );
        const verifyJson = (await verifyRes.json()) as { success?: boolean };
        verifyOk = verifyJson?.success === true;
      } catch (err) {
        console.error("Turnstile siteverify request failed:", err);
      }

      if (!verifyOk) {
        console.warn("Turnstile verification failed");
        return NextResponse.json(
          { error: "Verification failed" },
          { status: 403 }
        );
      }
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not configured — inquiry not emailed");
      // Still try Slack so the lead is not lost in local/dev setups that
      // only wire up the Slack webhook.
      await sendSlackInquiryNotification("new_inquiry", data);
      return NextResponse.json({ success: true });
    }

    // Dev-only escape hatch to exercise the owner-email-failure path.
    // Hard-gated on NODE_ENV so it cannot activate in a Vercel production
    // deployment even if the env var is accidentally set there.
    const simulateOwnerFailure =
      process.env.NODE_ENV !== "production" &&
      process.env.SIMULATE_OWNER_EMAIL_FAILURE === "true";

    let ownerFailed = false;
    let ownerErrorReason: string | undefined;

    try {
      if (simulateOwnerFailure) {
        throw new Error(
          "Simulated owner email failure (SIMULATE_OWNER_EMAIL_FAILURE=true)"
        );
      }
      await sendOwnerNotification(data);
      console.log("Email [ownerNotification] sent");
    } catch (err) {
      ownerFailed = true;
      ownerErrorReason =
        err instanceof Error ? err.message : String(err ?? "unknown error");
      console.error("Email [ownerNotification] failed:", err);
    }

    // Client confirmation + Slack run in parallel. Both are best-effort:
    // any failure is logged server-side but must not break the response.
    const clientTask: Promise<unknown> = canSendToArbitraryRecipients()
      ? sendClientConfirmation(data).then(
          () => console.log("Email [clientConfirmation] sent"),
          (err: unknown) =>
            console.error("Email [clientConfirmation] failed:", err)
        )
      : Promise.resolve();

    const slackTask = sendSlackInquiryNotification(
      ownerFailed ? "owner_email_failed" : "new_inquiry",
      data,
      ownerFailed ? { reason: ownerErrorReason } : undefined
    );

    await Promise.allSettled([clientTask, slackTask]);

    if (ownerFailed) {
      return NextResponse.json(
        { error: "We couldn't deliver your inquiry. Please try again shortly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
