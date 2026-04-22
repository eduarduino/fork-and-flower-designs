import { NextResponse } from "next/server";
import { inquirySchema } from "@/lib/schemas/inquiry";
import {
  sendOwnerNotification,
  sendClientConfirmation,
  canSendToArbitraryRecipients,
} from "@/lib/email";

// Simple in-memory rate limit: max 5 submissions per IP per minute
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60_000 });
    return false;
  }

  if (record.count >= 5) {
    return true;
  }

  record.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Server-side validation
    const result = inquirySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const canSendToCustomer = canSendToArbitraryRecipients();

      const tasks: Array<Promise<unknown>> = [sendOwnerNotification(data)];
      const labels: string[] = ["ownerNotification"];

      if (canSendToCustomer) {
        tasks.push(sendClientConfirmation(data));
        labels.push("clientConfirmation");
      }

      const results = await Promise.allSettled(tasks);
      results.forEach((r, i) => {
        if (r.status === "fulfilled") {
          console.log(`Email [${labels[i]}] sent`);
        } else {
          console.error(`Email [${labels[i]}] failed:`, r.reason);
        }
      });
    } else {
      console.warn("RESEND_API_KEY not configured — inquiry not emailed");
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
