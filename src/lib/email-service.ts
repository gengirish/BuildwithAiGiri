import { sendViaGmail } from "./gmail-service";

const AGENTMAIL_API_BASE = "https://api.agentmail.to/v0";

async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const sentViaGmail = await sendViaGmail({ to, subject, text, html }).catch(
    (err) => {
      console.warn("Gmail send failed, falling back to AgentMail:", err);
      return false;
    },
  );

  if (sentViaGmail) return;

  const apiKey = process.env.AGENTMAIL_API_KEY;
  const inboxId = process.env.AGENTMAIL_INBOX_ID;
  if (!apiKey || !inboxId) {
    console.warn("No email provider configured — skipping email");
    return;
  }

  const res = await fetch(
    `${AGENTMAIL_API_BASE}/inboxes/${encodeURIComponent(inboxId)}/messages/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        from: `BuildwithAiGiri <${inboxId}>`,
        subject,
        text,
        html,
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`AgentMail send failed (${res.status}): ${body}`);
  }
}

export async function sendSubmissionConfirmation(data: {
  email: string;
  full_name: string;
  idea_title: string;
}) {
  await sendEmail({
    to: data.email,
    subject: `We received your idea: ${data.idea_title}`,
    text: [
      `Hi ${data.full_name},`,
      "",
      `Thanks for submitting "${data.idea_title}" to BuildwithAiGiri!`,
      "",
      "Here's what happens next:",
      "",
      "1. We'll review your idea within 48 hours",
      "2. If selected, you'll be invited to book a 1-hour brainstorming call",
      "3. Then we build your MVP in one week — completely free",
      "",
      "You'll receive an email update on the status of your submission.",
      "",
      "In the meantime, feel free to reply to this email if you have any questions.",
      "",
      "Let's build something extraordinary together!",
      "",
      "— Girish Hiremath",
      "BuildwithAiGiri | 25 MVPs in 25 Weeks",
      "https://buildwithaigiri.vercel.app",
    ].join("\n"),
    html: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fafafa; padding: 40px 30px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 700; margin: 0;">
            Build<span style="color: #06b6d4;">withAi</span>Giri
          </h1>
        </div>

        <p style="font-size: 16px; color: #fafafa; margin-bottom: 8px;">Hi ${data.full_name},</p>

        <p style="font-size: 16px; color: #a1a1aa; line-height: 1.6;">
          Thanks for submitting <strong style="color: #06b6d4;">"${data.idea_title}"</strong> to BuildwithAiGiri!
        </p>

        <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 12px; padding: 24px; margin: 24px 0;">
          <h3 style="color: #fafafa; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px 0;">What happens next</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 12px 8px 0; color: #06b6d4; font-weight: 700; font-size: 20px; vertical-align: top; width: 30px;">1</td>
              <td style="padding: 8px 0; color: #a1a1aa; font-size: 14px;">We review your idea within <strong style="color: #fafafa;">48 hours</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px 8px 0; color: #06b6d4; font-weight: 700; font-size: 20px; vertical-align: top;">2</td>
              <td style="padding: 8px 0; color: #a1a1aa; font-size: 14px;">If selected, you book a <strong style="color: #fafafa;">1-hour brainstorming call</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px 8px 0; color: #06b6d4; font-weight: 700; font-size: 20px; vertical-align: top;">3</td>
              <td style="padding: 8px 0; color: #a1a1aa; font-size: 14px;">We build your <strong style="color: #fafafa;">MVP in one week</strong> — completely free</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">
          You'll receive an email update on the status of your submission. Feel free to reply to this email if you have any questions.
        </p>

        <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 32px; padding-top: 24px;">
          <p style="font-size: 14px; color: #a1a1aa; margin: 0;">
            Let's build something extraordinary together!
          </p>
          <p style="font-size: 14px; color: #fafafa; font-weight: 600; margin: 8px 0 0 0;">
            — Girish Hiremath
          </p>
          <p style="font-size: 12px; color: #71717a; margin: 4px 0 0 0;">
            BuildwithAiGiri | 25 MVPs in 25 Weeks
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendAdminNotification(data: {
  full_name: string;
  email: string;
  role: string;
  company?: string;
  idea_title: string;
  idea_description: string;
  target_audience?: string;
  business_model?: string;
  referral_source?: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("ADMIN_EMAIL not set — skipping admin notification");
    return;
  }

  const detailRows = [
    { label: "Name", value: data.full_name },
    { label: "Email", value: `<a href="mailto:${data.email}" style="color:#06b6d4">${data.email}</a>` },
    { label: "Role", value: data.role },
    ...(data.company ? [{ label: "Company", value: data.company }] : []),
    ...(data.target_audience ? [{ label: "Audience", value: data.target_audience }] : []),
    ...(data.business_model ? [{ label: "Model", value: data.business_model }] : []),
    ...(data.referral_source ? [{ label: "Referral", value: data.referral_source }] : []),
  ];

  const details = [
    `Name: ${data.full_name}`,
    `Email: ${data.email}`,
    `Role: ${data.role}`,
    data.company ? `Company: ${data.company}` : null,
    `Idea: ${data.idea_title}`,
    `Description:\n${data.idea_description}`,
    data.target_audience ? `Target Audience: ${data.target_audience}` : null,
    data.business_model ? `Business Model: ${data.business_model}` : null,
    data.referral_source ? `Referral: ${data.referral_source}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  await sendEmail({
    to: adminEmail,
    subject: `New Idea Submitted: ${data.idea_title}`,
    text: `New idea submission on BuildwithAiGiri!\n\n${details}`,
    html: `
      <div style="font-family:'Inter',-apple-system,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fafafa;padding:40px 30px;border-radius:16px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="font-size:20px;font-weight:700;margin:0;">New Idea Submitted</h1>
        </div>

        <div style="background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.2);border-radius:12px;padding:20px;margin-bottom:20px;">
          <h2 style="font-size:18px;color:#06b6d4;margin:0 0 8px 0;">${data.idea_title}</h2>
          <p style="font-size:14px;color:#a1a1aa;line-height:1.6;margin:0;white-space:pre-wrap;">${data.idea_description}</p>
        </div>

        <table style="width:100%;border-collapse:collapse;">
          ${detailRows.map((r) => `
            <tr>
              <td style="padding:6px 12px 6px 0;font-size:13px;color:#71717a;white-space:nowrap;vertical-align:top;width:80px;">${r.label}</td>
              <td style="padding:6px 0;font-size:13px;color:#fafafa;">${r.value}</td>
            </tr>
          `).join("")}
        </table>

        <div style="border-top:1px solid rgba(255,255,255,0.1);margin-top:24px;padding-top:16px;">
          <a href="mailto:${data.email}" style="display:inline-block;background:#06b6d4;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
            Reply to ${data.full_name}
          </a>
        </div>
      </div>
    `,
  });
}

export async function sendApprovalEmail(data: {
  email: string;
  full_name: string;
  idea_title: string;
  meetLink?: string | null;
  calendarLink?: string | null;
  eventStart?: string | null;
}) {
  const dateStr = data.eventStart
    ? new Date(data.eventStart).toLocaleString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      })
    : "TBD";

  await sendEmail({
    to: data.email,
    subject: `Your idea "${data.idea_title}" has been selected!`,
    text: [
      `Hi ${data.full_name},`,
      "",
      `Great news! Your idea "${data.idea_title}" has been selected for BuildwithAiGiri!`,
      "",
      "Next step: 1-hour brainstorming call",
      `Date: ${dateStr}`,
      data.meetLink ? `Google Meet: ${data.meetLink}` : "",
      data.calendarLink ? `Calendar event: ${data.calendarLink}` : "",
      "",
      "During the call, we'll:",
      "• Define the core problem and target user",
      "• Scope MVP features for a 1-week build",
      "• Discuss architecture and tech stack",
      "• Agree on deliverables and communication plan",
      "",
      "Please check your calendar for the invite.",
      "If the time doesn't work, just reply to this email and we'll reschedule.",
      "",
      "Let's build something extraordinary!",
      "",
      "— Girish Hiremath",
      "BuildwithAiGiri | 25 MVPs in 25 Weeks",
    ].join("\n"),
    html: `
      <div style="font-family:'Inter',-apple-system,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fafafa;padding:40px 30px;border-radius:16px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="font-size:24px;font-weight:700;margin:0;">
            Build<span style="color:#06b6d4;">withAi</span>Giri
          </h1>
        </div>

        <p style="font-size:16px;color:#fafafa;margin-bottom:8px;">Hi ${data.full_name},</p>

        <p style="font-size:16px;color:#a1a1aa;line-height:1.6;">
          Great news! Your idea <strong style="color:#06b6d4;">"${data.idea_title}"</strong> has been <strong style="color:#22c55e;">selected</strong> for BuildwithAiGiri!
        </p>

        <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:12px;padding:24px;margin:24px 0;">
          <h3 style="color:#fafafa;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px 0;">Brainstorming Call</h3>
          <p style="font-size:14px;color:#a1a1aa;margin:0 0 8px 0;">
            <strong style="color:#fafafa;">${dateStr}</strong> (IST)
          </p>
          ${data.meetLink ? `
            <a href="${data.meetLink}" style="display:inline-block;background:#06b6d4;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;margin-top:8px;">
              Join Google Meet
            </a>
          ` : ""}
        </div>

        <div style="margin:20px 0;">
          <h3 style="color:#fafafa;font-size:14px;margin:0 0 12px 0;">What we'll cover:</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:4px 0;font-size:14px;color:#a1a1aa;">• Define the core problem and target user</td></tr>
            <tr><td style="padding:4px 0;font-size:14px;color:#a1a1aa;">• Scope MVP features for a 1-week build</td></tr>
            <tr><td style="padding:4px 0;font-size:14px;color:#a1a1aa;">• Discuss architecture and tech stack</td></tr>
            <tr><td style="padding:4px 0;font-size:14px;color:#a1a1aa;">• Agree on deliverables</td></tr>
          </table>
        </div>

        <p style="font-size:13px;color:#71717a;">
          If the time doesn't work, just reply to this email and we'll reschedule.
        </p>

        <div style="border-top:1px solid rgba(255,255,255,0.1);margin-top:32px;padding-top:24px;">
          <p style="font-size:14px;color:#a1a1aa;margin:0;">Let's build something extraordinary!</p>
          <p style="font-size:14px;color:#fafafa;font-weight:600;margin:8px 0 0 0;">— Girish Hiremath</p>
          <p style="font-size:12px;color:#71717a;margin:4px 0 0 0;">BuildwithAiGiri | 25 MVPs in 25 Weeks</p>
        </div>
      </div>
    `,
  });
}
