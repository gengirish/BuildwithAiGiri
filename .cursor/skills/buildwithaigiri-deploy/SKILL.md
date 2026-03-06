---
name: buildwithaigiri-deploy
description: Deploy the BuildwithAiGiri website to Vercel with Supabase backend. Use when deploying, configuring environment variables, setting up CI/CD, managing domains, or troubleshooting deployment issues.
---

# BuildwithAiGiri Deployment

## Architecture

```
┌──────────────────┐   API routes    ┌──────────────────┐
│  Vercel (Next.js) │ ─────────────► │  Supabase (PG)    │
│  Frontend + API   │                │  Database + Auth   │
└──────────────────┘                └──────────────────┘
         │
         ├── Cal.com embed (iframe)
         └── AgentMail API (email)
```

| Service | Platform | URL |
|---------|----------|-----|
| Website | Vercel | `https://buildwithaigiri.com` |
| Database | Supabase | Supabase dashboard |
| Calendar | Cal.com | Embedded widget |
| Email | AgentMail | API-based |

## Environment Variables

### Vercel Dashboard

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `AGENTMAIL_API_KEY` | AgentMail API key |
| `NEXT_PUBLIC_CAL_LINK` | Cal.com booking link |

### Local Development

```bash
# .env.local (gitignored)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
AGENTMAIL_API_KEY=am_...
NEXT_PUBLIC_CAL_LINK=https://cal.com/yourname/buildwithaigiri
```

## Vercel Setup

### First-Time Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

Or connect GitHub repo to Vercel for auto-deploys on push to `main`.

### Vercel Configuration

In `next.config.ts`:
```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};
export default nextConfig;
```

### Vercel Analytics

```bash
npm install @vercel/analytics
```

Add to root layout:
```tsx
import { Analytics } from "@vercel/analytics/react";
// Inside <body>: <Analytics />
```

## Supabase Setup

### Create Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy the project URL and keys from Settings > API

### Create Tables

Run in Supabase SQL editor:

```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT,
  company TEXT,
  idea_title TEXT NOT NULL,
  idea_description TEXT NOT NULL,
  target_audience TEXT,
  business_model TEXT,
  referral_source TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id),
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  is_open_source BOOLEAN DEFAULT true,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_email ON submissions(email);
CREATE INDEX idx_projects_week ON projects(week_number);
```

### Row Level Security

```sql
-- Projects are publicly readable
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects are publicly readable"
  ON projects FOR SELECT USING (true);

-- Submissions are insert-only from public, read via service role
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit ideas"
  ON submissions FOR INSERT WITH CHECK (true);
```

## GitHub Actions CI

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run lint
      - run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: https://placeholder.supabase.co
          NEXT_PUBLIC_SUPABASE_ANON_KEY: placeholder
          NEXT_PUBLIC_CAL_LINK: https://cal.com/placeholder
```

## .gitignore

```gitignore
node_modules/
.next/
.env
.env.local
.env.production
.vercel/
*.log
```

## Custom Domain

1. Add domain in Vercel dashboard > Settings > Domains
2. Point DNS: CNAME `www` to `cname.vercel-dns.com`
3. Or A record for apex domain to Vercel IP
4. SSL is automatic via Let's Encrypt

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails | Check `npm run build` locally; ensure env vars are set |
| Supabase connection error | Verify `NEXT_PUBLIC_SUPABASE_URL` and keys |
| API route 500 | Check Vercel function logs; ensure `SUPABASE_SERVICE_ROLE_KEY` is set |
| Images not loading | Add hostname to `next.config.ts` `images.remotePatterns` |
| CORS errors | Supabase handles CORS; check API route headers if custom |

## Key Rules

1. **Never commit `.env.local`** -- secrets only in Vercel dashboard
2. **`NEXT_PUBLIC_` vars are build-time** -- redeploy after changing them
3. **Test builds locally** before pushing: `npm run build`
4. **Vercel auto-deploys** on push to `main` when connected
5. **Use preview deployments** for PRs -- Vercel creates them automatically
