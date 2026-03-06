---
name: agentmail-mcp
description: Integrate the AgentMail MCP server to give Cursor direct email capabilities. Use when setting up the MCP server, sending emails from the IDE, debugging email flows, or managing AgentMail inboxes through MCP tools.
---

# AgentMail MCP Server

The [AgentMail MCP Server](https://github.com/agentmail-to/agentmail-mcp) provides MCP (Model Context Protocol) tools for the AgentMail API, allowing Cursor to send, receive, and manage emails directly.

## Setup

### 1. Get API Key

Get your API key from [AgentMail Console](https://console.agentmail.to).

### 2. Configure in Cursor

Add to your Cursor MCP configuration (`.cursor/mcp.json` or global settings):

```json
{
  "mcpServers": {
    "AgentMail": {
      "command": "npx",
      "args": ["-y", "agentmail-mcp"],
      "env": {
        "AGENTMAIL_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

### 3. Verify

After restarting Cursor, the AgentMail tools should appear in the MCP tools list.

## Available Tools

The MCP server exposes these tools for use in Cursor:

| Tool | Description |
|------|-------------|
| `create_inbox` | Create a new email inbox |
| `list_inboxes` | List all inboxes |
| `get_inbox` | Get inbox details |
| `delete_inbox` | Delete an inbox |
| `send_message` | Send an email |
| `get_message` | Get a specific message |
| `list_messages` | List messages in an inbox |
| `reply_to_message` | Reply to a message |
| `list_threads` | List conversation threads |
| `get_thread` | Get thread with messages |
| `create_webhook` | Set up webhook for events |
| `list_webhooks` | List webhooks |
| `delete_webhook` | Remove a webhook |

## Tool Selection

By default, all tools are loaded. To limit to specific tools (reduces noise):

```json
{
  "mcpServers": {
    "AgentMail": {
      "command": "npx",
      "args": ["-y", "agentmail-mcp", "--tools", "send_message,get_message,reply_to_message,list_messages,create_inbox"],
      "env": {
        "AGENTMAIL_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

## Usage in BuildwithAiGiri

### Sending Test Emails During Development

In Cursor chat, ask:

```
Use the AgentMail MCP to send a test submission confirmation email
to test@example.com with subject "We received your idea!" and body
"Thanks for submitting your idea to BuildwithAiGiri."
```

### Checking Inbox for Replies

```
Use AgentMail MCP to list the latest 5 messages in the
hello@buildwithaigiri.com inbox.
```

### Creating Project Inboxes

```
Use AgentMail MCP to create a new inbox with username "hello"
and client_id "buildwithaigiri-hello".
```

## Integration with agentmail Skill

The MCP server provides the runtime tools; the `agentmail` skill provides the email templates and patterns. Use them together:

1. **agentmail skill** -- defines email templates, triggers, and the `email-service.ts` pattern
2. **agentmail-mcp** -- provides live MCP tools for testing and debugging emails from Cursor

## When to Use

| Scenario | Use |
|----------|-----|
| Writing email code (`lib/email-service.ts`) | `agentmail` skill |
| Testing emails during development | `agentmail-mcp` MCP tools |
| Debugging delivery issues | `agentmail-mcp` to check inbox/messages |
| Managing inboxes | `agentmail-mcp` to create/delete inboxes |
| Webhook setup | `agentmail-mcp` to create webhooks |

## Key Rules

1. **Never commit API keys** -- use environment variables in MCP config
2. **Use `--tools` flag** to limit exposed tools if not all are needed
3. **Test with sandbox** before sending to real addresses
4. **MCP tools run in Cursor's context** -- they have access to your API key
