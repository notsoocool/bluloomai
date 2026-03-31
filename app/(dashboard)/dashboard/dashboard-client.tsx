"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { InstagramAccount } from "@/types";
import type { AnalyticsSummary } from "@/types";

interface DashboardClientProps {
  account: InstagramAccount | null;
  analytics: AnalyticsSummary | null;
  searchParams?: Record<string, string | string[] | undefined>;
}

export function DashboardClient({
  account,
  analytics,
}: DashboardClientProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const error = params.get("error");
    const connected = params.get("connected");
    if (error) {
      console.error("Dashboard error:", error);
    }
    if (connected) {
      router.replace("/dashboard");
    }
  }, [params, router]);

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
      {/* Connect Instagram */}
      <Card>
        <CardHeader>
          <CardTitle>Instagram</CardTitle>
          <CardDescription>
            Connect your Instagram Business or Creator account to start analyzing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {account ? (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                {account.profilePictureUrl && (
                  <img
                    src={account.profilePictureUrl}
                    alt=""
                    className="h-12 w-12 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">@{account.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {account.followersCount.toLocaleString()} followers
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleSync} disabled={syncing}>
                {syncing ? "Syncing..." : "Sync posts"}
              </Button>
            </div>
          ) : (
            <Button onClick={handleConnect}>Connect Instagram</Button>
          )}
        </CardContent>
      </Card>

      {account && (
        <>
          {/* Growth summary */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Avg engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">
                  {analytics?.metrics.avgEngagementRate.toFixed(2) ?? "—"}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total posts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">
                  {analytics?.metrics.totalPosts ?? "—"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total likes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">
                  {analytics?.metrics.totalLikes?.toLocaleString() ?? "—"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total comments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">
                  {analytics?.metrics.totalComments?.toLocaleString() ?? "—"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Best posting time */}
          {analytics?.bestPostingSlots && analytics.bestPostingSlots.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Best posting times</CardTitle>
                <CardDescription>
                  Top 3 slots based on your engagement data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analytics.bestPostingSlots.map((slot) => (
                    <Badge key={slot.label} variant="secondary">
                      {slot.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top posts */}
          {analytics?.topPosts && analytics.topPosts.count > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top performers</CardTitle>
                <CardDescription>
                  Top 20% of your posts (avg {analytics.topPosts.avgEngagementRate.toFixed(2)}%
                  engagement)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {analytics.topPosts.count} posts analyzed
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
