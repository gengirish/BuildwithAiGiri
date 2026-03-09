const AGENTMAIL_API_BASE = "https://api.agentmail.to/v0";

export async function sendSubmissionConfirmation(data: {
  email: string;
  full_name: string;
  idea_title: string;
}) {
  const apiKey = process.env.AGENTMAIL_API_KEY;
  if (!apiKey) {
    console.warn("AgentMail not configured — skipping confirmation email");
    return;
  }

  const inboxId = process.env.AGENTMAIL_INBOX_ID;
  if (!inboxId) {
    console.warn("AGENTMAIL_INBOX_ID not set — skipping confirmation email");
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
        to: data.email,
        from: `BuildwithAiGiri <${inboxId}>`,
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
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`AgentMail send failed (${res.status}): ${body}`);
  }
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
  const apiKey = process.env.AGENTMAIL_API_KEY;
  const inboxId = process.env.AGENTMAIL_INBOX_ID;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!apiKey || !inboxId || !adminEmail) {
    console.warn("Admin notification not configured — skipping");
    return;
  }

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

  const detailRows = [
    { label: "Name", value: data.full_name },
    { label: "Email", value: `<a href="mailto:${data.email}" style="color:#06b6d4">${data.email}</a>` },
    { label: "Role", value: data.role },
    ...(data.company ? [{ label: "Company", value: data.company }] : []),
    ...(data.target_audience ? [{ label: "Audience", value: data.target_audience }] : []),
    ...(data.business_model ? [{ label: "Model", value: data.business_model }] : []),
    ...(data.referral_source ? [{ label: "Referral", value: data.referral_source }] : []),
  ];

  const res = await fetch(
    `${AGENTMAIL_API_BASE}/inboxes/${encodeURIComponent(inboxId)}/messages/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: adminEmail,
        from: `BuildwithAiGiri <${inboxId}>`,
        subject: `New Idea Submitted: ${data.idea_title}`,
        text: `New idea submission on BuildwithAiGiri!\n\n${details}`,
        html: `
          <div style="font-family:'Inter',-apple-system,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fafafa;padding:40px 30px;border-radius:16px;">
            <div style="text-align:center;margin-bottom:24px;">
              <h1 style="font-size:20px;font-weight:700;margin:0;">
                New Idea Submitted
              </h1>
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
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Admin notification failed (${res.status}): ${body}`);
  }
}
