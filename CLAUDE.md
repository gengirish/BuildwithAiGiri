# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

MVP Labs by IntelliForge AI — a marketing + intake site for a "25 MVPs in 25 weeks" program. Visitors submit product ideas, submissions land in Supabase and trigger emails, an admin approves a submission (which creates a Google Calendar invite with a Meet link and sends an approval email), and completed builds appear on the showcase page.

Production: `https://mvplabs.intelliforge.tech` (Vercel, auto-deploys on push to `master`).

## Commands

```bash
npm run dev                 # dev server on :3000
npm run build               # production build
npm run lint                # eslint (eslint-config-next)

npm run test:e2e            # Playwright (auto-starts `npm run dev` on :3000)
npm run test:e2e:ui         # interactive UI mode
npx playwright test e2e/landing.spec.ts                    # single file
npx playwright test -g "should render hero section"        # single test by name
npx playwright show-report
BASE_URL=https://mvplabs.intelliforge.tech npx playwright test   # run against a deployment
```

Database migrations (Python/Alembic, separate from the Node toolchain):

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head                              # DATABASE_URL is read from .env.local
alembic revision --autogenerate -m "description"
alembic downgrade -1
```

Local setup: `cp .env.example .env.local` and fill in keys. Everything degrades gracefully when keys are missing (see below), so the app still runs with an empty `.env.local`.

## Architecture

**Stack**: Next.js 16 App Router, React 19, TypeScript (strict), Tailwind v4 (no config file — tokens live in `src/app/globals.css`), Supabase (Postgres), Google APIs (Gmail + Calendar), AgentMail, Playwright.

### Optional-integration pattern

Every external integration is *optional at runtime*. `src/lib/supabase.ts` and `src/lib/google.ts` return `null` when their env vars are absent instead of throwing, and callers branch on `null`:

- `getServiceClient()` returns `null` → `/api/submissions` POST logs the submission and still returns 201; GET returns `[]`.
- `getGmail()` / `getCalendar()` return `null` → email falls back to AgentMail; calendar invite is skipped and approval email is sent without a Meet link.

Preserve this when adding integrations — the site and the E2E suite must work with zero credentials configured.

### Email chain

`src/lib/email-service.ts` owns all message copy (plain-text + HTML). It tries Gmail first (`gmail-service.ts`, hand-built base64url MIME via the Gmail API and a refresh token), and falls back to the AgentMail REST API. Emails are fired without `await` in route handlers (`.catch(console.error)`) so a mail failure never fails the submission.

Google auth uses a long-lived refresh token, not a session: hit `/api/auth/google` in a browser, consent, and `/api/auth/google/callback` renders the refresh token as HTML for you to paste into `GOOGLE_REFRESH_TOKEN`.

### API routes (`src/app/api/`)

All are `export const dynamic = "force-dynamic"`. Error shape is `{ error: string }` + status; success is `{ success: true, message }` or the raw rows.

- `POST /api/submissions` — the most involved route. Layered anti-bot: in-memory per-IP rate limit (5/min), honeypot field `_hp` (returns a fake 201), and timestamp `_t` minimum fill time of 800ms (422). Validates with `submissionSchema`, empty optional strings are normalized to `null`.
- `GET /api/submissions` — unauthenticated list used by `/dashboard`. There is no auth on it today.
- `POST /api/admin/approve` — guarded by an `x-admin-key` header matching `ADMIN_SECRET`. Creates the calendar invite, sends the approval email, then sets `status: "selected"`.

The rate limiter is a module-level `Map`, so it is per-instance and resets on cold start — it is friction, not a real limit.

### Phone-column resilience

`submissions.phone` may not exist in an older deployed database. The POST route inserts with `phone`, detects a missing-column error (`isMissingPhoneColumnError`, incl. PostgREST `PGRST204`/schema-cache wording), and retries the insert without it rather than failing the user. Do not remove this until every environment has the column.

### Two migration paths

`migrations/` (Alembic, models in `migrations/models.py`) is the source of truth for schema. `supabase/migrations/*.sql` holds idempotent hand-run SQL for the Supabase SQL Editor when Alembic can't be pointed at the DB. Schema changes generally need both, plus the matching TypeScript interface in `src/types/index.ts`.

Tables: `submissions` (status enum-as-text: `pending | reviewing | call_scheduled | selected | building | completed | declined`) and `projects` (`week_number` 1–25, `tech_stack text[]`).

### Frontend

`src/app/page.tsx` is a server component composing section components; `/submit`, `/showcase`, `/dashboard` are `"use client"` and fetch from the API routes. `/dashboard` is the admin submissions view (client-side filter/search over `GET /api/submissions`).

Conventions: components are PascalCase files directly in `src/components/` (no `ui/` subdirectory — shadcn primitives are not installed despite what the Cursor skills say); `@/*` maps to `src/*`; icons from `lucide-react` only; toasts via `sonner`; animation via `framer-motion`; forms via React Hook Form + `zodResolver` with schemas in `src/lib/validations.ts`.

Styling is dark-theme-only, driven by CSS variables and utility classes in `globals.css` — `glass-card`, `gradient-text`, `glow-cyan`, `bg-grid`, accent `#06b6d4`. Headings use `font-[var(--font-space)]` (Space Grotesk); body is Inter.

### E2E tests

Playwright specs in `e2e/` assert on user-visible copy (`getByRole`, `getByText`) rather than test ids, so **changing marketing copy breaks tests** — grep `e2e/` before editing section headings or badges. Chromium only; `webServer` reuses an already-running dev server locally.

## `.cursor/skills/`

Reference docs for the project (architecture, API conventions, deploy, Playwright, AgentMail, anti-bot). Useful context, but partly stale — they describe Next 15, a `components/ui/` directory, and a `CalEmbed` component that do not exist here. Trust the code over the skills.

## Other docs

`BETA_TESTING.md` — manual QA checklist covering every page, form validation case, and email/calendar flow. `LINKEDIN_STRATEGY.md` — marketing content, not engineering.
