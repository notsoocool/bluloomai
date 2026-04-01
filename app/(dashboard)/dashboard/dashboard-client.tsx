"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  landingPanel,
  landingSurface,
} from "@/components/landing/landing-theme";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { InstagramAccount } from "@/types";
import type { AnalyticsSummary } from "@/types";

interface DashboardClientProps {
  account: InstagramAccount | null;
  analytics: AnalyticsSummary | null;
  searchParams?: Record<string, string | string[] | undefined>;
}

const btnPrimary =
  "h-10 rounded-full bg-white px-6 text-sm font-medium text-black hover:bg-zinc-200";
const btnGhost =
  "landing-edge h-10 rounded-full border border-solid bg-white/5 px-5 text-sm text-white hover:bg-white/10";

export function DashboardClient({
  account,
  analytics,
}: DashboardClientProps) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const connected = params.get("connected");
    if (error) {
      console.error("Dashboard error:", error);
    }
    if (connected) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleConnect = () => {
    window.location.href = "/api/instagram/auth";
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/instagram/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        router.refresh();
      } else {
        console.error("Sync failed:", data.error);
      }
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <article className={cn(landingPanel, "rounded-2xl p-8 sm:rounded-3xl")}>
        <p className="text-[11px] tracking-[0.28em] text-zinc-500">
          INSTAGRAM · GRAPH API
        </p>
        <h2 className="mt-4 text-2xl font-semibold leading-tight md:text-3xl">
          {account ? "Connected account" : "Connect your account"}
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Connect your Instagram Business or Creator account to start analyzing
          posts and engagement.
        </p>
        <div className="mt-6">
          {account ? (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                {account.profilePictureUrl && (
                  <img
                    src={account.profilePictureUrl}
                    alt=""
                    className="h-12 w-12 rounded-full ring-1 ring-white/10"
                  />
                )}
                <div>
                  <p className="font-medium text-zinc-100">@{account.username}</p>
                  <p className="text-sm text-zinc-500">
                    {account.followersCount.toLocaleString()} followers
                  </p>
                </div>
              </div>
              <Button
                type="button"
                className={btnGhost}
                onClick={handleSync}
                disabled={syncing}
              >
                {syncing ? "Syncing..." : "Sync posts"}
              </Button>
            </div>
          ) : (
            <Button onClick={handleConnect} type="button" className={btnPrimary}>
              Connect Instagram
            </Button>
          )}
        </div>
      </article>

      {account && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricTile
              label="Avg engagement"
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
              value={
                analytics?.metrics?.totalLikes?.toLocaleString() ?? "—"
              }
            />
            <MetricTile
              label="Total comments"
              value={
                analytics?.metrics?.totalComments?.toLocaleString() ?? "—"
              }
            />
          </div>

          {analytics?.bestPostingSlots && analytics.bestPostingSlots.length > 0 && (
            <article className={cn(landingPanel, "rounded-2xl p-8 sm:rounded-3xl")}>
              <h2 className="text-xl font-semibold md:text-2xl">
                Best posting times
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Top 3 slots based on your engagement data
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {analytics.bestPostingSlots.map((slot) => (
                  <Badge
                    key={slot.label}
                    variant="secondary"
                    className="landing-edge rounded-full border border-solid bg-white/5 font-normal text-zinc-300"
                  >
                    {slot.label}
                  </Badge>
                ))}
              </div>
            </article>
          )}

          {analytics?.topPosts && analytics.topPosts.count > 0 && (
            <article className={cn(landingPanel, "rounded-2xl p-8 sm:rounded-3xl")}>
              <h2 className="text-xl font-semibold md:text-2xl">
                Top performers
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Top 20% of your posts (avg{" "}
                {analytics.topPosts.avgEngagementRate.toFixed(2)}% engagement)
              </p>
              <p className="mt-4 text-sm text-zinc-400">
                {analytics.topPosts.count} posts analyzed
              </p>
            </article>
          )}
        </>
      )}
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
    <div className={cn(landingSurface, "flex flex-col gap-1 p-4")}>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-2xl font-semibold text-zinc-100">{value}</p>
    </div>
  );
}
