---
name: agentmail
description: Build email automation using AgentMail API for BuildwithAiGiri. Use when creating email notifications, sending submission confirmations, setting up webhooks, or integrating email into the idea submission workflow.
---

# AgentMail - Email Integration for BuildwithAiGiri

AgentMail is an API-first email platform for AI agents. Used in BuildwithAiGiri for transactional emails: submission confirmations, status updates, and call reminders.

## Quick Start

### Installation

```bash
npm install agentmail
```

### Initialize Client

```typescript
import { AgentMailClient } from "agentmail";

const client = new AgentMailClient(); // Uses AGENTMAIL_API_KEY from environment
```

### Create Inbox and Send Email

```typescript
const inbox = await client.inboxes.create({
  username: "hello",
  clientId: "buildwithaigiri-hello",
});

await client.inboxes.messages.send(inbox.inboxId, {
  to: ["founder@example.com"],
  subject: "We received your idea!",
  text: "Thanks for submitting your idea to BuildwithAiGiri.",
  html: "<p>Thanks for submitting your idea to <strong>BuildwithAiGiri</strong>.</p>",
  labels: ["submission-confirmation"],
});
```

## BuildwithAiGiri Inboxes

| Alias | Address | Purpose |
|-------|---------|---------|
| `hello` | `hello@buildwithaigiri.com` | Submission confirmations, general communication |
| `noreply` | `noreply@buildwithaigiri.com` | Status updates, automated notifications |

## Email Triggers

| Trigger | Inbox | When |
|---------|-------|------|
| `submission_received` | hello | New idea submitted via `/api/submissions` |
| `submission_status_update` | noreply | Status changes (reviewing, selected, declined) |
| `call_reminder` | hello | 24h before scheduled brainstorming call |
| `build_started` | hello | Week's MVP build begins |
| `build_completed` | hello | MVP delivered, code handover details |

## Email Service Pattern

```typescript
// lib/email-service.ts
import { AgentMailClient } from "agentmail";

const client = new AgentMailClient();
const HELLO_INBOX = process.env.AGENTMAIL_HELLO_INBOX!;

export async function sendSubmissionConfirmation(data: {
  email: string;
  full_name: string;
  idea_title: string;
}) {
  await client.inboxes.messages.send(HELLO_INBOX, {
    to: [data.email],
    subject: `We received your idea: ${data.idea_title}`,
    text: `Hi ${data.full_name},\n\nThanks for submitting "${data.idea_title}" to BuildwithAiGiri!\n\nWe'll review your idea and get back to you within 48 hours. If selected, we'll invite you to book a 1-hour brainstorming call.\n\nStay tuned!\n- BuildwithAiGiri`,
    html: `<p>Hi ${data.full_name},</p><p>Thanks for submitting <strong>"${data.idea_title}"</strong> to BuildwithAiGiri!</p><p>We'll review your idea and get back to you within 48 hours.</p>`,
    labels: ["submission-confirmation"],
  });
}

export async function sendStatusUpdate(data: {
  email: string;
  full_name: string;
  idea_title: string;
  status: string;
}) {
  const statusMessages: Record<string, string> = {
    reviewing: "Your idea is now being reviewed!",
    selected: "Your idea has been selected for this week's build!",
    declined: "We appreciate your submission but have selected another idea this week.",
  };

  await client.inboxes.messages.send(HELLO_INBOX, {
    to: [data.email],
    subject: `Update on "${data.idea_title}"`,
    text: `Hi ${data.full_name},\n\n${statusMessages[data.status] || "Status updated."}\n\n- BuildwithAiGiri`,
    labels: ["status-update"],
  });
}
```

## Calling from API Routes (Non-Blocking)

```typescript
// In POST /api/submissions route:
import { sendSubmissionConfirmation } from "@/lib/email-service";

// Fire-and-forget pattern (don't await in the response path)
sendSubmissionConfirmation({
  email: result.data.email,
  full_name: result.data.full_name,
  idea_title: result.data.idea_title,
}).catch(() => {});
```

## Core API Operations

### Reply to Email

```typescript
await client.inboxes.messages.reply(inboxId, messageId, {
  text: "Thanks for your reply!",
  html: "<p>Thanks for your reply!</p>",
});
```

### List Messages with Labels

```typescript
const messages = await client.inboxes.messages.list(inboxId, {
  labels: ["submission-confirmation"],
});
```

### Update Labels

```typescript
await client.inboxes.messages.update(inboxId, messageId, {
  addLabels: ["processed"],
  removeLabels: ["unread"],
});
```

## Best Practices

1. **Always use `clientId`** on create operations to prevent duplicates
2. **Always include both `text` and `html`** in messages
3. **Fire-and-forget** email sends from API routes (non-blocking)
4. **Use labels** for filtering and state management
5. **Keep bounce rate < 4%** to protect sender reputation

## Additional Resources

- For complete API method signatures, see [references/api-reference.md](references/api-reference.md)
- For webhook event payloads, see [references/webhook-events.md](references/webhook-events.md)
- For advanced examples, see [references/examples.md](references/examples.md)
