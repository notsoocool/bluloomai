# Contributing to BluLoomAI

Thank you for helping improve BluLoomAI. This document explains how to set up the project, propose changes, and open pull requests.

## Code of conduct

All participants are expected to follow our [Code of Conduct](./CODE_OF_CONDUCT.md). Be respectful, inclusive, and constructive.

## Ways to contribute

- Report bugs or suggest features via [**GitHub Issues**](https://github.com/notsoocool/bluloomai/issues) (use the templates when available).
- Pick an issue labeled `good first issue` or `help wanted`.
- Improve documentation (`README.md`, `docs/`, this file).
- Fix typos, accessibility, or UI polish.

**Before large refactors or new features:** open an issue (or comment on an existing one) so maintainers can align on scope.

## Development setup

1. **Prerequisites:** Node.js 20+ (LTS recommended), [pnpm](https://pnpm.io/), a GitHub account.

2. **Clone** the upstream repo, or **fork** and clone your fork and add `upstream`:

   ```bash
   git clone https://github.com/notsoocool/bluloomai.git
   cd bluloomai
   ```

   If you use a fork:

   ```bash
   git clone https://github.com/<your-username>/bluloomai.git
   cd bluloomai
   git remote add upstream https://github.com/notsoocool/bluloomai.git
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Environment:** Copy `.env.example` to `.env.local` and fill in values. See [docs/ENV_VARIABLES.md](./docs/ENV_VARIABLES.md) for details. You need Clerk, Supabase, Meta (Instagram), and OpenAI keys for full local testing.

5. **Database:** Apply migrations from `supabase/migrations/` as described in the README.

6. **Run the app**

   ```bash
   pnpm dev
   ```

7. **Lint before you push**

   ```bash
   pnpm lint
   ```

8. **Build (optional sanity check)**

   ```bash
   pnpm build
   ```

If Clerk or Turbopack misbehave, see troubleshooting in [README.md](./README.md).

## Project orientation

| Area | Location |
|------|----------|
| App routes & pages | `app/` |
| API route handlers | `app/api/` |
| UI components | `components/` |
| Business logic | `services/` |
| Data access | `repositories/` |
| Shared types | `types/` |

Further reading:

- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [docs/API_ROUTES.md](./docs/API_ROUTES.md)

## Branching and commits

- Use a **feature branch** off `main`, e.g. `fix/login-redirect` or `feat/loading-skeleton`.
- Keep commits **focused**; prefer small PRs over one huge change.
- Write **clear commit messages** (imperative mood: “Add loading state for analytics”).

## Pull requests

1. Update or add **documentation** if behavior or env vars change.
2. Ensure **`pnpm lint`** passes and the app **builds** when your change touches production code.
3. Describe **what** changed and **why** in the PR body. Link issues with `Closes #123` or `Refs #123` when applicable.
4. Add **screenshots** for UI changes when helpful.

Maintainers may request changes; updating your branch is expected.

## Style and conventions

- **TypeScript** for application code; avoid `any` unless justified.
- **Match existing patterns** in the same file (imports, naming, component structure).
- **UI:** Tailwind + existing glass/landing tokens; avoid duplicating large design systems without discussion.
- **API routes:** Return consistent JSON errors (`{ error: string }`) and appropriate HTTP status codes; use Clerk `auth()` where routes are user-scoped.

## Continuous integration

[`.github/workflows/ci.yml`](./.github/workflows/ci.yml) runs **ESLint** and **`pnpm build`** on pushes and pull requests targeting `main`.

**Optional (maintainers):** add repository **Actions secrets** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` so the build step matches your Clerk app. If those secrets are missing, the workflow uses placeholder values so the build can still complete (same idea as in the README for local CI).

## Security

Do **not** commit secrets, `.env.local`, or keys. Report security issues via [SECURITY.md](./SECURITY.md), not public issues.

## Questions

Open a [**Discussion**](https://github.com/notsoocool/bluloomai/discussions) or [**issue**](https://github.com/notsoocool/bluloomai/issues) if something in this guide is unclear.
