import { createSupabaseAdmin } from "@/lib/supabase/admin";

const TABLE = "users";

export async function getOrCreateByClerkId(clerkUserId: string, email?: string) {
  const supabase = createSupabaseAdmin();
  const { data: existing } = await supabase
    .from(TABLE)
    .select("id")
    .eq("clerk_user_id", clerkUserId)
    .is("deleted_at", null)
    .single();

  if (existing) return existing.id as string;

  const { data: inserted, error } = await supabase
    .from(TABLE)
    .insert({
      clerk_user_id: clerkUserId,
      email,
    })
    .select("id")
    .single();

  if (error) throw error;
  return inserted.id as string;
}
