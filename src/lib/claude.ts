import Anthropic from '@anthropic-ai/sdk';
import { VotingIntelligence } from './voting-analysis';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generateProposal(params: {
  daoName: string;
  idea: string;
  pastProposals: string[];
  votingIntelligence?: VotingIntelligence | null;
}): Promise<string> {
  const { daoName, idea, pastProposals, votingIntelligence } = params;

  // Build intelligence context if available
  let intelligenceContext = '';
  if (votingIntelligence) {
    const topVotersList = votingIntelligence.topVoters
      .slice(0, 3)
      .map(v => `- ${v.address.slice(0, 8)}... (${v.votingPower}% voting power)`)
      .join('\n');

    const successPatterns = votingIntelligence.proposalPatterns
      .slice(0, 3)
      .map(p => `- ${p.category}: ${p.successRate}% success rate`)
      .join('\n');

    const riskKeywords = votingIntelligence.riskKeywords
      .map(k => `"${k.word}" (fails ${k.failureRate}%)`)
      .join(', ');

    const successKeywords = votingIntelligence.successKeywords
      .map(k => `"${k.word}" (passes ${k.successRate}%)`)
      .join(', ');

    intelligenceContext = `
VOTING INTELLIGENCE FOR ${daoName}:

Power Distribution:
- Top 3 voters control ${votingIntelligence.powerConcentration}% of voting power
${topVotersList}

Proposal Success Patterns:
${successPatterns}

${votingIntelligence.successKeywords.length > 0 ? `Language That Works:
Use these keywords/concepts: ${successKeywords}` : ''}

${votingIntelligence.riskKeywords.length > 0 ? `Language To Avoid:
Avoid these keywords/concepts: ${riskKeywords}` : ''}

Governance Activity: ${votingIntelligence.governanceActivity}
Average Voting Period: ${votingIntelligence.avgVotingPeriod} days
`;
  }

  const prompt = `You are a DAO governance expert generating a proposal for ${daoName}.

${intelligenceContext}

PAST SUCCESSFUL PROPOSALS FROM THIS DAO:
${pastProposals.slice(0, 3).join('\n\n---\n\n')}

USER IDEA: ${idea}

INSTRUCTIONS:
Generate a governance proposal that:
1. Follows the style and structure of successful proposals above
2. ${votingIntelligence?.proposalPatterns[0] ? `Aligns with "${votingIntelligence.proposalPatterns[0].category}" category patterns (${votingIntelligence.proposalPatterns[0].successRate}% success rate)` : 'Is clear and actionable'}
3. ${votingIntelligence?.successKeywords.length ? `Incorporates successful language patterns: ${votingIntelligence.successKeywords.map(k => k.word).join(', ')}` : 'Uses clear, professional language'}
4. ${votingIntelligence?.riskKeywords.length ? `Avoids problematic language: ${votingIntelligence.riskKeywords.map(k => k.word).join(', ')}` : 'Maintains measured, thoughtful tone'}
5. Includes proper sections: Title, Summary, Rationale/Motivation, Implementation, Decision
6. Is optimized for the voting power distribution (top 3 voters control ${votingIntelligence?.powerConcentration || 'N/A'}%)
7. Accounts for ${votingIntelligence?.avgVotingPeriod || '~7'} day voting period in timeline

Tone: Professional, data-driven, community-focused
Length: Comprehensive but scannable (2000-3000 words)

Output ONLY the proposal text in markdown format. No preamble or explanation.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514', // Sonnet 4 (latest available)
      max_tokens: 4000, // Increased for comprehensive proposals
      messages: [{ role: 'user', content: prompt }],
    });

    return message.content[0].type === 'text' 
      ? message.content[0].text 
      : 'Failed to generate proposal';
  } catch (error) {
    console.error('Claude API error:', error);
    return 'Error generating proposal';
  }
}