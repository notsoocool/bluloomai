/**
 * Content Generation Engine
 * Reel scripts, captions, hook optimizer.
 * Per-user daily limits applied at API layer.
 */

import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { getOpenAIClient } from "@/lib/openai";
import type { ReelScript, CaptionGenerationParams } from "@/types";

const DAILY_LIMIT = parseInt(
  process.env.RATE_LIMIT_GENERATION_PER_DAY ?? "20",
  10
);

export async function getTodayGenerationCount(userId: string): Promise<number> {
  const supabase = createSupabaseAdmin();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("content_generations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfDay.toISOString());

  if (error) return 0;
  return count ?? 0;
}

export async function checkAndIncrementLimit(
  userId: string,
  instagramAccountId: string | null,
  type: string,
  output: unknown
): Promise<boolean> {
  const count = await getTodayGenerationCount(userId);
  if (count >= DAILY_LIMIT) return false;

  const supabase = createSupabaseAdmin();
  await supabase.from("content_generations").insert({
    user_id: userId,
    instagram_account_id: instagramAccountId,
    type,
    output,
  });

  return true;
}

export async function generateReelScript(
  userId: string,
  topic: string,
  niche: string,
  instagramAccountId?: string
): Promise<ReelScript | null> {
  const prompt = `Generate an Instagram Reel script for a micro-influencer.

Topic: ${topic}
Niche: ${niche}

Return JSON:
{
  "hook": "3-second hook (first line that grabs attention)",
  "problem": "The problem or pain point",
  "valueBullets": ["bullet1", "bullet2", "bullet3"],
  "retentionTrigger": "Mid-reel retention moment",
  "cta": "Call to action",
  "suggestedCommentTrigger": "Question to boost comments"
}`;

  const response = await getOpenAIClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert Instagram Reel scriptwriter. Return JSON only.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    max_tokens: 500,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return null;

  const result = JSON.parse(content) as ReelScript;

  await checkAndIncrementLimit(userId, instagramAccountId ?? null, "reel_script", result);

  return result;
}

export async function generateCaption(
  userId: string,
  params: CaptionGenerationParams,
  context?: string,
  instagramAccountId?: string
): Promise<string | null> {
  const prompt = `Generate an Instagram caption for a micro-influencer.

Niche: ${params.niche}
Tone: ${params.tone}
Goal: ${params.goal}
${context ? `Context: ${context}` : ""}

Return only the caption text, no JSON. Include 3-5 relevant hashtags at the end.`;

  const response = await getOpenAIClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert Instagram copywriter. Return only the caption.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 300,
  });

  const content = response.choices[0]?.message?.content?.trim();
  if (!content) return null;

  await checkAndIncrementLimit(userId, instagramAccountId ?? null, "caption", { caption: content });

  return content;
}

export async function optimizeHook(
  userId: string,
  currentHook: string,
  instagramAccountId?: string
): Promise<string | null> {
  const prompt = `Improve this Instagram hook (first 3 seconds of a Reel). Make it more engaging and attention-grabbing.

Current hook: ${currentHook}

Return only the improved hook, nothing else. Keep it under 15 words.`;

  const response = await getOpenAIClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert at writing viral hooks. Return only the improved hook.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 100,
  });

  const content = response.choices[0]?.message?.content?.trim();
  if (!content) return null;

  await checkAndIncrementLimit(userId, instagramAccountId ?? null, "hook_optimizer", { hook: content });

  return content;
}
