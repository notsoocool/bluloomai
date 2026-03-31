import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Next.js 16+ uses `proxy.ts` (replaces `middleware.ts`). Clerk’s helper is still `clerkMiddleware`.
 *
 * Only pass `publishableKey` here so Turbopack inlines your real key (avoids `pk_test_dummy`).
 * Do **not** pass `secretKey` unless you also set `CLERK_ENCRYPTION_KEY` (dynamic-keys flow).
 * `CLERK_SECRET_KEY` in `.env.local` is still used automatically by Clerk.
 *
 * Requires `loadEnvConfig` in `next.config.ts`. After env changes: `rm -rf .next && pnpm dev`
 *
 * @see https://clerk.com/docs/references/nextjs/clerk-middleware
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */
export default clerkMiddleware({
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
