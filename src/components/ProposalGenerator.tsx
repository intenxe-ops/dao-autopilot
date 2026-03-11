"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { checkUsageLimit, trackProposalGeneration, type UsageStats } from "@/lib/usage-tracking";
import { TOP_DAOS } from "@/lib/dao-data";
import { fetchDAOStats, type DAOStats } from "@/lib/snapshot-api";
import { analyzeVotingPatterns, type VotingIntelligence } from "@/lib/voting-analysis";

export default function ProposalGenerator() {
  const { user, walletAddress, supabase } = useAuth();
  const [daoSpace, setDaoSpace] = useState("");
  const [idea, setIdea] = useState("");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [daoStats, setDaoStats] = useState<DAOStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [votingIntel, setVotingIntel] = useState<VotingIntelligence | null>(null);
  const [loadingIntel, setLoadingIntel] = useState(false);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loadingUsage, setLoadingUsage] = useState(true);

  // Load usage stats on mount
  useEffect(() => {
    loadUsageStats();
  }, [user, walletAddress]);

  const loadUsageStats = async () => {
    setLoadingUsage(true);
    const stats = await checkUsageLimit(supabase, user?.id || null, walletAddress);
    setUsageStats(stats);
    setLoadingUsage(false);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Fetch DAO stats when space is selected
  useEffect(() => {
    if (daoSpace && !loading && !proposal) {
      setLoadingStats(true);
      setLoadingIntel(true);
      
      Promise.all([
        fetchDAOStats(daoSpace),
        analyzeVotingPatterns(daoSpace)
      ])
        .then(([stats, intel]) => {
          setDaoStats(stats);
          setVotingIntel(intel);
        })
        .finally(() => {
          setLoadingStats(false);
          setLoadingIntel(false);
        });
    }
  }, [daoSpace, loading, proposal]);

  // Filter DAOs based on search
  const filteredDAOs = TOP_DAOS.filter(dao =>
    dao.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dao.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dao.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-close dropdown when no matches and user typed something
  useEffect(() => {
    if (searchTerm && filteredDAOs.length === 0 && showDropdown) {
      const timer = setTimeout(() => setShowDropdown(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, filteredDAOs.length, showDropdown]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showDropdown && !target.closest('.dao-dropdown-container')) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Close dropdown on Enter or Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showDropdown && (event.key === 'Escape' || event.key === 'Enter')) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showDropdown]);

  const handleDAOSelect = (space: string) => {
    setDaoSpace(space);
    setShowDropdown(false);
    setSearchTerm("");
  };

  const handleGenerate = async () => {
    if (!daoSpace || !idea) return;

    // Check usage limit
    if (!usageStats?.canGenerate) {
      return; // Blocked by limit
    }

    setLoading(true);
    setProposal("");

    try {
      const res = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ daoSpace, idea }),
      });

      const data = await res.json();
      
      if (data.success) {
        setProposal(data.proposal);
        
        // Track proposal generation
        await trackProposalGeneration(
          supabase,
          user?.id || null,
          walletAddress,
          daoSpace,
          data.proposal
        );

        // Reload usage stats
        await loadUsageStats();
      } else {
        setProposal("Error: " + data.error);
      }
    } catch (error) {
      setProposal("Error generating proposal");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([proposal], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${daoSpace.replace(/\.eth$/, "")}-proposal-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const isLimitReached = usageStats && !usageStats.canGenerate;

  return (
    <div className="space-y-8">
      {/* Usage Stats Banner */}
      {usageStats && !usageStats.isPro && (
        <div className={`border p-4 md:p-6 ${
          isLimitReached 
            ? 'bg-[#1a0a0a] border-white/20' 
            : 'bg-black/40 border-white/[0.05]'
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] text-[#666666] mb-2">
                {isLimitReached ? 'LIMIT REACHED' : 'FREE TIER'}
              </p>
              <p className="text-sm md:text-base text-white font-light">
                <span className="text-lg md:text-2xl font-normal">{usageStats.proposalsThisMonth}</span>
                <span className="text-[#666666]"> / {usageStats.limit}</span>
                <span className="text-[#808080] ml-2">proposals this month</span>
              </p>
            </div>
            {isLimitReached && (
              <a
                href="mailto:ops@intenxe.xyz?subject=Upgrade to Pro"
                className="px-6 py-3 bg-white text-black font-mono text-xs tracking-[0.15em] hover:bg-[#e0e0e0] transition-all cursor-pointer whitespace-nowrap"
              >
                UPGRADE TO PRO
              </a>
            )}
          </div>
          {isLimitReached && (
            <p className="text-xs text-[#999999] mt-4 font-light">
              Free tier limit reached. Upgrade to Pro for unlimited proposals.
            </p>
          )}
        </div>
      )}

      {/* Input Form */}
      <div className="bg-[#0f0f0f] border border-white/[0.08] p-6 md:p-12">
        <div className="space-y-8">
          <div>
            <label className="block text-[10px] font-mono tracking-[0.2em] text-[#666666] mb-4">
              DAO SNAPSHOT SPACE
            </label>
            
            <div className="relative dao-dropdown-container">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={daoSpace}
                  onChange={(e) => setDaoSpace(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Select DAO or enter space name"
                  disabled={loading || !!proposal || !!isLimitReached}
                  className="flex-1 px-0 py-3 md:py-4 bg-transparent border-b border-white/[0.08] text-white placeholder-[#404040] focus:outline-none focus:border-white/20 transition-colors font-light text-base md:text-lg tracking-tight disabled:opacity-30 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  disabled={loading || !!proposal || !!isLimitReached}
                  className="px-4 py-2 border-b border-white/[0.08] text-[#666666] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>

              {/* Dropdown */}
              {showDropdown && !loading && !proposal && !isLimitReached && (
                <div className="absolute z-10 w-full mt-2 bg-[#0f0f0f] border border-white/[0.08] max-h-[400px] overflow-y-auto">
                  {/* Search */}
                  <div className="p-3 border-b border-white/[0.05]">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search DAOs..."
                      className="w-full px-3 py-2 bg-black/40 border border-white/[0.08] text-white placeholder-[#404040] focus:outline-none focus:border-white/20 text-sm font-mono"
                    />
                  </div>

                  {/* DAO List */}
                  <div className="max-h-[300px] overflow-y-auto">
                    {filteredDAOs.map((dao) => (
                      <button
                        key={dao.id}
                        onClick={() => handleDAOSelect(dao.id)}
                        className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/[0.03] group cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-white font-light text-sm group-hover:text-[#e0e0e0]">
                              {dao.name}
                            </p>
                            <p className="text-[#666666] text-xs font-mono mt-0.5">
                              {dao.id}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono text-[#404040] tracking-wider">
                            {dao.category}
                          </span>
                        </div>
                      </button>
                    ))}
                    {filteredDAOs.length === 0 && (
                      <p className="px-4 py-6 text-center text-[#404040] text-sm font-mono">
                        No DAOs found
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-xs text-[#404040] mt-3 font-light tracking-wide">
              Select from top DAOs or enter custom Snapshot space
            </p>
          </div>

          {/* DAO Stats */}
          {daoSpace && daoStats && !proposal && (
            <div className="bg-black/40 border border-white/[0.05] p-6">
              <p className="text-[10px] font-mono tracking-[0.2em] text-[#666666] mb-4">
                DAO CONTEXT
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-2xl font-light text-white mb-1">
                    {daoStats.recentProposals}
                  </p>
                  <p className="text-xs text-[#808080] font-mono">
                    RECENT PROPOSALS
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-light text-white mb-1">
                    {daoStats.avgVotingPeriodDays}d
                  </p>
                  <p className="text-xs text-[#808080] font-mono">
                    AVG VOTING PERIOD
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-light text-white mb-1">
                    {daoStats.averageQuorum}%
                  </p>
                  <p className="text-xs text-[#808080] font-mono">
                    AVG QUORUM
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-light text-white mb-1">
                    {daoStats.successRate}%
                  </p>
                  <p className="text-xs text-[#808080] font-mono">
                    SUCCESS RATE
                  </p>
                </div>
              </div>
            </div>
          )}

          {loadingStats && daoSpace && !proposal && (
            <div className="bg-black/40 border border-white/[0.05] p-6">
              <p className="text-xs text-[#666666] font-mono tracking-wider animate-pulse">
                LOADING DAO CONTEXT...
              </p>
            </div>
          )}

          {/* Voting Intelligence */}
          {votingIntel && !proposal && (
            <div className="bg-black/40 border border-white/[0.05] p-6 md:p-8">
              <p className="text-[10px] font-mono tracking-[0.2em] text-[#666666] mb-6">
                VOTING INTELLIGENCE
              </p>

              {/* Power Distribution */}
              <div className="mb-8">
                <p className="text-xs font-mono text-[#808080] mb-3 tracking-wider">
                  POWER DISTRIBUTION
                </p>
                <p className="text-sm text-white mb-4 font-light">
                  Top 3 voters control{" "}
                  <span className="text-lg font-normal">{votingIntel.powerConcentration}%</span>{" "}
                  of voting power
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {votingIntel.topVoters.slice(0, 4).map((voter, i) => (
                    <div
                      key={voter.address}
                      className="flex justify-between items-center text-xs"
                    >
                      <span className="text-[#666666] font-mono">
                        {voter.address.slice(0, 6)}...{voter.address.slice(-4)}
                      </span>
                      <span className="text-white font-light">
                        {voter.votingPower}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proposal Patterns */}
              {votingIntel.proposalPatterns.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-mono text-[#808080] mb-3 tracking-wider">
                    PROPOSAL SUCCESS PATTERNS
                  </p>
                  <div className="space-y-2">
                    {votingIntel.proposalPatterns.slice(0, 4).map((pattern) => (
                      <div key={pattern.category} className="flex items-center gap-3">
                        <span className="text-xs text-[#666666] font-mono min-w-[120px]">
                          {pattern.category}
                        </span>
                        <div className="flex-1 h-1 bg-white/5 relative overflow-hidden">
                          <div
                            className="absolute h-full bg-white/20"
                            style={{ width: `${pattern.successRate}%` }}
                          />
                        </div>
                        <span className="text-xs text-white font-light min-w-[40px] text-right">
                          {pattern.successRate}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Risk Keywords */}
                {votingIntel.riskKeywords.length > 0 && (
                  <div>
                    <p className="text-xs font-mono text-[#808080] mb-3 tracking-wider">
                      RISK SIGNALS
                    </p>
                    <div className="space-y-2">
                      {votingIntel.riskKeywords.map((keyword) => (
                        <div key={keyword.word} className="flex items-start gap-2">
                          <span className="text-white/40 text-xs">⚠</span>
                          <div className="flex-1">
                            <span className="text-xs text-[#999999] font-mono">
                              "{keyword.word}"
                            </span>
                            <span className="text-xs text-[#666666] ml-2">
                              fails {keyword.failureRate}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Success Keywords */}
                {votingIntel.successKeywords.length > 0 && (
                  <div>
                    <p className="text-xs font-mono text-[#808080] mb-3 tracking-wider">
                      SUCCESS SIGNALS
                    </p>
                    <div className="space-y-2">
                      {votingIntel.successKeywords.map((keyword) => (
                        <div key={keyword.word} className="flex items-start gap-2">
                          <span className="text-white/40 text-xs">✓</span>
                          <div className="flex-1">
                            <span className="text-xs text-[#999999] font-mono">
                              "{keyword.word}"
                            </span>
                            <span className="text-xs text-[#666666] ml-2">
                              passes {keyword.successRate}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Level */}
              <div className="mt-6 pt-6 border-t border-white/[0.05]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#666666] font-mono tracking-wider">
                    GOVERNANCE ACTIVITY
                  </span>
                  <span className={`font-mono ${
                    votingIntel.governanceActivity === "HIGH"
                      ? "text-white"
                      : votingIntel.governanceActivity === "MEDIUM"
                      ? "text-[#999999]"
                      : "text-[#666666]"
                  }`}>
                    {votingIntel.governanceActivity}
                  </span>
                </div>
              </div>
            </div>
          )}

          {loadingIntel && daoSpace && !proposal && !votingIntel && (
            <div className="bg-black/40 border border-white/[0.05] p-6">
              <p className="text-xs text-[#666666] font-mono tracking-wider animate-pulse">
                ANALYZING VOTING PATTERNS...
              </p>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono tracking-[0.2em] text-[#666666] mb-4">
              PROPOSAL IDEA
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your proposal..."
              rows={6}
              disabled={loading || !!proposal || !!isLimitReached}
              className="w-full px-0 py-3 md:py-4 bg-transparent border-b border-white/[0.08] text-white placeholder-[#404040] focus:outline-none focus:border-white/20 transition-colors resize-none font-light text-base md:text-lg leading-relaxed tracking-tight disabled:opacity-30 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-[#404040] mt-3 font-light tracking-wide">
              Describe your proposal idea in a few sentences
            </p>
          </div>

          <div className="pt-4">
            {proposal ? (
              <button
                onClick={() => {
                  setProposal("");
                  setDaoSpace("");
                  setIdea("");
                  setDaoStats(null);
                  setVotingIntel(null);
                }}
                className="group w-full px-8 py-5 bg-transparent text-white border border-white/[0.08] font-mono text-xs tracking-[0.2em] hover:bg-white/5 transition-all duration-200 cursor-pointer"
              >
                <span className="inline-block group-hover:translate-x-0.5 transition-transform">
                  RESET / NEW PROPOSAL
                </span>
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={loading || !daoSpace || !idea || !!isLimitReached}
                className="group w-full px-8 py-5 bg-white text-black font-mono text-xs tracking-[0.2em] hover:bg-[#e0e0e0] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white cursor-pointer"
              >
                <span className="inline-block group-hover:translate-x-0.5 transition-transform">
                  {loading ? `EXECUTING... ${elapsedTime.toFixed(1)}s` : isLimitReached ? 'LIMIT REACHED - UPGRADE TO PRO' : "GENERATE PROPOSAL"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Generated Proposal */}
      {proposal && (
        <div className="bg-[#0f0f0f] border border-white/[0.08] p-6 md:p-12">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-8">
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] text-[#666666] mb-2">
                OUTPUT
              </p>
              <h3 className="text-xl md:text-2xl font-light text-white tracking-tight">
                Generated Proposal
              </h3>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="group px-4 py-3 bg-transparent text-[#808080] hover:text-white border border-white/[0.08] hover:bg-white/5 transition-all cursor-pointer"
                title="Copy to clipboard"
              >
                {copied ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:translate-x-0.5 transition-transform">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="group px-4 py-3 bg-transparent text-[#808080] hover:text-white border border-white/[0.08] hover:bg-white/5 transition-all cursor-pointer"
                title="Download as .md"
              >
                {downloaded ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:translate-y-0.5 transition-transform">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="bg-black/40 p-4 md:p-8 border border-white/[0.05] overflow-y-auto max-h-[400px] md:max-h-[600px]">
            <pre className="text-[#cccccc] whitespace-pre-wrap font-mono text-xs md:text-sm leading-relaxed">
              {proposal}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}