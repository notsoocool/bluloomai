import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import * as instagramAccountRepo from "@/repositories/instagram-account.repository";
import * as viralPatternService from "@/services/viral-pattern/viral-pattern.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function InsightsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const account = await instagramAccountRepo.getByClerkUserId(userId);
  if (!account) {
    return (
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-semibold">Insights</h1>
        <p className="mt-4 text-muted-foreground">
          Connect your Instagram account to view viral pattern insights.
        </p>
      </div>
    );
  }

  const insights = await viralPatternService.getViralPatternInsights(account.id);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Insights</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-powered viral pattern analysis: top vs bottom performers
        </p>
      </div>

      {!insights ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>Need at least 4 posts to generate insights.</p>
            <p className="mt-2 text-sm">
              Sync your posts from the Dashboard, then return here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top vs bottom comparison</CardTitle>
              <CardDescription>
                Key differences between your best and worst performing posts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Hook structure
                </h4>
                <p className="mt-1">{insights.topVsBottomComparison.hookStructure}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Caption length
                </h4>
                <p className="mt-1">{insights.topVsBottomComparison.captionLength}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  CTA usage
                </h4>
                <p className="mt-1">{insights.topVsBottomComparison.ctaUsage}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Hashtag density
                </h4>
                <p className="mt-1">{insights.topVsBottomComparison.hashtagDensity}</p>
              </div>
            </CardContent>
          </Card>

          {insights.growthInsights && insights.growthInsights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Growth insights</CardTitle>
                <CardDescription>
                  Actionable recommendations from your content patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights.growthInsights.map((insight, i) => (
                    <li
                      key={i}
                      className="flex gap-2 rounded-lg border border-border px-4 py-3"
                    >
                      <span className="text-primary">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
