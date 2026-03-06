import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient(process.env.SNAPSHOT_HUB_URL || 'https://hub.snapshot.org/graphql');

export interface Proposal {
  id: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  state: string;
  scores: number[];
  scores_total: number;
}

export async function getProposals(space: string, limit = 10): Promise<Proposal[]> {
  const query = `
    query Proposals($space: String!, $first: Int!) {
      proposals(
        first: $first,
        where: { space: $space },
        orderBy: "created",
        orderDirection: desc
      ) {
        id
        title
        body
        choices
        start
        end
        state
        scores
        scores_total
      }
    }
  `;

  try {
    const data: any = await client.request(query, { space, first: limit });
    return data.proposals as Proposal[];
  } catch (error) {
    console.error('Snapshot API error:', error);
    return [];
  }
}

export async function getProposalById(id: string): Promise<Proposal | null> {
  const query = `
    query Proposal($id: String!) {
      proposal(id: $id) {
        id
        title
        body
        choices
        start
        end
        state
        scores
        scores_total
      }
    }
  `;

  try {
    const data: any = await client.request(query, { id });
    return data.proposal as Proposal;
  } catch (error) {
    console.error('Snapshot API error:', error);
    return null;
  }
}