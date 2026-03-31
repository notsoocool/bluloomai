import { createSupabaseAdmin } from "@/lib/supabase/admin";

const TABLE = "post_metrics";

export async function upsert(
  postId: string,
  instagramAccountId: string,
  followersAtPost: number,
  engagementRate: number,
  dayOfWeek: number,
  hourOfDay: number
) {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from(TABLE).upsert(
    {
      post_id: postId,
      instagram_account_id: instagramAccountId,
      followers_at_post: followersAtPost,
      engagement_rate: engagementRate,
      day_of_week: dayOfWeek,
      hour_of_day: hourOfDay,
    },
    { onConflict: "post_id" }
  );

  if (error) throw error;
}
