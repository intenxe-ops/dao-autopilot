"use client";

import { useState, useEffect } from "react";
import { TOP_DAOS } from "@/lib/dao-data";
import { fetchDAOStats, type DAOStats } from "@/lib/snapshot-api";

export default function ProposalGenerator() {
  const [daoSpace, setDaoSpace] = useState("");
  const [idea, setIdea] = useState("");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [daoStats, setDaoStats] = useState<DAOStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

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
      fetchDAOStats(daoSpace)
        .then(stats => setDaoStats(stats))
        .finally(() => setLoadingStats(false));
    }
  }, [daoSpace, loading, proposal]);

  // Filter DAOs based on search
  const filteredDAOs = TOP_DAOS.filter(dao =>
    dao.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dao.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dao.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDAOSelect = (space: string) => {
    setDaoSpace(space);
    setShowDropdown(false);
    setSearchTerm("");
  };

  const handleGenerate = async () => {
    if (!daoSpace || !idea) return;

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
  };

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <div className="bg-[#0f0f0f] border border-white/[0.08] p-6 md:p-12">
        <div className="space-y-8">
          <div>
            <label className="block text-[10px] font-mono tracking-[0.2em] text-[#666666] mb-4">
              DAO SNAPSHOT SPACE
            </label>
            
            <div className="relative">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={daoSpace}
                  onChange={(e) => setDaoSpace(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Select DAO or enter space name"
                  disabled={loading || !!proposal}
                  className="flex-1 px-0 py-3 md:py-4 bg-transparent border-b border-white/[0.08] text-white placeholder-[#404040] focus:outline-none focus:border-white/20 transition-colors font-light text-base md:text-lg tracking-tight disabled:opacity-30 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  disabled={loading || !!proposal}
                  className="px-4 py-2 border-b border-white/[0.08] text-[#666666] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>

              {/* Dropdown */}
              {showDropdown && !loading && !proposal && (
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
                        className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/[0.03] group"
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

          <div>
            <label className="block text-[10px] font-mono tracking-[0.2em] text-[#666666] mb-4">
              PROPOSAL IDEA
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your proposal..."
              rows={6}
              disabled={loading || !!proposal}
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
                }}
                className="group w-full px-8 py-5 bg-transparent text-white border border-white/[0.08] font-mono text-xs tracking-[0.2em] hover:bg-white/5 transition-all duration-200"
              >
                <span className="inline-block group-hover:translate-x-0.5 transition-transform">
                  RESET / NEW PROPOSAL
                </span>
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={loading || !daoSpace || !idea}
                className="group w-full px-8 py-5 bg-white text-black font-mono text-xs tracking-[0.2em] hover:bg-[#e0e0e0] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <span className="inline-block group-hover:translate-x-0.5 transition-transform">
                  {loading ? `EXECUTING... ${elapsedTime.toFixed(1)}s` : "GENERATE PROPOSAL"}
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
            <button
              onClick={handleCopy}
              className="group w-full sm:w-auto px-6 py-3 bg-transparent text-[#808080] hover:text-white border border-white/[0.08] hover:bg-white/5 transition-all text-xs font-mono tracking-[0.15em]"
            >
              <span className="inline-block group-hover:translate-x-0.5 transition-transform">
                COPY
              </span>
            </button>
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