const SNAPSHOT_GRAPHQL_URL = "https://hub.snapshot.org/graphql";

export interface VoterProfile {
  address: string;
  votingPower: number;
  voteCount: number;
  participationRate: number;
}

export interface ProposalPattern {
  category: string;
  successRate: number;
  totalCount: number;
}

export interface VotingIntelligence {
  topVoters: VoterProfile[];
  powerConcentration: number; // % controlled by top 3
  proposalPatterns: ProposalPattern[];
  riskKeywords: { word: string; failureRate: number }[];
  successKeywords: { word: string; successRate: number }[];
  avgVotingPeriod: number;
  governanceActivity: "HIGH" | "MEDIUM" | "LOW";
}

interface SnapshotVote {
  voter: string;
  vp: number;
  created: number;
}

interface SnapshotProposal {
  id: string;
  title: string;
  body: string;
  state: string;
  scores_total: number;
  quorum: number;
  votes: number;
  created: number;
  start: number;
  end: number;
}

export async function analyzeVotingPatterns(
  space: string
): Promise<VotingIntelligence | null> {
  try {
    // Fetch proposals with votes
    const proposalsQuery = `
      query Proposals($space: String!) {
        proposals(
          first: 50,
          where: { space: $space },
          orderBy: "created",
          orderDirection: desc
        ) {
          id
          title
          body
          state
          scores_total
          quorum
          votes
          created
          start
          end
        }
      }
    `;

    const proposalsResponse = await fetch(SNAPSHOT_GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: proposalsQuery,
        variables: { space },
      }),
    });

    const proposalsData = await proposalsResponse.json();
    const proposals: SnapshotProposal[] =
      proposalsData?.data?.proposals || [];

    if (proposals.length === 0) {
      return null;
    }

    // Fetch votes for recent proposals (sample 10 most recent)
    const recentProposalIds = proposals.slice(0, 10).map((p) => p.id);
    const votesData = await fetchVotesForProposals(recentProposalIds);

    // Analyze voter power distribution
    const voterMap = new Map<string, { vp: number; count: number }>();
    votesData.forEach((vote) => {
      const existing = voterMap.get(vote.voter) || { vp: 0, count: 0 };
      voterMap.set(vote.voter, {
        vp: Math.max(existing.vp, vote.vp), // Take max VP seen
        count: existing.count + 1,
      });
    });

    // Calculate top voters
    const voters = Array.from(voterMap.entries())
      .map(([address, data]) => ({
        address,
        votingPower: data.vp,
        voteCount: data.count,
        participationRate: (data.count / recentProposalIds.length) * 100,
      }))
      .sort((a, b) => b.votingPower - a.votingPower);

    const topVoters = voters.slice(0, 5);
    const totalPower = voters.reduce((sum, v) => sum + v.votingPower, 0);
    const top3Power = topVoters
      .slice(0, 3)
      .reduce((sum, v) => sum + v.votingPower, 0);
    const powerConcentration =
      totalPower > 0 ? Math.round((top3Power / totalPower) * 100) : 0;

    // Analyze proposal patterns
    const closedProposals = proposals.filter((p) => p.state === "closed");
    const patterns = categorizeProposals(closedProposals);

    // Extract keywords
    const { riskKeywords, successKeywords } =
      extractKeywords(closedProposals);

    // Calculate governance activity
    const last30Days = Date.now() / 1000 - 30 * 24 * 60 * 60;
    const recentCount = proposals.filter((p) => p.created > last30Days).length;
    const governanceActivity: "HIGH" | "MEDIUM" | "LOW" =
      recentCount > 10 ? "HIGH" : recentCount > 5 ? "MEDIUM" : "LOW";

    // Calculate avg voting period
    const votingPeriods = proposals
      .filter((p) => p.start && p.end)
      .map((p) => (p.end - p.start) / 86400);
    const avgVotingPeriod =
      votingPeriods.length > 0
        ? votingPeriods.reduce((a, b) => a + b, 0) / votingPeriods.length
        : 0;

    return {
      topVoters: topVoters.map((v) => ({
        ...v,
        votingPower: Math.round((v.votingPower / totalPower) * 100), // Convert to %
      })),
      powerConcentration,
      proposalPatterns: patterns,
      riskKeywords,
      successKeywords,
      avgVotingPeriod: Math.round(avgVotingPeriod * 10) / 10,
      governanceActivity,
    };
  } catch (error) {
    console.error("Error analyzing voting patterns:", error);
    return null;
  }
}

async function fetchVotesForProposals(
  proposalIds: string[]
): Promise<SnapshotVote[]> {
  const votesQuery = `
    query Votes($proposals: [String!]!) {
      votes(
        first: 1000,
        where: { proposal_in: $proposals },
        orderBy: "vp",
        orderDirection: desc
      ) {
        voter
        vp
        created
      }
    }
  `;

  const response = await fetch(SNAPSHOT_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: votesQuery,
      variables: { proposals: proposalIds },
    }),
  });

  const data = await response.json();
  return data?.data?.votes || [];
}

function categorizeProposals(
  proposals: SnapshotProposal[]
): ProposalPattern[] {
  const categories = new Map<
    string,
    { total: number; passed: number }
  >();

  proposals.forEach((p) => {
    const category = detectCategory(p.title, p.body);
    const passed = p.scores_total >= p.quorum;

    const existing = categories.get(category) || { total: 0, passed: 0 };
    categories.set(category, {
      total: existing.total + 1,
      passed: existing.passed + (passed ? 1 : 0),
    });
  });

  return Array.from(categories.entries())
    .map(([category, data]) => ({
      category,
      successRate: Math.round((data.passed / data.total) * 100),
      totalCount: data.total,
    }))
    .filter((p) => p.totalCount >= 2) // Only show categories with 2+ proposals
    .sort((a, b) => b.totalCount - a.totalCount);
}

function detectCategory(title: string, body: string): string {
  const text = (title + " " + body).toLowerCase();

  if (
    text.includes("treasury") ||
    text.includes("fund") ||
    text.includes("grant") ||
    text.includes("budget")
  )
    return "Treasury";
  if (
    text.includes("parameter") ||
    text.includes("config") ||
    text.includes("setting")
  )
    return "Parameters";
  if (
    text.includes("working group") ||
    text.includes("committee") ||
    text.includes("team")
  )
    return "Working Group";
  if (text.includes("governance") || text.includes("voting"))
    return "Governance";
  if (
    text.includes("partnership") ||
    text.includes("integration") ||
    text.includes("collaboration")
  )
    return "Partnership";

  return "Other";
}

function extractKeywords(proposals: SnapshotProposal[]): {
  riskKeywords: { word: string; failureRate: number }[];
  successKeywords: { word: string; successRate: number }[];
} {
  const keywordStats = new Map<
    string,
    { total: number; passed: number }
  >();

  const commonWords = [
    "emergency",
    "immediate",
    "urgent",
    "community",
    "gradual",
    "phased",
    "transparency",
    "temporary",
    "permanent",
    "experimental",
  ];

  proposals.forEach((p) => {
    const text = (p.title + " " + p.body).toLowerCase();
    const passed = p.scores_total >= p.quorum;

    commonWords.forEach((word) => {
      if (text.includes(word)) {
        const existing = keywordStats.get(word) || { total: 0, passed: 0 };
        keywordStats.set(word, {
          total: existing.total + 1,
          passed: existing.passed + (passed ? 1 : 0),
        });
      }
    });
  });

  const keywords = Array.from(keywordStats.entries())
    .filter(([_, data]) => data.total >= 3) // Must appear in 3+ proposals
    .map(([word, data]) => ({
      word,
      rate: Math.round((data.passed / data.total) * 100),
      total: data.total,
    }));

  return {
    riskKeywords: keywords
      .filter((k) => k.rate < 50)
      .map((k) => ({ word: k.word, failureRate: 100 - k.rate }))
      .sort((a, b) => b.failureRate - a.failureRate)
      .slice(0, 3),
    successKeywords: keywords
      .filter((k) => k.rate >= 70)
      .map((k) => ({ word: k.word, successRate: k.rate }))
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 3),
  };
}