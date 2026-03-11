import { SupabaseClient } from "@supabase/supabase-js";

export interface UsageStats {
  proposalsThisMonth: number;
  limit: number;
  canGenerate: boolean;
  isPro: boolean;
}

export async function checkUsageLimit(
  supabase: SupabaseClient,
  userId: string | null,
  walletAddress: string | null
): Promise<UsageStats> {
  try {
    // Get user tier from profiles table
    let profile;
    
    if (userId) {
      // Google user - lookup by id
      const { data } = await supabase
        .from("profiles")
        .select("tier")
        .eq("id", userId)
        .single();
      profile = data;
    } else if (walletAddress) {
      // Wallet user - lookup by wallet_address
      const { data } = await supabase
        .from("profiles")
        .select("tier")
        .eq("wallet_address", walletAddress.toLowerCase())
        .single();
      profile = data;
    }

    const isPro = profile?.tier === "pro" || profile?.tier === "enterprise";
    const limit = isPro ? 999999 : 10; // Pro = unlimited, Free = 10

    // Get proposal count for current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    let count = 0;
    
    if (userId) {
      // Count by user_id (Google users)
      const { count: userCount } = await supabase
        .from("user_proposals")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", startOfMonth.toISOString());
      count = userCount || 0;
    } else if (walletAddress) {
      // Count by wallet_address (Wallet users)
      const { count: walletCount } = await supabase
        .from("user_proposals")
        .select("*", { count: "exact", head: true })
        .eq("wallet_address", walletAddress.toLowerCase())
        .gte("created_at", startOfMonth.toISOString());
      count = walletCount || 0;
    }

    const proposalsThisMonth = count;
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
  userId: string | null,
  walletAddress: string | null,
  daoSpace: string,
  proposalText: string
): Promise<boolean> {
  try {
    const { error } = await supabase.from("user_proposals").insert({
      user_id: userId,
      wallet_address: walletAddress?.toLowerCase() || null,
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