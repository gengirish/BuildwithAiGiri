import { test, expect, request as playwrightRequest } from "@playwright/test";

/**
 * End-to-end email-delivery coverage.
 *
 * Exercises the real path: HTTP POST /api/submissions → route handler →
 * email-service → AgentMail send API → AgentMail inbox. It then reads the
 * inbox back to prove the submission-confirmation email was actually
 * delivered — not just that the API returned 201.
 *
 * The trick: we submit with the AgentMail inbox address as the *submitter's*
 * email, so `sendSubmissionConfirmation` delivers the confirmation into that
 * same inbox, which we can list via the AgentMail API.
 *
 * Requires real credentials, so it skips (matching the project's
 * zero-credentials philosophy) unless both are set:
 *   AGENTMAIL_API_KEY   — to read the inbox
 *   AGENTMAIL_INBOX_ID  — the inbox address (also the confirmation recipient)
 *
 * Run against a deployment that has email configured (production uses
 * AgentMail); local dev has no email provider so nothing is sent:
 *
 *   AGENTMAIL_API_KEY=... AGENTMAIL_INBOX_ID=you@agentmail.to \
 *   BASE_URL=https://mvplabs.intelliforge.tech \
 *   npx playwright test e2e/email-delivery.spec.ts
 *
 * Note: each run inserts one real submission row (idea_title "Email Delivery
 * Test <marker>") and sends real email. The marker makes test rows easy to spot.
 */

const AGENTMAIL_API_BASE = "https://api.agentmail.to/v0";
const apiKey = process.env.AGENTMAIL_API_KEY;
const inboxId = process.env.AGENTMAIL_INBOX_ID;

const DELIVERY_TIMEOUT_MS = 90_000;
const POLL_INTERVAL_MS = 4_000;

test.describe("Email delivery (AgentMail round-trip)", () => {
  test.skip(
    !apiKey || !inboxId,
    "Set AGENTMAIL_API_KEY + AGENTMAIL_INBOX_ID (and BASE_URL to a deployment with email configured) to run email-delivery tests.",
  );

  test("delivers the submission-confirmation email to the inbox", async ({ request }) => {
    test.setTimeout(DELIVERY_TIMEOUT_MS + 30_000);

    const marker = `E2E-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const ideaTitle = `Email Delivery Test ${marker}`;
    const expectedSubject = `We received your idea: ${ideaTitle}`;

    // 1) Submit an idea. Confirmation email is addressed to the AgentMail inbox.
    const res = await request.post("/api/submissions", {
      headers: { "content-type": "application/json" },
      data: {
        full_name: "E2E Email Tester",
        email: inboxId,
        phone: "+1 555 000 1234",
        role: "Founder",
        company: "E2E Co",
        idea_title: ideaTitle,
        idea_description:
          "Automated end-to-end test verifying the submission confirmation email is actually delivered via AgentMail.",
        target_audience: "QA",
        business_model: "SaaS (Subscription)",
        referral_source: "e2e",
        _hp: "",
        _t: Date.now() - 5_000, // clear the anti-bot minimum-fill-time check
      },
    });
    expect(
      res.status(),
      `Submission should be accepted (201). Body: ${await res.text()}`,
    ).toBe(201);

    // 2) Poll the AgentMail inbox until the confirmation email lands.
    const inbox = await playwrightRequest.newContext({
      baseURL: AGENTMAIL_API_BASE,
      extraHTTPHeaders: { Authorization: `Bearer ${apiKey}` },
    });

    try {
      const deadline = Date.now() + DELIVERY_TIMEOUT_MS;
      let delivered: { subject?: string } | undefined;

      while (Date.now() < deadline && !delivered) {
        const listRes = await inbox.get(
          `/inboxes/${encodeURIComponent(inboxId!)}/messages`,
          { params: { limit: "20", ascending: "false" } },
        );
        expect(
          listRes.ok(),
          `AgentMail list failed (${listRes.status()}): ${await listRes.text()}`,
        ).toBeTruthy();

        const body = await listRes.json();
        const messages: Array<{ subject?: string }> = Array.isArray(body)
          ? body
          : body.messages ?? body.data ?? [];

        delivered = messages.find((m) => (m.subject ?? "").includes(marker));
        if (!delivered) await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      }

      expect(
        delivered,
        `Confirmation email "${expectedSubject}" was not delivered to ${inboxId} within ${DELIVERY_TIMEOUT_MS / 1000}s`,
      ).toBeTruthy();
    } finally {
      await inbox.dispose();
    }
  });
});
