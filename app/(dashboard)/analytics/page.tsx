import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import * as instagramAccountRepo from "@/repositories/instagram-account.repository";
import * as analyticsService from "@/services/analytics/analytics.service";
import {
  landingPanel,
  landingSurface,
} from "@/components/landing/landing-theme";
import { cn } from "@/lib/utils";

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const account = await instagramAccountRepo.getByClerkUserId(userId);
  if (!account) {
    return (
      <div>
        <div className="mb-8">
          <p className="text-[11px] tracking-[0.28em] text-zinc-500">
            BLULOOMAI · ANALYTICS
          </p>
          <h1 className="mt-5 text-3xl font-semibold leading-tight md:text-4xl">
            Analytics
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Connect your Instagram account to view analytics.
          </p>
        </div>
      </div>
    );
  }

  const analytics = await analyticsService.getAnalyticsSummary(account.id);

  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] tracking-[0.28em] text-zinc-500">
          BLULOOMAI · ANALYTICS
        </p>
        <h1 className="mt-5 max-w-xl text-3xl font-semibold leading-tight md:text-4xl">
          Analytics
        </h1>
        <p className="mt-2 max-w-lg text-sm text-zinc-500">
          Engagement metrics and performance trends
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile
            label="Average engagement rate"
            value={
              analytics?.metrics?.avgEngagementRate != null
                ? `${analytics.metrics.avgEngagementRate.toFixed(2)}%`
                : "—"
            }
          />
          <MetricTile
            label="Total posts"
            value={analytics?.metrics?.totalPosts ?? "—"}
          />
          <MetricTile
            label="Total likes"
            value={analytics?.metrics?.totalLikes?.toLocaleString() ?? "—"}
          />
          <MetricTile
            label="Total comments"
            value={analytics?.metrics?.totalComments?.toLocaleString() ?? "—"}
          />
        </div>

        {analytics?.byDayOfWeek &&
          analytics.byDayOfWeek.some((d) => d.postCount > 0) && (
            <article
              className={cn(landingPanel, "rounded-2xl p-8 sm:rounded-3xl")}
            >
              <h2 className="text-xl font-semibold md:text-2xl">
                Engagement by day
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Average engagement rate by day of week
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, i) => {
                    const data = analytics.byDayOfWeek.find(
                      (d) => d.dayOfWeek === i
                    );
                    return (
                      <div
                        key={day}
                        className={cn(
                          landingSurface,
                          "flex min-w-[88px] flex-col items-center rounded-2xl p-4"
                        )}
                      >
                        <span className="text-xs text-zinc-500">{day}</span>
                        <span className="mt-1 font-semibold text-zinc-100">
                          {data?.avgEngagementRate?.toFixed(2) ?? "0"}%
                        </span>
                        <span className="text-xs text-zinc-500">
                          {data?.postCount ?? 0} posts
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </article>
          )}

        {analytics?.bestPostingSlots &&
          analytics.bestPostingSlots.length > 0 && (
            <article
              className={cn(landingPanel, "rounded-2xl p-8 sm:rounded-3xl")}
            >
              <h2 className="text-xl font-semibold md:text-2xl">
                Best posting slots
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Top 3 recommended times based on your data
              </p>
              <ul className="mt-6 space-y-2">
                {analytics.bestPostingSlots.map((slot) => (
                  <li
                    key={slot.label}
                    className={cn(
                      landingSurface,
                      "flex items-center justify-between rounded-2xl px-4 py-3"
                    )}
                  >
                    <span className="text-zinc-200">{slot.label}</span>
                    <span className="text-sm text-zinc-500">
                      {slot.score.toFixed(2)}% avg
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          )}
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className={cn(landingSurface, "flex flex-col gap-1 rounded-2xl p-4")}>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-2xl font-semibold text-zinc-100">{value}</p>
    </div>
  );
}
