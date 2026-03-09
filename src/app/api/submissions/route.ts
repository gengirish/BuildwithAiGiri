import { NextRequest, NextResponse } from "next/server";
import { submissionSchema } from "@/lib/validations";
import { getServiceClient } from "@/lib/supabase";
import { sendSubmissionConfirmation, sendAdminNotification } from "@/lib/email-service";

export const dynamic = "force-dynamic";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const MIN_FILL_TIME_MS = 3_000;

function checkRateLimit(ip: string, limit = 3, windowMs = 60_000): boolean {
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

    const { error } = await supabase.from("submissions").insert({
      ...parsed.data,
      status: "pending",
    });

    if (error) {
      console.error("Supabase insert error:", error);
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
