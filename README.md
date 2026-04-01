# BluLoomAI

[![CI](https://github.com/notsoocool/bluloomai/actions/workflows/ci.yml/badge.svg)](https://github.com/notsoocool/bluloomai/actions/workflows/ci.yml)

**Repository:** [github.com/notsoocool/bluloomai](https://github.com/notsoocool/bluloomai)

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

## Documentation

- [docs/README.md](./docs/README.md) – index of technical docs
- [docs/API_ROUTES.md](./docs/API_ROUTES.md) – API reference
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) – architecture overview

## Contributing

We welcome issues and pull requests. Please read:

- [CONTRIBUTING.md](./CONTRIBUTING.md) – setup, branches, PR checklist
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) – community standards

Report security issues privately per [SECURITY.md](./SECURITY.md), not via public issues.

**Maintainers:** enable [Private vulnerability reporting](https://github.com/notsoocool/bluloomai/security) (recommended) and keep [SECURITY.md](./SECURITY.md) up to date.

## License

This project is licensed under the [MIT License](./LICENSE). Replace the copyright line in `LICENSE` with your legal name or organization if you are the primary rights holder.

## CI

GitHub Actions runs lint and production build on pushes and PRs to `main` (see `.github/workflows/ci.yml`). Optional: add Clerk keys as repository secrets so CI matches your production Clerk project.
