/**
 * Engagement & Analytics Engine
 * Calculates engagement rates, aggregates by time, identifies top/bottom performers.
 */

import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type {
  AnalyticsSummary,
  EngagementMetrics,
  EngagementByTime,
  PostPerformanceTier,
  PostingSlot,
} from "@/types";

export async function getAnalyticsSummary(
  instagramAccountId: string
): Promise<AnalyticsSummary | null> {
  const supabase = createSupabaseAdmin();

  const { data: account } = await supabase
    .from("instagram_accounts")
    .select("followers_count")
    .eq("id", instagramAccountId)
    .single();

  if (!account) return null;

  const followers = account.followers_count as number;
  if (followers === 0) return null;

  const { data: posts } = await supabase
    .from("posts")
    .select("id, like_count, comment_count, timestamp")
    .eq("instagram_account_id", instagramAccountId)
    .is("deleted_at", null)
    .order("timestamp", { ascending: false })
    .limit(100);

  if (!posts || posts.length === 0) {
    return buildEmptySummary(instagramAccountId);
  }

  const metrics = calculateMetrics(posts, followers);
  const byDayOfWeek = aggregateByDayOfWeek(posts, followers);
  const byHourOfDay = aggregateByHourOfDay(posts, followers);
  const { topPosts, bottomPosts } = getPerformanceTiers(posts, followers);
  const bySlot = aggregateByDayAndHour(posts, followers);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const bestPostingSlots: PostingSlot[] = bySlot
    .sort((a, b) => b.avgEngagementRate - a.avgEngagementRate)
    .slice(0, 3)
    .map((s) => ({
      dayOfWeek: s.dayOfWeek,
      hourOfDay: s.hourOfDay,
      score: s.avgEngagementRate,
      label: `${dayNames[s.dayOfWeek]} ${String(s.hourOfDay).padStart(2, "0")}:00`,
    }));

  return {
    metrics,
    byDayOfWeek,
    byHourOfDay,
    topPosts,
    bottomPosts,
    bestPostingSlots,
  };
}

function calculateMetrics(
  posts: Array<{ like_count: number; comment_count: number }>,
  followers: number
): EngagementMetrics {
  let totalLikes = 0;
  let totalComments = 0;
  const rates: number[] = [];

  for (const p of posts) {
    const likes = p.like_count ?? 0;
    const comments = p.comment_count ?? 0;
    totalLikes += likes;
    totalComments += comments;
    const engagement = (likes + comments) / followers;
    rates.push(engagement * 100);
  }

  const avgRate =
    rates.length > 0 ? rates.reduce((a, b) => a + b, 0) / rates.length : 0;

  return {
    engagementRate: avgRate,
    totalLikes,
    totalComments,
    totalPosts: posts.length,
    avgEngagementRate: avgRate,
  };
}

function aggregateByDayOfWeek(
  posts: Array<{ like_count: number; comment_count: number; timestamp: string }>,
  followers: number
): EngagementByTime[] {
  const byDay: Record<number, { engagement: number; count: number }> = {};
  for (let i = 0; i < 7; i++) byDay[i] = { engagement: 0, count: 0 };

  for (const p of posts) {
    const d = new Date(p.timestamp);
    const day = d.getDay();
    const eng = ((p.like_count ?? 0) + (p.comment_count ?? 0)) / followers;
    byDay[day].engagement += eng * 100;
    byDay[day].count += 1;
  }

  return Object.entries(byDay).map(([day, v]) => ({
    dayOfWeek: parseInt(day, 10),
    hourOfDay: 0,
    totalEngagement: v.engagement,
    postCount: v.count,
    avgEngagementRate: v.count > 0 ? v.engagement / v.count : 0,
  }));
}

function aggregateByHourOfDay(
  posts: Array<{ like_count: number; comment_count: number; timestamp: string }>,
  followers: number
): EngagementByTime[] {
  const byHour: Record<number, { engagement: number; count: number }> = {};
  for (let i = 0; i < 24; i++) byHour[i] = { engagement: 0, count: 0 };

  for (const p of posts) {
    const d = new Date(p.timestamp);
    const hour = d.getHours();
    const eng = ((p.like_count ?? 0) + (p.comment_count ?? 0)) / followers;
    byHour[hour].engagement += eng * 100;
    byHour[hour].count += 1;
  }

  return Object.entries(byHour).map(([hour, v]) => ({
    dayOfWeek: 0,
    hourOfDay: parseInt(hour, 10),
    totalEngagement: v.engagement,
    postCount: v.count,
    avgEngagementRate: v.count > 0 ? v.engagement / v.count : 0,
  }));
}

function aggregateByDayAndHour(
  posts: Array<{ like_count: number; comment_count: number; timestamp: string }>,
  followers: number
): Array<{ dayOfWeek: number; hourOfDay: number; avgEngagementRate: number; postCount: number }> {
  const map = new Map<string, { engagement: number; count: number }>();

  for (const p of posts) {
    const d = new Date(p.timestamp);
    const day = d.getDay();
    const hour = d.getHours();
    const key = `${day}-${hour}`;
    const eng = ((p.like_count ?? 0) + (p.comment_count ?? 0)) / followers;
    const existing = map.get(key) ?? { engagement: 0, count: 0 };
    map.set(key, {
      engagement: existing.engagement + eng * 100,
      count: existing.count + 1,
    });
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return Array.from(map.entries())
    .filter(([, v]) => v.count > 0)
    .map(([key, v]) => {
      const [d, h] = key.split("-").map(Number);
      return {
        dayOfWeek: d,
        hourOfDay: h,
        avgEngagementRate: v.engagement / v.count,
        postCount: v.count,
        label: `${dayNames[d]} ${String(h).padStart(2, "0")}:00`,
      };
    });
}

function getPerformanceTiers(
  posts: Array<{ id: string; like_count: number; comment_count: number }>,
  followers: number
): { topPosts: PostPerformanceTier; bottomPosts: PostPerformanceTier } {
  const withRate = posts.map((p) => ({
    id: p.id,
    rate:
      (((p.like_count ?? 0) + (p.comment_count ?? 0)) / followers) * 100,
  }));

  withRate.sort((a, b) => b.rate - a.rate);
  const topCount = Math.max(1, Math.ceil(posts.length * 0.2));
  const bottomCount = Math.max(1, Math.ceil(posts.length * 0.2));

  const top = withRate.slice(0, topCount);
  const bottom = withRate.slice(-bottomCount);

  return {
    topPosts: {
      tier: "top",
      postIds: top.map((p) => p.id),
      avgEngagementRate:
        top.length > 0
          ? top.reduce((s, p) => s + p.rate, 0) / top.length
          : 0,
      count: top.length,
    },
    bottomPosts: {
      tier: "bottom",
      postIds: bottom.map((p) => p.id),
      avgEngagementRate:
        bottom.length > 0
          ? bottom.reduce((s, p) => s + p.rate, 0) / bottom.length
          : 0,
      count: bottom.length,
    },
  };
}


function buildEmptySummary(instagramAccountId: string): AnalyticsSummary {
  return {
    metrics: {
      engagementRate: 0,
      totalLikes: 0,
      totalComments: 0,
      totalPosts: 0,
      avgEngagementRate: 0,
    },
    byDayOfWeek: [],
    byHourOfDay: [],
    topPosts: { tier: "top", postIds: [], avgEngagementRate: 0, count: 0 },
    bottomPosts: { tier: "bottom", postIds: [], avgEngagementRate: 0, count: 0 },
    bestPostingSlots: [],
  };
}
