import { NextRequest, NextResponse } from 'next/server';
import { getProposals } from '@/lib/snapshot';
import { generateProposal } from '@/lib/claude';
import { analyzeVotingPatterns } from '@/lib/voting-analysis';

export async function POST(req: NextRequest) {
  try {
    const { daoSpace, idea } = await req.json();

    if (!daoSpace || !idea) {
      return NextResponse.json(
        { success: false, error: 'Missing daoSpace or idea' },
        { status: 400 }
      );
    }

    // 1. Fetch past proposals from Snapshot
    console.log(`Fetching proposals for ${daoSpace}...`);
    const pastProposals = await getProposals(daoSpace, 5);
    
    if (pastProposals.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No proposals found for this DAO space' },
        { status: 404 }
      );
    }

    const proposalTexts = pastProposals.map(p => 
      `Title: ${p.title}\n\n${p.body}`
    );

    // 2. Fetch voting intelligence
    console.log('Analyzing voting patterns...');
    const votingIntel = await analyzeVotingPatterns(daoSpace);

    // 3. Generate new proposal using Claude with intelligence context
    console.log('Generating context-aware proposal with Claude...');
    const generatedProposal = await generateProposal({
      daoName: daoSpace,
      idea,
      pastProposals: proposalTexts,
      votingIntelligence: votingIntel,
    });

    return NextResponse.json({
      success: true,
      proposal: generatedProposal,
      analyzedProposals: pastProposals.length,
      usedIntelligence: votingIntel !== null,
    });
  } catch (error) {
    console.error('Proposal generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate proposal' },
      { status: 500 }
    );
  }
}