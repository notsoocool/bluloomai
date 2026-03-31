# BluLoomAI

Growth Intelligence Platform for micro-influencers (1k–100k followers). AI-driven analytics and content intelligence to increase reach, engagement, and follower growth.

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- TailwindCSS + Shadcn UI
- Supabase (PostgreSQL)
- Clerk (authentication)
- Instagram Graph API (official Meta API only)
- OpenAI API

## Getting Started

### 1. Install dependencies

This repo pins the pnpm store to `.pnpm-store/v10` via `.npmrc` so `pnpm add` (including the shadcn CLI) doesn’t hit **ERR_PNPM_UNEXPECTED_STORE**.

```bash
pnpm install
```

Add UI components (uses project `.npmrc` store):

```bash
pnpm exec shadcn add button card accordion
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your keys. See `docs/ENV_VARIABLES.md` for details.

```bash
cp .env.example .env.local
```

**Required:** Supabase, Clerk, Meta (Instagram), OpenAI.

### 3. Database

Run the Supabase migration in `supabase/migrations/001_initial_schema.sql` via the Supabase SQL Editor or CLI.

### 4. Run development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

**Clerk “Publishable key not valid” in `proxy.ts`:** Your real key must be in `.env.local`, then clear the build cache and restart:

```bash
rm -rf .next && pnpm dev
```

`next.config.ts` loads `.env*` early so the Edge proxy picks up `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.

**Turbopack errors** (`Persisting failed`, `Unable to open static sorted file *.sst`, `corrupted database`, `Cannot find module ... middleware-manifest.json`):

1. Stop **all** `next dev` processes (only one dev server should use `.next`).
2. Wipe the dev cache and restart:

   ```bash
   rm -rf .next && pnpm dev
   ```

3. If it keeps happening, use webpack for dev instead of Turbopack:

   ```bash
   rm -rf .next && pnpm dev:webpack
   ```

### 5. Build (for production)

```bash
pnpm build
```

**Note:** Build requires `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to be set (Clerk validates keys at build time). For CI without real keys, use placeholder values.

## Project Structure

- `/app` – Next.js pages and API routes
- `/components` – React components (UI, dashboard)
- `/services` – Business logic (Instagram, analytics, AI, content generation)
- `/repositories` – Database access layer
- `/lib` – Utilities, Supabase, OpenAI clients
- `/types` – TypeScript types

## Key Pages

- `/` – Landing
- `/dashboard` – Overview, connect Instagram, sync, metrics
- `/analytics` – Engagement metrics, posting times
- `/insights` – Viral pattern analysis (top vs bottom posts)
- `/generate` – Reel scripts, captions, hook optimizer
