"use client";

import { useState } from "react";

export default function ProposalGenerator() {
  const [daoSpace, setDaoSpace] = useState("");
  const [idea, setIdea] = useState("");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);

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
      <div className="bg-[#0f0f0f] border border-white/[0.08] p-12">
        <div className="space-y-8">
          <div>
            <label className="block text-[10px] font-mono tracking-[0.2em] text-[#666666] mb-4">
              DAO SNAPSHOT SPACE
            </label>
            <input
              type="text"
              value={daoSpace}
              onChange={(e) => setDaoSpace(e.target.value)}
              placeholder="arbitrumfoundation.eth"
              disabled={loading || !!proposal}
              className="w-full px-0 py-4 bg-transparent border-b border-white/[0.08] text-white placeholder-[#404040] focus:outline-none focus:border-white/20 transition-colors font-light text-lg tracking-tight disabled:opacity-30 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-[#404040] mt-3 font-light tracking-wide">
              Enter Snapshot space name (usually ends in .eth)
            </p>
          </div>

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
              className="w-full px-0 py-4 bg-transparent border-b border-white/[0.08] text-white placeholder-[#404040] focus:outline-none focus:border-white/20 transition-colors resize-none font-light text-lg leading-relaxed tracking-tight disabled:opacity-30 disabled:cursor-not-allowed"
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
                  {loading ? "EXECUTING..." : "GENERATE PROPOSAL"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Generated Proposal */}
      {proposal && (
        <div className="bg-[#0f0f0f] border border-white/[0.08] p-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] text-[#666666] mb-2">
                OUTPUT
              </p>
              <h3 className="text-2xl font-light text-white tracking-tight">
                Generated Proposal
              </h3>
            </div>
            <button
              onClick={handleCopy}
              className="group px-6 py-3 bg-transparent text-[#808080] hover:text-white border border-white/[0.08] hover:bg-white/5 transition-all text-xs font-mono tracking-[0.15em]"
            >
              <span className="inline-block group-hover:translate-x-0.5 transition-transform">
                COPY
              </span>
            </button>
          </div>
          
          <div className="bg-black/40 p-8 border border-white/[0.05] overflow-y-auto max-h-[600px]">
            <pre className="text-[#cccccc] whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {proposal}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}