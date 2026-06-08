import { NextRequest, NextResponse } from "next/server";
import { submissionSchema, type SubmissionFormData } from "@/lib/validations";
import { getServiceClient } from "@/lib/supabase";
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

function rowForInsert(data: SubmissionFormData, includePhone: boolean) {
  const base = {
    full_name: data.full_name.trim(),
    email: data.email.trim(),
    role: data.role,
    company: nullIfEmpty(data.company),
    idea_title: data.idea_title.trim(),
    idea_description: data.idea_description.trim(),
    target_audience: nullIfEmpty(data.target_audience),
    business_model: nullIfEmpty(data.business_model),
    referral_source: nullIfEmpty(data.referral_source),
    status: "pending" as const,
  };
  if (!includePhone) return base;
  return { ...base, phone: data.phone.trim() };
}

function isMissingPhoneColumnError(err: { message?: string; details?: string; code?: string }): boolean {
  const blob = `${err.message ?? ""} ${err.details ?? ""}`.toLowerCase();
  if (!blob.includes("phone")) return false;
  return (
    blob.includes("could not find") ||
    blob.includes("schema cache") ||
    blob.includes("does not exist") ||
    err.code === "PGRST204"
  );
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

    const supabase = getServiceClient();

    if (!supabase) {
      console.warn("Supabase not configured — storing submission in logs only");
      console.log("Submission received:", JSON.stringify(parsed.data, null, 2));

      sendSubmissionConfirmation({
        email: parsed.data.email,
        full_name: parsed.data.full_name,
        idea_title: parsed.data.idea_title,
      }).catch((err) => console.error("Email send failed:", err));

      sendAdminNotification(parsed.data).catch((err) =>
        console.error("Admin notification failed:", err),
      );

      return NextResponse.json(
        { success: true, message: "Idea submitted successfully!" },
        { status: 201 },
      );
    }

    let insertError = (await supabase.from("submissions").insert(rowForInsert(parsed.data, true)))
      .error;

    if (insertError && isMissingPhoneColumnError(insertError)) {
      console.warn(
        "submissions.phone column missing — retrying insert without phone. Run supabase/migrations/20260209120000_add_phone_to_submissions.sql to store phone in the database.",
      );
      insertError = (await supabase.from("submissions").insert(rowForInsert(parsed.data, false)))
        .error;
    }

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save submission. Please try again." },
        { status: 500 },
      );
    }

    sendSubmissionConfirmation({
      email: parsed.data.email,
      full_name: parsed.data.full_name,
      idea_title: parsed.data.idea_title,
    }).catch((err) => console.error("Email send failed:", err));

    sendAdminNotification(parsed.data).catch((err) =>
      console.error("Admin notification failed:", err),
    );

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
    const supabase = getServiceClient();

    if (!supabase) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch submissions" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Submissions GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
