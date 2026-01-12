# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DoseTrack (also "LogMyDose" or "PepRX") is a peptide therapy tracking platform with a D2C-first model and optional clinic integration. The platform provides AI-powered ambient intelligence that proactively surfaces insights without requiring user prompts.

**Current Status**: Planning phase - see `VISION.md` for product vision and `logmydose-plan.md` for detailed implementation plan.

## Target Tech Stack

### Backend (to be built in `/api`)
- Express.js with TypeScript
- PostgreSQL via Prisma ORM (Supabase for production, Docker for local dev)
- JWT authentication (access + refresh tokens)
- Anthropic Claude API for AI features
- Zod for request validation

### Web Portals (to be built in `/web`)
- React 18+ with Vite
- TailwindCSS
- React Query for data fetching
- Three portals: clinic-portal, admin-portal, patient-portal

### iOS App (to be built in `/ios`)
- Swift 5.9+ with SwiftUI

## Architecture Decisions

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

## Project Structure (Planned)

```
/api                    # Express.js backend
  /src/routes           # API routes
  /src/services         # Business logic
  /src/services/ai      # AI services (insights, annotations, reports)
  /src/ai/providers     # LLM clients (Anthropic, OpenAI)
  /src/ai/prompts       # Prompt templates
  /src/middleware       # Auth, tenant context, audit logging
  /prisma               # Database schema and migrations
/web
  /clinic-portal        # Clinic management React app
  /admin-portal         # Super admin React app
  /patient-portal       # Patient web app
/ios                    # Swift/SwiftUI iOS app
```

## Key Data Models

Core entities from the planned schema:
- `tenants`: Clinic/white-label instances
- `patients`: Unified D2C and clinic-managed users
- `substances`: Generic substance database (peptides, hormones, supplements)
- `substance_categories`: Extensible categories for future verticals
- `protocols`: Patient's active protocols
- `doses`: Dose logging
- `side_effects`: Side effect tracking
- `ai_insights`: Pre-generated AI insight cards
- `ai_annotations`: Cached AI annotations for data points
- `ai_reports`: Weekly/monthly AI reports

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

- Always run both build and lint when building the project (`npm run build && npm run lint`)
