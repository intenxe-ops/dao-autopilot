const SNAPSHOT_GRAPHQL_URL = "https://hub.snapshot.org/graphql";

export interface DAOStats {
  proposalCount: number;
  averageQuorum: number;
  avgVotingPeriodDays: number;
  successRate: number;
  recentProposals: number;
}

interface SnapshotProposal {
  id: string;
  state: string;
  scores_total: number;
  quorum: number;
  start: number;
  end: number;
}

export async function fetchDAOStats(space: string): Promise<DAOStats | null> {
  try {
    const query = `
      query Proposals($space: String!) {
        proposals(
          first: 20,
          where: { space: $space },
          orderBy: "created",
          orderDirection: desc
        ) {
          id
          state
          scores_total
          quorum
          start
          end
        }
      }
    `;

    const response = await fetch(SNAPSHOT_GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { space },
      }),
    });

    const data = await response.json();
    const proposals: SnapshotProposal[] = data?.data?.proposals || [];

    if (proposals.length === 0) {
      return null;
    }

    // Calculate stats
    const closed = proposals.filter((p) => p.state === "closed");
    const passed = closed.filter((p) => p.scores_total >= p.quorum);
    
    const votingPeriods = proposals
      .filter((p) => p.start && p.end)
      .map((p) => (p.end - p.start) / 86400); // Convert to days

    const avgVotingPeriod = votingPeriods.length > 0
      ? votingPeriods.reduce((a, b) => a + b, 0) / votingPeriods.length
      : 0;

    // Get quorum percentages for proposals that have quorum data
    const quorums = proposals
      .filter((p) => p.quorum > 0 && p.scores_total > 0)
      .map((p) => (p.scores_total / p.quorum) * 100);

    const avgQuorum = quorums.length > 0
      ? quorums.reduce((a, b) => a + b, 0) / quorums.length
      : 0;

    return {
      proposalCount: proposals.length,
      averageQuorum: Math.round(avgQuorum),
      avgVotingPeriodDays: Math.round(avgVotingPeriod * 10) / 10,
      successRate: closed.length > 0 ? Math.round((passed.length / closed.length) * 100) : 0,
      recentProposals: proposals.length,
    };
  } catch (error) {
    console.error("Error fetching DAO stats:", error);
    return null;
  }
}