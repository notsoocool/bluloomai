# BluLoomAI Environment Variables

Copy to `.env.local` and fill in values.

## Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Meta / Instagram Graph API
META_APP_ID=your-meta-app-id
META_APP_SECRET=your-meta-app-secret
NEXT_PUBLIC_META_REDIRECT_URI=https://your-domain.com/api/instagram/callback

# OpenAI
OPENAI_API_KEY=sk-...
```

## Optional

```env
# Clerk — only if you pass `secretKey` into `clerkMiddleware()` / proxy options (dynamic keys).
# Not needed when `CLERK_SECRET_KEY` is set in env only. See Clerk “dynamic keys” docs.
# CLERK_ENCRYPTION_KEY=...

# Token encryption (use Supabase Vault or custom)
# If not set, tokens stored with service role (ensure RLS protects)
ENCRYPTION_KEY=32-byte-hex-key-for-token-encryption

# Rate limiting
RATE_LIMIT_ANALYSIS_PER_DAY=50
RATE_LIMIT_GENERATION_PER_DAY=20

# Logging
LOG_LEVEL=info
```

## Meta App Setup

1. Create app at [developers.facebook.com](https://developers.facebook.com)
2. Add Instagram Graph API product
3. Configure OAuth redirect: `{NEXT_PUBLIC_META_REDIRECT_URI}`
4. Add permissions: `instagram_basic`, `instagram_manage_comments`, `pages_read_engagement`
5. App must be in Live mode for production
