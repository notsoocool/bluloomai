import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { Post } from "@/types";

const TABLE = "posts";

export interface PostRow {
  instagram_post_id: string;
  caption: string | null;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  permalink?: string;
  timestamp: string;
  like_count: number;
  comment_count: number;
}

export async function upsertMany(
  instagramAccountId: string,
  posts: PostRow[]
): Promise<{ inserted: number; updated: number }> {
  if (posts.length === 0) return { inserted: 0, updated: 0 };

  const supabase = createSupabaseAdmin();
  const rows = posts.map((p) => ({
    instagram_account_id: instagramAccountId,
    instagram_post_id: p.instagram_post_id,
    caption: p.caption,
    media_type: p.media_type,
    media_url: p.media_url,
    permalink: p.permalink,
    timestamp: p.timestamp,
    like_count: p.like_count,
    comment_count: p.comment_count,
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase
    .from(TABLE)
    .upsert(rows, {
      onConflict: "instagram_account_id,instagram_post_id",
      ignoreDuplicates: false,
    })
    .select("id");

  if (error) throw error;
  return { inserted: data?.length ?? 0, updated: data?.length ?? 0 };
}

export async function getByAccountId(
  instagramAccountId: string,
  limit = 50
): Promise<Post[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("instagram_account_id", instagramAccountId)
    .is("deleted_at", null)
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getById(postId: string): Promise<Post | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", postId)
    .single();

  if (error || !data) return null;
  return mapRow(data);
}

function mapRow(row: Record<string, unknown>): Post {
  return {
    id: row.id as string,
    instagramAccountId: row.instagram_account_id as string,
    instagramPostId: row.instagram_post_id as string,
    caption: row.caption as string | null,
    mediaType: row.media_type as "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM",
    mediaUrl: row.media_url as string | undefined,
    permalink: row.permalink as string | undefined,
    timestamp: new Date(row.timestamp as string),
    likeCount: (row.like_count as number) ?? 0,
    commentCount: (row.comment_count as number) ?? 0,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}
