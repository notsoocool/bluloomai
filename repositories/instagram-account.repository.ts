import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { InstagramAccount } from "@/types";

const TABLE = "instagram_accounts";

export async function getById(id: string): Promise<InstagramAccount | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error || !data) return null;
  return mapRow(data);
}

export async function getByUserId(userId: string): Promise<InstagramAccount | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .single();

  if (error || !data) return null;
  return mapRow(data);
}

export async function getByClerkUserId(clerkUserId: string): Promise<InstagramAccount | null> {
  const supabase = createSupabaseAdmin();
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", clerkUserId)
    .is("deleted_at", null)
    .single();

  if (!user) return null;
  return getByUserId(user.id);
}

export async function getByInstagramId(instagramBusinessAccountId: string) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("instagram_business_account_id", instagramBusinessAccountId)
    .is("deleted_at", null)
    .single();

  if (error || !data) return null;
  return mapRow(data);
}

export async function upsert(row: {
  userId: string;
  instagramBusinessAccountId: string;
  username: string;
  followersCount: number;
  profilePictureUrl?: string;
  accessTokenEncrypted: string;
  tokenExpiresAt: string;
}) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(
      {
        user_id: row.userId,
        instagram_business_account_id: row.instagramBusinessAccountId,
        username: row.username,
        followers_count: row.followersCount,
        profile_picture_url: row.profilePictureUrl,
        access_token_encrypted: row.accessTokenEncrypted,
        token_expires_at: row.tokenExpiresAt,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "instagram_business_account_id",
        ignoreDuplicates: false,
      }
    )
    .select()
    .single();

  if (error) throw error;
  return mapRow(data);
}

function mapRow(row: Record<string, unknown>): InstagramAccount {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    instagramBusinessAccountId: row.instagram_business_account_id as string,
    username: row.username as string,
    followersCount: (row.followers_count as number) ?? 0,
    profilePictureUrl: row.profile_picture_url as string | undefined,
    accessToken: row.access_token_encrypted as string,
    tokenExpiresAt: new Date(row.token_expires_at as string),
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}
