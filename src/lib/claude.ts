import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generateProposal(params: {
  daoName: string;
  idea: string;
  pastProposals: string[];
}): Promise<string> {
  const { daoName, idea, pastProposals } = params;

  const prompt = `You are a DAO governance expert. Generate a governance proposal for ${daoName}.

CONTEXT - Past successful proposals from this DAO:
${pastProposals.slice(0, 3).join('\n\n---\n\n')}

USER IDEA: ${idea}

Generate a proposal that:
1. Follows the style and structure of successful proposals above
2. Is clear, actionable, and well-reasoned
3. Includes proper sections: Title, Summary, Rationale, Implementation
4. Matches the tone and formatting conventions of this DAO

Output ONLY the proposal text in markdown format. No preamble or explanation.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
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