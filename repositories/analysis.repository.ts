import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { PostAnalysis } from "@/types";

const TABLE = "analysis_results";

export async function getByPostId(postId: string): Promise<PostAnalysis | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .select("result")
    .eq("post_id", postId)
    .single();

  if (error || !data) return null;
  return data.result as PostAnalysis;
}

export async function upsert(
  postId: string,
  instagramAccountId: string,
  result: PostAnalysis,
  modelVersion?: string
) {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from(TABLE).upsert(
    {
      post_id: postId,
      instagram_account_id: instagramAccountId,
      result,
      model_version: modelVersion,
    },
    { onConflict: "post_id" }
  );

  if (error) throw error;
}
