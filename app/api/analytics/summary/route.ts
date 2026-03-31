import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as instagramAccountRepo from "@/repositories/instagram-account.repository";
import * as analyticsService from "@/services/analytics/analytics.service";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = await instagramAccountRepo.getByClerkUserId(userId);
  if (!account) {
    return NextResponse.json(
      { error: "No Instagram account connected" },
      { status: 400 }
    );
  }

  const summary = await analyticsService.getAnalyticsSummary(account.id);
  return NextResponse.json(summary ?? { error: "No data" });
}
