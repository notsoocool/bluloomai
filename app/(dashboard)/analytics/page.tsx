import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import * as instagramAccountRepo from "@/repositories/instagram-account.repository";
import * as analyticsService from "@/services/analytics/analytics.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const account = await instagramAccountRepo.getByClerkUserId(userId);
  if (!account) {
    return (
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="mt-4 text-muted-foreground">
          Connect your Instagram account to view analytics.
        </p>
      </div>
    );
  }

  const analytics = await analyticsService.getAnalyticsSummary(account.id);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Engagement metrics and performance trends
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average engagement rate</CardDescription>
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

        {analytics?.byDayOfWeek && analytics.byDayOfWeek.some((d) => d.postCount > 0) && (
          <Card>
            <CardHeader>
              <CardTitle>Engagement by day</CardTitle>
              <CardDescription>
                Average engagement rate by day of week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, i) => {
                    const data = analytics.byDayOfWeek.find(
                      (d) => d.dayOfWeek === i
                    );
                    return (
                      <div
                        key={day}
                        className="flex flex-col items-center rounded-lg border border-border p-4 min-w-[80px]"
                      >
                        <span className="text-xs text-muted-foreground">
                          {day}
                        </span>
                        <span className="mt-1 font-medium">
                          {data?.avgEngagementRate?.toFixed(2) ?? "0"}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {data?.postCount ?? 0} posts
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {analytics?.bestPostingSlots && analytics.bestPostingSlots.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Best posting slots</CardTitle>
              <CardDescription>
                Top 3 recommended times based on your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analytics.bestPostingSlots.map((slot) => (
                  <li
                    key={slot.label}
                    className="flex items-center justify-between rounded-lg border border-border px-4 py-2"
                  >
                    <span>{slot.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {slot.score.toFixed(2)}% avg
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
