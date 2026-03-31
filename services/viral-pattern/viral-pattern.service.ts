/**
 * Viral Pattern Engine
 * Compares top 20% vs bottom 20% posts, extracts differences, sends to AI.
 */

import { createSupabaseAdmin } from "@/lib/supabase/admin";
import * as growthReportRepo from "@/repositories/growth-report.repository";
import { getOpenAIClient } from "@/lib/openai";
import type { ViralPatternInsights } from "@/types";

export async function getViralPatternInsights(
  instagramAccountId: string
): Promise<ViralPatternInsights | null> {
  const cached = await growthReportRepo.getLatest(
    instagramAccountId,
    "viral_pattern"
  );
  if (cached) return cached as ViralPatternInsights;

  const supabase = createSupabaseAdmin();
  const { data: account } = await supabase
    .from("instagram_accounts")
    .select("followers_count")
    .eq("id", instagramAccountId)
    .single();

  if (!account) return null;

  const followers = account.followers_count as number;
  const { data: posts } = await supabase
    .from("posts")
    .select("id, caption, like_count, comment_count")
    .eq("instagram_account_id", instagramAccountId)
    .is("deleted_at", null)
    .order("timestamp", { ascending: false })
    .limit(50);

  if (!posts || posts.length < 4) return null;

  const withRate = posts.map((p) => ({
    ...p,
    rate:
      (((p.like_count ?? 0) + (p.comment_count ?? 0)) / followers) * 100,
  }));

  withRate.sort((a, b) => b.rate - a.rate);
  const topCount = Math.max(2, Math.ceil(posts.length * 0.2));
  const bottomCount = Math.max(2, Math.ceil(posts.length * 0.2));

  const topPosts = withRate.slice(0, topCount);
  const bottomPosts = withRate.slice(-bottomCount);

  const topCaptions = topPosts.map((p) => p.caption ?? "").join("\n---\n");
  const bottomCaptions = bottomPosts.map((p) => p.caption ?? "").join("\n---\n");

  const prompt = `Compare these two sets of Instagram post captions.

TOP 20% PERFORMERS (higher engagement):
${topCaptions}

BOTTOM 20% PERFORMERS (lower engagement):
${bottomCaptions}

Analyze and return JSON:
{
  "topVsBottomComparison": {
    "hookStructure": "1-2 sentences on hook differences",
    "captionLength": "1-2 sentences on length differences",
    "ctaUsage": "1-2 sentences on CTA differences",
    "hashtagDensity": "1-2 sentences on hashtag differences"
  },
  "growthInsights": ["insight1", "insight2", "insight3"]
}`;

  const response = await getOpenAIClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an Instagram growth expert. Return JSON only.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    max_tokens: 600,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return null;

  const result = JSON.parse(content) as ViralPatternInsights;

  await growthReportRepo.upsert(instagramAccountId, "viral_pattern", result);

  return result;
}
