---
name: agency-agents
description: Leverage specialized AI agent personalities from The Agency for weekly MVP builds. Use when selecting agent roles for a build week, activating agent personas, or needing specialized guidance for frontend, backend, design, testing, or project management tasks.
---

# Agency Agents - AI Specialist Personas

[The Agency](https://github.com/msitarzewski/agency-agents) is a collection of 55+ specialized AI agent personalities. Each agent has deep expertise, a unique voice, and proven workflows. Use them during BuildwithAiGiri weekly builds to get specialized guidance.

## How to Use

1. Clone or download the repo: `git clone https://github.com/msitarzewski/agency-agents.git`
2. Before each week's build, select 3-4 relevant agents based on the MVP type
3. Add the agent personality file content to your Cursor context or system prompts
4. Activate by referencing: "Act as the Frontend Developer agent and help me build..."

## Recommended Agents for Weekly MVP Builds

### Engineering Division

| Agent | File | When to Use |
|-------|------|-------------|
| Frontend Developer | `engineering/engineering-frontend-developer.md` | React/Next.js UI implementation |
| Backend Architect | `engineering/engineering-backend-architect.md` | API design, database architecture |
| Rapid Prototyper | `engineering/engineering-rapid-prototyper.md` | Fast MVP iteration, hackathon-style builds |
| DevOps Automator | `engineering/engineering-devops-automator.md` | CI/CD, deployment, infrastructure |
| AI Engineer | `engineering/engineering-ai-engineer.md` | AI/ML features, LLM integration |

### Design Division

| Agent | File | When to Use |
|-------|------|-------------|
| UI Designer | `design/design-ui-designer.md` | Visual design, component libraries |
| UX Researcher | `design/design-ux-researcher.md` | User testing, behavior analysis |
| Brand Guardian | `design/design-brand-guardian.md` | Brand consistency, identity |

### Product Division

| Agent | File | When to Use |
|-------|------|-------------|
| Sprint Prioritizer | `product/product-sprint-prioritizer.md` | Feature prioritization for the week |
| Feedback Synthesizer | `product/product-feedback-synthesizer.md` | Analyzing collaborator feedback |

### Testing Division

| Agent | File | When to Use |
|-------|------|-------------|
| Evidence Collector | `testing/testing-evidence-collector.md` | Screenshot-based QA, visual proof |
| Reality Checker | `testing/testing-reality-checker.md` | Production readiness validation |

### Project Management

| Agent | File | When to Use |
|-------|------|-------------|
| Senior Project Manager | `project-management/project-manager-senior.md` | Scoping weekly MVPs, task conversion |
| Project Shepherd | `project-management/project-management-project-shepherd.md` | Cross-functional coordination |

## Weekly Agent Selection Guide

Pick agents based on what the week's MVP needs:

| MVP Type | Recommended Agents |
|----------|-------------------|
| **SaaS Dashboard** | Frontend Developer, Backend Architect, UI Designer |
| **Landing Page / Marketing** | Frontend Developer, Brand Guardian, UX Researcher |
| **AI-Powered App** | AI Engineer, Backend Architect, Frontend Developer |
| **Mobile App** | Mobile App Builder, UI Designer, Rapid Prototyper |
| **API / Backend Service** | Backend Architect, DevOps Automator, Reality Checker |
| **E-commerce / Marketplace** | Frontend Developer, Backend Architect, Sprint Prioritizer |

## Activation Pattern

In Cursor, add the agent content to your conversation context:

```
I'm building a SaaS analytics dashboard this week. I want you to act as
the Rapid Prototyper agent. Here are your agent instructions:

[Paste content from engineering/engineering-rapid-prototyper.md]

Now help me build the MVP starting with the project structure.
```

## Agent Design Philosophy

Each agent provides:
- **Specialized expertise** -- not generic prompt templates
- **Clear deliverables** -- concrete code and outputs
- **Success metrics** -- measurable quality standards
- **Proven workflows** -- step-by-step processes

## Key Rules

1. **Select agents before starting** each week's build
2. **Don't mix too many agents** -- 3-4 is optimal per week
3. **Use the Rapid Prototyper** for time-constrained weeks
4. **Use the Reality Checker** before every Friday handover
5. **Agent files are standalone** -- no dependencies between them
