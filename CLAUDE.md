# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LogMyDose is a peptide therapy tracking platform with a D2C-first model and optional clinic integration. The platform provides AI-powered ambient intelligence that proactively surfaces insights without requiring user prompts.

**Current Status**: Active development - see `vision.md` for product vision and `logmydose-plan.md` for detailed implementation plan.

## Tech Stack

### Backend (`/api`)
- Express.js with TypeScript
- PostgreSQL via Prisma ORM (Supabase for production, Docker for local dev)
- JWT authentication (access + refresh tokens)
- Anthropic Claude API for AI features
- Zod for request validation

### Web Applications
- React 18+ with Vite
- TailwindCSS
- React Query for data fetching
- Shared UI components from `@logmydose/ui`

### Mobile App (`/mobile`)
- React Native with TypeScript
- Expo with file-based routing (Expo Router)
- NativeWind for styling (TailwindCSS-compatible)
- React Query for data fetching

### Background Workers (`/workers`)
- BullMQ for job processing
- PDF export, email notifications, async tasks

## Architecture Decisions

### Monorepo Structure
- npm workspaces for package management
- Shared packages in `/packages` for code reuse
- Run `npm run build` from root to build all packages

### Multi-tenancy
- All tenant-scoped tables include `tenant_id` with Row Level Security (RLS) policies
- `clinic_id` is optional in patients table (NULL = D2C user)

### AI Strategy ("Ambient Intelligence")
The platform's core differentiator is AI that works proactively, not reactively:
- **Proactive Insight Cards**: Pattern detection, progress updates, safety alerts
- **Inline Annotations**: AI context on dose logs and bloodwork
- **Periodic Reports**: Weekly/monthly AI-generated summaries
- **Contextual Decision Support**: AI prompts before user actions
- **Smart UI Highlighting**: Interface adapts based on AI analysis
- **"Why" Layer**: Tap-to-explain on any data point

### HIPAA Compliance
- D2C self-tracking = personal health app (lighter compliance)
- Clinic integration = full HIPAA compliance required
- Build with HIPAA-ready architecture from start
- BAAs required with Supabase, hosting provider for PHI

## Project Structure

```
/api                    # Express.js backend
  /src/routes           # API routes
  /src/services         # Business logic
  /src/repositories     # Data access layer
  /src/middleware       # Auth, tenant context, audit logging
  /src/lib              # Utilities and helpers
/web-app                # Patient portal (React + Vite)
  /src/pages            # Page components
  /src/components       # UI components
  /src/hooks            # Custom React hooks
/admin-app              # Admin portal (React + Vite)
  /src/pages            # Admin pages
  /src/components       # Admin components
/web-landing            # Marketing landing page
  /src/components       # Landing page components
/mobile                 # React Native app (Expo)
  /app                  # File-based routing (Expo Router)
  /src/components       # Mobile components
  /src/hooks            # Mobile hooks
  /src/contexts         # React contexts
/packages
  /shared               # Shared TypeScript types, entities, DTOs
    /src/entities       # Entity definitions
    /src/types          # Type definitions
    /src/queues         # Queue job definitions
    /prisma             # Prisma schema and migrations
  /ui                   # Shared UI component library
    /src/components     # Reusable React components
/workers                # Background job workers (BullMQ)
  /src/processors       # Job processors
  /src/services         # Worker services
  /src/templates        # Email/PDF templates
```

## Key Data Models

Core entities (defined in `/packages/shared/src/entities`):
- `tenants`: Clinic/white-label instances
- `patients`: Unified D2C and clinic-managed users
- `products`: Products (peptides, hormones, supplements)
- `protocols`: Patient's active protocols
- `doses`: Dose logging
- `side_effects`: Side effect tracking
- `ai_insights`: Pre-generated AI insight cards
- `ai_annotations`: Cached AI annotations for data points
- `ai_reports`: Weekly/monthly AI reports

## Development Commands

```bash
# Install dependencies
npm install

# Start development (API + landing + web app)
npm run dev

# Individual services
npm run dev:api        # Backend API
npm run dev:app        # Patient web app
npm run dev:admin      # Admin portal
npm run dev:landing    # Landing page
npm run dev:workers    # Background workers

# Build
npm run build          # Build all packages
npm run build:api      # Build API only
npm run build:app      # Build web app only

# Infrastructure
npm run docker:up      # Start PostgreSQL + Redis
npm run docker:down    # Stop containers

# Quality
npm run lint           # Lint all workspaces
npm run typecheck      # Type check all workspaces
```

## Medical/Safety Constraints

When implementing AI features:
- All AI outputs must include "AI-generated" indicator
- Never diagnose or recommend starting/stopping medications
- Use language like "your data suggests" not "you have" or "you should"
- Implement escalation triggers for severe side effects or concerning patterns
- Include medical disclaimers on insights that could be interpreted as medical advice

## Git Guidelines

- Do not include "Co-Authored-By: Claude" or any Claude attribution in commit messages

## Build Guidelines

- Always run build, lint and pretty print when building the project

## File Creation Guidelines

- For markdown files (.md) other than CLAUDE.md the naming convention should always be kebab case instead of upper case. 
