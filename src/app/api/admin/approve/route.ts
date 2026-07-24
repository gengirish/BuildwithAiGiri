import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendApprovalEmail } from "@/lib/email-service";
import { createBrainstormInvite } from "@/lib/calendar-service";
import type { Submission } from "@/types";

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

    const sql = getDb();
    if (!sql) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 },
      );
    }

    const rows = (await sql`
      SELECT * FROM submissions WHERE id = ${submissionId} LIMIT 1
    `) as Submission[];
    const submission = rows[0];

    if (!submission) {
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

    try {
      await sql`UPDATE submissions SET status = 'selected' WHERE id = ${submissionId}`;
    } catch (updateError) {
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
