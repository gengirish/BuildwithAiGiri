---
name: spec-kit
description: Use GitHub Spec Kit for Spec-Driven Development during weekly MVP builds. Use when planning a new week's build, creating specifications, generating implementation plans, breaking down tasks, or following a structured development workflow.
---

# Spec Kit - Spec-Driven Development

[GitHub Spec Kit](https://github.com/github/spec-kit) is a toolkit for Spec-Driven Development where specifications are executable, directly generating working implementations rather than just guiding them.

## Why Use Spec Kit for BuildwithAiGiri

Each week's MVP build follows a disciplined process:
1. Define what to build (from the brainstorming call)
2. Create a specification (requirements + user stories)
3. Plan the technical implementation
4. Break into tasks
5. Execute implementation

Spec Kit automates this entire flow.

## Installation

```bash
# Persistent install (recommended)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# Verify
specify check
```

## Initialize in Project

```bash
# For Cursor
specify init . --ai cursor-agent

# Or with --here flag
specify init --here --ai cursor-agent

# Force merge into existing directory
specify init . --force --ai cursor-agent
```

This creates the `.specify/` directory with templates and scripts, and makes slash commands available.

## Core Workflow (Slash Commands)

### Step 1: Establish Principles (once per project)

```
/speckit.constitution Create principles focused on rapid MVP delivery,
clean code, responsive design, and user-first development.
```

Creates `.specify/memory/constitution.md` with project guidelines.

### Step 2: Create Specification

```
/speckit.specify Build a SaaS dashboard for [collaborator's idea].
Users can sign up, create projects, track metrics, and export reports.
The dashboard should have a clean, modern UI with real-time updates.
```

Focus on the **what** and **why**, not the tech stack. Output: `.specify/specs/{feature}/spec.md`

### Step 3: Clarify (Optional but Recommended)

```
/speckit.clarify
```

Structured questioning to fill gaps in the specification before planning.

### Step 4: Plan Implementation

```
/speckit.plan Use Next.js 15 with App Router, Tailwind CSS, shadcn/ui,
Supabase for database and auth, and deploy on Vercel.
```

Now specify the tech stack. Output: `plan.md`, `data-model.md`, `research.md`, contracts.

### Step 5: Generate Tasks

```
/speckit.tasks
```

Creates `tasks.md` with:
- Tasks organized by user story
- Dependency ordering
- Parallel execution markers `[P]`
- File paths for each task

### Step 6: Implement

```
/speckit.implement
```

Executes all tasks in order, respecting dependencies and parallelism.

## Optional Commands

| Command | Purpose |
|---------|---------|
| `/speckit.clarify` | Fill specification gaps with structured Q&A |
| `/speckit.analyze` | Cross-artifact consistency check (run after tasks) |
| `/speckit.checklist` | Generate quality checklists for requirements validation |

## Directory Structure After Setup

```
.specify/
├── memory/
│   └── constitution.md         # Project principles
├── scripts/                    # Shell scripts for git/branch management
├── specs/
│   └── 001-feature-name/
│       ├── spec.md             # Functional specification
│       ├── plan.md             # Technical implementation plan
│       ├── tasks.md            # Task breakdown
│       ├── data-model.md       # Database schema
│       ├── research.md         # Tech stack research
│       └── contracts/          # API specs, etc.
└── templates/
    ├── spec-template.md
    ├── plan-template.md
    └── tasks-template.md
```

## Weekly Build Workflow

For each week of the 25-week buildathon:

1. **Monday**: After brainstorming call, run `/speckit.specify` with the collaborator's idea
2. **Monday**: Run `/speckit.clarify` to fill gaps, then `/speckit.plan` with tech choices
3. **Tuesday**: Run `/speckit.tasks` to get the breakdown, review and adjust
4. **Tuesday-Friday**: Run `/speckit.implement` and iterate
5. **Friday**: Ship, handover code, publish to showcase

## Tips

- **Be explicit** in `/speckit.specify` about what you want -- the more detail, the better the spec
- **Don't specify tech stack** in the specify step -- save that for `/speckit.plan`
- **Review research.md** to catch any wrong assumptions about frameworks
- **Use `/speckit.analyze`** after tasks to catch inconsistencies before implementation
- **Each week creates a new feature branch** (e.g., `001-create-saas-dashboard`)

## Upgrading

```bash
uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git
```
