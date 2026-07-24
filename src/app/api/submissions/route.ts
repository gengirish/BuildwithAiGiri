import { NextRequest, NextResponse, after } from "next/server";
import { submissionSchema, type SubmissionFormData } from "@/lib/validations";
import { getDb, isDatabaseUnreachableError } from "@/lib/db";
import { sendSubmissionConfirmation, sendAdminNotification } from "@/lib/email-service";

export const dynamic = "force-dynamic";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/** Light anti-bot: block instant scripted posts; keep low so real users are not blocked. */
const MIN_FILL_TIME_MS = 800;

function nullIfEmpty(value: string | undefined | null): string | null {
  if (value == null) return null;
  const s = value.trim();
  return s === "" ? null : s;
}

/**
 * Send lead-capture emails after the response is sent, via Next's `after()`.
 * This keeps them off the request's critical path (no added user latency) while
 * guaranteeing the serverless function stays alive until the emails actually
 * finish — a bare fire-and-forget promise gets frozen/dropped once the response
 * returns, so the AgentMail fetch never completes. A mail failure is logged and
 * never fails the request.
 */
function dispatchLeadEmails(data: SubmissionFormData) {
  after(async () => {
    await Promise.allSettled([
      sendSubmissionConfirmation({
        email: data.email,
        full_name: data.full_name,
        idea_title: data.idea_title,
      }).catch((err) => console.error("Email send failed:", err)),
      sendAdminNotification(data).catch((err) =>
        console.error("Admin notification failed:", err),
      ),
    ]);
  });
}

function checkRateLimit(ip: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await req.json();

    if (body._hp) {
      return NextResponse.json(
        { success: true, message: "Idea submitted successfully!" },
        { status: 201 },
      );
    }

    if (body._t && Date.now() - Number(body._t) < MIN_FILL_TIME_MS) {
      return NextResponse.json(
        { error: "Please take your time filling out the form." },
        { status: 422 },
      );
    }

    const { _hp, _t, ...formData } = body;
    const parsed = submissionSchema.safeParse(formData);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue?.message || "Invalid submission data" },
        { status: 400 },
      );
    }

    const d = parsed.data;
    const sql = getDb();

    if (!sql) {
      console.warn("DATABASE_URL not configured — storing submission in logs only");
      console.log("Submission received:", JSON.stringify(d, null, 2));
      dispatchLeadEmails(d);
      return NextResponse.json(
        { success: true, message: "Idea submitted successfully!" },
        { status: 201 },
      );
    }

    try {
      await sql`
        INSERT INTO submissions (
          full_name, email, phone, role, company, idea_title, idea_description,
          target_audience, business_model, referral_source, status
        ) VALUES (
          ${d.full_name.trim()}, ${d.email.trim()}, ${d.phone.trim()}, ${d.role},
          ${nullIfEmpty(d.company)}, ${d.idea_title.trim()}, ${d.idea_description.trim()},
          ${nullIfEmpty(d.target_audience)}, ${nullIfEmpty(d.business_model)},
          ${nullIfEmpty(d.referral_source)}, 'pending'
        )
      `;
    } catch (err) {
      if (isDatabaseUnreachableError(err)) {
        // DB is down/unreachable (e.g. paused or deleted database). Don't drop
        // the lead: capture it via email + logs and confirm to the user,
        // matching the "no DB configured" degraded path above.
        console.error("Database unreachable — capturing submission via email only:", err);
        console.log("Submission received:", JSON.stringify(d, null, 2));
        dispatchLeadEmails(d);
        return NextResponse.json(
          { success: true, message: "Idea submitted successfully!" },
          { status: 201 },
        );
      }
      console.error("Database insert error:", err);
      return NextResponse.json(
        { error: "Failed to save submission. Please try again." },
        { status: 500 },
      );
    }

    dispatchLeadEmails(d);

    return NextResponse.json(
      { success: true, message: "Idea submitted successfully!" },
      { status: 201 },
    );
  } catch (err) {
    console.error("Submission route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const sql = getDb();

    if (!sql) {
      return NextResponse.json([]);
    }

    const data = await sql`SELECT * FROM submissions ORDER BY created_at DESC`;
    return NextResponse.json(data);
  } catch (err) {
    console.error("Submissions GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 },
    );
  }
}
