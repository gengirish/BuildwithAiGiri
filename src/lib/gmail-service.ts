import { getGmail } from "./google";

function buildMimeMessage({
  to,
  from,
  subject,
  text,
  html,
}: {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}) {
  const boundary = "boundary_" + Date.now();
  const lines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "",
    text,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "",
    html,
    "",
    `--${boundary}--`,
  ];

  return Buffer.from(lines.join("\r\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function sendViaGmail({
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
  const gmail = getGmail();
  if (!gmail) {
    console.warn("Gmail not configured — falling back to AgentMail");
    return false;
  }

  const from = `BuildwithAiGiri <${process.env.GMAIL_FROM || "gen.girish@gmail.com"}>`;
  const raw = buildMimeMessage({ to, from, subject, text, html });

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });

  return true;
}

export async function listInboxMessages(maxResults = 20) {
  const gmail = getGmail();
  if (!gmail) return null;

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults,
    q: "in:inbox",
  });

  if (!res.data.messages) return [];

  const messages = await Promise.all(
    res.data.messages.map(async (msg) => {
      const full = await gmail.users.messages.get({
        userId: "me",
        id: msg.id!,
        format: "metadata",
        metadataHeaders: ["From", "Subject", "Date"],
      });

      const headers = full.data.payload?.headers || [];
      const getHeader = (name: string) =>
        headers.find((h) => h.name === name)?.value || "";

      return {
        id: msg.id,
        from: getHeader("From"),
        subject: getHeader("Subject"),
        date: getHeader("Date"),
        snippet: full.data.snippet,
      };
    }),
  );

  return messages;
}
