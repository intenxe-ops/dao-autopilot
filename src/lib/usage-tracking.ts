import { SupabaseClient } from "@supabase/supabase-js";

export interface UsageStats {
  proposalsThisMonth: number;
  limit: number;
  canGenerate: boolean;
  isPro: boolean;
}

export async function checkUsageLimit(
  supabase: SupabaseClient,
  userId: string
): Promise<UsageStats> {
  try {
    // Get user tier (default to free)
    const { data: profile } = await supabase
      .from("profiles")
      .select("tier")
      .eq("id", userId)
      .single();

    const isPro = profile?.tier === "pro" || profile?.tier === "enterprise";
    const limit = isPro ? 999999 : 10; // Pro = unlimited, Free = 10

    // Get proposal count for current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("user_proposals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfMonth.toISOString());

    const proposalsThisMonth = count || 0;
    const canGenerate = proposalsThisMonth < limit;

    return {
      proposalsThisMonth,
      limit,
      canGenerate,
      isPro,
    };
  } catch (error) {
    console.error("Error checking usage:", error);
    return {
      proposalsThisMonth: 0,
      limit: 10,
      canGenerate: true,
      isPro: false,
    };
  }
}

export async function trackProposalGeneration(
  supabase: SupabaseClient,
  userId: string,
  daoSpace: string,
  proposalText: string
): Promise<boolean> {
  try {
    const { error } = await supabase.from("user_proposals").insert({
      user_id: userId,
      dao_space: daoSpace,
      proposal_text: proposalText,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error tracking proposal:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error tracking proposal:", error);
    return false;
  }
}