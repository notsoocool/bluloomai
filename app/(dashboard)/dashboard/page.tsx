import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import * as instagramAccountRepo from "@/repositories/instagram-account.repository";
import * as analyticsService from "@/services/analytics/analytics.service";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const account = await instagramAccountRepo.getByClerkUserId(userId);
  const analytics = account
    ? await analyticsService.getAnalyticsSummary(account.id)
    : null;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your growth overview and quick actions
        </p>
      </div>

      <DashboardClient account={account} analytics={analytics} />
    </div>
  );
}
