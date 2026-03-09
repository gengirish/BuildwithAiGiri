import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { sendApprovalEmail } from "@/lib/email-service";
import { createBrainstormInvite } from "@/lib/calendar-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { submissionId, preferredDate } = await req.json();

    if (!submissionId) {
      return NextResponse.json(
        { error: "submissionId is required" },
        { status: 400 },
      );
    }

    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 },
      );
    }

    const { data: submission, error: fetchError } = await supabase
      .from("submissions")
      .select("*")
      .eq("id", submissionId)
      .single();

    if (fetchError || !submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    let calendarResult = null;
    try {
      calendarResult = await createBrainstormInvite({
        attendeeEmail: submission.email,
        attendeeName: submission.full_name,
        ideaTitle: submission.idea_title,
        preferredDate,
      });
    } catch (err) {
      console.error("Calendar invite failed:", err);
    }

    await sendApprovalEmail({
      email: submission.email,
      full_name: submission.full_name,
      idea_title: submission.idea_title,
      meetLink: calendarResult?.meetLink,
      calendarLink: calendarResult?.htmlLink,
      eventStart: calendarResult?.start,
    });

    const { error: updateError } = await supabase
      .from("submissions")
      .update({ status: "selected" })
      .eq("id", submissionId);

    if (updateError) {
      console.error("Status update failed:", updateError);
    }

    return NextResponse.json({
      success: true,
      message: `Approved "${submission.idea_title}" — email sent to ${submission.email}`,
      calendar: calendarResult,
    });
  } catch (err) {
    console.error("Admin approve error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
