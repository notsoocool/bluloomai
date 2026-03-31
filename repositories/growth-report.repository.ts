import { createSupabaseAdmin } from "@/lib/supabase/admin";

const TABLE = "growth_reports";

export async function getLatest(
  instagramAccountId: string,
  reportType: string
): Promise<unknown | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .select("result")
    .eq("instagram_account_id", instagramAccountId)
    .eq("report_type", reportType)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data.result;
}

export async function upsert(
  instagramAccountId: string,
  reportType: string,
  result: unknown
) {
  const supabase = createSupabaseAdmin();
  await supabase.from(TABLE).insert({
    instagram_account_id: instagramAccountId,
    report_type: reportType,
    result,
  });
}
