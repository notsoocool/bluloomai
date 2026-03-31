/**
 * AI Content Intelligence Engine
 * Analyzes posts: hook, CTA, hashtags, sentiment, suggestions.
 * Avoids recomputation if already analyzed.
 */

import * as postRepo from "@/repositories/post.repository";
import * as analysisRepo from "@/repositories/analysis.repository";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { getOpenAIClient } from "@/lib/openai";
import type { PostAnalysis } from "@/types";

const ANALYSIS_SYSTEM = `You are an expert Instagram growth analyst for micro-influencers (1k-100k followers).
Analyze content and return JSON only. Be concise. Scores 1-10.`;

const ANALYSIS_USER = (caption: string, comments: string[]) => `
Analyze this Instagram post:

Caption: ${caption || "(no caption)"}

Sample comments (first 10): ${comments.slice(0, 10).join(" | ") || "none"}

Return JSON:
{
  "hookStrengthScore": number 1-10,
  "ctaPresenceScore": number 1-10,
  "hashtagQualityScore": number 1-10,
  "commentSentimentSummary": "1-2 sentences",
  "improvementSuggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "growthSummary": "2-3 sentence growth insight"
}
`;

export async function analyzePost(postId: string): Promise<PostAnalysis | null> {
  const existing = await analysisRepo.getByPostId(postId);
  if (existing) return existing;

  const post = await postRepo.getById(postId);
  if (!post) return null;

  const supabase = createSupabaseAdmin();
  const { data: comments } = await supabase
    .from("comments")
    .select("text")
    .eq("post_id", postId)
    .limit(10);

  const commentTexts = (comments ?? []).map((c) => c.text);

  const response = await getOpenAIClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: ANALYSIS_SYSTEM },
      {
        role: "user",
        content: ANALYSIS_USER(post.caption ?? "", commentTexts),
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 500,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return null;

  const result = JSON.parse(content) as PostAnalysis;

  await analysisRepo.upsert(
    postId,
    post.instagramAccountId,
    result,
    response.model
  );

  return result;
}

export async function analyzeAccountPosts(
  instagramAccountId: string,
  limit = 10
): Promise<{ analyzed: number; skipped: number }> {
  const posts = await postRepo.getByAccountId(instagramAccountId, limit);
  let analyzed = 0;
  let skipped = 0;

  for (const post of posts) {
    const existing = await analysisRepo.getByPostId(post.id);
    if (existing) {
      skipped++;
      continue;
    }
    const result = await analyzePost(post.id);
    if (result) analyzed++;
  }

  return { analyzed, skipped };
}
