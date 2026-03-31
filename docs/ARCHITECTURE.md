# BluLoomAI Architecture

## Overview

BluLoomAI is a Growth Intelligence Platform for micro influencers (1k–100k followers). It uses AI-driven analytics and content intelligence to help creators increase reach, engagement, saves, shares, comments, and follower growth.

**Core Principle:** This is NOT an automation-first tool. It is a Growth Intelligence Platform.

---

## Folder Structure

```
/app                    # Next.js App Router pages
  /(auth)               # Auth routes (sign-in, sign-up)
  /(dashboard)          # Protected dashboard routes
  /api                  # API route handlers
/components             # React components
  /ui                   # Shadcn UI primitives
  /dashboard            # Dashboard-specific components
/lib                    # Shared utilities, config, clients
  /supabase             # Supabase client
  /clerk                # Clerk auth helpers
  /openai               # OpenAI client
/services               # Business logic layer
  /instagram            # Instagram Graph API integration
  /analytics            # Engagement & analytics engine
  /ai                   # AI content intelligence
  /viral-pattern        # Viral pattern engine
  /posting-time         # Smart posting time engine
  /content-generation   # Content generation engine
/repositories           # Data access layer (DB operations)
/types                  # TypeScript types & interfaces
/hooks                  # React hooks
```

---

## Layer Responsibilities

| Layer | Responsibility | Example |
|-------|----------------|---------|
| **API Routes** | HTTP handling, validation, auth | `POST /api/instagram/sync` |
| **Services** | Business logic, orchestration | `InstagramService.syncPosts()` |
| **Repositories** | DB CRUD, queries | `PostRepository.upsertMany()` |
| **Types** | Shared interfaces | `Post`, `EngagementMetrics` |

---

## Data Flow

```
User Request → API Route → Service → Repository → Supabase
                    ↓
              External APIs (Meta, OpenAI)
```

---

## Security Model

- **Auth:** Clerk (JWT, session management)
- **Tokens:** Encrypted at rest (Supabase Vault or app-level encryption)
- **RLS:** Row Level Security on all Supabase tables
- **Rate Limiting:** Per-user, per-endpoint
- **Input Validation:** Zod schemas on all API inputs

---

## Serverless Considerations

- Stateless services
- Connection pooling via Supabase
- Idempotent sync operations
- Chunked/batched processing for large datasets
- Cold start optimization (minimal imports)
