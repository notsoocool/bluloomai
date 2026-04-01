import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import * as instagramAccountRepo from "@/repositories/instagram-account.repository";
import * as viralPatternService from "@/services/viral-pattern/viral-pattern.service";
import { landingPanel, landingSurface } from "@/components/landing/landing-theme";
import { cn } from "@/lib/utils";

export default async function InsightsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const account = await instagramAccountRepo.getByClerkUserId(userId);
  if (!account) {
    return (
      <div>
        <div className="mb-8">
          <p className="text-[11px] tracking-[0.28em] text-zinc-500">
            BLULOOMAI · INSIGHTS
          </p>
          <h1 className="mt-5 text-3xl font-semibold leading-tight md:text-4xl">
            Insights
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Connect your Instagram account to view viral pattern insights.
          </p>
        </div>
      </div>
    );
  }

  const insights = await viralPatternService.getViralPatternInsights(account.id);

  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] tracking-[0.28em] text-zinc-500">
          BLULOOMAI · INSIGHTS
        </p>
        <h1 className="mt-5 max-w-xl text-3xl font-semibold leading-tight md:text-4xl">
          Insights
        </h1>
        <p className="mt-2 max-w-lg text-sm text-zinc-500">
          AI-powered viral pattern analysis: top vs bottom performers
        </p>
      </div>

      {!insights ? (
        <article
          className={cn(landingPanel, "rounded-2xl p-12 text-center sm:rounded-3xl")}
        >
          <p className="text-zinc-400">
            Need at least 4 posts to generate insights.
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Sync your posts from the Dashboard, then return here.
          </p>
        </article>
      ) : (
        <div className="space-y-6">
          <article
            className={cn(landingPanel, "rounded-2xl p-8 sm:rounded-3xl")}
          >
            <h2 className="text-xl font-semibold md:text-2xl">
              Top vs bottom comparison
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Key differences between your best and worst performing posts
            </p>
            <div className="mt-6 space-y-5 text-zinc-300">
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Hook structure
                </h4>
                <p className="mt-1">
                  {insights.topVsBottomComparison.hookStructure}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Caption length
                </h4>
                <p className="mt-1">
                  {insights.topVsBottomComparison.captionLength}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  CTA usage
                </h4>
                <p className="mt-1">
                  {insights.topVsBottomComparison.ctaUsage}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Hashtag density
                </h4>
                <p className="mt-1">
                  {insights.topVsBottomComparison.hashtagDensity}
                </p>
              </div>
            </div>
          </article>

          {insights.growthInsights && insights.growthInsights.length > 0 && (
            <article
              className={cn(landingPanel, "rounded-2xl p-8 sm:rounded-3xl")}
            >
              <h2 className="text-xl font-semibold md:text-2xl">
                Growth insights
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Actionable recommendations from your content patterns
              </p>
              <ul className="mt-6 space-y-2">
                {insights.growthInsights.map((insight, i) => (
                  <li
                    key={i}
                    className={cn(
                      landingSurface,
                      "flex gap-3 rounded-2xl px-4 py-3 text-zinc-300"
                    )}
                  >
                    <span className="text-emerald-400/90">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </article>
          )}
        </div>
      )}
    </div>
  );
}
