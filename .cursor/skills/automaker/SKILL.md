---
name: automaker
description: Use Automaker for Kanban-based AI agent orchestration during weekly MVP builds. Use when setting up Automaker, creating feature cards, managing AI agent execution, or orchestrating multi-agent development workflows for BuildwithAiGiri buildathon weeks.
---

# Automaker - AI Development Studio

[Automaker](https://github.com/AutoMaker-Org/automaker) is an autonomous AI development studio that transforms feature descriptions into working code. Instead of writing every line, you define features on a Kanban board and AI agents implement them in isolated git worktrees.

## Prerequisites

- **Node.js 22+** (required: >=22.0.0 <23.0.0)
- **npm** (comes with Node.js)
- **Claude Code CLI** -- installed and authenticated with Anthropic subscription

## Quick Start

```bash
# Clone the repo
git clone https://github.com/AutoMaker-Org/automaker.git
cd automaker

# Install dependencies
npm install

# Start Automaker
npm run dev
# Choose: Web Application (browser at localhost:3007) or Desktop (Electron)
```

## Core Workflow

### 1. Add Features to Kanban Board

Create feature cards with:
- Clear description of what to build
- Screenshots or wireframes (image support)
- Technical constraints or preferences

### 2. Move to "In Progress"

Automaker automatically assigns an AI agent to implement the feature.

### 3. Watch Real-Time Implementation

- Live streaming of agent output
- See tool usage, file changes, and progress
- Send follow-up instructions without stopping the agent

### 4. Review and Verify

- Features move to "Waiting Approval" when done
- Review changes via built-in git diff viewer
- Run tests to verify implementation

### 5. Approve and Ship

- Commit changes from the isolated worktree
- Create PRs directly from Automaker
- Feature moves to "Verified"

## Planning Modes

| Mode | Description | When to Use |
|------|-------------|-------------|
| **skip** | Direct implementation, no plan | Simple features, quick fixes |
| **lite** | Quick plan before implementation | Moderate features |
| **spec** | Task breakdown with dedicated agents per task | Complex features (recommended for MVPs) |
| **full** | Phased execution with checkpoints | Large multi-component features |

For weekly MVP builds, **spec mode** is recommended -- it breaks the MVP into tasks and assigns dedicated agents per task.

## Git Worktree Isolation

Each feature executes in an isolated git worktree:
- Your main branch stays clean
- Multiple features can run concurrently (default: 3)
- Changes are reviewed before merging

## Weekly Build Workflow with Automaker

For each week of the 25-week BuildwithAiGiri buildathon:

### Monday (after brainstorming call)

1. Open the collaborator's project in Automaker
2. Create feature cards from the spec/plan (use Spec Kit output)
3. Set planning mode to **spec** for structured implementation

### Tuesday-Thursday

4. Move features to "In Progress" -- agents start implementing
5. Monitor real-time progress, send follow-up instructions as needed
6. Review completed features in "Waiting Approval"

### Friday

7. Run tests, verify all features
8. Commit and create PR
9. Hand over code to the collaborator

## Key Features

| Feature | Description |
|---------|-------------|
| **Multi-Model Support** | Choose from Claude Opus, Sonnet, Haiku per feature |
| **Extended Thinking** | Enable thinking modes (none, medium, deep, ultra) |
| **Plan Approval** | Review AI-generated plans before implementation |
| **Follow-up Instructions** | Send additional instructions to running agents |
| **Context Files** | Add markdown/images that agents reference |
| **Dependency Blocking** | Features can depend on other features |
| **Graph View** | Visualize feature dependencies |
| **Integrated Terminal** | Full terminal access within Automaker |
| **GitHub Integration** | Import issues, create PRs |

## Running Modes

```bash
# Web browser (http://localhost:3007)
npm run dev:web

# Electron desktop app (recommended)
npm run dev:electron

# With DevTools
npm run dev:electron:debug

# Interactive launcher
./start-automaker.sh
```

## Views

| View | Shortcut | Purpose |
|------|----------|---------|
| Board | K | Kanban board for feature workflow |
| Agent | A | Interactive chat with AI agents |
| Spec | D | Project specification editor |
| Context | C | Manage context files for agents |
| Terminal | T | Integrated terminal |
| Graph | H | Feature dependency visualization |
| GitHub Issues | G | Import and validate GitHub issues |

## Combining with Spec Kit

1. Run Spec Kit's `/speckit.specify` and `/speckit.plan` to create the specification
2. Run `/speckit.tasks` to get the task breakdown
3. Import tasks into Automaker as feature cards
4. Let Automaker's agents execute each task in isolated worktrees
5. Review and approve each completed feature

## Key Rules

1. **Always use spec mode** for weekly MVP builds -- it provides the best structure
2. **Review plans before implementation** -- enable plan approval
3. **Use context files** -- add the Spec Kit output as context for agents
4. **Set concurrency to 2-3** -- don't overwhelm with too many parallel agents
5. **Review every feature** before moving to Verified
6. **Git worktrees are ephemeral** -- commit important changes before cleaning up
