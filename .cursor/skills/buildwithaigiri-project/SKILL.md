---
name: buildwithaigiri-project
description: Provides architecture knowledge for the BuildwithAiGiri website. Use when exploring the codebase, adding features, debugging, or asking about project structure, tech stack, conventions, database schema, or design system.
---

# BuildwithAiGiri - Project Architecture

## Project Context

BuildwithAiGiri is a movement website where an experienced architect builds 25 software MVPs in 25 weeks for free, collaborating with founders, CTOs, and idea holders. The site collects idea submissions, facilitates brainstorming call bookings, and showcases completed projects.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Frontend | React 19, TypeScript, Tailwind CSS |
| Components | shadcn/ui, Radix UI primitives |
| Animations | Framer Motion 12 |
| Forms | React Hook Form + Zod |
| Database | Supabase (PostgreSQL) |
| Calendar | Cal.com embed |
| Email | AgentMail |
| Icons | Lucide React |
| Toasts | Sonner |
| Deployment | Vercel |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (dark theme, fonts, metadata)
│   ├── page.tsx                # Landing page (hero, how it works, about, FAQ)
│   ├── submit/
│   │   └── page.tsx            # Idea submission form
│   ├── showcase/
│   │   └── page.tsx            # Project portfolio (grows over 25 weeks)
│   ├── api/
│   │   ├── submissions/
│   │   │   └── route.ts        # POST: submit idea, GET: admin list
│   │   └── projects/
│   │       └── route.ts        # GET: public project list
│   └── globals.css             # Tailwind + custom CSS variables
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── Hero.tsx
│   ├── WeekCounter.tsx
│   ├── HowItWorks.tsx
│   ├── About.tsx
│   ├── IdeaForm.tsx
│   ├── ProjectCard.tsx
│   ├── Showcase.tsx
│   ├── FAQ.tsx
│   ├── CalEmbed.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/
│   ├── supabase.ts             # Supabase client (browser + server)
│   ├── validations.ts          # Zod schemas for forms and API
│   └── utils.ts                # cn() helper from shadcn
└── types/
    └── index.ts                # TypeScript interfaces
```

## Database Schema (Supabase)

### `submissions` table

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | `gen_random_uuid()` |
| full_name | text | required |
| email | text | required |
| role | text | Founder, CTO, CEO, etc. |
| company | text | nullable |
| idea_title | text | required |
| idea_description | text | required |
| target_audience | text | nullable |
| business_model | text | SaaS, subscription, marketplace |
| referral_source | text | nullable |
| status | text | pending / reviewing / call_scheduled / selected / building / completed / declined |
| created_at | timestamptz | default now() |

### `projects` table

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | `gen_random_uuid()` |
| submission_id | uuid (FK) | references submissions |
| week_number | int | 1-25 |
| title | text | project name |
| description | text | what was built |
| tech_stack | text[] | array of technologies |
| github_url | text | nullable |
| demo_url | text | nullable |
| is_open_source | boolean | default true |
| thumbnail_url | text | nullable |
| created_at | timestamptz | default now() |

## User Journey

```
Visit site → Explore Hero + How It Works → Submit Idea (form)
  → Idea stored in Supabase → Email notification via AgentMail
  → Review submission → Invite to book call (Cal.com)
  → Brainstorming call → Selected? → Build MVP that week
  → Code handover + team empowerment → Published to Showcase
```

## Design System

- **Background**: Dark (#0a0a0a to #111111)
- **Primary accent**: Electric blue (#3b82f6) or vibrant cyan (#06b6d4)
- **Secondary accent**: Neon green (#22c55e) for success states
- **Text**: White (#fafafa) primary, gray (#a1a1aa) secondary
- **Font**: Space Grotesk (headings), Inter (body)
- **Cards**: Glass-morphism with `bg-white/5 backdrop-blur-sm border border-white/10`
- **Animations**: Scroll-triggered fade-ins, counter animations, hover glows

## Environment Variables

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Supabase admin operations |
| `AGENTMAIL_API_KEY` | Server | AgentMail email sending |
| `NEXT_PUBLIC_CAL_LINK` | Client | Cal.com booking link |

## Conventions

### Naming

| Used for | Style | Example |
|----------|-------|---------|
| Components | PascalCase | `WeekCounter.tsx` |
| API routes | kebab-case dirs | `api/submissions/route.ts` |
| DB tables | snake_case | `submissions`, `projects` |
| CSS variables | kebab-case | `--card-border` |
| Lib files | camelCase | `supabase.ts`, `validations.ts` |

### Frontend Patterns

- All pages are `"use client"` unless purely static
- Use shadcn/ui primitives from `components/ui/`
- Toast notifications via `sonner` (`toast.success()`, `toast.error()`)
- Loading states: skeleton shimmer, never blank screens
- Icons: `lucide-react` exclusively
- Forms: React Hook Form + Zod resolver

### API Route Patterns

- All routes use `NextRequest`/`NextResponse` from `next/server`
- Error shape: `{ error: string }` with HTTP status
- Success shape: `{ success: true, message: string }` or direct data
- Rate limiting on public POST endpoints
- Supabase server client for DB operations
