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
    <div>
      <div className="mb-8">
        <p className="text-[11px] tracking-[0.28em] text-zinc-500">
          BLULOOMAI · WORKSPACE
        </p>
        <h1 className="mt-5 max-w-xl text-3xl font-semibold leading-tight md:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 max-w-lg text-sm text-zinc-500">
          Your growth overview and quick actions
        </p>
      </div>

      <DashboardClient account={account} analytics={analytics} />
    </div>
  );
}
