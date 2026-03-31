import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { Comment } from "@/types";

const TABLE = "comments";

export interface CommentRow {
  post_id: string;
  instagram_comment_id: string;
  text: string;
  username: string;
  timestamp: string;
  like_count: number;
}

export async function upsertMany(
  postId: string,
  comments: Omit<CommentRow, "post_id">[]
) {
  if (comments.length === 0) return;

  const supabase = createSupabaseAdmin();
  const rows = comments.map((c) => ({
    post_id: postId,
    instagram_comment_id: c.instagram_comment_id,
    text: c.text,
    username: c.username,
    timestamp: c.timestamp,
    like_count: c.like_count ?? 0,
  }));

  const { error } = await supabase.from(TABLE).upsert(rows, {
    onConflict: "post_id,instagram_comment_id",
    ignoreDuplicates: false,
  });

  if (error) throw error;
}
