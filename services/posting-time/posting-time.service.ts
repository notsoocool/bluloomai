/**
 * Smart Posting Time Engine
 * Groups engagement by day/hour, returns top 3 recommended slots.
 */

import * as analyticsService from "@/services/analytics/analytics.service";

export async function getBestPostingSlots(instagramAccountId: string) {
  const summary = await analyticsService.getAnalyticsSummary(instagramAccountId);
  return summary?.bestPostingSlots ?? [];
}
