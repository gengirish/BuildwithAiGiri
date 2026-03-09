import { NextRequest, NextResponse } from "next/server";
import { createOAuth2Client } from "@/lib/google";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
  }

  const client = createOAuth2Client();
  if (!client) {
    return NextResponse.json({ error: "Google OAuth not configured" }, { status: 500 });
  }

  try {
    const { tokens } = await client.getToken(code);

    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head><title>Google OAuth — BuildwithAiGiri</title></head>
        <body style="background:#0a0a0a;color:#fafafa;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
          <div style="max-width:600px;text-align:center;padding:40px;">
            <h1 style="color:#06b6d4;">Google Connected!</h1>
            <p style="color:#a1a1aa;margin-bottom:24px;">
              Copy the refresh token below and add it as <code>GOOGLE_REFRESH_TOKEN</code>
              in your <code>.env.local</code> and Vercel environment variables.
            </p>
            <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:16px;word-break:break-all;font-family:monospace;font-size:14px;color:#06b6d4;margin-bottom:16px;">
              ${tokens.refresh_token || "No refresh token returned — you may have already authorized. Revoke access at https://myaccount.google.com/permissions and try again."}
            </div>
            ${tokens.refresh_token ? `<p style="color:#22c55e;">Save this token. It won't be shown again.</p>` : ""}
          </div>
        </body>
      </html>
      `,
      {
        headers: { "Content-Type": "text/html" },
      },
    );
  } catch (err) {
    console.error("Google OAuth token exchange failed:", err);
    return NextResponse.json(
      { error: "Token exchange failed" },
      { status: 500 },
    );
  }
}
