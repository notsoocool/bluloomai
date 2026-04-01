# Security policy

## Supported versions

We prioritize security fixes for the latest release on the default `main` branch. Older commits may not receive backports unless agreed with maintainers.

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Instead, report privately so we can fix the issue before it is widely disclosed:

1. Use [**GitHub Security Advisories**](https://github.com/notsoocool/bluloomai/security/advisories/new) for this repository (**Security → Report a vulnerability**), or
2. Email the maintainers at a dedicated security address if one is published in the repo or org profile, or
3. Open a **private** discussion with maintainers only if no other channel exists.

Include:

- Description of the issue and potential impact
- Steps to reproduce (if safe to share)
- Affected versions or areas (e.g. API route, dependency)

We will acknowledge receipt as soon as we can and coordinate a fix and disclosure timeline.

## Scope

In scope:

- This application codebase and its configuration as shipped in this repository
- Authentication and authorization flows (e.g. Clerk integration)
- API routes under `app/api/` and handling of secrets

Typically out of scope:

- Third-party services (Clerk, Supabase, Meta, OpenAI) — report to the vendor per their policies
- Social engineering or physical attacks
- Issues requiring physical access to a user’s device

## Safe harbor

We support good-faith security research that follows this policy and applicable laws. Do not access data that is not yours, and do not degrade service for others.
