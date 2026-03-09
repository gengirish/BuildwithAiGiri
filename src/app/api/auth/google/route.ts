import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/google";

export async function GET() {
  const url = getAuthUrl();

  if (!url) {
    return NextResponse.json(
      { error: "Google OAuth not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI." },
      { status: 500 },
    );
  }

  return NextResponse.redirect(url);
}
